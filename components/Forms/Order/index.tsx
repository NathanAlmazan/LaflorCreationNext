import * as Yup from 'yup';
import { Formik } from 'formik';
// mui
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormHelperText from '@mui/material/FormHelperText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import LocationForm from "./LocationForm";
import { useState } from 'react';
// apollo
import { useMutation } from '@apollo/client';
import { CREATE_ORDER, CREATE_ORDER_DETAIL, OrderDetailInput, OrderInput, Orders, RecipientInput } from '../../../apollo/orders';
import { Items } from '../../../apollo/items';
// next
import { useRouter } from "next/router";

type Location = {
    lat: number,
    lng: number,
    address: string
}

interface OrderDetails extends Items {
    quantity: number
  }

export default function OrderForm({ account, details }: { account: string, details: OrderDetails[] }) {
    const router = useRouter();
    const [currentLocation, setCurrentLocation] = useState<Location>({
        lat: 14.657868,
        lng: 120.950761,
        address: ''
    });

    const { address, lat, lng } = currentLocation;

    const [createOrder, { error: orderError }] = useMutation<
        { createOrder: Orders },
        { recipient: RecipientInput, order: OrderInput }
    >(CREATE_ORDER);

    const [createOrderDetail, { error: detailsError }] = useMutation<
        { createOrderDetail: OrderDetails[] },
        { details: OrderDetailInput[] }
    >(CREATE_ORDER_DETAIL);

  return (
    <Formik
        initialValues={{
            firstname: '',
            lastname: '',
            contact: '',
            message: '',
            dNote: '',
            fRemarks: '',
            deliveryDate: new Date(),
            submit: null
        }}
        validationSchema={Yup.object().shape({
            firstname: Yup.string().max(50).required("Recipient firstname is required."),
            lastname: Yup.string().max(50).required("Recipient lastname is required."),
            contact: Yup.string().min(10).max(12).required("Recipient contact number is required."),
            message: Yup.string().max(250).required("Dedication message is required."),
            dNote: Yup.string().max(250),
            fRemarks: Yup.string().max(250),
            deliveryDate: Yup.date().required("Delivery date is required.")
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
            if (address.length !== 0) {
                createOrder({ variables: {
                    order: {
                        date: values.deliveryDate.toISOString().split("T")[0], 
                        time: values.deliveryDate.toString().split(" ")[4],
                        clientAccount: account,
                        mop: "PENDING",
                        message: values.message,
                        dNotes: values.dNote,
                        fRemarks: values.fRemarks,
                        riderId: null,
                        status: "PND"
                    },
                    recipient: {
                        recipientName: values.firstname + " " + values.lastname,
                        recipientContact: values.contact,
                        recipientStreet: address.split(", ").length > 4 ? address.split(", ")[0] + " " + address.split(", ")[1] : address.split(", ")[0],
                        recipientCity: address.split(", ").length > 4 ? address.split(", ")[2] : address.split(", ")[1],
                        recipientProvince: address.split(", ").length > 4 ? address.split(", ")[3] : address.split(", ")[2],
                        latitude: lat,
                        longitude: lng
                    }
                }}).then(result => {
                    const data = result.data;
                    if (details.length > 0 && data) {
                        const orderDetails: OrderDetailInput[] = details.map(d => ({
                            discountCode: d.discountCode,
                            itemCode: d.itemCode,
                            orderUid: data.createOrder.orderUid,
                            quantity: d.quantity
                        }));

                        createOrderDetail({ variables: {
                            details: orderDetails
                        }});
                    }
    
                    setStatus({ success: true });
                    setSubmitting(false);
                    router.push('/items');
                })
            } else {
                setErrors({ submit: "Recipient address is required." });
                setStatus({ success: false });
                setSubmitting(false);
            }
        } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: (err as Error).message });
            setSubmitting(false);
        }
        }}
    >
        {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
            <Grid component="form" noValidate onSubmit={handleSubmit} container spacing={2} justifyContent="space-between">
                <Grid item xs={12} sm={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                value={values.firstname}
                                name="firstname"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="First Name"
                                fullWidth
                                error={Boolean(touched.firstname && errors.firstname)}
                                helperText={Boolean(touched.firstname && errors.firstname) && errors.firstname}
                            />    
                        </Grid> 
                        <Grid item xs={12} md={6}>
                            <TextField 
                                value={values.lastname}
                                name="lastname"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Last Name"
                                fullWidth
                                error={Boolean(touched.lastname && errors.lastname)}
                                helperText={Boolean(touched.lastname && errors.lastname) && errors.lastname}
                            />    
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <TextField 
                                value={values.contact}
                                name="contact"
                                type="number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Contact Number"
                                fullWidth
                                error={Boolean(touched.contact && errors.contact)}
                                helperText={Boolean(touched.contact && errors.contact) && errors.contact}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+63</InputAdornment>
                                }}
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
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <TextField 
                                value={values.message}
                                name="message"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Dedication Message"
                                multiline
                                rows={5}
                                fullWidth
                                error={Boolean(touched.message && errors.message)}
                                helperText={Boolean(touched.message && errors.message) && errors.message}
                            />    
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label={"Delivery Date & Time"}
                                    value={values.deliveryDate}
                                    onChange={value => setFieldValue("deliveryDate", value)}
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <TextField 
                                value={values.fRemarks}
                                name="fRemarks"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Florist Remarks"
                                placeholder='e.g. Please put wrapper on the 2 roses.'
                                multiline
                                rows={2}
                                fullWidth
                                error={Boolean(touched.fRemarks && errors.fRemarks)}
                                helperText={Boolean(touched.fRemarks && errors.fRemarks) && errors.fRemarks}
                            />    
                        </Grid> 
                        <Grid item xs={12} md={12}>
                            <TextField 
                                value={values.dNote}
                                name="dNote"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Delivery Remakrs"
                                placeholder='e.g. Please call upon rider arrival.'
                                multiline
                                rows={2}
                                fullWidth
                                error={Boolean(touched.dNote && errors.dNote)}
                                helperText={Boolean(touched.dNote && errors.dNote) && errors.dNote}
                            />    
                        </Grid> 
                        {errors.submit && (
                            <Grid item xs={12} md={12}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Grid>
                        )}
                        {Boolean(orderError || detailsError) && (
                            <Grid item xs={12} md={12}>
                                <FormHelperText error>{orderError?.message || detailsError?.message}</FormHelperText>
                            </Grid>
                        )}
                        <Grid item xs={12} md={12}>
                            <LoadingButton 
                                disableElevation
                                loading={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Place Order
                            </LoadingButton>
                        </Grid> 
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <LocationForm 
                        location={currentLocation}
                        changeLocation={(location) => setCurrentLocation(location)}
                    />
                </Grid>
            </Grid>
        )}
    </Formik>
  )
}