import 'pure-react-carousel/dist/react-carousel.es.css';
import { CarouselProvider, Slider, Slide, Image } from 'pure-react-carousel';
import 'react-loading-skeleton/dist/skeleton.css';
import './../../../style/mainSlide.scss';
import img from './../../../assets/img/atHome.png';
import { useIntl } from 'react-intl';
import { Typography } from '@mui/material';
import { propsSlideChild } from '../../../utils/interfaces/redux.interface';
import {
  keyRootReducers,
  useAppDispatch,
  useAppSelector,
} from '../../../redux';
import fetchAtHomeSlides from '../../../redux/actions/slideAtHome.action';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { baseRouteProduct } from '../../../utils/routeApi';
import Skeleton from 'react-loading-skeleton';

export const SlideChild = (props: propsSlideChild) => {
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  const intl = useIntl();
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return (
    <>
      {props.slides && props.slides.length > 0 ? (
        <>
          {' '}
          <div className="mt-3"></div>
          <br />
          <div className="mt-3"></div>
          <Typography variant="h5" fontWeight="600">
            {intl.formatMessage({ id: props.title })}
          </Typography>
          <CarouselProvider
            touchEnabled={false}
            dragEnabled={false}
            lockOnWindowScroll
            tag="div"
            className="position-relative"
            naturalSlideWidth={70}
            naturalSlideHeight={55}
            totalSlides={props && props.slides && props.slides?.length}
            infinite={true}
            isPlaying={true}
            interval={4000}
            // dragEnabled={false}
            dragStep={3}
            step={3}
            visibleSlides={
              windowSize.innerWidth < 576
                ? 2
                : windowSize.innerWidth < 992
                ? 3
                : 4
            }
          >
            <Slider className="slideContainer">
              {props.slides &&
                props.slides.length > 0 &&
                props.slides.map((slide, index) => {
                  const base64String = btoa(
                    new Uint8Array(slide.image.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ''
                    )
                  );

                  return (
                    <Slide index={index} key={index} className="col-12">
                      <NavLink
                        to={`${baseRouteProduct}/${slide.product_id}`}
                        className="text-black"
                      >
                        <div className="card-slide text-center">
                          <Image
                            hasMasterSpinner
                            src={`data:image/png;base64,${base64String}`}
                            isBgImage={true}
                            tag="div"
                            className="slide-img-child"
                          />
                          <div className="mt-3"></div>
                          <Typography variant="body2">
                            {slide.product_name}
                          </Typography>
                        </div>
                      </NavLink>
                    </Slide>
                  );
                })}
            </Slider>
          </CarouselProvider>
        </>
      ) : (
        <Skeleton count={3} />
      )}
    </>
  );
};

const AtHome = () => {
  const dispatch = useAppDispatch();
  const { slides } = useAppSelector(
    (state: keyRootReducers) => state.slideAtHome
  );
  useEffect(() => {
    (!slides || slides.length < 1) && dispatch(fetchAtHomeSlides());
  }, []);

  return (
    <>
      <div className="col-12 mx-auto">
        <div className="mt-3" />
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={40}
          totalSlides={1}
          touchEnabled={false}
          dragEnabled={false}
          lockOnWindowScroll
          tag="div"
          className="position-relative mainSlide"
        >
          <Slider className="slideContainer">
            <Slide index={0} className="col-12">
              <Image
                hasMasterSpinner
                src={img}
                isBgImage={true}
                tag="div"
                className="slide-img"
              />
            </Slide>
          </Slider>
        </CarouselProvider>
        <SlideChild title="atHome.title" slides={slides} />
        <SlideChild title="atHome.title" slides={slides} />
      </div>
    </>
  );
};

export default AtHome;
