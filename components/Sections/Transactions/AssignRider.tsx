import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
// apollo
import { Rider, GET_RIDER_BY_AREA, ASSIGN_ORDER } from "../../../apollo/riders";
import { useMutation, useQuery } from '@apollo/client';
import { Orders } from '../../../apollo/orders';

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: number | null) => void;
  riders: Rider[];
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, riders } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (value: number) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Assign Rider</DialogTitle>
      <List sx={{ pt: 0 }}>
        {riders.map((rider) => (
          <ListItem button onClick={() => handleListItemClick(rider.riderId)} key={rider.riderId}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={rider.riderName} secondary={rider.riderContact} />
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={() => handleListItemClick(0)}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem>
      </List>
    </Dialog>
  );
}

interface AssignRiderProps {
    open: boolean;
    handleClose: () => void;
    city: string;
    province: string;
    orderUid: string;
}

interface RidersData {
    riderByArea: Rider[];
}

interface RiderVars {
    city: string;
    province: string;
}

export default function AssignRider({ open, city, orderUid, province, handleClose }: AssignRiderProps) {

  const { data } = useQuery<RidersData, RiderVars>(GET_RIDER_BY_AREA, {
    variables: { city, province }
  })

  const [setOrderRider, { loading }] = useMutation<
    { setOrderRider: Orders },
    { rider: number, order: string }
  >(ASSIGN_ORDER);

  const handleAssignRider = async (riderId: number | null) => {
   if (riderId) {
    await setOrderRider({ variables: {
        order: orderUid,
        rider: riderId
    }})
   }

   handleClose();
  }

  return (
      <SimpleDialog
        open={open}
        onClose={handleAssignRider}
        riders={data ? data.riderByArea : []}
      />
  );
}
