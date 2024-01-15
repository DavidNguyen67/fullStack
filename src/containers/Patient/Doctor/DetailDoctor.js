import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../store/actions';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDoctorDetail } from '../../../services/userService';
import * as constant from './../../../utils';
import DoctorSchedule from '../../System/Doctor/DoctorSchedule';
import ExtraInfo from './ExtraInfo';

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: {},
    };
  }

  async componentDidMount() {
    const { doctors: doctor } = this.props;
    const { id } = this.props.match?.params;

    if (id)
      if (doctor.length < 1) {
        await this.fetchDoctorDetails(id);
      }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { id: newId } = this.props.match?.params;
    const { id: prevId } = prevProps.match?.params;

    if (newId !== prevId) {
      await this.fetchDoctorDetails(newId);
    }
  }

  async fetchDoctorDetails(id) {
    if (id) {
      const response = await getDoctorDetail(id);
      if (response.data && !response.data.message && !response.data.error) {
        this.setState((prevState) => ({
          ...prevState,
          doctor: response.data,
        }));
      }
    }
  }

  render() {
    const { doctor } = this.state;
    const { lang } = this.props;

    // if (Object.keys(doctor).length < 1) {
    //   return <>No data</>;
    // }

    const nameVi = `${doctor.lastName} ${doctor.firstName}`;
    const nameEn = `${doctor.firstName} ${doctor.lastName}`;

    const base64 =
      doctor.image?.data?.length > 0 &&
      btoa(
        new Uint8Array(doctor.image?.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
    const imageSrc = base64 ? `data:image/png;base64,${base64}` : '';
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left col-4"
              style={{
                background: `url(${imageSrc}) no-repeat top center / cover`,
              }}
            ></div>
            <div className="content-right col-8">
              <div className="up">
                {lang === constant.LANGUAGES.VI
                  ? `${doctor.positionData?.valueVi}, ${nameVi}`
                  : `${doctor.positionData?.valueEn} ${nameEn}`}
              </div>
              <div className="down">
                {/* <div>
                  {lang === constant.LANGUAGES.VI
                    ? doctor.markDown?.contentMarkdown_VI
                    : doctor.markDown?.contentMarkdown_EN}
                </div> */}
                <div>
                  {lang === constant.LANGUAGES.VI
                    ? doctor.markDown?.description_VI
                    : doctor.markDown?.description_EN}
                </div>
              </div>
            </div>
          </div>
          <div className="schedule-doctor row">
            <div
              className="content-left col-12 col-lg-6"
              style={{ borderRight: '1px solid black' }}
            >
              <DoctorSchedule
                doctorData={{
                  nameVi,
                  nameEn,
                  priceInfo: doctor?.doctorInfo?.priceInfo,
                }}
              />
            </div>
            <div className="content-right col-12 col-lg-6">
              <ExtraInfo info={doctor.doctorInfo} />
            </div>
          </div>
          <div className="detail-info-doctor">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  lang === constant.LANGUAGES.VI
                    ? doctor.markDown?.contentHTML_VI
                    : doctor.markDown?.contentHTML_EN,
              }}
            ></div>
          </div>
          <div className="comment-doctor"></div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readDoctor: (id) => dispatch(actions.readDoctor(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
