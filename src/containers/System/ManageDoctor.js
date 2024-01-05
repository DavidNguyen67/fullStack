import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './doctorsManage.scss';
import Select from 'react-select';
import * as actions from './../../store/actions';
import * as constant from './../../utils';
import { toast } from 'react-toastify';
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
    };
  }
  handleEditorChange = ({ html, text }) => {
    this.setState((prevState) => ({
      ...prevState,
      contentHTML: html,
      contentMarkdown: text,
    }));
  };
  handleSaveContentMarkdown = (event) => {
    const { contentHTML, contentMarkdown, description, selectedDoctor } =
      this.state;
    const payload = {
      contentHTML,
      contentMarkdown,
      description,
      doctorId: selectedDoctor?.value,
    };
    for (const key of Object.keys(payload)) {
      if (!payload[key]) delete payload[key];
    }
    if (!payload.doctorId) {
      toast.error(<FormattedMessage id="toast.selectDoctorIsRequired" />);
      return;
    }
    if (!payload.contentHTML) {
      toast.error(<FormattedMessage id="toast.contentHTMLRequired" />);
      return;
    }
    if (!payload.contentMarkdown) {
      toast.error(<FormattedMessage id="toast.selectDoctorIsRequired" />);
      return;
    }
    this.props.updateDoctor(payload);
    const { statusCode, isErrorUpdateDoctor } = this.props;
    if (isErrorUpdateDoctor) {
      if (statusCode === 500) {
        toast.error(<FormattedMessage id={`toast.InternalError`} />);
        return;
      }
      if (statusCode === 409) {
        toast.error(
          <FormattedMessage
            id="toast.conflictEmail"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
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
    } else {
      toast.success(
        <FormattedMessage
          id="toast.successUpdateDoctor"
          values={{
            br: <br />,
          }}
          tagName="div"
        />
      );
    }
    this.setState((prevState) => ({
      ...prevState,
      selectedDoctor: '',
      contentHTML: '',
      contentMarkdown: '',
      description: '',
    }));
    return;
  };
  handleChange = (selectedDoctor) => {
    console.log(selectedDoctor);
    this.setState({ selectedDoctor });
  };
  handleOnChangeDesc = (event) => {
    this.setState((prevState) => ({
      ...prevState,
      description: event.target.value,
    }));
  };
  componentDidUpdate(prevProps) {
    const { lang } = this.props;
    if (prevProps.lang !== lang) {
      this.setState(
        (prevState) => ({
          ...prevState,
          selectedDoctor: {
            ...prevState.selectedDoctor,
            label:
              lang === constant.LANGUAGES.EN
                ? prevState.selectedDoctor?.labelEn
                : prevState.selectedDoctor?.labelVi,
          },
        }),
        () => console.log(this.state)
      );
    }
  }

  async componentDidMount() {
    await this.props.readAllDoctors();
  }

  render() {
    const { selectedOption } = this.state;
    const { doctors, lang } = this.props;
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

    return (
      <>
        <div className="manage-doctor-container">
          <div className="manage-doctor-title text-center my-4">
            <FormattedMessage id={'title.doctor.title'} />
          </div>
          <div className="more-info mb-4 d-flex">
            <div className="row col-12">
              <div className="content-left form-group col-5">
                <label>
                  <FormattedMessage id={'title.doctor.SelectDoctor'} />
                </label>
                {selectedOption ? (
                  <label>{selectedOption?.label}</label>
                ) : (
                  <></>
                )}

                <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={listDoctors}
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
                  value={this.state.description}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="manage-doctor-editor">
            <MdEditor
              style={{ height: '500px' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
            />
          </div>
          <div className="my-4" />
          <button
            className="btn btn-success save-content-markdown"
            onClick={this.handleSaveContentMarkdown}
          >
            <FormattedMessage id={'button.save'} />
          </button>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readAllDoctors: () => dispatch(actions.readAllDoctors()),
    updateDoctor: (payload) => dispatch(actions.updateDoctor(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
