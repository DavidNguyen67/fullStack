import { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  CommonUtils,
  LanguageUtils,
  MAX_FILE_SIZE,
  PNG_PREFIX,
} from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import validator from 'validator';
import { toast } from 'react-toastify';
import {
  deleteUsersService,
  getAllUsersService,
} from '../../../services/userService';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const COPY = 'COPY';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const DELETE = 'DELETE';
const READ = 'READ';

class ActionUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      dataForModal: {},
      isOpen: false,

      users: {},
      pureUsers: [],
      isLoadingRequest: false,
    };
  }
  handleChangeInput = (event, key) => {
    if (event.target.type.toLowerCase() === 'file') {
      const onSelectFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
          this.setState((prevState) => ({
            ...prevState,
            users: {
              ...prevState.users,
              [key]: { ...prevState.users[key], previewImgUrl: undefined },
            },
          }));
          return;
        }

        // I've kept this example simple by using the first image instead of multiple
        const objectUrl = URL.createObjectURL(event.target.files[0]);
        this.setState((prevState) => ({
          ...prevState,
          users: {
            ...prevState.users,
            [key]: {
              ...prevState.users[key],
              previewImgUrl: objectUrl,
              image: event.target.files[0],
            },
          },
        }));
        if (this.state.users[key].previewImgUrl) {
          URL.revokeObjectURL(this.state.users[key].previewImgUrl);
        }
        return;
      };

      onSelectFile(event);
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      users: {
        ...prevState.users,
        [key]: {
          ...prevState.users[key],
          [event.target.name]: event.target.value,
        },
      },
    }));
  };
  submitData = async (event) => {
    event.preventDefault();

    const isCreateForm = this.props.location?.pathname?.includes(
      CREATE.toLocaleLowerCase()
    );
    const isCopyForm = this.props.location?.pathname?.includes(
      COPY.toLocaleLowerCase()
    );
    const isUpdateForm = this.props.location?.pathname?.includes(
      UPDATE.toLocaleLowerCase()
    );
    const isDeleteForm = this.props.location?.pathname?.includes(
      DELETE.toLocaleLowerCase()
    );
    const validateFields = (ObjectData) => {
      return Object.keys(ObjectData).every((key) => {
        const { email, password, firstName, lastName, phoneNumber } =
          ObjectData[key];

        if (!email) {
          toast.error(<FormattedMessage id="validate.emailRequired" />);
          return false;
        }
        if ((isCreateForm || isCopyForm) && !password) {
          toast.error(<FormattedMessage id="validate.passwordRequired" />);
          return false;
        }
        if (!firstName) {
          toast.error(<FormattedMessage id="validate.firstNameRequired" />);
          return false;
        }
        if (!lastName) {
          toast.error(<FormattedMessage id="validate.lastNameRequired" />);
          return false;
        }

        if (!validator.isEmail(email)) {
          toast.error(<FormattedMessage id="validate.emailInvalid" />);
          return false;
        }

        if (
          (isCreateForm || isCopyForm) &&
          !validator.isLength(password, { min: 6 })
        ) {
          toast.error(<FormattedMessage id="validate.passwordLength" />);
          return false;
        }

        if (validator.isNumeric(firstName) || validator.isNumeric(lastName)) {
          toast.error(<FormattedMessage id="validate.nameCharacters" />);
          return false;
        }

        if (
          phoneNumber &&
          !validator.isMobilePhone(phoneNumber, 'any', { strictMode: false })
        ) {
          toast.error(<FormattedMessage id="validate.phoneNumberInvalid" />);
          return false;
        }

        return true;
      });
    };

    let payload = [];
    Object.keys(this.state.users).forEach(
      (key) => (payload = [...payload, this.state.users[key]])
    );

    if (isDeleteForm) {
      const id = payload.map((data) => data.id);
      this.setState((prevState) => ({
        ...prevState,
        isLoadingRequest: !prevState.isLoadingRequest,
      }));
      const response = await deleteUsersService(id);
      this.setState((prevState) => ({
        ...prevState,
        isLoadingRequest: !prevState.isLoadingRequest,
      }));
      if (!response || Object.keys(response).length < 1) {
        toast.error(
          <FormattedMessage
            id="toast.cantConnectToServer"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
        return;
      }
      if (
        response.status === 500 ||
        response.data.statusCode === 500 ||
        response.statusCode === 500
      )
        toast.error(<FormattedMessage id={`toast.InternalError`} />);
      if (response.statusCode === 200 || response.status === 200) {
        toast.success(
          <FormattedMessage
            id="toast.successCreateUser"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
        return;
      }
      if (response.statusCode === 409 || response.status === 409) {
        toast.error(
          <FormattedMessage
            id="toast.conflictEmail"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
        return;
      }
      toast.error(
        <FormattedMessage
          id="toast.errorUpdateUser"
          values={{
            br: <br />,
          }}
          tagName="div"
        />
      );
      return;
    }

    const { users } = this.state;

    if (isCreateForm || isCopyForm) {
      payload = Object.keys(users).map((key) => {
        return users[key].email && users[key];
      });
    }

    if (!validateFields(users)) {
      return;
    }
    payload = Array.isArray(payload) ? payload : [payload];
    for (const item of payload) {
      try {
        if (item.image && (!item.image.type || !item.image.data)) {
          const file = item.image;
          if (!file.type.startsWith('image/')) {
            toast.error(<FormattedMessage id={'toast.NotImageFile'} />);
            return;
          }
          if (file?.size > MAX_FILE_SIZE) {
            toast.error(<FormattedMessage id={'toast.OverSizeFile'} />);
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (isCreateForm || isCopyForm) {
      payload = payload.filter((data) => {
        if (!data.email) return false;

        Object.keys(data).forEach((key) => {
          if (!data[key] || key === 'id') {
            delete data[key];
          }
        });
        return true;
      });

      // const formData = new FormData();
      // payload.forEach((data) => {
      //   Object.keys(data).forEach((key) => {
      //     if (data[key]) {
      //       formData.append(key, data[key]);
      //       return;
      //     }
      //   });
      // });
      let result = [];
      for (const item of payload) {
        const newItem = { ...item };
        if (item.previewImgUrl) delete newItem.previewImgUrl;

        if (item.image && (!item.image?.type || !item.image?.data)) {
          const base64String = await CommonUtils.getBase64(item.image);
          newItem.image = base64String;
        } else if (item.image && item.image.data && item.image.type) {
          const bufferToBase64 = `${PNG_PREFIX}${btoa(
            new Uint8Array(item.image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )}`;
          newItem.image = bufferToBase64;
        } else newItem.image = '';

        result.push(newItem);
      }
      // if (!isSameData) {
      this.setState((prevState) => ({
        ...prevState,
        isLoadingRequest: !prevState.isLoadingRequest,
      }));
      await this.props.createNewUser(result);
      this.setState((prevState) => ({
        ...prevState,
        isLoadingRequest: !prevState.isLoadingRequest,
      }));
      if (this.props.isErrorCreate) {
        const { statusCode } = this.props;
        if (statusCode === 500) {
          toast.error(<FormattedMessage id={`toast.InternalError`} />);
          return;
        }
        if (statusCode === 409) {
          toast.error(
            <FormattedMessage
              id="toast.conflictEmail"
              values={{
                br: <br />,
              }}
              tagName="div"
            />
          );
          return;
        }
        toast.error(
          <FormattedMessage
            id="toast.failedCreateUser"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
      } else {
        toast.success(
          <FormattedMessage
            id="toast.successCreateUser"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
      }
      return;
      // }
    }
    if (isUpdateForm) {
      const compareById = (a, b) => a.id - b.id;
      const pureUsers = this.state.pureUsers.sort(compareById);
      payload.sort(compareById);
      this.state.pureUsers.sort(compareById);

      for (const item of payload) {
        if (item.image) {
          if (item.image.data && item.image.type) {
            delete item.image;
          } else {
            item.image = await CommonUtils.getBase64(item.image);
          }
        }
      }

      const result = payload.reduce((acc, data, index) => {
        let value = null;
        let userId = null;

        Object.keys(data).forEach((key) => {
          if (data[key] !== this.state.pureUsers[index][key]) {
            value = { ...value, [key]: data[key] };
            !userId && (userId = data.id);
          }
          userId && (value = { ...value, id: data.id });
        });

        return value ? [...acc, value] : acc;
      }, []);

      result.forEach((data) => {
        if (data && data.previewImgUrl) delete data.previewImgUrl;
      });

      if (result.length > 0 && result.some((data) => data)) {
        const isSameData = pureUsers.every((user, index) => {
          return Object.keys(user).every((key) => {
            return user[key] === payload[index][key];
          });
        });
        if (!isSameData) {
          this.setState((prevState) => ({
            ...prevState,
            isLoadingRequest: !prevState.isLoadingRequest,
          }));
          const isErrorUpdate = await this.props.updateUsers(result);
          this.setState((prevState) => ({
            ...prevState,
            isLoadingRequest: !prevState.isLoadingRequest,
          }));

          if (isErrorUpdate) {
            toast.error(
              <FormattedMessage
                id="toast.errorUpdateUser"
                values={{
                  br: <br />,
                }}
                tagName="div"
              />
            );
          } else {
            toast.success(
              <FormattedMessage
                id="toast.successUpdateUser"
                values={{
                  br: <br />,
                }}
                tagName="div"
              />
            );
            const { history, systemMenuPath } = this.props;
            history.push(systemMenuPath);
          }

          if (this.props.match?.params?.id) {
            const response = await getAllUsersService(
              this.props.match.params.id
            );
            const { history, systemMenuPath } = this.props;

            if (response.data && Array.isArray(response.data)) {
              const users = response.data.reduce((accumulator, value) => {
                return { ...accumulator, [uuidv4()]: value };
              }, {});
              this.setState((prevState) => ({
                ...prevState,
                users,
                pureUsers: response.data,
              }));
            } else {
              if (
                response.status === 500 ||
                response.data?.statusCode === 500
              ) {
                toast.error(<FormattedMessage id={`toast.InternalError`} />);
              } else if (
                response.status === 404 ||
                response.data?.statusCode === 404
              ) {
                toast.error(
                  <FormattedMessage id={`toast.errorNotFoundUser`} />
                );
              } else {
                toast.error(<FormattedMessage id={`toast.errorReadUser`} />);
              }
              history.push(systemMenuPath);
            }
          }
        }
      }
    }
  };
  componentWillUnmount() {
    if (this.state.previewImgUrl) {
      URL.revokeObjectURL(this.state.previewImgUrl);
    }
  }
  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
    if (this.props.match?.params?.id) {
      const response = await getAllUsersService(this.props.match.params.id);
      if (response.data && Array.isArray(response.data)) {
        const users = response.data.reduce((accumulator, value) => {
          return { ...accumulator, [uuidv4()]: value };
        }, {});
        this.setState((prevState) => ({
          ...prevState,
          users,
          pureUsers: response.data,
        }));
      } else {
        const { history, systemMenuPath } = this.props;
        if (
          response.status === 500 ||
          response.data?.statusCode === 500 ||
          response.statusCode === 500
        )
          toast.error(<FormattedMessage id={`toast.InternalError`} />);
        if (response.status === 404 || response.data?.statusCode === 404)
          toast.error(<FormattedMessage id={`toast.errorNotFoundUser`} />);
        else toast.error(<FormattedMessage id={`toast.errorReadUser`} />);
        history.push(systemMenuPath);
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const newState = {};

    if (prevProps.genders !== this.props.genders) {
      const updatedUsersGenders = { ...this.state.users };
      Object.keys(updatedUsersGenders).forEach((key) => {
        updatedUsersGenders[key].genders = this.props.genders[0]?.key;
      });

      newState.genders = this.props.genders;
      newState.gender = this.props.genders[0]?.key;
      newState.users = updatedUsersGenders;
    }

    if (prevProps.positions !== this.props.positions) {
      // Similar updates for positions, modifying newState.positions and newState.position as needed
      const updatedUsersPositions = { ...this.state.users };
      Object.keys(updatedUsersPositions).forEach((key) => {
        updatedUsersPositions[key].positions = this.props.positions[0]?.key;
      });
      newState.positions = this.props.positions;
      newState.position = this.props.positions[0]?.key;
      newState.users = updatedUsersPositions;
    }

    if (prevProps.roles !== this.props.roles) {
      const updatedUsersRoles = { ...this.state.users };
      Object.keys(updatedUsersRoles).forEach((key) => {
        updatedUsersRoles[key].roles = this.props.roles[0]?.key;
      });

      newState.roles = this.props.roles;
      newState.role = this.props.roles[0]?.key;
      newState.users = updatedUsersRoles;
    }

    if (Object.keys(newState).length > 0) {
      this.setState((prevState) => ({ ...prevState, ...newState }));
    }
  }
  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };
  handleAddRow = () => {
    const { users, genders, positions, roles } = this.state;
    const keys = Object.keys(users);
    let newObject = {};
    Object.keys(users[keys[0]]).forEach(
      (key) =>
        (newObject = { ...newObject, [key]: key === 'id' ? uuidv4() : '' })
    );
    this.setState((prevState) => ({
      ...prevState,
      users: {
        ...prevState.users,
        [uuidv4()]: {
          ...newObject,
          roleId: roles[0].keyMap,
          positionId: positions[0].keyMap,
          gender: genders[0].keyMap,
        },
      },
    }));
  };
  handleRemoveRow = (key) => {
    const { users } = this.state;
    delete users[key];
    this.setState((prevState) => ({
      ...prevState,
      users,
    }));
  };
  render() {
    const isDeleteForm = this.props.location?.pathname?.includes(
      DELETE.toLocaleLowerCase()
    );
    const { lang, isLoading, isError } = this.props;
    const { genders, positions, roles, users, isLoadingRequest } = this.state;
    const { location } = this.props;
    const isUpdateForm = location?.pathname.includes(
      UPDATE.toLocaleLowerCase()
    );
    const isCreateForm =
      location?.pathname.includes(CREATE.toLocaleLowerCase()) ||
      location?.pathname.includes(COPY.toLocaleLowerCase());
    if (isLoading) {
      return <>Loading...</>;
    }

    if (isError) {
      return <>Error...</>;
    }

    return (
      <>
        <div className="mt-4 flex-grow-1 d-flex">
          <button className="btn btn-primary" onClick={this.goBack}>
            <FormattedMessage id="button.back" />
          </button>
          <div className="mx-2" />
        </div>
        {users &&
          Object.keys(users).length > 0 &&
          Object.keys(users).map((key, index) => {
            const user = users[key];
            const base64 = btoa(
              new Uint8Array(user.image?.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            const imageSrc = base64 ? `${PNG_PREFIX}${base64}` : '';

            return (
              <div key={key} className="d-lg-flex user-form">
                <form className="col col-12 col-md-10">
                  <div className="form-row my-2 row">
                    <div
                      className={
                        !isCreateForm
                          ? 'form-group col-12 col-lg-12'
                          : 'form-group col-6 col-lg-6'
                      }
                    >
                      <label htmlFor={`inputEmail${key}`}>
                        <FormattedMessage id="manage-user.email" />
                      </label>
                      <input
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="text"
                        className="form-control"
                        disabled={isDeleteForm}
                        id={`inputEmail${key}`}
                        placeholder={LanguageUtils.getMessageByKey(
                          'manage-user.emailPlaceholder',
                          lang
                        )}
                        value={user.email || ''}
                        name="email"
                      />
                    </div>
                    <div
                      className={
                        !isCreateForm ? 'd-none' : 'form-group  col-6 col-lg-6'
                      }
                    >
                      <label htmlFor={`inputPassword${key}`}>
                        <FormattedMessage id="manage-user.password" />
                      </label>
                      <input
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="password"
                        className="form-control"
                        disabled={isDeleteForm}
                        id={`inputPassword${key}`}
                        placeholder={LanguageUtils.getMessageByKey(
                          'manage-user.passwordPlaceholder',
                          lang
                        )}
                        value={user.password || ''}
                        name="password"
                      />
                    </div>
                    <div className={'form-group  col-6 col-lg-6'}>
                      <label htmlFor={`inputFirstName${key}`}>
                        <FormattedMessage id="manage-user.firstName" />
                      </label>
                      <input
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="text"
                        className="form-control"
                        disabled={isDeleteForm}
                        id={`inputFirstName${key}`}
                        placeholder={LanguageUtils.getMessageByKey(
                          'manage-user.firstNamePlaceholder',
                          lang
                        )}
                        name="firstName"
                        value={user.firstName || ''}
                      />
                    </div>
                    <div className={'form-group  col-6 col-lg-6'}>
                      <label htmlFor={`inputLastName${key}`}>
                        <FormattedMessage id="manage-user.lastName" />
                      </label>
                      <input
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="text"
                        className="form-control"
                        disabled={isDeleteForm}
                        id={`inputLastName${key}`}
                        placeholder={LanguageUtils.getMessageByKey(
                          'manage-user.lastNamePlaceholder',
                          lang
                        )}
                        name="lastName"
                        value={user.lastName || ''}
                      />
                    </div>
                  </div>
                  <div className="form-row my-2 row">
                    <div className="form-group col-12 col-lg-6 ">
                      <label htmlFor={`inputAddress${key}`}>
                        <FormattedMessage id="manage-user.address" />
                      </label>
                      <input
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="text"
                        className="form-control"
                        disabled={isDeleteForm}
                        id={`inputAddress${key}`}
                        placeholder={LanguageUtils.getMessageByKey(
                          'manage-user.addressPlaceholder',
                          lang
                        )}
                        name="address"
                        value={user.address || ''}
                      />
                    </div>
                    <div className="form-group col-12 col-lg-6 mt-2 mt-lg-0">
                      <label htmlFor={`inputPhoneNumber${key}`}>
                        <FormattedMessage id="manage-user.phoneNumber" />
                      </label>
                      <input
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="text"
                        name="phoneNumber"
                        className="form-control col-6 col-lg-3"
                        disabled={isDeleteForm}
                        id={`inputPhoneNumber${key}`}
                        placeholder={LanguageUtils.getMessageByKey(
                          'manage-user.phoneNumberPlaceholder',
                          lang
                        )}
                        value={user.phoneNumber || ''}
                      />
                    </div>
                  </div>
                  <div className="form-row my-2 row">
                    <div className="form-group col-md-6 col-lg-3 position-relative">
                      <label htmlFor={`inputGender${key}`}>
                        <FormattedMessage id="manage-user.gender" />
                      </label>
                      <i className="fa fa-chevron-down position-absolute arrows"></i>
                      <select
                        id={`inputGender${key}`}
                        className="form-control"
                        disabled={isDeleteForm}
                        name="gender"
                        onChange={(event) => this.handleChangeInput(event, key)}
                      >
                        {genders?.length > 0 &&
                          genders.map((item, index) => (
                            <option
                              key={item.id}
                              defaultChecked={index === 0}
                              value={item.keyMap || ''}
                            >
                              {lang.toLowerCase() === 'en'
                                ? item.valueEn
                                : item.valueVi}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group col-md-6 col-lg-3 position-relative">
                      <label htmlFor={`inputPosition${key}`}>
                        <FormattedMessage id="manage-user.position" />
                      </label>
                      <i className="fa fa-chevron-down position-absolute arrows"></i>
                      <select
                        id={`inputPosition${key}`}
                        className="form-control"
                        disabled={isDeleteForm}
                        name="position"
                        onChange={(event) => this.handleChangeInput(event, key)}
                      >
                        {positions?.length > 0 &&
                          positions.map((item, index) => (
                            <option
                              key={item.id}
                              defaultChecked={index === 0}
                              value={item.keyMap || ''}
                            >
                              {lang.toLowerCase() === 'en'
                                ? item.valueEn
                                : item.valueVi}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group col-md-6 col-lg-3 position-relative">
                      <label htmlFor={`inputRoleId${key}`}>
                        <FormattedMessage id="manage-user.role" />
                      </label>
                      <i className="fa fa-chevron-down position-absolute arrows"></i>
                      <select
                        id={`inputRoleId${key}`}
                        className="form-control"
                        disabled={isDeleteForm}
                        name="role"
                        onChange={(event) => this.handleChangeInput(event, key)}
                      >
                        {roles?.length > 0 &&
                          roles.map((item, index) => (
                            <option
                              key={item.id}
                              defaultChecked={index === 0}
                              value={item.keyMap || ''}
                            >
                              {lang.toLowerCase() === 'en'
                                ? item.valueEn
                                : item.valueVi}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group col-md-6 col-lg-3 inputImage-container">
                      <div className="d-flex">
                        <label
                          htmlFor={`inputImage${key}`}
                          className="btn btn-success mt-4"
                        >
                          <FormattedMessage id="manage-user.image" />
                          <i className="fas fa-upload"></i>
                        </label>
                        <input
                          onChange={(event) =>
                            this.handleChangeInput(event, key)
                          }
                          type="file"
                          accept="image/*"
                          className="form-control inputImage"
                          id={`inputImage${key}`}
                          value={user.avatar || ''}
                          name="avatar"
                          disabled={isDeleteForm}
                        />
                        <div
                          className="preview-image flex-grow-1 mt-4 mx-3"
                          style={
                            user.previewImgUrl
                              ? {
                                  background: `url(${user.previewImgUrl}) no-repeat center top / contain`,
                                  boxShadow: `rgba(0, 0, 0, 0.35) 0px 5px 15px`,
                                }
                              : imageSrc
                              ? {
                                  background: `url(${imageSrc}) no-repeat center top / contain`,
                                  boxShadow: `rgba(0, 0, 0, 0.35) 0px 5px 15px`,
                                }
                              : {}
                          }
                          onClick={() => {
                            if (user.previewImgUrl || imageSrc) {
                              this.setState((prevState) => ({
                                ...prevState,
                                users: {
                                  ...prevState.users,
                                  [key]: {
                                    ...prevState.users[key],
                                    isOpen: true,
                                  },
                                },
                              }));
                            }
                          }}
                        ></div>
                        {user.isOpen && (
                          <Lightbox
                            mainSrc={user.previewImgUrl || imageSrc}
                            onCloseRequest={() =>
                              this.setState((prevState) => ({
                                ...prevState,
                                users: {
                                  ...prevState.users,
                                  [key]: {
                                    ...prevState.users[key],
                                    isOpen: false,
                                  },
                                },
                              }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </form>
                {!isUpdateForm ? (
                  <div className="m-auto d-flex">
                    <button
                      className="btn d-inline-flex align-items-center btn-success"
                      onClick={this.handleAddRow}
                    >
                      <i className="fas fa-plus-circle text-white" />
                      <div className="mx-1" />
                      <FormattedMessage id={'button.addRow'} />
                    </button>
                    {index !== 0 ? (
                      <>
                        <div className="mx-2" />
                        <button
                          className="btn d-inline-flex align-items-center btn-danger"
                          onClick={() => this.handleRemoveRow(key)}
                        >
                          <i className="fas fa-minus-circle text-white" />
                          <div className="mx-1" />
                          <FormattedMessage id={'button.removeRow'} />
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        <div className="mt-4 flex-grow-1 d-flex">
          <button
            className="btn btn-primary"
            onClick={(event) => this.submitData(event, isCreateForm)}
            disabled={isLoadingRequest}
          >
            <FormattedMessage id="manage-user.save" />
          </button>
          <div className="mx-2" />
          <button className="btn btn-secondary" onClick={this.goBack}>
            <FormattedMessage id="button.cancel" />
          </button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
    genders: state.admin.genders,
    roles: state.admin.roles,
    statusCode: state.admin.statusCode,
    positions: state.admin.positions,
    isLoading: state.admin.isLoading,
    isError: state.admin.isError,
    isErrorCreate: state.admin.isErrorCreate,
    isErrorUpdate: state.admin.isErrorUpdate,
    isLoadingRead: state.admin.isLoadingRead,
    isErrorRead: state.admin.isErrorRead,
    isSuccessRead: state.admin.isSuccessRead,
    systemMenuPath: state.app.systemMenuPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (payload) => dispatch(actions.createNewUser(payload)),
    updateUsers: (payload) => dispatch(actions.updateUsers(payload)),
    deleteUsers: (payload) => dispatch(actions.deleteUsers(payload)),
    readUsers: (id) => dispatch(actions.readUsers(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionUserPage);