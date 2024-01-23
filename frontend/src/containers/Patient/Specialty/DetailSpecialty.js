import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import {
  getSpecialtyDetail,
  getSpecialtyDetailFilterByProvince,
} from '../../../services';
import DoctorSchedule from '../../System/Doctor/DoctorSchedule';
import ExtraInfo from '../Doctor/ExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { LANGUAGES } from '../../../utils';
import Select from 'react-select';
import * as actions from './../../../store/actions';
import { FormattedMessage } from 'react-intl';
class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
      doctors: [],
      contentHTML: {},
      description: {},

      isShow: false,
      provinces: [],

      selectedProvince: {},
    };
  }
  async componentDidMount() {
    const { id } = this.props?.match?.params;
    const { specialties } = this.state;
    this.props.fetchProvinceStart();
    if (specialties.length < 1) {
      await this.fetchSpecialtyDetails(id);
      return;
    }
  }

  async fetchSpecialtyDetails(id) {
    if (id) {
      const response = await getSpecialtyDetail(id);
      if (response) {
        if (response.statusCode === 200) {
          const data = response.data;
          const doctors =
            data.doctorSpecialty?.length > 0 &&
            data.doctorSpecialty.map((item) => ({
              ...item.doctorInfo,
              priceInfo: item.priceInfo,
            }));
          this.setState((prevState) => ({
            ...prevState,
            doctors,
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

  componentDidUpdate(preProps, prevState) {
    if (preProps.provinces !== this.props.provinces) {
      this.setState((prevState) => ({
        ...prevState,
        provinces: this.props.provinces,
      }));
    }
  }
  handleChangeProvince = async (selectedProvince) => {
    if (selectedProvince.value) {
      const { id } = this.props?.match?.params;
      const response = await getSpecialtyDetailFilterByProvince(
        id,
        selectedProvince.value
      );
      if (response) {
        if (response.statusCode === 200) {
          const data = response.data;
          const doctors =
            data.doctorSpecialty?.length > 0 &&
            data.doctorSpecialty.map((item) => item.doctorInfo);

          this.setState((prevState) => ({
            ...prevState,
            doctors: doctors,
            selectedProvince,
            contentHTML: {
              vi: data.descriptionHTML_VI,
              en: data.descriptionHTML_EN,
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

      this.setState((prevState) => ({
        ...prevState,
        selectedProvince,
      }));
    } else {
      const { id } = this.props?.match?.params;
      await this.fetchSpecialtyDetails(id);
    }
  };

  render() {
    const { description, doctors, isShow, provinces, selectedProvince } =
      this.state;
    const { lang } = this.props;
    const listProvince =
      provinces.map &&
      provinces.map((item) => {
        return {
          value: item.keyMap,
          label: lang === LANGUAGES.EN ? item.valueEn : item.valueVi,
        };
      });
    listProvince.unshift({
      value: undefined,
      label: lang === LANGUAGES.EN ? 'All' : 'Toàn quốc',
    });

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
                <Select
                  options={listProvince}
                  value={selectedProvince}
                  onChange={this.handleChangeProvince}
                  placeholder={<FormattedMessage id={'clinic.choose'} />}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
