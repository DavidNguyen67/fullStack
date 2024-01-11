import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../store/actions';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import './doctorExtraInfoContainer.scss';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';
class ExtraInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      addressClinic: '',
      nameClinic: '',
      priceInfo: '',
      provinceInfo: '',
    };
  }

  render() {
    const { isShow } = this.state;
    const { info, lang } = this.props;

    return (
      <div className="doctor-extra-info-container h-100">
        <div className="content-up pb-4">
          <h3 className="text-uppercase">
            <FormattedMessage id={`clinic.address`} />
          </h3>
          <h6>
            <strong>{info?.nameClinic || ''}</strong>
          </h6>
          <h6>
            <strong>
              {`${info?.addressClinic} ${
                lang === LANGUAGES.EN
                  ? `${info?.provinceInfo?.valueEn}`
                  : `${info?.provinceInfo?.valueVi}`
              }` || ''}
            </strong>
          </h6>
        </div>
        <div className="content-down">
          {isShow ? (
            <>
              <div className="content-down-title text-uppercase">
                <h5>
                  <FormattedMessage id={`clinic.cost`} />
                </h5>
              </div>
              <div className="detail-info">
                <div className="left col-12 py-2">
                  <div className="row">
                    <div className="col-10">
                      <div className="mx-2">
                        <div>
                          <FormattedMessage id={`clinic.cost`} />
                        </div>
                        <p style={{ font: 'menu' }} className="m-0">
                          <FormattedMessage id={`clinic.costInfo`} />
                        </p>
                      </div>
                    </div>
                    <div className="col-2 d-flex">
                      <span className="m-auto">
                        {lang === LANGUAGES.EN ? (
                          <NumberFormat
                            value={info?.priceInfo?.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                          />
                        ) : (
                          <NumberFormat
                            value={info?.priceInfo?.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <p className="text-justify m-0 mt-2 mx-2 item">
                        <FormattedMessage id={`clinic.PaymentMethod`} />:{' '}
                        {lang === LANGUAGES.EN
                          ? `${info?.paymentInfo?.valueEn}`
                          : `${info?.paymentInfo?.valueVi}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="short-info">
                <span
                  className="toggle"
                  onClick={() =>
                    this.setState((prevState) => ({
                      ...prevState,
                      isShow: !prevState.isShow,
                    }))
                  }
                >
                  <FormattedMessage id={`clinic.hide`} />
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="short-info">
                <FormattedMessage id={`clinic.cost`} />:
                {lang === LANGUAGES.EN ? (
                  <NumberFormat
                    value={info?.priceInfo?.valueEn}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                  />
                ) : (
                  <NumberFormat
                    value={info?.priceInfo?.valueVi}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={'VND'}
                  />
                )}
                <span
                  className="toggle"
                  onClick={() =>
                    this.setState((prevState) => ({
                      ...prevState,
                      isShow: !prevState.isShow,
                    }))
                  }
                >
                  {' '}
                  <FormattedMessage id={`clinic.more`} />
                </span>
              </div>
            </>
          )}
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
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readAllDoctors: () => dispatch(actions.readAllDoctors()),
    readAllScheduleHours: () => dispatch(actions.readAllScheduleHours()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ExtraInfo));
