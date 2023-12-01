import React, { ComponentLifecycle } from 'react';
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
import slide1 from './../../assets/img/child1.jpg';
import slide2 from './../../assets/img/child2.jpg';
import slide3 from './../../assets/img/child3.jpg';
import slide4 from './../../assets/img/child4.jpg';
import slide5 from './../../assets/img/child5.jpg';
import slide6 from './../../assets/img/child6.jpg';
import slide7 from './../../assets/img/child7.jpg';
import slide8 from './../../assets/img/child8.jpg';
import slide9 from './../../assets/img/child9.jpg';

import './../../style/slide.scss';
import { Button, Card, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

const slides = [
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
  slide7,
  slide8,
  slide9,
];
interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S> {}

export default class SlideChild extends React.Component<
  {},
  { width: number; height: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  // componentDidMount() {
  //   const slider = document.getElementById('mySlider');

  //   if (slider) {
  //     slider.focus();
  //   }
  // }

  render() {
    return (
      <>
        <div className="d-flex align-items-center mb-3">
          <Typography variant="h5">
            <strong>Chuyên khoa</strong>
          </Typography>
          <Button className="ms-auto" variant="outlined">
            <Typography variant="h5">Xem them</Typography>
          </Button>
        </div>

        <CarouselProvider
          naturalSlideWidth={70}
          naturalSlideHeight={50}
          totalSlides={
            this.state.width < 576
              ? slides.length
              : this.state.width < 768
              ? slides.length / 2
              : slides.length / 3
          }
          infinite={true}
          isPlaying={true}
          interval={4000}
          touchEnabled={false}
          dragEnabled={false}
          lockOnWindowScroll
          tag="div"
          // style={{ outline: 'none' }}
          visibleSlides={
            this.state.width < 576 ? 1 : this.state.width < 768 ? 2 : 3
          }
          className="col-12 col-lg-12 m-auto position-relative"
        >
          <Slider id="mySlider" style={{ outline: 'none' }}>
            {slides.length > 0 &&
              slides.map((slide, index) => (
                <Slide index={index} key={slide}>
                  <div className="card-slide">
                    <NavLink to="/" className="text-black">
                      <Image
                        src={slide}
                        hasMasterSpinner={false}
                        className="slide-img slide-img-children"
                      />
                      <Typography variant="h6" align="center" className="mt-2">
                        <strong>Co xuong khop</strong>
                      </Typography>
                    </NavLink>
                  </div>
                </Slide>
              ))}
          </Slider>
          <ButtonBack className="button-Slide position-absolute start-0 left">
            <ArrowBackIosNewIcon color="info" />
          </ButtonBack>
          <ButtonNext className="button-Slide position-absolute end-0 right">
            <ArrowForwardIosIcon color="info" />
          </ButtonNext>
          <DotGroup
            showAsSelectedForCurrentSlideOnly={true}
            className="d-flex justify-content-center my-2 DotGroup"
          ></DotGroup>
        </CarouselProvider>
      </>
    );
  }
}
