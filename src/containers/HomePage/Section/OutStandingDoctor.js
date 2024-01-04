import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as actions from './../../../store/actions';
import * as constant from '../../../utils/';
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingRequest: false,
    };
  }

  async componentDidMount() {
    const { doctors } = this.props;
    if (doctors) {
      this.props.readDoctors(constant.MAX_NUMBER_OF_DOCTORS);
    }
  }

  render() {
    const { doctors } = this.props;

    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Bac si noi bat tuan qua</span>
            <button className="btn-section">Xem them</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {typeof doctors !== 'string' &&
                doctors.length > 0 &&
                doctors.map((doctor) => {
                  const base64 = btoa(
                    new Uint8Array(doctor.image?.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ''
                    )
                  );
                  const imageSrc = base64
                    ? `data:image/png;base64,${base64}`
                    : '';
                  return (
                    <div className="section-customize" key={doctor.id}>
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
                          <h3>{doctor.firstName}</h3>
                          <div>{doctor.email}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    doctors: state.admin.doctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readDoctors: (limit) => dispatch(actions.readDoctors(limit)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
