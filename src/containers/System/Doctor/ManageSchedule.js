import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import * as actions from './../../../store/actions';
import Select from 'react-select';
import * as constant from './../../../utils';
import DatePicker from './../../../components/Input/DatePicker';
class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDoctor: null,
      isLoading: false,
      currentDate: null,
      timeSchedule: [],
      doctors: [],
    };
  }

  handleChange = async (selectedDoctor) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedDoctor,
    }));
  };

  handleSave = async () => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log('====================================');
    console.log(this.state);
    console.log('====================================');
    this.setState((prevState) => ({
      ...prevState,
      isLoading: false,
      selectedTime: null,
    }));
  };

  handleChangeDatePicker = ([date]) => {
    this.setState((prevState) => ({
      ...prevState,
      currentDate: date,
    }));
  };

  handlerKeyDown = async (event) => {
    const keyCode = event.which || event.keyCode;
    if (keyCode === constant.KeyCodeUtils.ENTER) {
      event.preventDefault();
      await this.handleSave();
    }
  };

  handleSelectTime = (id) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedTime: id,
    }));
  };

  async componentDidMount() {
    await this.props.readAllDoctors();
    await this.props.readAllScheduleHours();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    let updatedState = {};

    if (prevProps.doctors !== this.props.doctors) {
      updatedState = {
        ...updatedState,
        doctors: this.props.doctors,
      };
    }

    if (prevProps.timeSchedule !== this.props.timeSchedule) {
      updatedState = {
        ...updatedState,
        timeSchedule: this.props.timeSchedule,
      };
    }

    if (Object.keys(updatedState).length > 0) {
      this.setState(
        (prevState) => ({
          ...prevState,
          ...updatedState,
        }),
        () => (updatedState = {})
      );
    }
  }

  render() {
    const { selectedDoctor, isLoading, doctors, timeSchedule, selectedTime } =
      this.state;
    const { lang } = this.props;
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
      <div className="manage-schedule-container">
        <div className="manage-schedule-title">
          <FormattedMessage id={'manage-schedule.title'} />
        </div>
        <div className="container">
          <div className="row">
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
                className="form-control"
                minDate={new Date()}
              />
            </div>
            <div className="col-12 pick-hour-container my-4 d-flex flex-wrap row">
              {timeSchedule.length > 0 &&
                timeSchedule.map((item) => {
                  return (
                    <div key={item.id} className="col-3 mb-3">
                      <button
                        className={
                          selectedTime === item.id
                            ? `btn-schedule active w-100`
                            : `btn-schedule w-100`
                        }
                        onClick={() => this.handleSelectTime(item.id)}
                      >
                        {lang === constant.LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </button>
                    </div>
                  );
                })}
            </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readAllDoctors: () => dispatch(actions.readAllDoctors()),
    readAllScheduleHours: () => dispatch(actions.readAllScheduleHours()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
