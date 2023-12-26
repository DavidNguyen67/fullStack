import { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LanguageUtils } from '../../../utils';
import * as actions from './../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import validator from 'validator';
import { toast } from 'react-toastify';

const initInfo = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  avatar: '',
};
class UserManageRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      dataForModal: {},
      previewImgUrl: undefined,
      isOpen: false,

      ...initInfo,
    };
  }
  handleChangeInput = (event) => {
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
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  };
  submitData = async (event) => {
    event.preventDefault();

    const validateFields = () => {
      const { email, password, firstName, lastName, phoneNumber } = this.state;

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

      if (!validator.isMobilePhone(phoneNumber, 'any', { strictMode: false })) {
        toast.error(<FormattedMessage id="validate.phoneNumberInvalid" />);
        return false;
      }

      return true;
    };

    if (!validateFields()) {
      return;
    }

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

    let payload = {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      positionId: position,
      roleId: role,
      image: avatar,
    };
    payload = Array.isArray(payload) ? payload : [payload];
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
      this.setState({
        ...this.state,
        ...initInfo,
      });
    }
  };
  componentWillUnmount() {
    if (this.state.previewImgUrl) {
      URL.revokeObjectURL(this.state.previewImgUrl);
    }
  }
  componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    let newState = null;
    if (prevProps.genders !== this.props.genders) {
      newState = {
        ...newState,
        genders: this.props.genders,
        gender: this.props.genders[0]?.key,
      };
    }
    if (prevProps.positions !== this.props.positions) {
      newState = {
        ...newState,
        positions: this.props.positions,
        position: this.props.positions[0]?.key,
      };
    }
    if (prevProps.roles !== this.props.roles) {
      newState = {
        ...newState,
        roles: this.props.roles,
        role: this.props.roles[0]?.key,
      };
    }

    newState && this.setState({ ...prevState, ...newState });
  }

  render() {
    const { lang, isLoading, isError } = this.props;
    const { genders, positions, roles, previewImgUrl, isOpen } = this.state;
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
        <form className="col col-12 col-md-10 mx-auto">
          <div className="form-row my-2 row">
            <div className="form-group col-6 col-lg-3">
              <label htmlFor="inputEmail">
                <FormattedMessage id="manage-user.email" />
              </label>
              <input
                onChange={this.handleChangeInput}
                type="text"
                className="form-control"
                id="inputEmail"
                placeholder={LanguageUtils.getMessageByKey(
                  'manage-user.emailPlaceholder',
                  lang
                )}
                value={email}
                name="email"
              />
            </div>
            <div className="form-group col-6 col-lg-3">
              <label htmlFor="inputPassword">
                <FormattedMessage id="manage-user.password" />
              </label>
              <input
                onChange={this.handleChangeInput}
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder={LanguageUtils.getMessageByKey(
                  'manage-user.passwordPlaceholder',
                  lang
                )}
                value={password}
                name="password"
              />
            </div>
            <div className="form-group col-6 col-lg-3">
              <label htmlFor="inputFirstName">
                <FormattedMessage id="manage-user.firstName" />
              </label>
              <input
                onChange={this.handleChangeInput}
                type="text"
                className="form-control"
                id="inputFirstName"
                placeholder={LanguageUtils.getMessageByKey(
                  'manage-user.firstNamePlaceholder',
                  lang
                )}
                name="firstName"
                value={firstName}
              />
            </div>
            <div className="form-group col-6 col-lg-3">
              <label htmlFor="inputLastName">
                <FormattedMessage id="manage-user.lastName" />
              </label>
              <input
                onChange={this.handleChangeInput}
                type="text"
                className="form-control"
                id="inputLastName"
                placeholder={LanguageUtils.getMessageByKey(
                  'manage-user.lastNamePlaceholder',
                  lang
                )}
                name="lastName"
                value={lastName}
              />
            </div>
          </div>
          <div className="form-row my-2 row">
            <div className="form-group col-12 col-lg-6 ">
              <label htmlFor="inputAddress">
                <FormattedMessage id="manage-user.address" />
              </label>
              <input
                onChange={this.handleChangeInput}
                type="text"
                className="form-control"
                id="inputAddress"
                placeholder={LanguageUtils.getMessageByKey(
                  'manage-user.addressPlaceholder',
                  lang
                )}
                name="address"
                value={address}
              />
            </div>
            <div className="form-group col-12 col-lg-6 mt-2 mt-lg-0">
              <label htmlFor="inputPhoneNumber">
                <FormattedMessage id="manage-user.phoneNumber" />
              </label>
              <input
                onChange={this.handleChangeInput}
                type="text"
                name="phoneNumber"
                className="form-control col-6 col-lg-3"
                id="inputPhoneNumber"
                placeholder={LanguageUtils.getMessageByKey(
                  'manage-user.phoneNumberPlaceholder',
                  lang
                )}
                value={phoneNumber}
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
                onChange={this.handleChangeInput}
              >
                {genders?.length > 0 &&
                  genders.map((item, index) => (
                    <option
                      key={item.id}
                      defaultChecked={index === 0}
                      value={item.key}
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
                onChange={this.handleChangeInput}
              >
                {positions?.length > 0 &&
                  positions.map((item, index) => (
                    <option
                      key={item.id}
                      defaultChecked={index === 0}
                      value={item.key}
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
                onChange={this.handleChangeInput}
              >
                {roles?.length > 0 &&
                  roles.map((item, index) => (
                    <option
                      key={item.id}
                      defaultChecked={index === 0}
                      value={item.key}
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
                <label htmlFor="inputImage" className="btn btn-success mt-4">
                  <FormattedMessage id="manage-user.image" />
                  <i className="fas fa-upload"></i>
                </label>
                <input
                  onChange={this.handleChangeInput}
                  type="file"
                  className="form-control"
                  id="inputImage"
                  value={avatar}
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
                  onClick={() => this.setState({ isOpen: true })}
                ></div>
                {isOpen && (
                  <Lightbox
                    mainSrc={previewImgUrl}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                  />
                )}
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={this.submitData}>
            <FormattedMessage id="manage-user.save" />
          </button>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManageRedux);
