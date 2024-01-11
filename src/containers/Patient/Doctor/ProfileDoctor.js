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

class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: {},
    };
  }

  async componentDidMount() {
    const { id } = this.props;
    if (id) await this.fetchDoctorProfile(id);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      const { id } = this.props;
      console.log(id);
      if (id) await this.fetchDoctorProfile(id);
    }
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

  render() {
    const { doctor } = this.state;
    const { lang, isShowDesc, dataTime } = this.props;

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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
