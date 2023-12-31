import { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LanguageUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import validator from 'validator';
import { toast } from 'react-toastify';
import { getAllUsersService } from '../../../services/userService';
import { v4 as uuidv4 } from 'uuid';

const COPY = 'COPY';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const DELETE = 'DELETE';
const REAAD = 'READ';

class ActionUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      dataForModal: {},
      isOpen: false,

      users: {},
      pureUsers: [],
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
            [key]: { ...prevState.users[key], previewImgUrl: objectUrl },
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
    const isUpdateForm = this.props.location?.pathname?.includes(
      UPDATE.toLocaleLowerCase()
    );
    const validateFields = (ObjectData) => {
      return Object.keys(ObjectData).every((key) => {
        const { email, password, firstName, lastName, phoneNumber } =
          ObjectData[key];

        if (!email) {
          toast.error(<FormattedMessage id="validate.emailRequired" />);
          return false;
        }
        if (isCreateForm && !password) {
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

        if (isCreateForm && !validator.isLength(password, { min: 6 })) {
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

    if (!validateFields(this.state.users)) {
      return;
    }

    let payload = [];
    Object.keys(this.state.users).forEach(
      (key) => (payload = [...payload, this.state.users[key]])
    );

    payload = Array.isArray(payload) ? payload : [payload];

    // const isCreateForm = this.props.location?.pathname?.includes(
    //   CREATE.toLocaleLowerCase()
    // );
    // const isCreateForm = this.props.location?.pathname?.includes(
    //   CREATE.toLocaleLowerCase()
    // );
    if (isCreateForm) {
      await this.props.createNewUser(payload);
      if (this.props.isErrorCreated) {
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
    }
    if (isUpdateForm) {
      let result = [];
      // payload.forEach((data) =>
      //   Object.keys(this.state.users).forEach((key) => {
      //     if (this.state.users[key]?.email === data.key) {
      //       const { email, ...payloadUpdate } = this.state.users[key];
      //       result = [...result, payloadUpdate];
      //     } else result = [...result, this.state.users[key]];
      //   })
      // );
      // Object.keys(this.state.users).forEach(key => {

      // })
      payload = result;
      console.log(payload);
      await this.props.updateUsers(payload);
      if (this.props.isErrorUpdate) {
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
      if (response.data) {
        const users = response.data.reduce((accumulator, value) => {
          return { ...accumulator, [uuidv4()]: value };
        }, {});
        this.setState((prevState) => ({
          ...prevState,
          users,
          pureUsers: response.data,
        }));
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

  render() {
    const { lang, isLoading, isError } = this.props;
    const { genders, positions, roles, users } = this.state;
    const { location } = this.props;
    const isCreateForm = location?.pathname.includes(
      CREATE.toLocaleLowerCase()
    );

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
          Object.keys(users).map((key) => {
            const user = users[key];
            return (
              <form key={key} className="col col-12 col-md-10 user-form">
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
                      id={`inputPassword${key}`}
                      placeholder={LanguageUtils.getMessageByKey(
                        'manage-user.passwordPlaceholder',
                        lang
                      )}
                      value={user.password || ''}
                      name="password"
                    />
                  </div>
                  <div className="form-group col-6 col-lg-3">
                    <label htmlFor={`inputFirstName${key}`}>
                      <FormattedMessage id="manage-user.firstName" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="text"
                      className="form-control"
                      id={`inputFirstName${key}`}
                      placeholder={LanguageUtils.getMessageByKey(
                        'manage-user.firstNamePlaceholder',
                        lang
                      )}
                      name="firstName"
                      value={user.firstName || ''}
                    />
                  </div>
                  <div className="form-group col-6 col-lg-3">
                    <label htmlFor={`inputLastName${key}`}>
                      <FormattedMessage id="manage-user.lastName" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="text"
                      className="form-control"
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
                      name="gender"
                      onChange={(event) => this.handleChangeInput(event, key)}
                    >
                      {genders?.length > 0 &&
                        genders.map((item, index) => (
                          <option
                            key={item.id}
                            defaultChecked={index === 0}
                            value={user.item || ''.key}
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
                      name="position"
                      onChange={(event) => this.handleChangeInput(event, key)}
                    >
                      {positions?.length > 0 &&
                        positions.map((item, index) => (
                          <option
                            key={item.id}
                            defaultChecked={index === 0}
                            value={user.item || ''.key}
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
                      name="role"
                      onChange={(event) => this.handleChangeInput(event, key)}
                    >
                      {roles?.length > 0 &&
                        roles.map((item, index) => (
                          <option
                            key={item.id}
                            defaultChecked={index === 0}
                            value={user.item || ''.key}
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
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="file"
                        className="form-control inputImage"
                        id={`inputImage${key}`}
                        value={user.avatar || ''}
                        name="avatar"
                      />
                      <div
                        className="preview-image flex-grow-1 mt-4 mx-3"
                        style={
                          user.previewImgUrl
                            ? {
                                background: `url(${user.previewImgUrl}) no-repeat center top / contain`,
                                boxShadow: `rgba(0, 0, 0, 0.35) 0px 5px 15px`,
                              }
                            : {}
                        }
                        onClick={() =>
                          this.setState((prevState) => ({
                            ...prevState,
                            users: {
                              ...prevState.users,
                              [key]: {
                                ...prevState.users[key],
                                isOpen: true,
                              },
                            },
                          }))
                        }
                      ></div>
                      {user.isOpen && (
                        <Lightbox
                          mainSrc={user.previewImgUrl}
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
            );
          })}
        <div className="mt-4 flex-grow-1 d-flex">
          <button
            className="btn btn-primary"
            onClick={(event) => this.submitData(event, isCreateForm)}
          >
            <FormattedMessage id="manage-user.save" />
          </button>
          <div className="mx-2" />
          <button className="btn btn-secondary">
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
    positions: state.admin.positions,
    isLoading: state.admin.isLoading,
    isError: state.admin.isError,
    isErrorCreated: state.admin.isErrorCreated,
    isErrorUpdate: state.admin.isErrorUpdate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (payload) => dispatch(actions.createNewUser(payload)),
    updateUsers: (payload) => dispatch(actions.updateUsers(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionUserPage);
