import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { style, InputWrapperProps } from './index';
import ModeIcon from '@mui/icons-material/Mode';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../utils/hook';
import { loadUser } from '../../redux/actions/CRUD';

function UpdateModal(props: InputWrapperProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { selected, dataUser } = useAppSelector(
    (state: any) => state.CRUD_Reducers
  );
  const dispatch = useAppDispatch();

  const fetchUser = React.useCallback(() => {
    handleOpen();
    selected.length === 1 && dispatch(loadUser(selected[0]));
  }, [selected]);

  return (
    <div>
      <Button onClick={fetchUser} color="success" variant="outlined">
        <ModeIcon color="warning" />
        Update
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4" fontWeight="700" align="center">
            Update user
          </Typography>
          <br />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            fullWidth
            required
            value={dataUser && dataUser.user && dataUser.user.email}
            disabled
          />
          <div className="my-2"></div>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small-label">Gender</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              // value={this.state.value}
              label="Gender"
              value={dataUser && dataUser.user && dataUser.user.gender}
              // onChange={this.handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <div className="my-2"></div>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            value={dataUser && dataUser.user && dataUser.user.name}
          />
          <div className="my-2"></div>
          <TextField
            label="Address"
            variant="outlined"
            size="small"
            fullWidth
            value={dataUser && dataUser.user && dataUser.user.address}
          />
          <div className="my-2"></div>
          <div className="d-flex">
            <FormControl sx={{ width: '48%' }} size="small">
              <InputLabel id="demo-select-small-label">TypeId</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={dataUser && dataUser.user && dataUser.user.typeId}
                label="TypeId"
                // onChange={this.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: '48%', marginLeft: 'auto' }} size="small">
              <InputLabel id="demo-select-small-label">PositionId</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                // value={this.state.value}
                value={dataUser && dataUser.user && dataUser.user.positionId}
                label="PositionId"
                // onChange={this.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="my-2"></div>
          <TextField
            label="Avatar"
            variant="outlined"
            size="small"
            fullWidth
            value={dataUser && dataUser.user && dataUser.user.avatar}
          />
          <div className="my-4"></div>
          <Button variant="outlined" className="w-100">
            Update
          </Button>

          {/* </CardContent> */}
        </Box>
      </Modal>
    </div>
  );
}
export default React.memo(UpdateModal);
