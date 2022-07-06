import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';
import dynamic from "next/dynamic";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Label from './Label';
import { Orders, OrderStatus } from "../../../apollo/orders";
import DeliveryDiningTwoToneIcon from '@mui/icons-material/DeliveryDiningTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { capitalCase } from 'change-case';

const AssignRiderDialog = dynamic(() => import("./AssignRider"));

interface RecentOrdersTableProps {
  className?: string;
  clientOrders: Orders[];
  update: () => void;
}

interface Filters {
  status?: OrderStatus;
}

interface AssignRiderProps {
  orderUid: string;
  city: string;
  province: string;
}

const getStatusLabel = (cryptoOrderStatus: OrderStatus): JSX.Element => {
  const map = {
    CRT: {
      text: 'Cart',
      color: 'error'
    },
    PND: {
      text: 'Pending',
      color: 'error'
    },
    PAID: {
      text: 'Paid',
      color: 'success'
    },
    DSP: {
      text: 'Dispatched',
      color: 'warning'
    },
    DLV: {
      text: 'Delivered',
      color: 'success'
    },
  };

  const result = map[cryptoOrderStatus];

  return <Label color={result.color as any}>{result.text}</Label>;
};

const applyFilters = (
  clientOrders: Orders[],
  filters: Filters
): Orders[] => {
  return clientOrders.filter((order) => {
    let matches = true;

    if (filters.status && order.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  clientOrders: Orders[],
  page: number,
  limit: number
): Orders[] => {
  return clientOrders.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ clientOrders, update }) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: undefined
  });
  const [assign, setAssign] = useState<AssignRiderProps>();

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'PND',
      name: 'Pending'
    },
    {
      id: 'PAID',
      name: 'Paid'
    },
    {
      id: 'DSP',
      name: 'Dispatched'
    },
    {
      id: 'DLV',
      name: 'Delivered'
    }
  ];

  const handleStatusChange = ((e: SelectChangeEvent<string>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: e.target.value === 'all' ? undefined : e.target.value as OrderStatus
    }));
  })

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? clientOrders.map((order) => order.orderUid)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(clientOrders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < clientOrders.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === clientOrders.length;

  const theme = useTheme();

  const handleAssignClose = () => {
    setAssign(undefined);
    update();
  }

  return (
    <>
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            <BulkActions />
          </Box>
        )}
        {!selectedBulkActions && (
          <CardHeader
            action={
              <Box width={150}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status || 'all'}
                    onChange={handleStatusChange}
                    label="Status"
                    autoWidth
                  >
                    {statusOptions.map((statusOption) => (
                      <MenuItem key={statusOption.id} value={statusOption.id}>
                        {statusOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            }
            title="Recent Orders"
          />
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedAllCryptoOrders}
                    indeterminate={selectedSomeCryptoOrders}
                    onChange={handleSelectAllCryptoOrders}
                  />
                </TableCell>
                <TableCell>Client Details</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Delivery Details</TableCell>
                <TableCell>Rider Details</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCryptoOrders.map((order) => {
                const isCryptoOrderSelected = selectedCryptoOrders.includes(
                  order.orderUid
                );
                return (
                  <TableRow
                    hover
                    key={order.orderUid}
                    selected={isCryptoOrderSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isCryptoOrderSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOneCryptoOrder(event, order.orderUid)
                        }
                        value={isCryptoOrderSelected}
                      />
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
                      <Tooltip title="Delete Order" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.colors.error.lighter },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredCryptoOrders.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25, 30]}
          />
        </Box>
      </Card>
      {assign && (
        <AssignRiderDialog 
          open={assign !== undefined}
          city={assign.city}
          province={assign.province}
          orderUid={assign.orderUid}
          handleClose={handleAssignClose}
        />
      )}
    </>
  );
};

RecentOrdersTable.propTypes = {
  clientOrders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  clientOrders: []
};

export default RecentOrdersTable;
