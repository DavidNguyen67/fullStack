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
import * as services from '../../../services/userService';
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
      selectedProvince,
      selectedPayment,
      selectedPrice,
      nameClinic,
      addressClinic,
      note,
    } = this.state;

    const filterEmptyValues = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(
          ([key, value]) =>
            value !== undefined && value !== null && value !== ''
        )
      );
    const doctorId = selectedDoctor?.value;

    const payloadMarkDown = filterEmptyValues({
      contentHTML_EN,
      contentMarkdown_EN,
      contentHTML_VI,
      contentMarkdown_VI,
      description_VI,
      description_EN,
      doctorId,
    });

    const payloadDoctorInfo = filterEmptyValues({
      provinceId: selectedProvince?.value,
      paymentId: selectedPayment?.value,
      priceId: selectedPrice?.value,
      nameClinic,
      addressClinic,
      note,
      doctorId,
    });

    if (!doctorId) {
      toast.error(<FormattedMessage id="toast.selectDoctorIsRequired" />);
      return;
    }

    const { lang } = this.props;
    if (lang === constant.LANGUAGES.EN) {
      if (!payloadMarkDown.contentHTML_EN) {
        toast.error(<FormattedMessage id="toast.contentHTMLRequired" />);
        return;
      }
      if (!payloadMarkDown.contentMarkdown_EN) {
        toast.error(<FormattedMessage id="toast.contentMarkdownRequired" />);
        return;
      }
    } else {
      if (!payloadMarkDown.contentHTML_VI) {
        toast.error(<FormattedMessage id="toast.contentHTMLRequired" />);
        return;
      }
      if (!payloadMarkDown.contentMarkdown_VI) {
        toast.error(<FormattedMessage id="toast.contentMarkdownRequired" />);
        return;
      }
    }
    if (!payloadDoctorInfo.priceId) {
      toast.error(<FormattedMessage id="toast.PriceRequired" />);
      return;
    }
    if (!payloadDoctorInfo.paymentId) {
      toast.error(<FormattedMessage id="toast.PaymentMethodRequired" />);
      return;
    }
    if (!payloadDoctorInfo.provinceId) {
      toast.error(<FormattedMessage id="toast.ProvinceRequired" />);
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const response = await services.updateMarkDownService(payloadMarkDown);
    const res = await services.createUpdateNewDoctorInfo(payloadDoctorInfo);
    this.setState((prevState) => ({
      ...prevState,
      isLoading: false,
    }));

    if (
      (response.statusCode === 200 || response.data?.statusCode === 200) &&
      (res.statusCode === 200 || res.data?.statusCode === 200)
    ) {
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
        contentHTML_EN: '',
        contentMarkdown_EN: '',
        description_VI: '',
        description_EN: '',
        selectedOption: '',
        contentHTML: '',
        contentMarkdown: '',
        description: '',

        selectedProvince: '',
        selectedPayment: '',
        selectedPrice: '',
        nameClinic: '',
        addressClinic: '',
        note: '',
      }));
      await this.props.readAllDoctors();
    } else {
      if (
        response.statusCode === 500 ||
        response.data?.statusCode === 500 ||
        res.statusCode === 500 ||
        res.data?.statusCode === 500
      ) {
        toast.error(<FormattedMessage id={`toast.InternalError`} />);
        return;
      }
      if (
        response.statusCode === 400 ||
        response.data?.statusCode === 400 ||
        res.statusCode === 400 ||
        res.data?.statusCode === 400
      ) {
        toast.error(<FormattedMessage id={`toast.BadRequest`} />);
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
  handleChange = {
    doctor: async (selectedDoctor) => {
      const response = await services.getDoctorDetail(selectedDoctor.value);

      let newState = { selectedDoctor };

      if (response.data) {
        newState = {
          ...newState,
          doctor: response.data,
        };
        const { markDown, doctorInfo } = response.data;
        newState = {
          ...newState,
          addressClinic: doctorInfo?.addressClinic || '',
          nameClinic: doctorInfo?.nameClinic || '',
          note: doctorInfo?.note || '',
        };
        console.log(doctorInfo);
        if (this.props.lang === constant.LANGUAGES.VI) {
          newState = {
            ...newState,
            description_VI: markDown?.description_VI || '',
            contentHTML_VI: markDown?.contentHTML_VI || '',
            contentMarkdown_VI: markDown?.contentMarkdown_VI || '',
            hasOldData: !!markDown?.contentHTML_VI || '',

            selectedPayment: {
              label: doctorInfo?.paymentInfo.valueVi,
              value: doctorInfo?.paymentInfo.keyMap,
            },
            selectedProvince: {
              label: doctorInfo?.provinceInfo.valueVi,
              value: doctorInfo?.provinceInfo.keyMap,
            },
            selectedPrice: {
              label: `${doctorInfo?.priceInfo.valueVi} VND`,
              value: doctorInfo?.priceInfo.keyMap,
            },
          };
        } else
          newState = {
            ...newState,
            description_EN: markDown?.description_EN || '',
            contentHTML_EN: markDown?.contentHTML_EN || '',
            contentMarkdown_EN: markDown?.contentMarkdown_EN || '',
            hasOldData: !!markDown?.contentHTML_EN || '',

            selectedPayment: {
              label: doctorInfo?.paymentInfo.valueEn,
              value: doctorInfo?.paymentInfo.keyMap,
            },
            selectedProvince: {
              label: doctorInfo?.provinceInfo.valueEn,
              value: doctorInfo?.provinceInfo.keyMap,
            },
            selectedPrice: {
              label: `$ ${doctorInfo?.priceInfo.valueEn}`,
              value: doctorInfo?.priceInfo.keyMap,
            },
          };
      }

      this.setState(newState);
    },
    price: (selectedPrice) => {
      this.setState((prevState) => ({
        ...prevState,
        selectedPrice: selectedPrice,
      }));
    },
    payment: (selectedPayment) => {
      this.setState((prevState) => ({
        ...prevState,
        selectedPayment: selectedPayment,
      }));
    },
    province: (selectedProvince) => {
      this.setState((prevState) => ({
        ...prevState,
        selectedProvince: selectedProvince,
      }));
    },
    nameClinic: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        nameClinic: event.target.value,
      }));
    },
    addressClinic: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        addressClinic: event.target.value,
      }));
    },
    note: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        note: event.target.value,
      }));
    },
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
  async componentDidUpdate(prevProps) {
    const { lang, prices, provinces, payments } = this.props;

    const updateState = {};

    if (prevProps.lang !== lang) {
      const { selectedDoctor } = this.state;
      if (selectedDoctor) await this.handleChange.doctor(selectedDoctor);

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
      selectedProvince,
      selectedPayment,
      selectedPrice,
      nameClinic,
      addressClinic,
      note,
    } = this.state;
    const { doctors, lang } = this.props;
    if (lang === constant.LANGUAGES.VI) {
      contentMarkdown = this.state?.contentMarkdown_VI;
      description = this.state?.description_VI;
    } else {
      description = this.state?.description_EN;
      contentMarkdown = this.state?.contentMarkdown_EN;
    }

    const listDoctor =
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

    const listProvince =
      provinces.length > 0 &&
      provinces.map &&
      provinces.map((province) => {
        return {
          value: province.keyMap,
          label:
            lang === constant.LANGUAGES.VI
              ? `${province.valueVi}`
              : `${province.valueEn}`,
        };
      });
    const listPayment =
      payments.length > 0 &&
      payments.map &&
      payments.map((payment) => {
        return {
          value: payment.keyMap,
          label:
            lang === constant.LANGUAGES.VI
              ? `${payment.valueVi}`
              : `${payment.valueEn}`,
        };
      });
    const listPrice =
      prices.length > 0 &&
      prices.map &&
      prices.map((price) => {
        return {
          value: price.keyMap,
          label:
            lang === constant.LANGUAGES.VI
              ? `${price.valueVi} VND`
              : `$ ${price.valueEn}`,
        };
      });

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
                  onChange={this.handleChange.doctor}
                  options={listDoctor}
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
            <div className="col-12 col-lg-4 mb-2 form-group">
              <label>
                <FormattedMessage id={'doctor.price'} />
              </label>
              <Select
                value={selectedPrice}
                onChange={this.handleChange.price}
                options={listPrice}
                placeholder={<FormattedMessage id={'title.doctor.price'} />}
              />
            </div>
            <div className="col-12 col-lg-4 mb-2 form-group">
              <label>
                <FormattedMessage id={'doctor.payment'} />
              </label>
              <Select
                value={selectedPayment}
                onChange={this.handleChange.payment}
                options={listPayment}
                placeholder={<FormattedMessage id={'title.doctor.payment'} />}
              />
            </div>
            <div className="col-12 col-lg-4 mb-2 form-group">
              <label>
                <FormattedMessage id={'doctor.province'} />
              </label>
              <Select
                value={selectedProvince}
                onChange={this.handleChange.province}
                options={listProvince}
                placeholder={<FormattedMessage id={'title.doctor.province'} />}
              />
            </div>
            <div className="col-12 col-lg-4 mb-2 form-group">
              <label>
                <FormattedMessage id={'doctor.nameClinic'} />
              </label>
              <input
                className="form-control"
                value={nameClinic || ''}
                onChange={this.handleChange.nameClinic}
                placeholder={constant.LanguageUtils.getMessageByKey(
                  'manage-user.nameClinicPlaceholder',
                  lang
                )}
              />
            </div>
            <div className="col-12 col-lg-4 mb-2 form-group">
              <label>
                <FormattedMessage id={'doctor.addressClinic'} />
              </label>
              <input
                className="form-control"
                value={addressClinic || ''}
                onChange={this.handleChange.addressClinic}
                placeholder={constant.LanguageUtils.getMessageByKey(
                  'manage-user.addressClinicPlaceholder',
                  lang
                )}
              />
            </div>
            <div className="col-12 col-lg-4 mb-2 form-group">
              <label>
                <FormattedMessage id={'doctor.note'} />
              </label>
              <input
                className="form-control"
                value={note || ''}
                onChange={this.handleChange.note}
                placeholder={constant.LanguageUtils.getMessageByKey(
                  'manage-user.notePlaceholder',
                  lang
                )}
              />
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
