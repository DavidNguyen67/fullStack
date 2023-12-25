import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';

class Specialty extends Component {
  changeLanguage = (lan) => {
    this.props.changeLanguageAppRedux(lan);
  };

  render() {
    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Chuyen khoa pho bien</span>
            <button className="btn-section">Xem them</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <h3>Co xuong khop 1</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <h3>Co xuong khop 2</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <h3>Co xuong khop 3</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <h3>Co xuong khop 4</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <h3>Co xuong khop 5</h3>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty"></div>
                <h3>Co xuong khop 6</h3>
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
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
