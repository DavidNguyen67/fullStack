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

const initInfo = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  avatar: '',
};
class ActionUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      dataForModal: {},
      previewImgUrl: undefined,
      isOpen: false,

      ...initInfo,
      users: [],
    };
  }
  handleChangeInput = (event, key) => {
    if (event.target.type.toLowerCase() === 'file') {
      const onSelectFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
          this.setState((prevState) => ({
            ...prevState,
            previewImgUrl: undefined,
          }));
          return;
        }

        if (this.state.previewImgUrl) {
          URL.revokeObjectURL(this.state.previewImgUrl);
        }
        // I've kept this example simple by using the first image instead of multiple
        const objectUrl = URL.createObjectURL(event.target.files[0]);
        this.setState((prevState) => ({
          ...prevState,
          previewImgUrl: objectUrl,
        }));
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

    const validateFields = (ObjectData) => {
      Object.keys(ObjectData).every((key, index) => {
        const { email, password, firstName, lastName, phoneNumber } =
          ObjectData[key];

        if (!email) {
          toast.error(<FormattedMessage id="validate.emailRequired" />);
          return false;
        }
        if (!password) {
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

        if (!validator.isLength(password, { min: 6 })) {
          toast.error(<FormattedMessage id="validate.passwordLength" />);
          return false;
        }

        if (validator.isNumeric(firstName) || validator.isNumeric(lastName)) {
          toast.error(<FormattedMessage id="validate.nameCharacters" />);
          return false;
        }

        if (
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

    console.log(this.state.users);
    // const {
    //   email,
    //   password,
    //   firstName,
    //   lastName,
    //   phoneNumber,
    //   address,
    //   gender,
    //   position,
    //   role,
    //   avatar,
    // } = this.state;

    // let payload = {
    //   email,
    //   password,
    //   firstName,
    //   lastName,
    //   phoneNumber,
    //   address,
    //   gender,
    //   positionId: position,
    //   roleId: role,
    //   image: avatar,
    // };
    // payload = Array.isArray(payload) ? payload : [payload];
    // await this.props.createNewUser(payload);
    // if (this.props.isErrorCreated) {
    //   toast.error(
    //     <FormattedMessage
    //       id="toast.failedCreateUser"
    //       values={{
    //         br: <br />,
    //       }}
    //       tagName="div"
    //     />
    //   );
    // } else {
    //   toast.success(
    //     <FormattedMessage
    //       id="toast.successCreateUser"
    //       values={{
    //         br: <br />,
    //       }}
    //       tagName="div"
    //     />
    //   );
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     ...initInfo,
    //   }));
    // }
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

  render() {
    const { lang, isLoading, isError } = this.props;
    const { genders, positions, roles, previewImgUrl, isOpen, users } =
      this.state;
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      avatar,
    } = this.state;

    if (isLoading) {
      return <>Loading...</>;
    }

    if (isError) {
      return <>Error...</>;
    }
    return (
      <>
        {users &&
          Object.keys(users).length > 0 &&
          Object.keys(users).map((key) => {
            const user = users[key];
            return (
              <form key={key} className="col col-12 col-md-10 user-form">
                <div className="form-row my-2 row">
                  <div className="form-group col-6 col-lg-3">
                    <label htmlFor="inputEmail">
                      <FormattedMessage id="manage-user.email" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="text"
                      className="form-control"
                      id="inputEmail"
                      placeholder={LanguageUtils.getMessageByKey(
                        'manage-user.emailPlaceholder',
                        lang
                      )}
                      value={user.email || ''}
                      name="email"
                    />
                  </div>
                  <div className="form-group col-6 col-lg-3">
                    <label htmlFor="inputPassword">
                      <FormattedMessage id="manage-user.password" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="password"
                      className="form-control"
                      id="inputPassword"
                      placeholder={LanguageUtils.getMessageByKey(
                        'manage-user.passwordPlaceholder',
                        lang
                      )}
                      value={user.password || ''}
                      name="password"
                    />
                  </div>
                  <div className="form-group col-6 col-lg-3">
                    <label htmlFor="inputFirstName">
                      <FormattedMessage id="manage-user.firstName" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="text"
                      className="form-control"
                      id="inputFirstName"
                      placeholder={LanguageUtils.getMessageByKey(
                        'manage-user.firstNamePlaceholder',
                        lang
                      )}
                      name="firstName"
                      value={user.firstName || ''}
                    />
                  </div>
                  <div className="form-group col-6 col-lg-3">
                    <label htmlFor="inputLastName">
                      <FormattedMessage id="manage-user.lastName" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="text"
                      className="form-control"
                      id="inputLastName"
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
                    <label htmlFor="inputAddress">
                      <FormattedMessage id="manage-user.address" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="text"
                      className="form-control"
                      id="inputAddress"
                      placeholder={LanguageUtils.getMessageByKey(
                        'manage-user.addressPlaceholder',
                        lang
                      )}
                      name="address"
                      value={user.address || ''}
                    />
                  </div>
                  <div className="form-group col-12 col-lg-6 mt-2 mt-lg-0">
                    <label htmlFor="inputPhoneNumber">
                      <FormattedMessage id="manage-user.phoneNumber" />
                    </label>
                    <input
                      onChange={(event) => this.handleChangeInput(event, key)}
                      type="text"
                      name="phoneNumber"
                      className="form-control col-6 col-lg-3"
                      id="inputPhoneNumber"
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
                    <label htmlFor="inputGender">
                      <FormattedMessage id="manage-user.gender" />
                    </label>
                    <i className="fa fa-chevron-down position-absolute arrows"></i>
                    <select
                      id="inputGender"
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
                    <label htmlFor="inputPosition">
                      <FormattedMessage id="manage-user.position" />
                    </label>
                    <i className="fa fa-chevron-down position-absolute arrows"></i>
                    <select
                      id="inputPosition"
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
                    <label htmlFor="inputRoleId">
                      <FormattedMessage id="manage-user.role" />
                    </label>
                    <i className="fa fa-chevron-down position-absolute arrows"></i>
                    <select
                      id="inputRoleId"
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
                        htmlFor="inputImage"
                        className="btn btn-success mt-4"
                      >
                        <FormattedMessage id="manage-user.image" />
                        <i className="fas fa-upload"></i>
                      </label>
                      <input
                        onChange={(event) => this.handleChangeInput(event, key)}
                        type="file"
                        className="form-control"
                        id="inputImage"
                        value={user.avatar || ''}
                        name="avatar"
                      />
                      <div
                        className="preview-image flex-grow-1 mt-4 mx-3"
                        style={
                          previewImgUrl
                            ? {
                                background: `url(${previewImgUrl}) no-repeat center top / contain`,
                                boxShadow: `rgba(0, 0, 0, 0.35) 0px 5px 15px`,
                              }
                            : {}
                        }
                        onClick={() =>
                          this.setState((prevState) => ({
                            ...prevState,
                            isOpen: true,
                          }))
                        }
                      ></div>
                      {isOpen && (
                        <Lightbox
                          mainSrc={previewImgUrl}
                          onCloseRequest={() =>
                            this.setState((prevState) => ({
                              ...prevState,
                              isOpen: false,
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
          <button className="btn btn-primary" onClick={this.submitData}>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (payload) => dispatch(actions.createNewUser(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionUserPage);
