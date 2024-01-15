import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageClinic.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { createClinic } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      address: '',
      descriptionHTML_VI: '',
      contentMarkdown_VI: '',
      descriptionHTML_EN: '',
      contentMarkdown_EN: '',
      isLoading: false,
      isFailed: false,
    };
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

  submit = async () => {
    const {
      name,
      image,
      descriptionHTML_EN,
      contentMarkdown_EN,
      descriptionHTML_VI,
      contentMarkdown_VI,
      address,
    } = this.state;

    try {
      const base64String = await CommonUtils.getBase64(image);

      const payload = {
        name,
        image: base64String,
        address,
        descriptionHTML_EN,
        contentMarkdown_EN,
        descriptionHTML_VI,
        contentMarkdown_VI,
      };

      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      this.setState((prevState) => ({
        ...prevState,
        isLoading: true,
        isFailed: false,
      }));

      const response = await createClinic(payload);

      if (response) {
        if (response.statusCode === 200) {
          this.setState((prevState) => ({
            ...prevState,
            name: '',
            address: '',
            descriptionHTML_VI: '',
            contentMarkdown_VI: '',
            descriptionHTML_EN: '',
            contentMarkdown_EN: '',
            isLoading: false,
            isFailed: false,
          }));
          toast.success('Success!');
          return;
        } else
          this.setState((prevState) => ({
            ...prevState,
            isFailed: true,
            isLoading: false,
          }));
        toast.error('Failed');
        return;
      }
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  render() {
    const { name, isLoading, address, contentMarkdown_VI, contentMarkdown_EN } =
      this.state;

    return (
      <>
        <div className="manage-specialty-container">
          <div className="ms-title">Quan ly chuyen khoa</div>
          <div className="add-new-specialty">
            <div className="row">
              <div className="col-6 col-lg-3 form-group">
                <label>Chuyen hoa</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange.name}
                />
              </div>
              <div className="col-6 col-lg-3 form-group">
                <label>Chuyen hoa</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={this.handleChange.img}
                />
              </div>
              <div className="col-12 col-lg-6 form-group">
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
              <div className="col-12 col-lg-6 form-group">
                <label>Vi</label>
                <MdEditor
                  style={{ height: '300px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleChange.editorVi}
                  value={contentMarkdown_VI}
                />
              </div>
              <div className="col-12 col-lg-6 form-group">
                <label>En</label>
                <MdEditor
                  style={{ height: '300px' }}
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
                  className="btn btn-primary"
                  onClick={this.submit}
                  disabled={isLoading}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
