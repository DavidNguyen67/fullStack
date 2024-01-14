import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { getSpecialtyDetail } from '../../../services';

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
    };
  }
  async componentDidMount() {
    const { id } = this.props?.match?.params;
    const { specialties } = this.state;

    if (id)
      if (specialties.length < 1) {
        await this.fetchSpecialtyDetails(id);
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
    return (
      <>
        <HomeHeader />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
