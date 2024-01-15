import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { readClinic } from '../../../services/userService';
import TextTruncate from '../../../components/TextTruncate/TextTruncate';
import { withRouter } from 'react-router-dom';

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinics: [],
      isFailed: false,
      isLoading: false,
    };
  }

  async componentDidMount() {
    const response = await readClinic();
    if (response) {
      if (response.statusCode === 200) {
        this.setState((prevState) => ({
          ...prevState,
          clinics: response.data,
          isLoading: false,
          isFailed: false,
        }));
        return;
      } else
        this.setState((prevState) => ({
          ...prevState,
          clinics: [],
          isFailed: true,
          isLoading: false,
        }));
      return;
    }
  }

  redirectDetail = (id) => {
    const { history } = this.props;
    if (history) history.push(`/clinic/detail/${id}`);
  };

  render() {
    const { clinics } = this.state;

    return (
      <div className="section-share section-medial-facility">
        {typeof clinics !== 'string' && clinics && clinics.length > 0 && (
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">Co so y te noi bat</span>
              <button className="btn-section">
                <FormattedMessage id={`homePage.moreInfo`} />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {clinics.map((clinic) => {
                  const base64 = btoa(
                    new Uint8Array(clinic.image?.data)?.reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ''
                    )
                  );
                  const imageSrc = base64
                    ? `data:image/png;base64,${base64}`
                    : '';
                  return (
                    <div className="section-customize">
                      <div className="img d-flex justify-content-center">
                        <div
                          className="info-specialty"
                          style={{ cursor: 'pointer' }}
                          onClick={() => this.redirectDetail(clinic.id)}
                        >
                          <div
                            className="bg-image section-medial-facility"
                            style={{
                              background: `url(${imageSrc}) no-repeat center top / contain`,
                            }}
                          ></div>
                          <h3 className="clinicName">
                            <TextTruncate
                              className="text-center"
                              text={clinic.name}
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
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MedicalFacility));
