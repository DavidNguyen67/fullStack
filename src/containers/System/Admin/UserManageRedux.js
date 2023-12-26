import { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LanguageUtils } from '../../../utils';
import * as actions from './../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class UserManageRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      dataForModal: {},
      previewImgUrl: undefined,
      isOpen: false,
    };
  }
  onSelectFile = (event) => {
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
      newState = { ...newState, genders: this.props.genders };
    }
    if (prevProps.positions !== this.props.positions) {
      newState = { ...newState, positions: this.props.positions };
    }
    if (prevProps.roles !== this.props.roles) {
      newState = { ...newState, roles: this.props.roles };
    }

    newState && this.setState({ ...prevState, ...newState });
  }

  render() {
    const { lang, isLoading, isError } = this.props;
    const { genders, positions, roles, previewImgUrl, isOpen } = this.state;

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
            <div className="form-group col-12 col-lg-6">
              <label htmlFor="inputEmail">Email</label>
              <input
                type="text"
                className="form-control"
                id="inputEmail"
                placeholder={LanguageUtils.getMessageByKey(
                  'login.password',
                  lang
                )}
              />
            </div>
            <div className="form-group col-6 col-lg-3">
              <label htmlFor="inputFirstName">
                <FormattedMessage id="manage-user.firstName" />
              </label>
              <input
                type="text"
                className="form-control"
                id="inputFirstName"
                placeholder={LanguageUtils.getMessageByKey(
                  'login.password',
                  lang
                )}
              />
            </div>
            <div className="form-group col-6 col-lg-3">
              <label htmlFor="inputLastName">
                <FormattedMessage id="manage-user.lastName" />
              </label>
              <input
                type="text"
                className="form-control"
                id="inputLastName"
                placeholder={LanguageUtils.getMessageByKey(
                  'login.password',
                  lang
                )}
              />
            </div>
          </div>
          <div className="form-row my-2 row">
            <div className="form-group col-12 col-lg-6 ">
              <label htmlFor="inputAddress">
                <FormattedMessage id="manage-user.address" />
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                placeholder={LanguageUtils.getMessageByKey(
                  'login.password',
                  lang
                )}
              />
            </div>
            <div className="form-group col-12 col-lg-6 mt-2 mt-lg-0">
              <label htmlFor="inputPhoneNumber">
                <FormattedMessage id="manage-user.phoneNumber" />
              </label>
              <input
                type="text"
                className="form-control col-6 col-lg-3"
                id="inputPhoneNumber"
                placeholder={LanguageUtils.getMessageByKey(
                  'login.password',
                  lang
                )}
              />
            </div>
          </div>
          <div className="form-row my-2 row">
            <div className="form-group col-md-6 col-lg-3">
              <label htmlFor="inputGender">
                <FormattedMessage id="manage-user.gender" />
              </label>

              <select id="inputGender" className="form-control">
                {genders?.length > 0 &&
                  genders.map((gender) => (
                    <option key={gender.id}>
                      {lang.toLowerCase() === 'en'
                        ? gender.valueEn
                        : gender.valueVi}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group col-md-6 col-lg-3">
              <label htmlFor="inputPosition">
                <FormattedMessage id="manage-user.position" />
              </label>

              <select id="inputPosition" className="form-control">
                {positions?.length > 0 &&
                  positions.map((position) => (
                    <option key={position.id}>
                      {lang.toLowerCase() === 'en'
                        ? position.valueEn
                        : position.valueVi}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group col-md-6 col-lg-3">
              <label htmlFor="inputRoleId">
                <FormattedMessage id="manage-user.role" />
              </label>

              <select id="inputRoleId" className="form-control">
                {roles?.length > 0 &&
                  roles.map((role) => (
                    <option key={role.id}>
                      {lang.toLowerCase() === 'en'
                        ? role.valueEn
                        : role.valueVi}
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
                  type="file"
                  className="form-control"
                  id="inputImage"
                  onChange={this.onSelectFile}
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
          <button type="submit" className="btn btn-primary">
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManageRedux);
