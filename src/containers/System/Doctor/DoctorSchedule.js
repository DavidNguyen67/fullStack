import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorSchedule.scss';
import * as actions from './../../../store/actions';
import moment from 'moment';
import localization from 'moment/locale/vi';
import * as constants from './../../../utils';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import * as services from './../../../services';
import { FormattedMessage } from 'react-intl';
import BookingModal from '../../Patient/Doctor/Modal/BookingModal';
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDay: [],
      allAvailableTime: [],
      isShow: false,
      dataTime: null,
      doctor: null,

      DateAppointment: new Date(),
    };
  }

  getDays = async (isFetch = true) => {
    const { lang } = this.props;

    let arrWeekDays = [];
    for (let index = 0; index < 7; index++) {
      const object = {};
      object.label =
        lang === constants.LANGUAGES.VI
          ? index === 0
            ? `Hôm nay - ${moment(new Date()).format('DD/MM')}`
            : moment(new Date()).add(index, 'days').format('dddd - DD/MM')
          : index === 0
          ? `Today - ${moment(new Date()).locale('en').format('DD/MM')}`
          : moment(new Date())
              .add(index, 'days')
              .locale('en')
              .format('ddd - DD/MM');
      object.value = moment(new Date())
        .add(index, 'days')
        .startOf('day')
        .valueOf();
      arrWeekDays = [...arrWeekDays, object];
    }
    if (isFetch) {
      const date = arrWeekDays.length > 0 && arrWeekDays[0]?.value;
      await this.fetchSchedule(date);
    }

    this.setState((prevState) => ({
      ...prevState,
      allDay: arrWeekDays,
    }));
  };

  fetchSchedule = async (date) => {
    let id = this.props.match.params.id;
    const { doctorId, userInfo } = this.props;

    if (doctorId) id = doctorId;
    if (id && date) {
      const response = await services.getWeekDaysSchedule(id, date);
      if (response.statusCode === 200) {
        this.setState((prevState) => ({
          ...prevState,
          allAvailableTime: response.data,
          DateAppointment: date,
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          allAvailableTime: [],
        }));
      }
    }
  };

  async componentDidMount() {
    this.getDays();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang) {
      this.getDays(false);
    }
    if (prevProps.doctorId !== this.props.doctorId) {
      const response = await services.getDoctorDetail(this.props.doctorId);
      if (response) {
        console.log(response.data);
        if (response.statusCode === 200) {
          this.setState((prevState) => ({
            ...prevState,
            doctor: response.data,
            isLoading: false,
            isFailed: false,
          }));
          return;
        } else
          this.setState((prevState) => ({
            ...prevState,
            doctor: {},
            isFailed: true,
            isLoading: false,
          }));
        return;
      }
    }
  }

  handleSelectWeekDays = async (event) => {
    const date = event.target.value;
    await this.fetchSchedule(date);
  };

  handleBook = (item) => {
    this.toggleModal();
    this.setState((prevState) => ({
      ...prevState,
      dataTime: item,
    }));
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isShow: !prevState.isShow,
    }));
  };
  render() {
    const { allDay, allAvailableTime, isShow, dataTime, DateAppointment } =
      this.state;
    const { lang, doctorData } = this.props;
    return (
      <>
        <div className="doctor-schedule-container row">
          <div className="all-schedule col-12 col-md-6">
            <select
              onChange={this.handleSelectWeekDays}
              className="text-capitalize form-select"
            >
              {allDay.length > 0 &&
                allDay.map((day) => {
                  return (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt my-3">
                <span className="text-uppercase mx-2">
                  <FormattedMessage id={'scheduleDoctor.schedule'} />
                </span>
              </i>
            </div>
            <div className="time-content">
              {allAvailableTime.length > 0 ? (
                <div className="row">
                  {allAvailableTime.map((item) => {
                    const timeDisplay =
                      lang === constants.LANGUAGES.EN
                        ? item.time?.valueEn
                        : item.time?.valueVi;
                    return (
                      <div
                        className="col-12 col-sm-6 col-md-4 my-2"
                        key={item.id}
                      >
                        <button
                          className="btn col-12"
                          onClick={() => this.handleBook(item)}
                        >
                          {timeDisplay}
                        </button>
                      </div>
                    );
                  })}
                  <div className="book-free">
                    <span>
                      <FormattedMessage id={'scheduleDoctor.bookFree.choose'} />{' '}
                      <i className="far fa-hand-point-up" />{' '}
                      <FormattedMessage
                        id={'scheduleDoctor.bookFree.bookFree'}
                      />
                    </span>
                  </div>
                </div>
              ) : (
                <div className="col-12">
                  <FormattedMessage id={'scheduleDoctor.NoData'} />
                </div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isShow={isShow}
          toggleModal={this.toggleModal}
          dataTime={dataTime}
          doctorData={doctorData}
          DateAppointment={DateAppointment}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    doctors: state.admin.doctors,
    lang: state.app.language,
    timeSchedule: state.admin.timeSchedule,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readAllDoctors: () => dispatch(actions.readAllDoctors()),
    readAllScheduleHours: () => dispatch(actions.readAllScheduleHours()),
    startLoading: () => dispatch(actions.startLoading()),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DoctorSchedule));
