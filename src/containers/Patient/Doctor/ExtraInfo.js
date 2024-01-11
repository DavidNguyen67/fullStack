import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../store/actions';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import './doctorExtraInfoContainer.scss';

class ExtraInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
    };
  }

  render() {
    const { isShow } = this.state;
    return (
      <div className="doctor-extra-info-container h-100">
        <div className="content-up pb-4">
          <h3 className="text-uppercase">ĐỊA CHỈ KHÁM</h3>
          <h6>
            <strong>Phòng khám Chuyên khoa Da Liễu </strong>
          </h6>
          <h6>
            <strong>207 Phố Huế - Hai Bà Trưng</strong>
          </h6>
        </div>
        <div className="content-down">
          {isShow ? (
            <>
              <div className="content-down-title text-uppercase">Gia kham</div>
              <div className="detail-info">
                <div className="left col-12 pe-4">
                  <div className="row">
                    <div className="col-10">
                      <div>Giá khám</div>
                      <p style={{ font: 'menu' }} className="m-0">
                        Giá khám đã bao gồm phí đặt lịch hẹn trước (Giá niêm yết
                        của phòng khám)
                      </p>
                      <p style={{ font: 'menu' }}>
                        Giá khám cho người nước ngoài 30 USD
                      </p>
                    </div>
                    <div className="col-2 d-flex">
                      <span className="ms-auto my-auto">250</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-10">
                      <div>Giá tái khám</div>
                      <p style={{ font: 'menu' }}>Theo chỉ định của bác sĩ</p>
                    </div>
                    <div className="col-2 d-flex">
                      <span className="ms-auto my-auto">250</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <p className="text-justify">
                        Người bệnh có thể thanh toán chi phí bằng hình thức tiền
                        mặt và quẹt thẻ
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <span
                onClick={() =>
                  this.setState((prevState) => ({
                    ...prevState,
                    isShow: !prevState.isShow,
                  }))
                }
              >
                An bot
              </span>
            </>
          ) : (
            <>
              GIÁ KHÁM: 300.000đ - 400.000đ
              <span
                onClick={() =>
                  this.setState((prevState) => ({
                    ...prevState,
                    isShow: !prevState.isShow,
                  }))
                }
              >
                Xem chi tiet
              </span>
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
