import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './userManage.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ModalUser from './ModalUser';
import { toast } from 'react-toastify';
import * as actions from './../../store/actions';

const CREATE = 'CREATE';
const DELETE = 'DELETE';
const UPDATE = 'UPDATE';
const UPDATE_MANY = 'UPDATE_MANY';

const ToastDeleteComponent = () => {
  const deleteFunc = async () => {
    const ids = this.state.selected.toString();
    await this.props.deleteUsers(ids);

    const { isErrorDelete } = this.props;

    console.log(this.props.isErrorDelete);
    if (!isErrorDelete) {
      this.setState({
        ...this.state,
        selected: [],
      });
      await this.props.readUsers();
      toast.success(<FormattedMessage id="toast.successDeleteUser" />);
    } else {
      toast.error(<FormattedMessage id="toast.errorDeleteUser" />);
    }
  };
  return (
    <div className="m-2">
      <h3 style={{ fontWeight: 'bold', color: 'black' }}>
        <FormattedMessage id="confirmDeleteUsers" />
      </h3>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary"
          style={{ padding: '0 20px' }}
          onClick={deleteFunc}
        >
          <FormattedMessage id="toast.confirmYes" />
        </button>
        <div className="mx-2" />
        <button className="btn btn-danger" style={{ padding: '0 20px' }}>
          <FormattedMessage id="toast.confirmNo" />
        </button>
      </div>
    </div>
  );
};
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

  async componentDidMount() {
    await this.props.readUsers();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.users.length !== this.props.users.length)
      await this.props.readUsers();
  }

  handleClickSelect = (id, dataUser) => {
    this.setState((prevState) => {
      const { selected } = prevState;
      const updatedSelected = selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id];

      let newDataForModal = prevState.selected?.length === 0 ? dataUser : {};

      if (updatedSelected.length === 1)
        newDataForModal = this.props.users.find(
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

  handleCreateNewUser = async (payload) => {
    if (!Array.isArray(payload)) payload = [payload];
    await this.props.createNewUser(payload);

    const { isErrorCreate } = this.props;
    if (!isErrorCreate) {
      await this.props.readUsers();
      toast.success(<FormattedMessage id="toast.successCreateUser" />);
    } else {
      toast.error(<FormattedMessage id="toast.errorCreateUser" />);
    }
  };

  handleDeleteUsers = async () => {
    if (this.state.selected.length > 1) {
      toast(<ToastDeleteComponent />, { pauseOnHover: true });
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
    toast.error(<FormattedMessage id="selectOneUserAtLeast" />);
  };

  deleteFunc = async (id) => {
    await this.props.deleteUsers(id);
    const { isErrorDelete } = this.props;

    if (!isErrorDelete) {
      this.setState({
        ...this.state,
        selected: [],
      });
      await this.props.readUsers();
      toast.success(<FormattedMessage id="toast.successDeleteUser" />);
    } else {
      toast.error(<FormattedMessage id="toast.errorDeleteUser" />);
    }
  };

  updateFunc = async (payload) => {
    await this.props.updateUsers(payload);
    const { isErrorUpdate } = this.props;

    if (!isErrorUpdate) {
      await this.props.readUsers();
      toast.success(<FormattedMessage id="toast.successUpdateUser" />);
    } else {
      toast.error(<FormattedMessage id="toast.successUpdateUser" />);
    }
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
    toast.error(<FormattedMessage id="selectOneUserAtLeast" />);
  };

  handleSetSelectedUser = () => {
    this.setState({
      ...this.state,
      selected: [],
    });
  };

  render() {
    const { users } = this.props;
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
        <div className="title text-center">
          <FormattedMessage id={'title.manageUser'} />
        </div>
        <div className="flex-grow-1 d-flex">
          <div className="ms-auto" />
          <button
            className="btn btn-primary"
            style={{ lineHeight: '14px' }}
            onClick={this.handleAddNewUser}
          >
            <i className="fas fa-plus"></i>
            <FormattedMessage id={'button.create'} />
          </button>
          <div className="mx-2" />
          <button
            className="btn btn-warning"
            style={{ lineHeight: '14px' }}
            onClick={this.handleUpdateUser}
          >
            <i className="fas fa-pencil-alt"></i>
            <FormattedMessage id={'button.update'} />
          </button>
          <div className="mx-2" />
          <button
            className="btn btn-danger"
            style={{ lineHeight: '14px' }}
            onClick={this.handleDeleteUsers}
          >
            <i className="fas fa-trash"></i>
            <FormattedMessage id={'button.delete'} />
          </button>
        </div>
        <br />
        <div className="users-table">
          <table id="customers" style={{ overflowX: 'scroll' }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>
                  <FormattedMessage id={'title.table.firstName'} />
                </th>
                <th>
                  <FormattedMessage id={'title.table.lastName'} />
                </th>
                <th>
                  <FormattedMessage id={'title.table.address'} />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users ? (
                users?.length > 0 &&
                users?.map((user) => (
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
  return {
    users: state.admin.users,

    isLoadingCreate: state.admin.isLoadingCreate,
    isErrorCreate: state.admin.isErrorCreate,

    isLoadingRead: state.admin.isLoadingRead,
    isErrorRead: state.admin.isErrorRead,

    isLoadingUpdate: state.admin.isLoadingUpdate,
    isErrorUpdate: state.admin.isErrorUpdate,

    isLoadingDelete: state.admin.isLoadingDelete,
    isErrorDelete: state.admin.isErrorDelete,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readUsers: () => dispatch(actions.readUsers()),
    deleteUsers: (ids) => dispatch(actions.deleteUsers(ids)),
    createNewUser: (payload) => dispatch(actions.createNewUser(payload)),
    updateUsers: (payload) => dispatch(actions.updateUsers(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
