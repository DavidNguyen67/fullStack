import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './userManage.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import * as actions from './../../store/actions';
import ModalUser from './ModalUser';
import { Button } from 'reactstrap';
import ScrollToTop from 'react-scroll-to-top';
import { toast } from 'react-toastify';
import { deleteUsersService } from '../../services/userService';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import Pagination from 'react-js-pagination';
// import 'bootstrap/dist/css/bootstrap.min.css';

const COPY = 'COPY';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const DELETE = 'DELETE';
const READ = 'READ';

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      selected: [],
      modal: false,
      typeModal: '',
      activePage: 1,
    };
  }

  async componentDidMount() {
    await this.props.readUsers(this.state.activePage);
  }

  // async componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevState.activePage !== this.state.activePage) {
  //     const response = await this.props.readUsers(false, this.state.activePage);
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       response,
  //     }));
  //   }
  // }

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
    const { selected } = this.state;
    const hasSelected = selected.includes(dataUser.id);

    const handleDeleteUsers = (isMany) => {
      const deleteFunc = async () => {
        const { id } = dataUser;
        this.props.startLoading();
        const response = await deleteUsersService([id]);
        this.props.stopLoading();
        if (response.statusCode === 200 || response.status === 200) {
          toast.success(
            <FormattedMessage
              id="toast.successDeleteUser"
              values={{
                br: <br />,
              }}
              tagName="div"
            />
          );
          const response = await this.props.readUsers();
          this.setState((prevState) => ({
            ...prevState,
            response,
          }));
          return;
        }
        if (response.statusCode === 401 || response.status === 401) {
          toast.error('Ban khong co quyen thuc hien hanh dong nay');
          return;
        }
        toast.error(
          <FormattedMessage
            id="toast.errorDeleteUser"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
      };
      toast(
        <div className="m-2">
          <h4 style={{ color: 'black' }}>
            <FormattedMessage
              id={
                isMany ? 'toast.confirmDeleteUsers' : 'toast.confirmDeleteUser'
              }
            />
            <br />
            {!isMany ? <strong>{dataUser.firstName}</strong> : ''}
          </h4>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary"
              style={{ padding: '0 20px' }}
              onClick={deleteFunc}
            >
              <FormattedMessage id={'toast.confirmYes'} />
            </button>
            <div className="mx-2" />
            <button className="btn btn-danger" style={{ padding: '0 20px' }}>
              <FormattedMessage id={'toast.confirmNo'} />
            </button>
          </div>
        </div>,
        { pauseOnHover: true }
      );
      return;
    };

    if (this.state.selected.length < 2) {
      if (typeModal === DELETE) {
        handleDeleteUsers();
        return;
      }

      this.toggleModal(dataUser, typeModal);
    } else {
      if (hasSelected) {
        const { history } = this.props;
        switch (typeModal) {
          case COPY:
            history.push(`/system/users/copy:${selected}`);
            break;
          case UPDATE:
            history.push(`/system/users/update:${selected}`);
            break;
          case DELETE:
            history.push(`/system/users/delete:${selected}`);
            break;
          default:
            break;
        }
      } else {
        if (typeModal === DELETE) {
          handleDeleteUsers();
          return;
        }
        this.toggleModal(dataUser, typeModal);
      }
    }
  };

  handleSelectAll = () => {
    const { users } = this.props;
    const { selected } = this.state;
    let selectedUsers = [];
    if (selected.length < users.length) {
      users.forEach((user) => {
        selectedUsers = [...selectedUsers, user.id];
      });
      this.setState((prevState) => ({
        ...prevState,
        selected: selectedUsers,
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        selected: [],
      }));
    }
  };

  async handlePageChange(pageNumber) {
    await this.props.readUsers(pageNumber);
    this.setState({ activePage: pageNumber });
  }

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
          <button
            className="btn btn-primary"
            style={{ lineHeight: '14px' }}
            onClick={(event) => this.handleActionUsers('', CREATE)}
          >
            <span className="d-flex gap-2">
              <i className="fas fa-plus"></i>
              <FormattedMessage id={'button.create'} />
            </span>
          </button>
          <div className="mx-2" />
          <button
            className="btn btn-warning"
            style={{ lineHeight: '14px' }}
            onClick={() => {
              if (selected.length > 0) {
                const user = users.find((user) => selected[0] === user.id);
                this.handleActionUsers(user, UPDATE);
              } else {
                toast.error(<FormattedMessage id="toast.AtLestChoiceOne" />);
              }
            }}
          >
            <span className="d-flex gap-2">
              <i className="fas fa-pencil-alt"></i>
              <FormattedMessage id={'button.update'} />
            </span>
          </button>
          <div className="mx-2" />
          <button
            className="btn btn-danger"
            style={{ lineHeight: '14px' }}
            onClick={() => {
              if (selected.length > 0) {
                const user = users.find((user) => selected[0] === user.id);
                this.handleActionUsers(user, DELETE);
              } else {
                toast.error(<FormattedMessage id="toast.AtLestChoiceOne" />);
              }
            }}
          >
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
                <th>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="flexCheckDefault"
                      checked={
                        selected.length === users.length && users.length > 0
                      }
                      onChange={() => this.handleSelectAll()}
                    />
                  </div>
                </th>
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
                      <button
                        className="btn btn-danger"
                        onClick={() => this.handleActionUsers(user, DELETE)}
                      >
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
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={10}
            totalItemsCount={this.props.totalRecord}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.admin.users,
    totalRecord: state.admin.totalRecord,

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
    readUsers: (page) => dispatch(actions.readUsers(false, page)),
    deleteUsers: (ids) => dispatch(actions.deleteUsers(ids)),
    createNewUser: (payload) => dispatch(actions.createNewUser(payload)),
    updateUsers: (payload) => dispatch(actions.updateUsers(payload)),
    startLoading: () => dispatch(actions.startLoading()),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);