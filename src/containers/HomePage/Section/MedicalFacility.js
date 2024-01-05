import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';

class MedicalFacility extends Component {
  render() {
    return (
      <div className="section-share section-medial-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Co so y te noi bat</span>
            <button className="btn-section">
              <FormattedMessage id={`homePage.moreInfo`} />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
                <div className="bg-image section-medial-facility"></div>
                <h3>He thong thu cuc 1</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medial-facility"></div>
                <h3>He thong thu cuc 2</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medial-facility"></div>
                <h3>He thong thu cuc 3</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medial-facility"></div>
                <h3>He thong thu cuc 4</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medial-facility"></div>
                <h3>He thong thu cuc 5</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medial-facility"></div>
                <h3>He thong thu cuc 6</h3>
              </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
