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

import './../../style/slide.scss';
import { Button, Card, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { NumberLiteralType } from 'typescript';

// interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S> {}

export default class SlideChild extends React.Component<
  { slides: any[] },
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
          naturalSlideHeight={55}
          totalSlides={this.props.slides.length}
          infinite={true}
          isPlaying={true}
          interval={4000}
          touchEnabled={false}
          // dragEnabled={false}
          dragStep={3}
          lockOnWindowScroll
          step={3}
          tag="div"
          // style={{ outline: 'none' }}
          visibleSlides={
            this.state.width < 576 ? 1 : this.state.width < 768 ? 2 : 3
          }
          className="col-12 col-lg-12 m-auto position-relative"
        >
          <Slider id="mySlider" style={{ outline: 'none' }}>
            {this.props.slides.length > 0 &&
              this.props.slides.map((slide, index) => (
                <Slide index={index} key={slide}>
                  <div className="card-slide">
                    <NavLink to="/" className="text-black">
                      <Image
                        src={slide}
                        hasMasterSpinner={false}
                        className="slide-img slide-img-children"
                        isBgImage
                        tag="div"
                      />
                      <Typography variant="h6" align="center" className="py-2">
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
