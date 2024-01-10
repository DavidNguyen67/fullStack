import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './doctorsManage.scss';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import * as constant from '../../../utils';
import { toast } from 'react-toastify';
import {
  getDoctorDetail,
  updateMarkDownService,
} from '../../../services/userService';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDoctor: null,
      doctor: null,
      contentHTML: '',
      contentMarkdown: '',
      description: '',
      hasOldData: false,
      isLoading: false,

      prices: [],
      payments: [],
      provinces: [],

      selectedProvince: '',
      selectedPayment: '',
      selectedPrice: '',
      nameClinic: '',
      addressClinic: '',
      note: '',
    };
  }
  handleEditorChange = ({ html, text }) => {
    const { lang } = this.props;
    if (lang === constant.LANGUAGES.EN)
      this.setState((prevState) => ({
        ...prevState,
        contentHTML_EN: html,
        contentMarkdown_EN: text,
      }));
    else
      this.setState((prevState) => ({
        ...prevState,
        contentHTML_VI: html,
        contentMarkdown_VI: text,
      }));
  };
  handleSaveContentMarkdown = async (event) => {
    const {
      contentHTML_EN,
      contentMarkdown_EN,
      contentHTML_VI,
      contentMarkdown_VI,
      description_VI,
      description_EN,
      selectedDoctor,
    } = this.state;
    const payload = {
      contentHTML_EN,
      contentMarkdown_EN,
      contentHTML_VI,
      contentMarkdown_VI,
      description_VI,
      description_EN,
      doctorId: selectedDoctor?.value,
    };
    for (const key of Object.keys(payload)) {
      if (!payload[key]) delete payload[key];
    }

    if (!payload.doctorId) {
      toast.error(<FormattedMessage id="toast.selectDoctorIsRequired" />);
      return;
    }
    const { lang } = this.props;
    if (lang === constant.LANGUAGES.EN) {
      if (!payload.contentHTML_EN) {
        toast.error(<FormattedMessage id="toast.contentHTMLRequired" />);
        return;
      }
      if (!payload.contentMarkdown_EN) {
        toast.error(<FormattedMessage id="toast.selectDoctorIsRequired" />);
        return;
      }
    } else {
      if (!payload.contentHTML_VI) {
        toast.error(<FormattedMessage id="toast.contentHTMLRequired" />);
        return;
      }
      if (!payload.contentMarkdown_VI) {
        toast.error(<FormattedMessage id="toast.selectDoctorIsRequired" />);
        return;
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const response = await updateMarkDownService(payload);
    this.setState((prevState) => ({
      ...prevState,
      isLoading: false,
    }));

    if (response.statusCode && response.data) {
      toast.success(
        <FormattedMessage
          id="toast.successUpdateDoctor"
          values={{
            br: <br />,
          }}
          tagName="div"
        />
      );
      this.setState((prevState) => ({
        ...prevState,
        selectedDoctor: '',
        contentHTML_VI: '',
        contentMarkdown_VI: '',
        contentHTML_EN: '',
        contentMarkdown_EN: '',
        description_VI: '',
        description_EN: '',
        selectedOption: '',
      }));
      await this.props.readAllDoctors();
    } else {
      if (response.statusCode === 500) {
        toast.error(<FormattedMessage id={`toast.InternalError`} />);
        return;
      }
      toast.error(
        <FormattedMessage
          id="toast.failUpdateDoctor"
          values={{
            br: <br />,
          }}
          tagName="div"
        />
      );
    }

    return;
  };
  handleChange = async (selectedDoctor) => {
    const response = await getDoctorDetail(selectedDoctor.value);

    let newState = { selectedDoctor };

    if (response.data) {
      newState = {
        ...newState,
        doctor: response.data,
      };
      const { markDown } = response.data;
      if (this.props.lang === constant.LANGUAGES.VI) {
        newState = {
          ...newState,
          description_VI: markDown?.description_VI || '',
          contentHTML_VI: markDown?.contentHTML_VI || '',
          contentMarkdown_VI: markDown?.contentMarkdown_VI || '',
          hasOldData: !!markDown?.contentHTML_VI,
        };
      } else
        newState = {
          ...newState,
          description_EN: markDown?.description_EN || '',
          contentHTML_EN: markDown?.contentHTML_EN || '',
          contentMarkdown_EN: markDown?.contentMarkdown_EN || '',
          hasOldData: !!markDown?.contentHTML_EN,
        };
    }

    this.setState(newState);
  };
  handleOnChangeDesc = (event) => {
    const { lang } = this.props;
    if (lang === constant.LANGUAGES.VI)
      this.setState((prevState) => ({
        ...prevState,
        description_VI: event.target.value,
      }));
    else
      this.setState((prevState) => ({
        ...prevState,
        description_EN: event.target.value,
      }));
  };

  // IF get error at manageDoctor, check componentDidUpdate
  componentDidUpdate(prevProps) {
    const { lang, prices, provinces, payments } = this.props;
    const updateState = {};

    if (prevProps.lang !== lang) {
      updateState.selectedDoctor = {
        ...this.state.selectedDoctor,
        label:
          lang === constant.LANGUAGES.EN
            ? this.state.selectedDoctor?.labelEn
            : this.state.selectedDoctor?.labelVi,
      };
    }

    if (prevProps.prices !== prices) {
      updateState.prices = prices;
    }

    if (prevProps.provinces !== provinces) {
      updateState.provinces = provinces;
    }

    if (prevProps.payments !== payments) {
      updateState.payments = payments;
    }

    if (Object.keys(updateState).length > 0)
      this.setState((prevState) => ({
        ...prevState,
        ...updateState,
      }));
  }

  //

  async componentDidMount() {
    await this.props.readAllDoctors();
    await this.props.fetchProvinceStart();
    await this.props.fetchPaymentStart();
    await this.props.fetchPriceStart();
  }

  render() {
    let contentMarkdown = null;
    let description = null;
    const {
      selectedDoctor,
      hasOldData,
      isLoading,
      prices,
      provinces,
      payments,
    } = this.state;
    const { doctors, lang } = this.props;
    if (lang === constant.LANGUAGES.VI) {
      contentMarkdown = this.state.contentMarkdown_VI;
      description = this.state.description_VI;
    } else {
      description = this.state.description_EN;
      contentMarkdown = this.state.contentMarkdown_EN;
    }
    const listDoctors =
      doctors.length > 0 &&
      doctors.map &&
      doctors.map((doctor) => {
        const value = doctor.id;
        const labelVi = `${doctor.positionData?.valueVi} ${doctor.lastName} ${doctor.firstName}`;
        const labelEn = `${doctor.positionData?.valueEn} ${doctor.firstName} ${doctor.lastName}`;

        return {
          value,
          label: lang === constant.LANGUAGES.VI ? labelVi : labelEn,
          labelVi,
          labelEn,
        };
      });

    console.log(prices, provinces, payments);

    return (
      <>
        <div className="manage-doctor-container row">
          <div className="manage-doctor-title text-center my-4">
            <FormattedMessage id={'title.doctor.title'} />
          </div>
          <div className="more-info mb-4">
            <div className="row col-12">
              <div className="content-left form-group col-5">
                <label>
                  <FormattedMessage id={'title.doctor.SelectDoctor'} />
                </label>
                <Select
                  value={selectedDoctor}
                  onChange={this.handleChange}
                  options={listDoctors}
                  placeholder={
                    <FormattedMessage id={'title.doctor.SelectDoctor'} />
                  }
                />
              </div>
              <div className="content-right form-group col-7">
                <label>
                  <FormattedMessage
                    id={'title.doctor.introductoryInformation'}
                  />
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  onChange={this.handleOnChangeDesc}
                  value={description}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="more-info-extract row">
            <div className="col-4 mb-2 form-group">
              <label>Chon gia</label>
              <input className="form-control" />
            </div>
            <div className="col-4 mb-2 form-group">
              <label>Chon gia</label>
              <input className="form-control" />
            </div>
            <div className="col-4 mb-2 form-group">
              <label>Chon gia</label>
              <input className="form-control" />
            </div>
            <div className="col-4 mb-2 form-group">
              <label>Chon gia</label>
              <input className="form-control" />
            </div>
            <div className="col-4 mb-2 form-group">
              <label>Chon gia</label>
              <input className="form-control" />
            </div>
            <div className="col-4 mb-2 form-group">
              <label>Chon gia</label>
              <input className="form-control" />
            </div>
            <div className="my-2" />
          </div>
          <div className="manage-doctor-editor row">
            <div className="col-12">
              <MdEditor
                style={{ height: '500px' }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChange}
                value={contentMarkdown}
              />
            </div>
          </div>
          <div className="row" />
          <div className="my-2" />
          <div className="col-6">
            <button
              className="btn btn-primary save-content-markdown"
              onClick={this.handleSaveContentMarkdown}
              disabled={isLoading}
            >
              {hasOldData ? (
                <FormattedMessage id={'button.save'} />
              ) : (
                <FormattedMessage id={'button.create'} />
              )}
            </button>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    doctors: state.admin.doctors,
    lang: state.app.language,
    isErrorUpdateDoctor: state.admin.isErrorUpdateDoctor,
    isSuccessUpdateDoctor: state.admin.isSuccessUpdateDoctor,
    statusCode: state.admin.statusCode,

    prices: state.admin.prices,
    provinces: state.admin.provinces,
    payments: state.admin.payments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readAllDoctors: () => dispatch(actions.readAllDoctors()),
    updateDoctor: (payload) => dispatch(actions.updateDoctor(payload)),
    fetchProvinceStart: () => dispatch(actions.fetchProvinceStart()),
    fetchPaymentStart: () => dispatch(actions.fetchPaymentStart()),
    fetchPriceStart: () => dispatch(actions.fetchPriceStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
