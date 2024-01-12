import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../../store/actions';
import * as services from './../../../../services';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { LANGUAGES } from '../../../../utils';
import validator from 'validator';
import { toast } from 'react-toastify';
import DatePicker from './../../../../components/Input/DatePicker';
import moment from 'moment';
class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      isLoading: false,

      date: null,
      timeType: null,
      doctorId: null,

      namePatient: '',
      phoneNumber: '',
      email: '',
      address: '',
      note: '',
      dob: new Date(),
      gender: {},
    };

    this.timer = null;

    this.windowResized = this.windowResized.bind(this);

    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.windowResized);
    this.updateWindowWidth();

    const { genders } = this.props;
    if (!genders || genders.length < 1) this.props.getGenderStart();
  }

  async componentDidUpdate(prevProps, prevState) {
    const newState = {};

    if (prevProps.dataTime !== this.props.dataTime) {
      const { date, timeType, doctorId } = this.props.dataTime;
      newState.date = date;
      newState.timeType = timeType;
      newState.doctorId = doctorId;
    }

    if (prevProps.genders !== this.props.genders) {
      const { lang, genders } = this.props;
      newState.genders = this.props.genders;
      newState.gender = {
        value: genders[0]?.keyMap,
        label:
          lang === LANGUAGES.EN ? genders[0]?.valueEn : genders[0]?.valueVi,
      };
    }
    if (prevProps.lang !== this.props.lang) {
      const { lang, genders } = this.props;
      newState.gender = {
        value: genders[0]?.keyMap,
        label:
          lang === LANGUAGES.EN ? genders[0]?.valueEn : genders[0]?.valueVi,
      };
    }

    // Only call setState once with the accumulated changes
    if (Object.keys(newState).length > 0)
      this.setState((prevState) => ({
        ...prevState,
        ...newState,
      }));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResized);
    this.setState((prevState) => ({
      ...prevState,
      date: null,
      timeType: null,
      doctorId: null,
      namePatient: '',
      phoneNumber: '',
      email: '',
      address: '',
      note: '',
      dob: new Date(),
      gender: {},
    }));
  }

  updateWindowWidth() {
    let _this = this;
    setTimeout(function () {
      _this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }

  windowResized() {
    let _this = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function () {
      _this.updateWindowWidth();
    }, 500);
  }

  bookConfirm = async () => {
    const {
      timeType,
      doctorId,
      namePatient,
      phoneNumber,
      email,
      address,
      note,
      dob,
      gender,
    } = this.state;
    const payload = {
      date: dob,
      timeType,
      doctorId,
      namePatient,
      phoneNumber,
      email,
      address,
      note,
      gender: gender.value,
    };

    const validateFields = () => {
      const { namePatient, phoneNumber, email } = this.state;

      if (!namePatient) {
        toast.error(<FormattedMessage id="validate.nameRequired" />);
        return false;
      }

      if (!email) {
        toast.error(<FormattedMessage id="validate.emailRequired" />);
        return false;
      }

      if (!validator.isEmail(email)) {
        toast.error(<FormattedMessage id="validate.emailInvalid" />);
        return false;
      }

      if (validator.isNumeric(namePatient)) {
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
    };

    if (!validateFields()) {
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const response = await services.createAppointment(payload);

    this.setState((prevState) => ({
      ...prevState,
      isLoading: false,
    }));

    if (
      response.status === 500 ||
      response.data?.statusCode === 500 ||
      response.statusCode === 500
    ) {
      toast.error(<FormattedMessage id={`toast.InternalError`} />);
      return;
    }
    if (response.statusCode === 200 || response.status === 200) {
      toast.success(<FormattedMessage id="toast.successCreateAppointment" />);
      this.setState((prevState) => ({
        ...prevState,
        date: null,
        timeType: null,
        doctorId: null,
        namePatient: '',
        phoneNumber: '',
        email: '',
        address: '',
        note: '',
        dob: new Date(),
        gender: {},
      }));
      this.props.toggleModal();
      return;
    }
    toast.error(<FormattedMessage id="toast.failedCreateAppointment" />);
  };

  handleChange = {
    name: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        namePatient: event.target.value,
      }));
    },
    phoneNumber: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        phoneNumber: event.target.value,
      }));
    },
    email: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        email: event.target.value,
      }));
    },
    address: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        address: event.target.value,
      }));
    },
    note: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        note: event.target.value,
      }));
    },
    dob: ([date]) => {
      this.setState((prevState) => ({
        ...prevState,
        dob: date,
      }));
    },
    gender: (selectedGender) => {
      this.setState((prevState) => ({
        ...prevState,
        gender: selectedGender,
      }));
    },
  };

  render() {
    const {
      width,
      doctorId,
      namePatient,
      phoneNumber,
      email,
      address,
      note,
      gender,
      dob,
      isLoading,
    } = this.state;
    const { isShow, toggleModal, dataTime, genders, lang } = this.props;

    const listGender = genders.map((item) => {
      return {
        value: item.keyMap,
        label: lang === LANGUAGES.EN ? item.valueEn : item.valueVi,
      };
    });

    return (
      <>
        <Modal
          isOpen={isShow}
          toggle={toggleModal}
          // {...props}
          className="modal-booking-container"
          centered={width < 576}
          size="lg"
        >
          <div
            className="booking-modal-content"
            onKeyPress={(event) => event.which === 13 && this.bookConfirm()}
          >
            <div className="booking-modal-header">
              <div className="row">
                <div className="col-10">
                  <span>
                    <FormattedMessage id="booking.title" />
                  </span>
                </div>
                <div className="col-2">
                  <span
                    className="float-end p-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleModal()}
                  >
                    <i className="fas fa-times" />
                  </span>
                </div>
              </div>
            </div>
            <div className="booking-modal-body">
              <div className="row">
                <div className="col-12">
                  <ProfileDoctor
                    id={doctorId}
                    isShowDesc={false}
                    dataTime={dataTime}
                  />
                  <hr />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.name" />
                    </label>
                    <input
                      className="form-control"
                      onChange={this.handleChange.name}
                      value={namePatient}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.phoneNumber" />
                    </label>
                    <input
                      className="form-control"
                      onChange={this.handleChange.phoneNumber}
                      value={phoneNumber}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.email" />
                    </label>
                    <input
                      className="form-control"
                      onChange={this.handleChange.email}
                      value={email}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.address" />
                    </label>
                    <input
                      className="form-control"
                      onChange={this.handleChange.address}
                      value={address}
                    />
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.reason" />
                    </label>
                    <input
                      className="form-control"
                      onChange={this.handleChange.note}
                      value={note}
                    />
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.dob" />
                    </label>
                    <DatePicker
                      onChange={this.handleChange.dob}
                      className="form-control"
                      value={dob}
                    />
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.gender" />
                    </label>
                    <Select
                      value={gender}
                      onChange={this.handleChange.gender}
                      options={listGender}
                      placeholder={
                        <FormattedMessage id={'manage-user.gender'} />
                      }
                    />
                  </div>
                </div>
                <div className="col-12">
                  <hr />
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <div className="row">
                <div className="col-6 col-sm-3 ms-auto">
                  <button
                    className="btn btn-success w-100"
                    onClick={this.bookConfirm}
                    disabled={isLoading}
                  >
                    <FormattedMessage id="button.book" />
                  </button>
                </div>
                <div className="col-6 col-sm-3">
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => toggleModal()}
                  >
                    <FormattedMessage id="button.cancel" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    lang: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
