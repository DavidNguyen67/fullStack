import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as actions from './../../../store/actions';
import * as constant from '../../../utils/';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { getTopDoctorService } from '../../../services/userService';
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topDoctors: [],
      isLoading: false,
      isFailed: false,
    };
  }

  async componentDidMount() {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
      topDoctors: [],
      isFailed: false,
    }));
    const response = await getTopDoctorService();
    if (response) {
      if (response.statusCode === 200) {
        this.setState((prevState) => ({
          ...prevState,
          topDoctors: response.data,
          isLoading: false,
          isFailed: false,
        }));
        return;
      } else
        this.setState((prevState) => ({
          ...prevState,
          topDoctors: [],
          isFailed: true,
          isLoading: false,
        }));
      return;
    }
  }

  // async componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { topDoctors } = this.props;
  //   if (topDoctors !== prevProps.topDoctors) {
  //     this.props.readTopDoctors(constant.MAX_NUMBER_OF_DOCTORS);
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       topDoctors,
  //     }));
  //   }
  // }

  handleViewDetailDoctor = (item) => {
    const { history } = this.props;
    if (history) history.push(`/doctor/detail/${item.id}`);
    // return <Redirect to={`/doctor/${item.id}`} push={true} />;
  };

  render() {
    const { lang } = this.props;
    const { topDoctors } = this.state;
    console.log(topDoctors);

    return (
      <div className="section-share section-outstanding-doctor">
        {typeof topDoctors !== 'string' &&
          topDoctors &&
          topDoctors.length > 0 && (
            <div className="section-container">
              <div className="section-header">
                <span className="title-section">
                  <FormattedMessage id={`homePage.moreInfo`} />
                </span>
                <button className="btn-section">
                  <FormattedMessage id={`homePage.moreInfo`} />
                </button>
              </div>
              <div className="section-body">
                <Slider {...this.props.settings}>
                  {typeof topDoctors !== 'string' &&
                    topDoctors &&
                    topDoctors.length > 0 &&
                    topDoctors.map((doctor) => {
                      const nameVi = `${doctor.lastName} ${doctor.firstName}`;
                      const nameEn = `${doctor.firstName} ${doctor.lastName}`;

                      const base64 = btoa(
                        new Uint8Array(doctor.image?.data)?.reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          ''
                        )
                      );
                      const imageSrc = base64
                        ? `data:image/png;base64,${base64}`
                        : '';

                      return (
                        <div
                          className="section-customize"
                          key={doctor.id}
                          onClick={() => this.handleViewDetailDoctor(doctor)}
                        >
                          <div className="customize-border">
                            <div className="outer-bg">
                              <div
                                className="bg-image section-outstanding-doctor"
                                style={{
                                  background: `url(${imageSrc}) no-repeat center top / cover`,
                                }}
                              ></div>
                            </div>
                            <div className="position text-center">
                              <h3>
                                {lang === constant.LANGUAGES.VI
                                  ? `${doctor.positionData?.valueVi}`
                                  : `${doctor.positionData?.valueEn}`}
                              </h3>
                              <h4>
                                {lang === constant.LANGUAGES.VI
                                  ? nameVi
                                  : nameEn}
                              </h4>
                              <div>{doctor.email}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </Slider>
              </div>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    topDoctors: state.admin.topDoctors,
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readTopDoctors: (limit) => dispatch(actions.readTopDoctors(limit)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
