import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from "@mui/material/TextField";
import Divider from '@mui/material/Divider';
// icons
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
// types
import { CREATE_DISCOUNT, DELETE_DISCOUNT, Discount } from '../../apollo/items';
// apollo
import { useMutation } from "@apollo/client";
import React from "react";

interface DiscountProps {
    open: boolean;
    handleClose: () => void;
    discounts: Discount[];
    update: (discount: Discount) => void;
    removed: (code: string) => void;
}

interface DiscountForm {
    discCode: string;
    discAmount: string;
}

function Discounts({ open, discounts, handleClose, update, removed }: DiscountProps) {
  const [formData, setFormData] = useState<DiscountForm>({} as DiscountForm);
  const { discCode, discAmount } = formData;

  const [createDiscount, { loading: add }] = useMutation<
    { createDiscount: Discount },
    { discount: Discount }
  >(CREATE_DISCOUNT);

  const [deleteDiscount, { loading: remove }] = useMutation<
    { deleteDiscount: Discount },
    { discount: string }
  >(DELETE_DISCOUNT);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  
  const handleSubmitDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
        discCode: discCode,
        discAmount: parseFloat(discAmount)
    };

    await createDiscount({ variables: {
        discount: data
    }})

    setFormData({ discCode: '', discAmount: '' });
    update(data);
  }

  const handleDeleteDiscount = async (discCode: string) => {
    await deleteDiscount({ variables: {
        discount: discCode
    }})

    removed(discCode);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Discounts</DialogTitle>
        <DialogContent>
            <Stack direction="column" spacing={2}>
                <Stack component="form" onSubmit={handleSubmitDiscount} direction="column" spacing={1}>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <TextField 
                            required
                            name="discCode"
                            label="Discount Code"
                            value={discCode}
                            inputProps={{ maxLength: 3 }}
                            onChange={handleTextChange}
                        />
                        <TextField 
                            required
                            name="discAmount"
                            label="Discount Amount"
                            type="number"
                            value={discAmount}
                            onChange={handleTextChange}
                        />
                    </Stack>
                    <Button type="submit" disabled={add || remove} variant="contained">Add Discount</Button>
                </Stack>
                <List sx={{ width: "100%", bgcolor: 'background.paper' }}>
                    {discounts.map(discount => (
                        <>
                            <ListItem key={discount.discCode}>
                                <ListItemText primary={discount.discCode} secondary={"₱ " + discount.discAmount.toFixed(2)} />
                                <IconButton color="error" onClick={() => handleDeleteDiscount(discount.discCode)}>
                                    <Tooltip title="Remoove Discount">
                                        <DeleteTwoToneIcon />
                                    </Tooltip>
                                </IconButton>
                            </ListItem>
                            <Divider variant="fullWidth" component="li" />
                        </>
                    ))}
                </List>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  )
}

export default Discounts