import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './userManage.scss';
import {
  getAllUsers,
  createNewUser,
  deleteUsers,
  updateUsers,
} from '../../services/userService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ModalUser from './ModalUser';
import { toast } from 'react-toastify';

const CREATE = 'CREATE';
const DELETE = 'DELETE';
const UPDATE = 'UPDATE';
const UPDATE_MANY = 'UPDATE_MANY';

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      selected: [],
      isOpenModal: false,
      dataForModal: {},
      typeModel: '',
    };
  }

  fetchUsers = async () => {
    const response = await getAllUsers();
    this.setState({ arrUsers: response.data });
  };

  async componentDidMount() {
    await this.fetchUsers();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      !prevState.arrUsers.length === this.state.arrUsers.length &&
      !prevState.arrUsers.every(
        (value, index) => value === this.state.arrUsers[index]
      )
    )
      await this.fetchUsers();
  }

  handleClickSelect = (id, dataUser) => {
    this.setState((prevState) => {
      const { selected } = prevState;
      const updatedSelected = selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id];

      let newDataForModal = prevState.selected?.length === 0 ? dataUser : {};

      if (updatedSelected.length === 1)
        newDataForModal = this.state.arrUsers.find(
          (user) => user.id === updatedSelected[0]
        );

      return {
        selected: updatedSelected,
        dataForModal: newDataForModal,
      };
    });
  };

  handleAddNewUser = () => {
    this.setState({
      ...this.state,
      isOpenModal: true,
      typeModel: CREATE,
    });
  };

  toggleModal = () => {
    this.setState({
      ...this.state,
      isOpenModal: !this.state.isOpenModal,
    });
  };

  handleToastBaseOnStatusCode = (statusCode, message) => {
    switch (Math.floor(statusCode / 100)) {
      case 2:
        return toast.success(message);
      case 3:
        return toast.warn(message);
      default:
        return toast.error(message);
    }
  };

  handleCreateNewUser = async (payload) => {
    if (!Array.isArray(payload)) payload = [payload];
    const response = await createNewUser(payload);
    await this.fetchUsers();
    this.handleToastBaseOnStatusCode(
      response.data?.status || response.statusCode,
      response.data?.message || 'Success'
    );
  };

  handleDeleteUsers = async () => {
    const deleteFunc = async () => {
      const ids = this.state.selected.toString();
      const response = await deleteUsers(ids);
      await this.fetchUsers();
      this.handleToastBaseOnStatusCode(
        response.data?.status || response.statusCode,
        response.data?.message || 'Success'
      );
      this.setState({
        ...this.state,
        selected: [],
      });
    };
    if (this.state.selected.length > 1) {
      toast(
        <div className="m-2">
          <h3 style={{ fontWeight: 'bold', color: 'black' }}>
            Do you wanna delete those users
          </h3>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary"
              style={{ padding: '0 20px' }}
              onClick={deleteFunc}
            >
              Yes
            </button>
            <div className="mx-2" />
            <button className="btn btn-danger" style={{ padding: '0 20px' }}>
              No
            </button>
          </div>
        </div>,
        { pauseOnHover: true }
      );
      return;
    }
    if (this.state.selected.length === 1) {
      this.setState({
        ...this.state,
        isOpenModal: !this.state.isOpenModal,
        typeModel: DELETE,
      });
      return;
    }
    toast.error('Must be at least one user selected');
  };

  deleteFunc = async (id) => {
    const response = await deleteUsers(id);
    if (Math.floor(response.data?.status || response.statusCode / 100) === 2) {
      await this.fetchUsers();
    }
    console.log('Rn here');
    this.handleToastBaseOnStatusCode(
      response.data?.status || response.statusCode,
      response.data?.message || 'Success'
    );
  };

  updateFunc = async (payload) => {
    const response = await updateUsers(payload);
    await this.fetchUsers();
    this.handleToastBaseOnStatusCode(
      response.data?.status || response.statusCode,
      response.data?.message || (response.data > 0 && 'Success')
    );
  };

  handleUpdateUser = async () => {
    if (this.state.selected.length === 1) {
      this.setState({
        ...this.state,
        isOpenModal: !this.state.isOpenModal,
        typeModel: UPDATE,
      });
      return;
    }
    if (this.state.selected.length > 1) {
      this.setState({
        ...this.state,
        isOpenModal: !this.state.isOpenModal,
        typeModel: UPDATE_MANY,
      });
      return;
    }
    toast.error('Only accept one user selected');
  };

  handleSetSelectedUser = () => {
    console.log('Run here');
    this.setState({
      ...this.state,
      selected: [],
    });
  };

  render() {
    return (
      <div className="users-container">
        <ModalUser
          isOpen={this.state.isOpenModal}
          toggle={this.toggleModal}
          createUser={this.handleCreateNewUser}
          dataUser={
            this.state.typeModel !== CREATE &&
            this.state.typeModel !== UPDATE_MANY &&
            this.state.dataForModal
          }
          typeModel={this.state.typeModel}
          deleteUser={this.deleteFunc}
          updateUser={this.updateFunc}
          selected={this.state.selected}
          handleSetSelectedUser={this.handleSetSelectedUser}
        />
        <div className="title text-center">Manage users</div>
        <div className="flex-grow-1 d-flex">
          <div className="ms-auto" />
          <button
            className="btn btn-primary py-1 px-3"
            style={{ lineHeight: '14px' }}
            onClick={this.handleAddNewUser}
          >
            <i className="fas fa-plus"></i>
            Add new user
          </button>
          <div className="mx-2" />
          <button
            className="btn btn-warning py-1 px-3"
            style={{ lineHeight: '14px' }}
            onClick={this.handleUpdateUser}
          >
            <i className="fas fa-pencil-alt"></i>
            Edit
          </button>
          <div className="mx-2" />
          <button
            className="btn btn-danger py-1 px-3"
            style={{ lineHeight: '14px' }}
            onClick={this.handleDeleteUsers}
          >
            <i className="fas fa-trash"></i>
            Delete
          </button>
        </div>
        <br />
        <div className="users-table">
          <table id="customers" style={{ overflowX: 'scroll' }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state?.arrUsers ? (
                this.state?.arrUsers?.length > 0 &&
                this.state?.arrUsers?.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.address}</td>
                    <td>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          value={user.id}
                          className="flexCheckDefault"
                          checked={this.state?.selected?.includes(user.id)}
                          onChange={() => this.handleClickSelect(user.id, user)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
                    <Skeleton count={5} />
                  </td>
                  <td>
                    <Skeleton count={5} />
                  </td>
                  <td>
                    <Skeleton count={5} />
                  </td>
                  <td>
                    <Skeleton count={5} />
                  </td>
                  <td>
                    <Skeleton count={5} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
