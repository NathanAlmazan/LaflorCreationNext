import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardHeader,
    Divider,
    Avatar,
    Grid,
    Button,
    Stack,
    TextField,
    InputAdornment
  } from '@mui/material';
  import DeleteConfirm from "../../Dialogs/DeleteConfirm";
  import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
  import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
  import SearchIcon from '@mui/icons-material/Search';
  //animation 
  import { AnimatePresence, motion } from 'framer-motion';
  //types
  import { constantCase, noCase } from 'change-case';
  import { Rider } from "../../../apollo/riders";


  interface RiderListProps {
    riders: Rider[];
    update: (rider: Rider) => void;
    remove: (riderId: number) => void;
  }

 export default function RiderList({ riders, update, remove }: RiderListProps) {
    const [deleteRider, setDelete] = useState<number | null>(null);
    const [search, setSearch] = useState<string>('');
    const [filtered, setFiltered] = useState<Rider[]>(riders);

    useEffect(() => {
        if (search.length > 0) {
            setFiltered(state => filtered.filter(r => noCase(r.riderProvince).search(noCase(search)) !== -1))
        } else setFiltered(state => riders);
    }, [search, filtered, riders])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);
  
    return (
      <>
        <Card>
            <CardHeader 
                title="Riders' List" 
                action={
                    <TextField 
                        value={search}
                        onChange={handleSearchChange}
                        variant="outlined"
                        placeholder="Search Province"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                        }}
                        fullWidth
                    />
                }
            />
            <Divider />
            <Box p={2}>
            <AnimatePresence>
                <Grid container spacing={0}>
                
                    {filtered.map((rider) => (
                        <Grid key={rider.riderId} item xs={12} sm={6} lg={4}>
                            <motion.div
                                key={rider.riderId}
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                            >
                                <Box p={3} display="flex" alignItems="flex-start">
                                {rider.riderImage ? (
                                    <Avatar src={rider.riderImage} />
                                ) : (
                                    <Avatar>
                                        {constantCase(rider.riderName.slice(0, 2))}
                                    </Avatar>
                                )}
                                <Box pl={2}>
                                    <Typography gutterBottom variant="subtitle2">
                                    {rider.riderName}
                                    </Typography>
                                    <Typography variant="h4" gutterBottom>
                                    {rider.riderCity}
                                    </Typography>
                                    <Typography color="text.primary" sx={{ pb: 2 }}>
                                    {rider.riderProvince}
                                    </Typography>
                                <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<EditTwoToneIcon />}
                                            onClick={() => update(rider)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DeleteTwoToneIcon />}
                                            onClick={() => setDelete(rider.riderId)}
                                        >
                                            Delete
                                        </Button>
                                </Stack>
                                </Box>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </AnimatePresence>
            </Box>
        </Card>
        <DeleteConfirm 
            open={deleteRider !== null}
            handleClose={() => setDelete(null)}
            handleDelete={() => remove(deleteRider as number)}
            name={riders.find(r => r.riderId === deleteRider) && riders.find(r => r.riderId === deleteRider)?.riderName}
        />
      </>
    );
  }
  