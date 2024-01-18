import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../store/actions';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import { LanguageUtils } from '../../../utils';
import { confirmRemedy } from '../../../services/userService';
import { toast } from 'react-toastify';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

class ModalConfirmPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      isLoading: false,

      timeType: '',
      doctorId: '',
      patientId: '',
      patientName: '',
      image: null,
      email: '',
      payloadModal: {},
    };
    this.timer = null;

    this.windowResized = this.windowResized.bind(this);

    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('resize', this.windowResized);
    this.updateWindowWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResized);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { payloadModal } = this.props;
    if (prevProps.payloadModal !== this.props.payloadModal) {
      this.setState((prevState) => ({
        ...prevState,
        email: payloadModal.patientEmail,
        timeType: payloadModal.timeType,
        doctorId: payloadModal.doctorId,
        patientId: payloadModal.patientId,
        patientName: payloadModal.patientName,
      }));
    }
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

  confirm = async () => {
    const { image, email, timeType, doctorId, patientId, patientName } =
      this.state;
    const { lang } = this.props;
    let file = null;
    if (image) file = image[0]?.file;

    const formData = new FormData();
    Object.entries({
      file,
      email,
      timeType,
      lang,
      doctorId,
      patientId,
      patientName,
    }).forEach(([key, value]) => value && formData.append(key, value));
    if (formData) {
      this.props.startLoading();
      const response = await confirmRemedy(formData);
      this.props.stopLoading();

      if (response) {
        if (response.statusCode === 200) {
          toast.success('oke');
          this.props.toggleModal();
        } else {
          toast.error('no');
        }

        return;
      }
    }
  };

  handleChange = {
    email: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        email: event.target.value,
      }));
    },
    image: (image) => {
      this.setState((prevState) => ({
        ...prevState,
        image,
      }));
    },
  };

  render() {
    const { width, isLoading, image, email } = this.state;
    const { isShow, toggleModal, lang } = this.props;
    return (
      <>
        <Modal
          isOpen={isShow}
          toggle={toggleModal}
          // {...props}
          className="modal-booking-container"
          centered={width < 576}
        >
          <div className="confirmModal-container">
            <div className="confirmModal-header">
              <h3 className="text-center">ajsdhjas</h3>
            </div>
            <div className="confirmModal-body my-4">
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Email benh nhan</label>
                    <input
                      className="form-control"
                      value={email}
                      onChange={this.handleChange.email}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label>Email benh nhan</label>
                  <FilePond
                    files={image}
                    onupdatefiles={this.handleChange.image}
                    acceptedFileTypes={'image/*'}
                    allowReplace
                    maxFiles={5}
                    name="file1"
                    labelIdle={LanguageUtils.getMessageByKey(
                      'manage-user.filePlaceholder',
                      lang
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="confirmModal-footer">
              <div className="row">
                <div className="col-6 col-sm-3 ms-auto">
                  <button
                    className="btn btn-success w-100"
                    onClick={this.confirm}
                    disabled={isLoading}
                  >
                    <FormattedMessage id="button.book" />
                  </button>
                </div>
                <div className="col-6 col-sm-3">
                  <button
                    className="btn btn-danger w-100"
                    onClick={toggleModal}
                  >
                    <FormattedMessage id="button.cancel" />
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
    startLoading: () => dispatch(actions.startLoading()),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalConfirmPatient);
