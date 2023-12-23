import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss';
import Slider from 'react-slick';

// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import img from './../../../assets/images/113340-chup-petct.jpg';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'red' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'green' }}
      onClick={onClick}
    />
  );
}

class Specialty extends Component {
  changeLanguage = (lan) => {
    this.props.changeLanguageAppRedux(lan);
  };

  render() {
    const settings = {
      dots: false,
      infinite: true,
      arrows: true,
      lazyLoad: true,
      className: 'react-slick-container',
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    return (
      <div className="section-specialty">
        <div className="specialty-container">
          <div className="specialty-header">
            <span className="title-section">Chuyen khoa pho bien</span>
            <button className="btn-section">Xem them</button>
          </div>
          <div className="specialty-body">
            <Slider {...settings}>
              <div className="specialty-customize">
                <div className="bg-image"></div>
                <h3>Co xuong khop 1</h3>
              </div>
              <div className="specialty-customize">
                <div className="bg-image"></div>
                <h3>Co xuong khop 2</h3>
              </div>
              <div className="specialty-customize">
                <div className="bg-image"></div>
                <h3>Co xuong khop 3</h3>
              </div>
              <div className="specialty-customize">
                <div className="bg-image"></div>
                <h3>Co xuong khop 4</h3>
              </div>
              <div className="specialty-customize">
                <div className="bg-image"></div>
                <h3>Co xuong khop 5</h3>
              </div>
              <div className="specialty-customize">
                <div className="bg-image"></div>
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
