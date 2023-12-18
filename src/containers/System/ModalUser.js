import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './userManage.scss';
import validator from 'validator';
import { toast } from 'react-toastify';

const CREATE = 'CREATE';
const DELETE = 'DELETE';
const UPDATE = 'UPDATE';
const UPDATE_MANY = 'UPDATE_MANY';
class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // modal: this.props.isOpen,
      id: null,
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
      if (
        this.props.typeModel === CREATE ||
        this.props.typeModel === UPDATE_MANY
      ) {
        this.setState({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          address: '',
        });
        return;
      }
      this.setState({
        id: this.props.dataUser?.id,
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

  handleActionUser = async () => {
    switch (this.props?.typeModel) {
      case CREATE:
        if (
          this.state.email &&
          this.state.password &&
          this.state.firstName &&
          this.state.lastName
        )
          validator.isEmail(this.state.email) &&
            validator.isAlpha(this.state.firstName) &&
            validator.isAlpha(this.state.lastName) &&
            (await this.props.createUser(this.state));
        else toast.error('Some fields are not allowed');
        break;
      case DELETE:
        await this.props.deleteUser(this.state.id?.toString());
        break;
      case UPDATE:
        let payload = null;
        if (this.state.email === this.props.dataUser?.email) {
          function exclude(user, keys) {
            return Object.fromEntries(
              Object.entries(user).filter(([key]) => !keys.includes(key))
            );
          }
          payload = exclude(this.state, ['email']);
        }
        if (!Array.isArray(payload)) payload = [payload];
        await this.props.updateUser(payload);
        break;
      case UPDATE_MANY:
        Object.keys(this.state).forEach(
          (key) => !this.state[key] && delete this.state[key]
        );
        if (this.state.email) {
          toast.error('Email cannot be bulk update');
          return this.props.toggle();
        }
        let data = [];
        this.props.selected?.forEach((element) => {
          data = [...data, { id: element }];
        });
        data[data.length - 1] = { ...data[data.length - 1], ...this.state };
        await this.props.updateUser(data);
        break;
      default:
        break;
    }
    return this.props.toggle();
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
              return event.which === 13 && this.handleActionUser();
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
              onClick={this.handleActionUser}
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
