import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
    open: boolean;
    handleClose: () => void;
    handleDelete: () => void;
    name?: string;
}

export default function AlertDialog({ open, name, handleClose, handleDelete }: AlertDialogProps) {

  const handleDeleteClick = () => {
    handleDelete();
    handleClose();
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete ${name}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            When you delete this Rider it cannot be undone and all of the orders he delivered will be untraceable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteClick} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  );
}
