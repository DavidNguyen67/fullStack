import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { readSpecialty } from './../../../services/userService';
import { withRouter } from 'react-router-dom';
import TextTruncate from '../../../components/TextTruncate/TextTruncate';

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
      isLoading: false,
      isFailed: false,
    };
  }
  changeLanguage = (lan) => {
    this.props.changeLanguageAppRedux(lan);
  };

  async componentDidMount() {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
      specialties: [],
      isFailed: false,
    }));
    const response = await readSpecialty();
    if (response) {
      if (response.statusCode === 200) {
        this.setState((prevState) => ({
          ...prevState,
          specialties: response.data,
        }));
        return;
      } else
        this.setState((prevState) => ({
          ...prevState,
          specialties: [],
        }));
      return;
    }
  }

  redirectDetail = (id) => {
    const { history } = this.props;
    if (history) history.push(`/specialty/detail/${id}`);
  };

  render() {
    const { specialties } = this.state;

    return (
      <div className="section-share section-specialty">
        {typeof specialties !== 'string' &&
          specialties &&
          specialties.length > 0 && (
            <div className="section-container">
              <div className="section-header">
                <span className="title-section">Chuyen khoa pho bien</span>
                <button className="btn-section">
                  <FormattedMessage id={`homePage.moreInfo`} />
                </button>
              </div>
              <div className="section-body">
                <Slider {...this.props.settings}>
                  {typeof specialties !== 'string' &&
                    specialties &&
                    specialties.length > 0 &&
                    specialties.map((specialty) => {
                      const base64 = btoa(
                        new Uint8Array(specialty.image?.data)?.reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          ''
                        )
                      );
                      const imageSrc = base64
                        ? `data:image/png;base64,${base64}`
                        : '';
                      return (
                        <div
                          className="section-customize"
                          key={specialty.id}
                          style={{ border: '1px solid #ccc' }}
                        >
                          <div className="img d-flex justify-content-center">
                            <div
                              className="info-specialty"
                              style={{ cursor: 'pointer' }}
                              onClick={() => this.redirectDetail(specialty.id)}
                            >
                              <div
                                className="bg-image section-specialty"
                                style={{
                                  background: `url(${imageSrc}) no-repeat center top / cover`,
                                }}
                              ></div>
                              <h3 className="clinicName">
                                <TextTruncate
                                  className="text-center"
                                  text={specialty.name}
                                  maxLength={20}
                                  tag="h4"
                                />
                              </h3>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </Slider>
              </div>
            </div>
          )}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Specialty));
