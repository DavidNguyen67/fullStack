import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './userManage.scss';
import validator from 'validator';

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // modal: this.props.isOpen,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dataUser !== prevProps.dataUser) {
      this.setState({
        email: this.props.dataUser?.email,
        password: this.props.dataUser?.password,
        firstName: this.props.dataUser?.firstName,
        lastName: this.props.dataUser?.lastName,
        address: this.props.dataUser?.address,
      });
    }
  }

  handleChangeInput = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value.trim(),
    });
  };

  isValidState = () => {
    if (
      this.state.email &&
      this.state.password &&
      this.state.firstName &&
      this.state.lastName
    ) {
      return (
        validator.isEmail(this.state.email) &&
        validator.isAlpha(this.state.firstName) &&
        validator.isAlpha(this.state.lastName)
      );
    }
  };
  handleAddNewUser = async (event) => {
    if (this.isValidState()) {
      await this.props.createUser(this.state);
      this.setState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
      });
      return this.props.toggle();
    }
  };

  render() {
    console.log(this.props);
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className="modal-user-container"
        >
          <ModalHeader toggle={this.props.toggle}>Modal title</ModalHeader>
          <ModalBody
            onKeyPress={(event) => {
              return event.which === 13 && this.handleAddNewUser();
            }}
          >
            <div className="model-user-body">
              <div className="input-container">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChangeInput}
                />
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChangeInput}
                />
              </div>
              <div className="input-container">
                <label>FirstName</label>
                <input
                  type="text"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleChangeInput}
                />
              </div>
              <div className="input-container">
                <label>LastName</label>
                <input
                  type="text"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleChangeInput}
                />
              </div>
              <div className="input-container w-100">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={this.state.address}
                  onChange={this.handleChangeInput}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="px-2"
              onClick={this.handleAddNewUser}
            >
              Do Something
            </Button>
            <Button
              color="secondary"
              className="px-2"
              onClick={this.props.toggle}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
