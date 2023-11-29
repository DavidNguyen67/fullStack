import React from 'react';
import { connect } from 'react-redux';
import './../../style/table.scss';
import { loadUsers, selectedUser } from '../../redux/actions/CRUD';
import { IUser } from '../../interfaces/User.interface';
import { Checkbox, Pagination, Typography } from '@mui/material';
import { Table } from 'react-bootstrap';
import DeleteModal from '../modals/deleteModal';
import { UpdateModal } from '../modals';
import { NavLink } from 'react-router-dom';

interface Props {
  data: {
    data: IUser[];
    totalPage: number;
    skip: number;
  };
  selected: number[];
  fetchUsers: (payload?: { page: number; take: number }) => Promise<object[]>;
  selectedUser: (payload: number) => void;
}

// class Home extends React.Component {
class Home extends React.Component<Props> {
  state: {
    page: number;
  } = {
    page: 1,
  };

  handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number = 1
  ) => {
    await this.props.fetchUsers({ page: value, take: 5 });
    this.setState({ ...this.state, page: value });
  };
  handleClickSelect = (userId: number) => {
    this.props.selectedUser(userId);
  };

  componentDidMount = async () => {
    await this.props.fetchUsers({ page: this.state.page, take: 5 });
  };
  render(): React.ReactNode {
    return (
      <>
        <div className="d-flex justify-content-end">
          <UpdateModal />
          <div className="mx-2"></div>
          <DeleteModal />
        </div>
        <div className="my-2"></div>
        <Table responsive id="customers">
          <thead>
            <tr>
              <th>
                <Typography variant="h5">#</Typography>
              </th>
              <th>
                <Typography variant="h5">Email</Typography>
              </th>
              <th>
                <Typography variant="h5">Name</Typography>
              </th>
              <th>
                <Typography variant="h5">Gender</Typography>
              </th>
              <th>
                <Typography variant="h5">Address</Typography>
              </th>
              <th>
                <Typography variant="h5">Actions</Typography>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.data &&
              this.props.data.data &&
              this.props.data.data.length > 0 &&
              this.props.data.data.map((data, index) => (
                <tr key={data.id}>
                  <td>{this.props.data && this.props.data.skip + index + 1}</td>
                  <td>
                    <Typography variant="subtitle1" className="truncate-text">
                      {data.email}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle1" className="truncate-text">
                      {data.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle1" className="truncate-text">
                      {data.gender}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle1" className="truncate-text">
                      {data.address || 'unknown'}
                    </Typography>
                  </td>
                  <td>
                    <NavLink to={'/'}>Detail</NavLink>
                  </td>
                  <td>
                    <Checkbox
                      checked={this.props.selected.includes(data.id)}
                      onClick={() => this.handleClickSelect(data.id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Typography>Page: {this.state.page}</Typography>
        <Pagination
          count={this.props.data && this.props.data.totalPage}
          showFirstButton
          showLastButton
          onChange={this.handleChange}
        />
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { data, selected } = state.CRUD_Reducers;
  return {
    data,
    selected,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchUsers: (payload: any) => dispatch(loadUsers(payload)),
    selectedUser: (payload: number) => dispatch(selectedUser(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
