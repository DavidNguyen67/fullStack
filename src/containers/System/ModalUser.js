import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './userManage.scss';
import validator from 'validator';
import { toast } from 'react-toastify';
import _ from 'lodash';

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
      [event.target.name]: ['address', 'lastname', 'firstname'].includes(
        event.target.name.toLowerCase()
      )
        ? event.target.value
        : event.target.value.trim(),
    });
  };

  handleActionUser = async () => {
    function exclude(user, keys) {
      return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
      );
    }

    switch (this.props?.typeModel) {
      case CREATE:
        if (
          this.state.email &&
          this.state.password &&
          this.state.firstName &&
          this.state.lastName
        ) {
          if (validator.isEmail(this.state.email)) {
            await this.props.createUser(this.state);
            this.setState({
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              address: '',
            });
            return this.props.toggle();
          } else toast.error('Some fields are not allowed');
        } else toast.error('Some fields are required');
        break;

      case DELETE:
        await this.props.deleteUser(this.state.id?.toString());
        return this.props.toggle();

      case UPDATE:
        if (
          _.isEqual(
            this.state,
            exclude(this.props.dataUser, ['createAt', 'updateAt'])
          )
        )
          return this.props.toggle();

        let payload = null;
        if (this.state.email === this.props.dataUser?.email) {
          payload = exclude(this.state, ['email']);
        } else payload = this.state;
        if (!Array.isArray(payload)) payload = [payload];
        await this.props.updateUser(payload);
        return this.props.toggle();

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
        // This line is necessary for formatted data to update bulk users
        data[data.length - 1] = { ...data[data.length - 1], ...this.state };

        await this.props.updateUser(data);
        return this.props.toggle();

      default:
        break;
    }
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className="modal-user-container"
        >
          <ModalHeader toggle={this.props.toggle}>
            {this.props.typeModel === DELETE ? (
              <FormattedMessage id={'button.delete'} />
            ) : this.props.typeModel === CREATE ? (
              <FormattedMessage id={'button.create'} />
            ) : (
              <FormattedMessage id={'button.update'} />
            )}
          </ModalHeader>
          <ModalBody
            onKeyPress={(event) => {
              return event.which === 13 && this.handleActionUser();
            }}
          >
            <div className="model-user-body">
              <div
                className={
                  this.props.typeModel === UPDATE_MANY ||
                  this.props.typeModel === UPDATE ||
                  this.props.typeModel === DELETE
                    ? 'input-container w-100'
                    : 'input-container'
                }
              >
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChangeInput}
                  disabled={
                    this.props.typeModel === DELETE ||
                    this.props.typeModel === UPDATE_MANY
                  }
                />
              </div>
              {this.props.typeModel === UPDATE_MANY ||
              this.props.typeModel === UPDATE ||
              this.props.typeModel === DELETE ? (
                <></>
              ) : (
                <div className="input-container">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChangeInput}
                    disabled={this.props.typeModel === DELETE}
                  />
                </div>
              )}
              <div className="input-container">
                <label>
                  <FormattedMessage id={'title.table.firstName'} />
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleChangeInput}
                  disabled={this.props.typeModel === DELETE}
                />
              </div>
              <div className="input-container flex-grow-1">
                <label>
                  <FormattedMessage id={'title.table.lastName'} />
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleChangeInput}
                  disabled={this.props.typeModel === DELETE}
                />
              </div>
              <div className="input-container w-100">
                <label>
                  <FormattedMessage id={'title.table.address'} />
                </label>
                <input
                  type="text"
                  name="address"
                  value={this.state.address}
                  onChange={this.handleChangeInput}
                  disabled={this.props.typeModel === DELETE}
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
              {this.props.typeModel === DELETE
                ? DELETE
                : this.props.typeModel === CREATE
                ? CREATE
                : UPDATE}
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
