import React from 'react';
import { connect } from 'react-redux';
import './../../style/table.scss';
import { loadUsers } from '../../redux/actions/CRUD';
import { IUser } from '../../interfaces/User.interface';
import { Button, Pagination, Typography } from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table } from 'react-bootstrap';

interface Props {
  data: IUser[];
  fetchUsers: () => Promise<object[]>;
}

// class Home extends React.Component {
class Home extends React.Component<Props> {
  state = {
    page: 2,
  };

  handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    this.setState({ ...this.state, page: value });
  };

  componentDidMount = async () => {
    await this.props.fetchUsers();
  };
  render(): React.ReactNode {
    return (
      <>
        <Table responsive id="customers">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.length > 0 &&
              this.props.data.map((data, index) => (
                <tr key={data.id}>
                  <td>{index + 1}</td>
                  <td>{data.email}</td>
                  <td>{data.name}</td>
                  <td>{data.gender}</td>
                  <td>{data.address || 'Unknown'}</td>
                  <td>
                    <div className="d-flex">
                      <Button variant="outlined" color="success">
                        <ModeIcon color="warning" />
                        Update
                      </Button>
                      <div className="mx-2"></div>
                      <Button variant="outlined" color="error">
                        <DeleteIcon color="info" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Typography>Page: {this.state.page}</Typography>
        <Pagination
          count={10}
          showFirstButton
          showLastButton
          onChange={this.handleChange}
        />
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { data } = state.CRUD_Reducers;
  // console.log(state.CRUD_Reducers);
  // console.log(data);

  /**
   *! Async login in redux used with class Component typescript need to fixed
   *! Class Component used without hook can not be async function
   */

  return {
    data,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchUsers: () => dispatch(loadUsers()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
