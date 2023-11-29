import * as React from 'react';
import Button from '@mui/material/Button';
import { InputWrapperProps } from './index';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import { Typography } from '@mui/material';
import { deleteUsers } from '../../redux/actions/CRUD';
import { useAppDispatch, useAppSelector } from '../../utils/hook';
import { memo } from 'react';

function DeleteModal(props: InputWrapperProps) {
  const { selected } = useAppSelector((state: any) => state.CRUD_Reducers);
  const dispatch = useAppDispatch();

  const showToastForSubmitChange = () => {
    if (selected.length < 1) {
      toast.error(`Please select at least one user`, {
        duration: 3000,
      });
      return;
    }
    toast((t: any) => {
      // toast.dismiss();
      t.duration = 5000;
      const toastDismiss = (toastId: any) => {
        toast.dismiss(toastId);
      };

      return (
        <>
          <div>
            <Typography variant="body1">
              Are you wanna apply the newest changes for {''}
              <b>{selected.length}</b> users?
            </Typography>
            <div className="mt-2 w-100 d-flex justify-content-center">
              <Button
                color="success"
                variant="outlined"
                onClick={() => {
                  dispatch(deleteUsers(selected));
                  toastDismiss(t.id);
                }}
              >
                <Typography variant="caption">Yes</Typography>
              </Button>
              <div className="mx-2"></div>
              <Button
                color="error"
                variant="outlined"
                onClick={() => toastDismiss(t.id)}
              >
                <Typography variant="caption">No</Typography>
              </Button>
            </div>
          </div>
        </>
      );
    });
  };
  const submitDelete = React.useCallback(() => {
    showToastForSubmitChange();
  }, [selected]);

  return (
    <div>
      <Button onClick={submitDelete} color="error" variant="outlined">
        <DeleteIcon color="info" />
        Delete
      </Button>
    </div>
  );
}

export default memo(DeleteModal);
