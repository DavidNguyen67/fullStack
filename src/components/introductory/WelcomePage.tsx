import React from 'react';
import './../../style/welcome.scss';
import { Button, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import item1 from './../../assets/img/item1.png';
import item2 from './../../assets/img/item2.png';
import item3 from './../../assets/img/item3.png';
import item4 from './../../assets/img/item4.png';
import item5 from './../../assets/img/item5.png';
import item6 from './../../assets/img/item6.png';
import item7 from './../../assets/img/item7.png';
import item8 from './../../assets/img/item8.png';
import item9 from './../../assets/img/item9.png';
import item10 from './../../assets/img/item10.png';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SlideComponent from './Slide';
import SlideChild from './SlideChild';

const titles = [
  {
    title: 'Khám chuyên khoa',
    icon: item1,
  },
  {
    title: 'Khám từ xa',
    icon: item2,
  },
  {
    title: 'Khám tổng quát',
    icon: item3,
  },
  {
    title: 'Xét nghiệm y học',
    icon: item4,
  },
  {
    title: 'Sức khỏe tinh thần',
    icon: item5,
  },
  {
    title: 'Khám nha khoa',
    icon: item6,
  },
  {
    title: 'Gói phẫu thuật',
    icon: item7,
  },
  {
    title: 'Sống khỏe Tiểu đường',
    icon: item8,
  },
  {
    title: 'Bài Test Sức Khỏe',
    icon: item9,
  },
  {
    title: 'Y tế gần bạn',
    icon: item10,
  },
];

class WelcomePage extends React.Component {
  state = {
    canViewMore: true,
  };

  render(): React.ReactNode {
    return (
      <>
        <SlideComponent />
        {/* <div className="col-12 flex m-auto container-img">
          <div className="brgImg m-auto"></div>
        </div> */}
        <div className="col-12">
          <br />
          <br />
          <Typography variant="h3">Dịch vụ toàn diện</Typography>
          <div className="row mx-2">
            {titles.length > 0 &&
              titles
                .slice(0, this.state.canViewMore ? 6 : titles.length)
                .map((title) => (
                  <div
                    className="col-12 col-sm-6 col-lg-4 my-3"
                    key={title.title}
                  >
                    <NavLink
                      to={''}
                      // className="position-absolute top-50 translate-middle-y d-flex align-items-center"
                      className="container-items"
                    >
                      <div className="items">
                        <img
                          src={title.icon}
                          className="img-items ms-4 me-2"
                          alt=""
                        />
                        <Typography variant="h6" color="black">
                          {title.title}
                        </Typography>
                      </div>
                    </NavLink>
                  </div>
                ))}
          </div>
          <div className="w-100 d-flex justify-content-center">
            <Button
              className="m-auto"
              onClick={() =>
                this.setState({ canViewMore: !this.state.canViewMore })
              }
            >
              {this.state.canViewMore ? (
                <Typography align="center" variant="h6">
                  View More <KeyboardArrowDownIcon />
                </Typography>
              ) : (
                <Typography align="center" variant="h6">
                  Hide More <KeyboardArrowUpIcon />
                </Typography>
              )}
            </Button>
          </div>
          <div className="my-4" />
          <SlideChild />
        </div>
      </>
    );
  }
}
export default WelcomePage;
