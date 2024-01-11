import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../../store/actions';
import * as services from './../../../../services';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import { FormattedMessage } from 'react-intl';

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,

      date: null,
      timeType: null,
      doctorId: null,
    };

    this.timer = null;

    this.windowResized = this.windowResized.bind(this);

    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.windowResized);
    this.updateWindowWidth();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataTime !== this.props.dataTime) {
      const { date, timeType, doctorId } = this.props.dataTime;
      this.setState((prevState) => ({
        ...prevState,
        date,
        timeType,
        doctorId,
      }));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResized);
    this.setState((prevState) => ({
      ...prevState,
      date: null,
      timeType: null,
      doctorId: null,
    }));
  }

  updateWindowWidth() {
    let _this = this;
    setTimeout(function () {
      _this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }

  windowResized() {
    let _this = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function () {
      _this.updateWindowWidth();
    }, 500);
  }

  bookConfirm = () => {
    const { date, timeType, doctorId } = this.state;
  };

  handleChange = {
    price: (selectedPrice) => {
      this.setState((prevState) => ({
        ...prevState,
        selectedPrice: selectedPrice,
      }));
    },
    payment: (selectedPayment) => {
      this.setState((prevState) => ({
        ...prevState,
        selectedPayment: selectedPayment,
      }));
    },
    province: (selectedProvince) => {
      this.setState((prevState) => ({
        ...prevState,
        selectedProvince: selectedProvince,
      }));
    },
    nameClinic: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        nameClinic: event.target.value,
      }));
    },
    addressClinic: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        addressClinic: event.target.value,
      }));
    },
    note: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        note: event.target.value,
      }));
    },
  };

  render() {
    const { width, doctorId } = this.state;
    const { isShow, toggleModal, dataTime } = this.props;

    return (
      <>
        <Modal
          isOpen={isShow}
          toggle={toggleModal}
          // {...props}
          className="modal-booking-container"
          centered={width < 576}
          size="lg"
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <div className="row">
                <div className="col-10">
                  <span>Thong tin dat lich</span>
                </div>
                <div className="col-2">
                  <span
                    className="float-end p-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleModal()}
                  >
                    <i className="fas fa-times" />
                  </span>
                </div>
              </div>
            </div>
            <div className="booking-modal-body">
              <div className="row">
                <div className="col-12">
                  <ProfileDoctor
                    id={doctorId}
                    isShowDesc={false}
                    dataTime={dataTime}
                  />
                  <hr />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.name" />
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.phoneNumber" />
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.email" />
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.address" />
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.reason" />
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.who" />
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id="manage-user.gender" />
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
                <div className="col-12">
                  <hr />
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <div className="row">
                <div className="col-6 col-sm-3 ms-auto">
                  <button
                    className="btn btn-success w-100"
                    onClick={this.bookConfirm}
                  >
                    <FormattedMessage id="button.book" />
                  </button>
                </div>
                <div className="col-6 col-sm-3">
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => toggleModal()}
                  >
                    <FormattedMessage id="button.cancel" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
