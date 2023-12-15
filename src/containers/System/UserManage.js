import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './userManage.scss';
import { getAllUsers } from '../../services/userService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      selected: [],
    };
  }

  async componentDidMount() {
    const response = await getAllUsers();
    console.log(response);
    this.setState({ arrUsers: response.data });
  }
  handleClickSelect = (id) => {
    this.setState((prevState) => {
      const { selected } = prevState;
      const updatedSelected = selected?.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id];

      return {
        selected: updatedSelected,
      };
    });
  };

  render() {
    return (
      <div className="users-container">
        <div className="title text-center">Manage users</div>
        <div className="flex-grow-1 d-flex">
          <button
            className="ms-auto btn btn-warning py-1 px-3 line-he"
            style={{ lineHeight: '14px' }}
          >
            <i className="fas fa-pencil-alt"></i>
            Edit
          </button>
          <div className="mx-2" />
          <button
            className="btn btn-danger py-1 px-3 line-he"
            style={{ lineHeight: '14px' }}
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
                          onChange={() => this.handleClickSelect(user.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <Skeleton count={5} />
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
