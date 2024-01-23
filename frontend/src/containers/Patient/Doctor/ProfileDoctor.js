import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../store/actions';
import * as services from './../../../services';
import * as constant from './../../../utils';
import './ProfileDoctor.scss';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: {},
    };
  }

  async componentDidMount() {
    const { id, doctorId, doctorData } = this.props;
    if (id) {
      await this.fetchDoctorProfile(id);
      return;
    }

    if (doctorId) {
      const response = await services.getDoctorDetail(doctorId);
      if (response) {
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
            isFailed: true,
            isLoading: false,
          }));
        return;
      }
    }

    if (doctorData) {
      this.setState((prevState) => ({
        ...prevState,
        doctor: doctorData,
        isLoading: false,
        isFailed: false,
      }));
    }
  }

  async componentDidUpdate(prevProps) {
    // if (prevProps.id !== this.props.id) {
    //   const { id } = this.props;
    //   if (id) await this.fetchDoctorProfile(id);
    // }
  }

  async fetchDoctorProfile(id) {
    const response = await services.readProfileDoctor(id);
    if (response.statusCode === 200) {
      this.setState({
        doctor: response.data,
      });
    }
  }

  renderTime = (dataTime) => {
    const { lang } = this.props;

    if (dataTime && !_.isEmpty(dataTime)) {
      function Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      const date =
        lang === constant.LANGUAGES.VI
          ? Capitalize(
              moment.unix(new Date(dataTime.date)).format('dddd - DD/MM/YYYY')
            )
          : moment
              .unix(new Date(dataTime.date))
              .locale('en')
              .format('ddd - MM/DD/YYYY');
      const time =
        lang === constant.LANGUAGES.VI
          ? `${dataTime.time.valueVi}`
          : `${dataTime.time.valueEn}`;
      return (
        <>
          <div>{`${time} - ${date}`}</div>
          <div>
            <FormattedMessage id={'profileDoctor.free'} />
          </div>
        </>
      );
    }
    return <></>;
  };
  forwardToDetailDoctor = () => {
    const { doctor } = this.state;
    const { history } = this.props;
    history && history.push(`/doctor/detail/${doctor.id}`);
  };

  render() {
    const { doctor } = this.state;
    const { lang, isShowDesc, dataTime, isShowMarkDown, isShowLink } =
      this.props;

    const nameVi = `${doctor.lastName} ${doctor.firstName}`;
    const nameEn = `${doctor.firstName} ${doctor.lastName}`;
    const base64 = btoa(
      new Uint8Array(doctor.image?.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    const imageSrc = base64 ? `data:image/png;base64,${base64}` : '';
    return (
      <>
        <div className="profile-doctor-container">
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
              {isShowDesc ? (
                <div className="down">
                  {lang === constant.LANGUAGES.VI
                    ? doctor.markDown?.description_VI
                    : doctor.markDown?.description_EN}
                </div>
              ) : (
                <div className="down">{this.renderTime(dataTime)}</div>
              )}
              <div className="price">
                {<FormattedMessage id="clinic.cost" />}:{' '}
                {lang === constant.LANGUAGES.EN ? (
                  <NumberFormat
                    value={doctor.doctorInfo?.priceInfo?.valueEn}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                  />
                ) : (
                  <NumberFormat
                    value={doctor.doctorInfo?.priceInfo?.valueVi}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={'VND'}
                  />
                )}
              </div>
            </div>
          </div>
          {isShowMarkDown && (
            <>
              <br />
              <div style={{ maxHeight: '50%' }}>
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        lang === constant.LANGUAGES.VI
                          ? doctor.markDown?.contentHTML_VI
                          : doctor.markDown?.contentHTML_EN,
                    }}
                  ></div>
                </div>
                <div>
                  {lang === constant.LANGUAGES.VI
                    ? doctor.markDown?.description_VI
                    : doctor.markDown?.description_EN}
                </div>
              </div>
            </>
          )}
          <br />
          {isShowLink && (
            <>
              <div>
                <button
                  className="btn btn-primary mb-3"
                  onClick={this.forwardToDetailDoctor}
                >
                  Xem them
                </button>
                {/* <Link to={`/doctor/detail/${doctor.id}`}>Xem them</Link> */}
              </div>
            </>
          )}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProfileDoctor));
