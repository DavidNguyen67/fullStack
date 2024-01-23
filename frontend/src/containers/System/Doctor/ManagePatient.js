import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../store/actions';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getPatientByDayAndDoctorId } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import { Modal } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import ModalConfirmPatient from './ModalConfirmPatient';

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      appointments: [],
      isLoading: false,
      isFailed: false,

      isShow: false,
      payloadModal: {},
    };
  }

  async componentDidMount() {
    const { userInfo } = this.props;
    const todayUnixTimeStamp = moment().startOf('day').valueOf();
    try {
      const response = await getPatientByDayAndDoctorId(
        userInfo.id,
        todayUnixTimeStamp,
        userInfo.access_token
      );

      this.handleResponse(response);
    } catch (error) {
      console.error('Error in componentDidMount:', error);
    }
  }

  handleChangeDatePicker = async ([date]) => {
    const { userInfo } = this.props;
    const timeStamp = new Date(date).getTime();

    try {
      const response = await getPatientByDayAndDoctorId(
        userInfo.id,
        timeStamp,
        userInfo.access_token
      );

      this.handleResponse(response, date);
    } catch (error) {
      console.error('Error in handleChangeDatePicker:', error);
    }
  };

  handleResponse(response, date) {
    if (response && response.statusCode === 200) {
      this.setState((prevState) => ({
        ...prevState,
        currentDate: date || prevState.currentDate,
        appointments: response.data,
        isLoading: false,
        isFailed: false,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        currentDate: date || prevState.currentDate,
        appointments: [],
        isFailed: true,
        isLoading: false,
      }));
    }
  }

  handleOpenModalConfirm = (item) => {
    const payloadModal = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      patientEmail: item.patientInfo?.email,
      patientName: item.patientInfo?.firstName,
      timeType: item.timeType,
    };
    this.setState((prevState) => ({
      ...prevState,
      payloadModal,
    }));
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isShow: !prevState.isShow,
    }));
  };

  render() {
    const { currentDate, appointments, isShow, payloadModal } = this.state;
    const { lang } = this.props;

    return (
      <>
        <ModalConfirmPatient
          toggleModal={this.toggleModal}
          isShow={isShow}
          payloadModal={payloadModal}
        />
        <div className="manage-patient-container">
          <h3 className="m-p-title text-center">Quan ly benh nhan</h3>
          <div className="manage-patient-body row">
            <div className="col-6 form-group">
              <label>Chon ngay</label>
              <DatePicker
                onChange={this.handleChangeDatePicker}
                className="form-control"
                value={currentDate}
              />
            </div>
          </div>
          <div className="manage-patient-body row">
            <div className="col-12 form-group">
              <div className="table-container">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Thời gian</th>
                      <th scope="col">Ngay</th>
                      <th scope="col">Họ và tên</th>
                      <th scope="col">Địa chỉ</th>
                      <th scope="col">Giới tính</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length > 0 ? (
                      appointments.map((item, index) => {
                        const patient = item.patientInfo;

                        return (
                          <tr key={item.id}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              {lang === LANGUAGES.EN
                                ? item?.time?.valueEn
                                : item?.time?.valueVi}
                            </td>
                            <td>
                              {lang === LANGUAGES.EN
                                ? moment(item?.DateAppointment)
                                    .locale('en')
                                    .format('DD MMM YYYY')
                                : moment(item?.DateAppointment).format(
                                    'DD/MM/YYYY'
                                  )}
                            </td>
                            <td>
                              {lang === LANGUAGES.EN
                                ? `${patient.firstName} ${patient.lastName}`
                                : `${patient.lastName} ${patient.firstName}`}
                            </td>
                            <td>{patient.address}</td>
                            <td>
                              {lang === LANGUAGES.EN
                                ? patient?.genderData?.valueEn
                                : patient?.genderData?.valueVi}
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  this.handleOpenModalConfirm(item)
                                }
                                className="btn btn-primary"
                              >
                                Confirm
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6}>None</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
    lang: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startLoading: () => dispatch(actions.startLoading()),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
