import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageSpecialty.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from './../../../utils/CommonUtils';
import { createSpecialty } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
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
    img: (event) => {
      this.setState((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.files[0],
      }));
    },
    editor: ({ html, text }) => {
      this.setState((prevState) => ({
        ...prevState,
        descriptionHTML: html,
        descriptionMarkdown: text,
      }));
    },
  };

  submit = async () => {
    const { name, image, descriptionHTML, descriptionMarkdown } = this.state;
    const { lang } = this.props;

    try {
      const base64String = await CommonUtils.getBase64(image);

      const payload = {
        name,
        image: base64String,
      };

      const langSpecificKeys =
        lang === LANGUAGES.VI
          ? {
              descriptionHTML_VI: descriptionHTML,
              contentMarkdown_VI: descriptionMarkdown,
            }
          : {
              descriptionHTML_EN: descriptionHTML,
              contentMarkdown_EN: descriptionMarkdown,
            };

      Object.assign(payload, langSpecificKeys);

      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      this.setState((prevState) => ({
        ...prevState,
        isLoading: true,
        isFailed: false,
      }));

      const response = await createSpecialty(payload);

      if (response) {
        if (response.statusCode === 200) {
          this.setState((prevState) => ({
            ...prevState,
            name: '',
            image: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            isLoading: false,
            isFailed: false,
          }));
          return;
        } else
          this.setState((prevState) => ({
            ...prevState,
            isFailed: true,
            isLoading: false,
          }));
        return;
      }
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  render() {
    const { name, descriptionMarkdown, isLoading } = this.state;

    return (
      <>
        <div className="manage-specialty-container">
          <div className="ms-title">Quan ly chuyen khoa</div>
          <div className="add-new-specialty">
            <div className="row">
              <div className="col-6 form-group">
                <label>Chuyen hoa</label>
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
            </div>
            <br />
            <div className="row">
              <div className="col-12">
                <MdEditor
                  style={{ height: '300px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleChange.editor}
                  value={descriptionMarkdown}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
