import React from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  Image,
  Dot,
  DotGroup,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import slide1 from './../../assets/img/slide1.png';
import slide2 from './../../assets/img/slide2.png';
import slide3 from './../../assets/img/slide3.png';
import slide4 from './../../assets/img/slide4.png';

import './../../style/slide.scss';

const slides = [slide1, slide2, slide3, slide4];

export default class SlideComponent extends React.Component {
  componentDidMount() {
    const slider = document.getElementById('mySlider');

    if (slider) {
      slider.focus();
    }
  }
  render() {
    return (
      <>
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={50}
          totalSlides={slides.length}
          infinite={true}
          isPlaying={true}
          interval={4000}
          touchEnabled={false}
          dragEnabled={false}
          lockOnWindowScroll
          tag="div"
          // style={{ outline: 'none' }}
          className="col-12 col-lg-9 m-auto position-relative "
        >
          <Slider id="mySlider" style={{ outline: 'none' }}>
            {slides.length > 0 &&
              slides.map((slide, index) => (
                <Slide index={index} key={slide} className="my-3">
                  <Image
                    src={slide}
                    hasMasterSpinner={false}
                    className="slide-img"
                  />
                </Slide>
              ))}
          </Slider>
          {/* <ButtonBack className="button-Slide position-absolute top-50 translate-middle start-0">
            <ArrowBackIosNewIcon />
          </ButtonBack>
          <ButtonNext className="button-Slide position-absolute top-50 translate-middle end-0">
            <ArrowForwardIosIcon />
          </ButtonNext> */}
          <DotGroup
            showAsSelectedForCurrentSlideOnly={true}
            className="d-flex justify-content-center my-2 DotGroup"
          ></DotGroup>
        </CarouselProvider>
      </>
    );
  }
}
