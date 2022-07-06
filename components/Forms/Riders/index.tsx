import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// form
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// apollo
import { Rider, RiderInput, CREATE_RIDER } from "../../../apollo/riders";
import { useMutation } from '@apollo/client';

const cities: { name: string, province: string }[] = require('philippines/cities');
const provinces: { name: string, region: string, key: string }[] = require('philippines/provinces');

interface UpsertRiderDialogProps {
    open: boolean;
    handleClose: () => void;
    create?: (rider: Rider) => void;
    update?: (rider: Rider) => void;
    rider?: Rider | null;
}

function UpsertRiderDialog({ open, rider, create, update, handleClose }: UpsertRiderDialogProps) {

  const [createRider, { error }] = useMutation<
    { createRider: Rider },
    { rider: RiderInput }
  >(CREATE_RIDER);

  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{rider ? "Update Rider" : "New Rider"}</DialogTitle>
        <DialogContent>
            <Formik
                initialValues={{
                    firstname: rider ? rider.riderName.split(" ")[0] : '',
                    lastname: rider ? rider.riderName.split(" ")[1] : '',
                    contact: rider ? rider.riderContact.substring(2) : '',
                    city: rider ? rider.riderCity : '',
                    province: rider ? rider.riderProvince : '',
                    provinceCode: rider ? provinces.find(p => p.name === rider.riderProvince) ? provinces.find(p => p.name === rider.riderProvince)?.key : '' : '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    firstname: Yup.string().max(255).required('First Name is required'),
                    lastname: Yup.string().max(255).required('Last Name is required'),
                    city: Yup.string().max(15).required('Assigned city is required.'),
                    province: Yup.string().max(15).required('Assigned province is required.'),
                    contact: Yup.string().min(10).max(12).required("Contact number is required.")
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                    const riderData = {
                        riderId: rider ? rider.riderId : undefined,
                        riderName: values.firstname + " " + values.lastname,
                        riderContact: "63" + values.contact,
                        riderCity: values.city,
                        riderProvince: values.province,
                        accountUid: rider ? rider.accountUid : null,
                        riderImage: rider ? rider.riderImage : null,
                    };

                    createRider({
                        variables: {
                            rider: riderData
                        }
                    }).then((data) => {
                        setStatus({ success: true });
                        setSubmitting(false);

                        if (create && data.data?.createRider) create(data.data?.createRider);
                        else if (update) update(riderData as Rider);

                        resetForm();
                        handleClose();
                    }).catch(err => {
                        setStatus({ success: false });
                        setErrors({ submit: (err as Error).message });
                        setSubmitting(false);
                    })
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                    <Grid container component="form" noValidate onSubmit={handleSubmit} spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                                <OutlinedInput
                                    value={values.firstname}
                                    name="firstname"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="John"
                                    fullWidth
                                    error={Boolean(touched.firstname && errors.firstname)}
                                />
                                {touched.firstname && errors.firstname && (
                                    <FormHelperText error id="helper-text-firstname-signup">
                                        {errors.firstname}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(touched.lastname && errors.lastname)}
                                    value={values.lastname}
                                    name="lastname"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    inputProps={{}}
                                />
                                {touched.lastname && errors.lastname && (
                                    <FormHelperText error id="helper-text-lastname-signup">
                                        {errors.lastname}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="contact-signup">Contact Number*</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(touched.contact && errors.contact)}
                                    value={values.contact}
                                    name="contact"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    startAdornment={
                                        <InputAdornment position="start">+63</InputAdornment>
                                    }
                                    sx={{
                                        'input[type=number]::-webkit-inner-spin-button': { 
                                            '-webkit-appearance': 'none', 
                                            margin: 0
                                        }, 
                                        'input[type=number]::-webkit-outer-spin-button': { 
                                            '-webkit-appearance': 'none', 
                                            margin: 0
                                        }
                                    }}
                                />
                                {touched.lastname && errors.lastname && (
                                    <FormHelperText error id="helper-text-lastname-signup">
                                        {errors.lastname}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                freeSolo
                                value={values.city}
                                onChange={(e, newValue) => setFieldValue('city', newValue)}
                                disableClearable
                                options={cities.filter(city => city.province === values.provinceCode).map((option) => option.name)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Assigned City"
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                        disabled={values.province.length < 1}
                                        error={Boolean(touched.city && errors.city)}
                                        helperText={Boolean(touched.city && errors.city) && errors.city}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                freeSolo
                                value={values.province}
                                onChange={(e, newValue) => {
                                    setFieldValue('province', newValue);
                                    setFieldValue('provinceCode', provinces.find(p => p.name === newValue)?.key)
                                }}
                                disableClearable
                                options={provinces.map((option) => option.name)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Assigned Province"
                                            InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                        error={Boolean(touched.province && errors.province)}
                                        helperText={Boolean(touched.province && errors.province) && errors.province}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            {error && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{error.message}</FormHelperText>
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                {rider ? "Update Rider" : "Create Rider"}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Formik>
        </DialogContent>
    </Dialog>
  )
}

export default UpsertRiderDialog