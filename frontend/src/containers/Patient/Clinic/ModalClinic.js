import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { getClinicDetail, updateClinic } from '../../../services';
import { startLoading, stopLoading } from '../../../store/actions';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      name: '',
      image: '',
      address: '',
      oldData: {},
      descriptionHTML_VI: '',
      contentMarkdown_VI: '',
      descriptionHTML_EN: '',
      contentMarkdown_EN: '',
    };

    this.timer = null;

    this.windowResized = this.windowResized.bind(this);

    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.windowResized);
    this.updateWindowWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResized);
  }

  updateWindowWidth() {
    let _this = this;
    setTimeout(function () {
      _this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }

  windowResized() {
    let _this = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function () {
      _this.updateWindowWidth();
    }, 500);
  }

  handleChange = {
    name: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    },
    address: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    },
    img: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.files[0],
      }));
    },
    editorVi: ({ html, text }) => {
      this.setState((prevState) => ({
        ...prevState,
        descriptionHTML_VI: html,
        contentMarkdown_VI: text,
      }));
    },
    editorEn: ({ html, text }) => {
      this.setState((prevState) => ({
        ...prevState,
        descriptionHTML_EN: html,
        contentMarkdown_EN: text,
      }));
    },
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.clinicId !== this.props.clinicId) {
      const response = await getClinicDetail(this.props.clinicId);
      if (response.statusCode === 200) {
        this.setState((prevState) => ({
          ...prevState,
          ...response.data,
          oldData: { ...response.data },
        }));
      }
    }
  }

  submit = async () => {
    const {
      name,
      image,
      address,
      descriptionHTML_VI,
      contentMarkdown_VI,
      descriptionHTML_EN,
      contentMarkdown_EN,
      oldData,
    } = this.state;
    const { clinicId } = this.props;

    const payload = {
      name,
      image,
      address,
      descriptionHTML_VI,
      contentMarkdown_VI,
      descriptionHTML_EN,
      contentMarkdown_EN,
      clinicId,
    };
    Object.entries(payload).forEach(
      ([key, value]) => !value && delete payload[key]
    );
    if (_.isEqual(payload, oldData)) {
      this.props.toggleModal();
      return;
    }

    if (Object.keys(payload).length > 0) {
      this.props.startLoading();
      const response = await updateClinic(payload);
      this.props.stopLoading();
      if (
        response.status === 500 ||
        response.data?.statusCode === 500 ||
        response.statusCode === 500
      ) {
        toast.error(<FormattedMessage id={`toast.InternalError`} />);

        return;
      }
      if (response.statusCode === 200) toast.success('oke');
      else toast.error('error');
    }
  };
  render() {
    const { isOpenModal, toggleModal } = this.props;
    const { width } = this.state;
    const { name, isLoading, address, contentMarkdown_VI, contentMarkdown_EN } =
      this.state;

    return (
      <>
        <Modal
          isOpen={isOpenModal}
          toggle={toggleModal}
          centered={width < 576}
          size="lg"
        >
          <div className="clinic-modal-container p-4">
            <div className="row">
              <div className="col-12"></div>
              <div className="row">
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="titleMain.clinic" />
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.handleChange.name}
                  />
                </div>
                <div className="col-6 form-group">
                  <label>Chuyen hoa</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={this.handleChange.img}
                  />
                </div>
                <div className="col-12 form-group">
                  <label>Dia chi</label>
                  <input
                    className="form-control"
                    type="text"
                    name="address"
                    value={address}
                    onChange={this.handleChange.address}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-12 form-group">
                  <label>Vi</label>
                  <MdEditor
                    style={{ height: '200px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={this.handleChange.editorVi}
                    value={contentMarkdown_VI}
                  />
                </div>
                <div className="col-12 form-group">
                  <label>En</label>
                  <MdEditor
                    style={{ height: '200px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={this.handleChange.editorEn}
                    value={contentMarkdown_EN}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-12">
                  <button
                    className="btn btn-primary ms-auto"
                    onClick={this.submit}
                    disabled={isLoading}
                  >
                    <FormattedMessage id="button.save" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startLoading: () => dispatch(startLoading()),
    stopLoading: () => dispatch(stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalClinic);
