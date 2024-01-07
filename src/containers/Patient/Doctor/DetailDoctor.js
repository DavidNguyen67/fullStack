import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../store/actions';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDoctorDetail } from '../../../services/userService';
import * as constant from './../../../utils';

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
        const response = await getDoctorDetail(id);
        if (response.data)
          if (!response.data.message && !response.data.error) {
            this.setState((prevState) => ({
              ...prevState,
              doctor: response.data,
            }));
          }
      }
  }

  async componentDidUpdate(prevProps, prevState) {}

  render() {
    const { doctor } = this.state;
    const { lang } = this.props;
    if (Object.keys(doctor).length < 1) {
      return <>No data</>;
    }

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
                {lang === constant.LANGUAGES.VI
                  ? doctor.markDown?.description_VI
                  : doctor.markDown?.description_EN}
              </div>
            </div>
          </div>
          <div className="schedule-doctor"></div>
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
