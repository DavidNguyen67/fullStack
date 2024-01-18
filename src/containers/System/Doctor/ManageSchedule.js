import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import * as actions from './../../../store/actions';
import Select from 'react-select';
import * as constant from './../../../utils';
import DatePicker from './../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import {
  createNewScheduleService,
  getDoctorDetail,
  getWeekDaysSchedule,
} from '../../../services/userService';
import moment from 'moment';
import NavigatorPage from '../../../components/NavigatorPage/NavigatorPage';

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDoctor: null,
      isLoading: false,
      currentDate: new Date(),
      timeSchedule: [],
      doctors: [],
      selectedTime: [],
    };
  }

  handleChange = async (selectedDoctor) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedDoctor,
    }));
  };

  handleSave = async () => {
    const { userInfo } = this.props;
    const { currentDate, selectedDoctor, selectedTime } = this.state;

    if (!userInfo && !selectedDoctor) {
      toast.error(<FormattedMessage id="toast.selectDoctorIsRequired" />);
      return;
    }
    if (!currentDate) {
      toast.error(<FormattedMessage id="toast.selectDateIsRequired" />);
      return;
    }
    if (selectedTime.length < 1) {
      toast.error(<FormattedMessage id="toast.selectScheduleIsRequired" />);
      return;
    }

    const payload = {
      date: currentDate,
      doctorId: selectedDoctor?.value || userInfo.id,
      timeType:
        selectedTime?.map &&
        selectedTime.map((item) => item.keyMap || item.timeType),
    };

    // filter the false value in payload
    Object.keys(payload).forEach((key) => {
      if (typeof new Date().getMonth === 'function') return;
      if (Array.isArray(payload[key])) {
        payload[key] = payload[key].filter(
          (item) => item || Object.keys(item).length > 0
        );
        return;
      }
      if (Object.keys(payload[key]).length < 1) delete payload[key];
    });

    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    this.props.startLoading();
    const response = await createNewScheduleService(payload);
    this.props.stopLoading();
    this.setState((prevState) => ({
      ...prevState,
      isLoading: false,
      selectedTime: [],
    }));

    if (response && response.statusCode === 200) {
      toast.success(<FormattedMessage id={`toast.successBookSchedule`} />);
    } else {
      if (response.data.status === 409) {
        toast.error(<FormattedMessage id={`toast.conflictSchedule`} />);
        return;
      }
      if (response.data.status === 500) {
        toast.error(<FormattedMessage id={`toast.InternalError`} />);
        return;
      }
      toast.error(<FormattedMessage id={`toast.errorBookSchedule`} />);
    }
  };

  handleChangeDatePicker = async ([date]) => {
    const { userInfo } = this.props;
    const dateData = new Date(date).getTime();
    let newObj = {};
    if (dateData) {
      newObj = { ...newObj, currentDate: date };
      const response = await getWeekDaysSchedule(
        userInfo.id,
        new Date(date).getTime()
      );

      if (Array.isArray(response.data)) {
        newObj = { ...newObj, selectedTime: response.data };
      }
    }

    if (Object.keys(newObj.length > 0))
      this.setState((prevState) => ({
        ...prevState,
        ...newObj,
      }));
  };

  handlerKeyDown = async (event) => {
    const keyCode = event.which || event.keyCode;
    if (keyCode === constant.KeyCodeUtils.ENTER) {
      event.preventDefault();
      await this.handleSave();
    }
  };

  handleSelectTime = (itemData) => {
    this.setState((prevState) => {
      const { selectedTime } = prevState;
      const updatedSelected = selectedTime.find((item) => {
        return (
          item.timeType === itemData.keyMap || item.keyMap === itemData.keyMap
        );
      })
        ? selectedTime.filter(
            (selectedId) =>
              selectedId.timeType !== itemData.keyMap &&
              selectedId.keyMap !== itemData.keyMap
          )
        : [...selectedTime, itemData];
      return {
        ...prevState,
        selectedTime: updatedSelected,
      };
    });
  };

  async componentDidMount() {
    await Promise.all([
      this.props.readAllDoctors(),
      this.props.readAllScheduleHours(),
    ]);

    const { userInfo } = this.props;
    const startOfDayTimestamp = moment().startOf('day').valueOf();
    const response = await getWeekDaysSchedule(
      userInfo.id,
      startOfDayTimestamp
    );

    const newState = {
      currentDate: startOfDayTimestamp,
      ...(response.data?.length > 0 && { selectedTime: response.data }),
    };

    this.setState((prevState) => ({ ...prevState, ...newState }));
  }

  async componentDidUpdate(prevProps) {
    const updatedState = {};

    if (prevProps.doctors !== this.props.doctors) {
      updatedState.doctors = this.props.doctors;
    }

    if (prevProps.timeSchedule !== this.props.timeSchedule) {
      updatedState.timeSchedule = this.props.timeSchedule;
    }

    if (Object.keys(updatedState).length > 0) {
      this.setState((prevState) => ({ ...prevState, ...updatedState }));
    }
  }

  render() {
    const {
      selectedDoctor,
      isLoading,
      doctors,
      timeSchedule,
      selectedTime,
      currentDate,
    } = this.state;
    const { lang, userInfo } = this.props;

    const listDoctors =
      doctors.length > 0 &&
      doctors.map &&
      doctors.map((doctor) => {
        const value = doctor.id;
        const labelVi = `${doctor.positionData?.valueVi} ${doctor.lastName} ${doctor.firstName}`;
        const labelEn = `${doctor.positionData?.valueEn} ${doctor.firstName} ${doctor.lastName}`;

        return {
          value,
          label: lang === constant.LANGUAGES.VI ? labelVi : labelEn,
          labelVi,
          labelEn,
        };
      });

    return (
      <>
        <NavigatorPage onlyShowGoBack={true} />
        <div className="manage-schedule-container row">
          <div className="col-12">
            <div className="manage-schedule-title">
              <FormattedMessage id={'manage-schedule.title'} />
            </div>
            <div className="row">
              {userInfo.roleId === constant.USER_ROLE.ADMIN ? (
                <>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id={'title.doctor.SelectDoctor'} />
                    </label>

                    <Select
                      value={selectedDoctor}
                      onChange={this.handleChange}
                      options={listDoctors}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id={'title.doctor.SelectDate'} />
                    </label>
                    <DatePicker
                      onChange={this.handleChangeDatePicker}
                      value={currentDate}
                      className="form-control"
                      minDate={new Date().setDate(new Date().getDate() - 1)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-3 form-group">
                    <label>
                      <FormattedMessage id={'title.doctor.SelectDate'} />
                    </label>
                    <DatePicker
                      onChange={this.handleChangeDatePicker}
                      value={currentDate}
                      className="form-control"
                      minDate={new Date().setDate(new Date().getDate() - 1)}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="row mt-2">
              <label>
                <FormattedMessage id={'title.doctor.SelectTimeSchedule'} />
              </label>
              {timeSchedule.length > 0 &&
                timeSchedule.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="col-12 col-sm-6 col-lg-3 mb-3"
                    >
                      <button
                        className={
                          selectedTime.some(
                            (time) =>
                              time.timeType === item.keyMap ||
                              time.keyMap === item.keyMap
                          )
                            ? `btn-schedule active w-100`
                            : `btn-schedule w-100`
                        }
                        onClick={() => this.handleSelectTime(item)}
                      >
                        {lang === constant.LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </button>
                    </div>
                  );
                })}
            </div>
            <div className="row">
              <div className="col-12">
                <button
                  className="btn btn-primary"
                  disabled={isLoading}
                  onClick={this.handleSave}
                >
                  <FormattedMessage id={'button.save'} />
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);