import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DetailClinic.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { getClinicDetail } from '../../../services';
import DoctorSchedule from '../../System/Doctor/DoctorSchedule';
import ExtraInfo from '../Doctor/ExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      contentHTML: {},
      description: {},

      isShow: false,
    };
  }
  async componentDidMount() {
    const { id } = this.props?.match?.params;
    const { doctors } = this.state;
    if (doctors.length < 1) {
      await this.fetchSpecialtyDetails(id);
      return;
    }
  }

  async fetchSpecialtyDetails(id) {
    if (id) {
      const response = await getClinicDetail(id);
      if (response) {
        if (response.statusCode === 200) {
          const data = response.data;
          const doctors =
            data.doctorClinic?.length > 0 &&
            data.doctorClinic.map((item) => ({
              ...item.doctorInfo,
              priceInfo: item.priceInfo,
            }));
          this.setState((prevState) => ({
            ...prevState,
            doctors,
            name: data.name,
            address: data.address,
            contentHTML: {
              vi: data.contentMarkdown_VI,
              en: data.contentMarkdown_EN,
            },
            description: {
              vi: data.descriptionHTML_VI,
              en: data.descriptionHTML_EN,
            },
            isLoading: false,
            isFailed: false,
          }));
          return;
        } else
          this.setState((prevState) => ({
            ...prevState,
            doctorIds: [],
            isFailed: true,
            isLoading: false,
          }));
        return;
      }
      // if (response.data && !response.data.message && !response.data.error) {
      //   this.setState((prevState) => ({
      //     ...prevState,
      //     doctor: response.data,
      //   }));
      // }
    }
  }

  toggleDesSpecialty = () => {
    this.setState((prevState) => ({
      ...prevState,
      isShow: !prevState.isShow,
    }));
  };

  componentDidUpdate(preProps, prevState) {}

  render() {
    const { description, doctors, isShow, name, address } = this.state;
    const { lang } = this.props;

    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="container">
          <br />
          <div className="row">
            <div
              className="each-doctor col-12 overflow-hidden position-relative"
              style={isShow ? {} : { height: '250px' }}
            >
              <h1>{name}</h1>
              <h3>{address}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    lang === LANGUAGES.VI ? description?.vi : description?.en,
                }}
              ></div>
              <button
                className="btn btn-primary position-absolute bottom-0 end-0"
                onClick={this.toggleDesSpecialty}
                // placeholder=''
              >
                Toggle description
              </button>
            </div>
          </div>
          <div className="my-2">
            <div className="row">
              <div className="col-12 col-lg-4">
                <label>
                  <FormattedMessage id="clinic.choose" />
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            {doctors.length > 0 ? (
              doctors.map((item) => {
                return (
                  <div className="col-12 each-doctor my-2 p-4" key={item.id}>
                    <div className="row">
                      <div className="col-12 col-lg-6 content-left">
                        <ProfileDoctor
                          isShowDesc={true}
                          isShowLink={true}
                          isShowMarkDown={true}
                          doctorData={item}
                          doctorId={item.id}
                        />
                      </div>
                      <div className="col-12 col-lg-6 content-right">
                        <DoctorSchedule doctorId={item.id} doctorData={item} />
                        <ExtraInfo doctorId={item.id} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 each-doctor my-2 p-4">
                Tam thoi khong co bac sy
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    lang: state.app.language,
    doctors: state.admin.doctors,
    provinces: state.admin.provinces,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProvinceStart: () => dispatch(actions.fetchProvinceStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
