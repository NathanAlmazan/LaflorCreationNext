import { useState } from "react";
import {
    Tooltip,
    TableCell,
    TableRow,
    Typography,
    IconButton,
    Table,
    Box,
    Collapse,
    TableHead,
    TableBody,
    useTheme
  } from '@mui/material';
import DeliveryDiningTwoToneIcon from '@mui/icons-material/DeliveryDiningTwoTone';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { capitalCase } from 'change-case';
// types 
import { Orders, OrderStatus } from "../../../apollo/orders";

interface Location {
    lat: number;
    lng: number;
}

interface AssignRiderProps {
    orderUid: string;
    city: string;
    province: string;
}

function TransactionRow({ order, setLocation, setAssign, setDelivered, getStatusLabel }: { 
    order: Orders, 
    setLocation: (location: Location) => void,
    setAssign: (assign: AssignRiderProps) => void,
    setDelivered: (orderUid: string) => void,
    getStatusLabel: (status: OrderStatus) => JSX.Element;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
        <TableRow hover>
        <TableCell padding="checkbox">
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </TableCell>
        <TableCell>
            <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
            >
            {order.client.clientName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
            {order.client.clientContact}
            </Typography>
        </TableCell>
        <TableCell>
            <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
            >
            {order.orderUid}
            </Typography>
        </TableCell>
        <TableCell>
            <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
            >
            {order.recipient.recipientCity + ", " + order.recipient.recipientProvince}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
            {new Date(`${order.date}T${order.time}`).toLocaleString()}
            </Typography>
        </TableCell>
        <TableCell>
            <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
            >
            {order.rider ? order.rider.riderName : 'Unassigned'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
            {order.rider ? order.rider.riderContact : ''}
            </Typography>
        </TableCell>
        <TableCell align="right">
            <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
            >
            {"₱ " + order.amount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
            {order.mop ? capitalCase(order.mop) : 'Unpaid'}
            </Typography>
        </TableCell>
        <TableCell align="right">
            {getStatusLabel(order.status)}
        </TableCell>
        <TableCell align="right">
            <Tooltip title="View Location" arrow>
            <IconButton
                sx={{
                '&:hover': { background: theme.colors.error.lighter },
                color: theme.palette.secondary.main
                }}
                color="inherit"
                size="small"
                onClick={() => setLocation({ lat: order.recipient.latitude, lng: order.recipient.longitude })}
            >
                <LocationOnIcon fontSize="small" />
            </IconButton>
            </Tooltip>
            {Boolean(order.rider === null && order.status !== 'DLV') && (
            <Tooltip title="Assign Rider" arrow>
                <IconButton
                sx={{
                    '&:hover': {
                    background: theme.colors.primary.lighter
                    },
                    color: theme.palette.primary.main
                }}
                color="inherit"
                size="small"
                onClick={() => setAssign({ orderUid: order.orderUid, city: order.recipient.recipientCity, province: order.recipient.recipientProvince })}
                >
                <DeliveryDiningTwoToneIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            )}
            {Boolean(order.rider !== null && order.status !== 'DLV') && (
            <Tooltip title="Set Delivered" arrow>
                <IconButton
                sx={{
                    '&:hover': { background: theme.colors.error.lighter },
                    color: theme.palette.error.main
                }}
                color="inherit"
                size="small"
                onClick={() => setDelivered(order.orderUid)}
                >
                <AllInboxIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            )}
        </TableCell>
        </TableRow>
        <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                        Order Details
                    </Typography>
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                            <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderDetails.map((details, i) => (
                                <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                        {details.item.itemName}
                                    </TableCell>
                                    <TableCell>{details.discountCode ? details.discountCode : 'None'}</TableCell>
                                    <TableCell align="right">{details.quantity}</TableCell>
                                    <TableCell align="right">
                                        {"₱ " + details.finalPrice.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, marginTop: 2 }} colSpan={1} />
                                <TableCell style={{ paddingBottom: 0, marginTop: 2 }} colSpan={1}>
                                    Message
                                </TableCell>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                                   {order.message}
                                </TableCell>
                            </TableRow>
                            {order.fRemarks !== null && order.fRemarks.length > 0 && (
                                 <TableRow>
                                    <TableCell style={{ paddingBottom: 0, marginTop: 2 }} colSpan={1} />
                                    <TableCell style={{ paddingBottom: 0, marginTop: 2 }} colSpan={1}>
                                        Florist Remarks
                                    </TableCell>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                                        {order.fRemarks}
                                    </TableCell>
                                </TableRow>
                            )}
                              {order.dNotes !== null && order.dNotes.length > 0 && (
                                 <TableRow>
                                    <TableCell style={{ paddingBottom: 0, marginTop: 2 }} colSpan={1} />
                                    <TableCell style={{ paddingBottom: 0, marginTop: 2 }} colSpan={1}>
                                        Delivery Notes
                                    </TableCell>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                                        {order.dNotes}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Collapse>
        </TableCell>
        </TableRow>
    </>
  )
}

export default TransactionRow