import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  IconButton,
  Icon,
  DialogActions,
  Button,
} from '@mui/material';

import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';

function DeleteButton({ dispatch, message, agreeAction }) {
  function confirmDelete() {
    dispatch(
      openDialog({
        children: (
          <>
            <DialogTitle id="alert-dialog-title">Confirm Delete?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(closeDialog())} color="primary">
                Disagree
              </Button>
              <Button
                onClick={() => {
                  agreeAction();
                  dispatch(closeDialog());
                }}
                color="primary"
                autoFocus
              >
                Agree
              </Button>
            </DialogActions>
          </>
        ),
      })
    );
  }

  return (
    <IconButton
      onClick={(ev) => {
        ev.stopPropagation();
        confirmDelete();
      }}
      size="large"
    >
      <Icon>delete</Icon>
    </IconButton>
  );
}

export default DeleteButton;
