import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './userManage.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import * as actions from './../../store/actions';
import ModalUser from './ModalUser';
import { Button } from 'reactstrap';
import ScrollToTop from 'react-scroll-to-top';

const COPY = 'COPY';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const DELETE = 'DELETE';
const REAAD = 'READ';
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      selected: [],
      modal: false,
      typeModal: '',
    };
  }

  async componentDidMount() {
    const response = await this.props.readUsers();
    this.setState((prevState) => ({
      ...prevState,
      response,
    }));
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.users.length !== this.props.users.length)
  //     await this.props.readUsers();
  // }

  toggleModal = (dataUser, typeModal) => {
    this.setState((prevState) => ({
      ...prevState,
      user: dataUser,
      modal: !this.state.modal,
      typeModal,
    }));
  };

  handleClickSelect = (id, dataUser) => {
    this.setState((prevState) => {
      const { selected } = prevState;
      const updatedSelected = selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id];

      return {
        ...prevState,
        selected: updatedSelected,
      };
    });
  };
  handleCopyUser = (dataUser) => {
    console.log(dataUser);
  };

  handleActionUsers = (dataUser, typeModal) => {
    if (this.state.selected.length < 2) this.toggleModal(dataUser, typeModal);
    else {
      const { selected } = this.state;
      const hasSelected = selected.includes(dataUser.id);

      if (hasSelected) {
        const { history } = this.props;
        switch (typeModal) {
          case COPY:
            history.push(`/system/users/copy:${selected}`);
            break;
          case UPDATE:
            history.push(`/system/users/update:${selected}`);
            break;
          default:
            break;
        }
      } else {
        this.toggleModal(dataUser, typeModal);
      }
    }
  };

  render() {
    const { users, isLoadingRead, isErrorRead } = this.props;
    const { modal, selected, user, typeModal } = this.state;

    if (isLoadingRead) {
      return <>Loading...</>;
    }

    if (isErrorRead) {
      return <>Error...</>;
    }

    return (
      <div className="users-container">
        <ScrollToTop smooth color="#6f00ff" />
        <ModalUser
          modal={modal}
          toggleModal={this.toggleModal}
          selected={selected}
          user={user}
          typeModal={typeModal}
        />
        <div className="title text-center">
          <FormattedMessage id={'title.manageUser'} />
        </div>
        <div className="flex-grow-1 d-flex">
          <button className="btn btn-primary" style={{ lineHeight: '14px' }}>
            <span className="d-flex gap-2">
              <i className="fas fa-plus"></i>
              <FormattedMessage id={'button.create'} />
            </span>
          </button>
          <div className="mx-2" />
          <button className="btn btn-warning" style={{ lineHeight: '14px' }}>
            <span className="d-flex gap-2">
              <i className="fas fa-pencil-alt"></i>
              <FormattedMessage id={'button.update'} />
            </span>
          </button>
          <div className="mx-2" />
          <button className="btn btn-danger" style={{ lineHeight: '14px' }}>
            <span className="d-flex gap-2">
              <i className="fas fa-trash"></i>
              <FormattedMessage id={'button.delete'} />
            </span>
          </button>
          <div className="me-auto" />
        </div>
        <br />
        <div className="users-table">
          <table id="customers" style={{ overflowX: 'scroll' }}>
            <thead>
              <tr>
                <th></th>
                <th>
                  <FormattedMessage id={'title.table.action'} />
                </th>
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
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) &&
                users.length > 0 &&
                users?.map((user) => (
                  <tr key={user.id}>
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
                    <td>
                      <Button
                        color="success"
                        onClick={() => this.handleActionUsers(user, COPY)}
                      >
                        <span className="d-flex gap-1 align-items-center">
                          <i className="fas fa-copy"></i>
                          <FormattedMessage id={'button.copy'} />
                        </span>
                      </Button>
                      <button
                        className="btn btn-warning mx-4"
                        onClick={() => this.handleActionUsers(user, UPDATE)}
                      >
                        <span className="d-flex gap-1 align-items-center">
                          <i className="fas fa-pencil-alt"></i>
                          <FormattedMessage id={'button.update'} />
                        </span>
                      </button>
                      <button className="btn btn-danger">
                        <span className="d-flex gap-1 align-items-center">
                          <i className="fas fa-trash" />
                          <FormattedMessage id={'button.delete'} />
                        </span>
                      </button>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.address}</td>
                  </tr>
                ))}
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
