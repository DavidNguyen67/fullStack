import React from 'react';
import { connect } from 'react-redux';
import './../../style/table.scss';
import { loadUsers, selectedUser } from '../../redux/actions/CRUD';
import { IUser } from '../../interfaces/User.interface';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from '@mui/material';
import { Table } from 'react-bootstrap';
import DeleteModal from '../modals/deleteModal';
// import { UpdateModal } from '../modals';
import { NavLink } from 'react-router-dom';
import Example from '../modals/createModal';
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
    take: number;
  } = {
    page: 1,
    take: 5,
  };

  handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number = 1
  ) => {
    await this.props.fetchUsers({ page: value, take: this.state.take });
    this.setState({ ...this.state, page: value });
  };
  handleClickSelect = (userId: number) => {
    this.props.selectedUser(userId);
  };
  handleChangeStateTake = (event: any) => {
    this.setState({ ...this.state, take: event.target.value });
  };

  componentDidMount = async () => {
    await this.props.fetchUsers({
      page: this.state.page,
      take: this.state.take,
    });
  };
  componentDidUpdate = async (
    prevProps: Readonly<Props>,
    prevState: any,
    snapshot?: any
  ) => {
    if (
      prevState.page !== this.state.page ||
      prevState.take !== this.state.take
    )
      await this.props.fetchUsers({
        page: this.state.page,
        take: this.state.take,
      });
  };
  render(): React.ReactNode {
    return (
      <>
        <div className="d-flex justify-content-end">
          {/* <UpdateModal page={this.state.page} take={this.state.take} /> */}
          <Example />
          <div className="mx-2"></div>
          <DeleteModal page={this.state.page} take={this.state.take} />
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
                    <Typography variant="subtitle2" className="truncate-text">
                      {data.email}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle2" className="truncate-text">
                      {data.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle2" className="truncate-text">
                      {data.gender}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle2" className="truncate-text">
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
        <div className="d-flex align-content-center justify-content-center">
          <Typography>Page: {this.state.page}</Typography>
          <Pagination
            count={this.props.data && this.props.data.totalPage}
            showFirstButton
            showLastButton
            onChange={this.handleChange}
          />
          <FormControl
            sx={{ m: 1, minWidth: 120, marginLeft: 'auto' }}
            size="small"
          >
            <Select
              value={this.state.take}
              onChange={this.handleChangeStateTake}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
            <FormHelperText>Row per page</FormHelperText>
          </FormControl>
        </div>
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
