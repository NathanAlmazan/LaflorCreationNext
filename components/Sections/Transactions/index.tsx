import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  MenuItem,
  CardHeader
} from '@mui/material';
import dynamic from "next/dynamic";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Label from './Label';
import { Orders, OrderStatus, SET_ORDER_DELIVERED } from "../../../apollo/orders";
// apollo
import { useMutation } from '@apollo/client';

const AssignRiderDialog = dynamic(() => import("./AssignRider"));
const MapDialog = dynamic(() => import("./MapDialog"));
const Row = dynamic(() => import("./TransactionRow"));

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

interface Location {
  lat: number;
  lng: number;
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
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: undefined
  });
  const [assign, setAssign] = useState<AssignRiderProps>();
  const [location, setLocation] = useState<Location>();

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

  const handleAssignClose = () => {
    setAssign(undefined);
    update();
  }

  const [setOrderDelivered, { loading }] = useMutation<
    { setOrderDelivered: Orders },
    { uid: string }
  >(SET_ORDER_DELIVERED);

  const handleOrderDelivered = async (orderUid: string) => {
    await setOrderDelivered({ variables: {
      uid: orderUid
    }});
    update();
  }

  const handleAssignRider =  (assign: AssignRiderProps) => setAssign(assign);
  const handleViewLocation =  (address: Location) => setLocation(address);

  return (
    <>
      <Card>
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
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
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
              {paginatedCryptoOrders.map((order) => (
                <Row 
                  key={order.orderUid}
                  order={order}
                  getStatusLabel={getStatusLabel}
                  setAssign={handleAssignRider}
                  setLocation={handleViewLocation}
                  setDelivered={handleOrderDelivered}
                />
              )
              )}
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
      {location && (
        <MapDialog 
          open={location !== undefined}
          handleClose={() => setLocation(undefined)}
          location={location}
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
