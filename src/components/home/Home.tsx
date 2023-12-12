import 'pure-react-carousel/dist/react-carousel.es.css';
import {
  CarouselProvider,
  Slider,
  Slide,
  DotGroup,
  Image,
} from 'pure-react-carousel';
import { useEffect, useState } from 'react';
import instance from '../../utils/custom/axios';
import { EventsFetchAll } from '../../utils/routeApi';
import { ImageResponse } from '../../utils/interfaces/resImg.interface';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './../../style/mainSlide.scss';
// import Skeleton from '@mui/material/Skeleton';

const keySessionData = 'dataSlide';

const Home = () => {
  const [slides, setSlides] = useState<ImageResponse[] | null>(null);

  const fetchEventSlides = async () => {
    const res = await instance.get(EventsFetchAll);
    res?.data && (await setSlides(res.data));

    // Something wrong here, an async login.
    // session said it is storing a promise data
    const dataInSession = sessionStorage.getItem(keySessionData);

    if (!dataInSession)
      sessionStorage.setItem(keySessionData, JSON.stringify(slides));
    else {
      if (JSON.stringify(slides) !== dataInSession)
        sessionStorage.setItem(keySessionData, JSON.stringify(slides));
    }
  };

  useEffect(() => {
    const data = sessionStorage.getItem(keySessionData);
    if (data && JSON.parse(data)) {
      setSlides(JSON.parse(data));
      return;
    }
    fetchEventSlides();
  }, []);

  return (
    <div className="col-12 col-lg-9 mx-auto">
      <div className="mt-3" />
      {slides && slides.length > 0 ? (
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={50}
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
              slides.map((slide, index) => {
                // const base64String = btoa(
                //   String.fromCharCode(...new Uint8Array(slide.image.data))
                // );
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
