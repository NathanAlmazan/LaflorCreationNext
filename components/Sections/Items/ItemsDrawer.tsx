import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ItemsList from "./ItemsList";
import { Items } from '../../../apollo/items';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

  interface OrderDetails extends Items {
    quantity: number
  }

type ItemsDrawerProps = {
    open: boolean;
    items: Items[];
    selected: OrderDetails[];
    handleSelect?: (item: Items) => void;
    handleClose: () => void;
}

export default function ItemsDrawer({ open, items, selected, handleClose, handleSelect }: ItemsDrawerProps) {
  return (
    <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
    >
        <AppBar position='fixed'>
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Addon Items
            </Typography>
        </Toolbar>
        </AppBar>
        <ItemsList 
            items={items} 
            handleSelect={handleSelect}
            selected={selected}
        />
    </Dialog>
  )
}