import 'pure-react-carousel/dist/react-carousel.es.css';
import {
  CarouselProvider,
  Slider,
  Slide,
  DotGroup,
  Image,
} from 'pure-react-carousel';
import { useEffect } from 'react';
import { ImageResponse } from '../../utils/interfaces/resImg.interface';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './../../style/mainSlide.scss';
import { keyRootReducers, useAppDispatch, useAppSelector } from '../../redux';
import fetchSlides from '../../redux/actions/slides.action';

const Home = () => {
  const { slides } = useAppSelector((state: keyRootReducers) => state.slide);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (!slides || slides.length < 1) && dispatch(fetchSlides());
  }, []);

  return (
    <div className="col-12 mx-auto">
      <div className="mt-3" />
      {slides && slides.length > 0 ? (
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={40}
          totalSlides={slides.length}
          infinite={true}
          isPlaying={true}
          interval={5000}
          touchEnabled={false}
          dragEnabled={false}
          lockOnWindowScroll
          tag="div"
          // style={{ outline: 'none' }}
          className="position-relative mainSlide"
        >
          <Slider className="slideContainer">
            {slides &&
              slides.map((slide: ImageResponse, index) => {
                const base64String = btoa(
                  new Uint8Array(slide.image.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                  )
                );

                return (
                  <Slide
                    index={index}
                    key={index}
                    className="col-12"
                    onFocus={(e: Event) => e.preventDefault()}
                  >
                    <Image
                      hasMasterSpinner
                      src={`data:image/png;base64,${base64String}`}
                      isBgImage={true}
                      tag="div"
                      className="slide-img"
                    />
                  </Slide>
                );
              })}
          </Slider>
          <DotGroup className="d-flex align-items-center dotGroup mt-3" />
        </CarouselProvider>
      ) : (
        <Skeleton style={{ paddingTop: '50%' }} />
      )}
    </div>
  );
};

export default Home;
