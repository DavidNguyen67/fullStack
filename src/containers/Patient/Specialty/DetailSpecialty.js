import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { getSpecialtyDetail } from '../../../services';
import DoctorSchedule from '../../System/Doctor/DoctorSchedule';
import ExtraInfo from '../Doctor/ExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
      doctorIds: [20, 22],
    };
  }
  async componentDidMount() {
    const { id } = this.props?.match?.params;
    const { specialties } = this.state;

    if (specialties.length < 1) {
      await this.fetchSpecialtyDetails(id);
      return;
    }
  }

  async fetchSpecialtyDetails(id) {
    if (id) {
      const response = await getSpecialtyDetail(id);
      if (response.data && !response.data.message && !response.data.error) {
        this.setState((prevState) => ({
          ...prevState,
          doctor: response.data,
        }));
      }
    }
  }

  render() {
    const { doctorIds } = this.state;
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="container">
          <div className="description-specialty"></div>
          {doctorIds.length > 0 &&
            doctorIds.map((item) => {
              return (
                <div className="each-doctor-container" key={item}>
                  <div className="row my-3 py-2">
                    <div className="col-12 row each-doctor p-4">
                      <div className="col-6 content-left">
                        <ProfileDoctor doctorId={item} />
                      </div>
                      <div className="col-6 content-right">
                        <DoctorSchedule doctorId={item} />
                        <ExtraInfo doctorId={item} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
