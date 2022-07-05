import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHelperText from '@mui/material/FormHelperText';
// Forms
import * as Yup from 'yup';
import { Formik } from 'formik';
// apollo
import { useMutation } from '@apollo/client';
import { OrderPayment, PaymentType, CREATE_PAYMENT_INTENT, Orders, PAY_WITH_CARD, CardPaymentInput } from '../../../apollo/orders';

export default function CardPayment({ orders, next }: { orders: Orders[], next: (id: string) => void }) {
  
  const [createPaymentIntent, { error: intentError }] = useMutation<
    { createPaymentIntent: OrderPayment | null },
    { uid: string[], type: PaymentType }
  >(CREATE_PAYMENT_INTENT);

  const [payWithCard, { error: cardError }] = useMutation<
    { payWithCard: OrderPayment },
    { uid: string[], card: CardPaymentInput }
  >(PAY_WITH_CARD);

  useEffect(() => {
    createPaymentIntent({ variables: {
        type: "CARD",
        uid: orders.map(order => order.orderUid)
    }}).catch(err => console.log(err.message));
  }, [orders, createPaymentIntent])

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Pay with Card
      </Typography>
      <Formik
        initialValues={{
           cardName: '',
           cardNumber: '',
           expYear: '',
           expMonth: '',
           cvcNumber: '',
           submit: null
        }}
        validationSchema={Yup.object().shape({
           cardName: Yup.string().max(50).required("Card name is required."),
           cardNumber: Yup.string().min(15).max(20).required("Card number is required."),
           expYear: Yup.number().min(new Date().getFullYear()).max(new Date().getFullYear() + 10).required("Card expiration year is required."),
           expMonth: Yup.number().min(1).max(12).required("Card expiration month is required."),
           cvcNumber: Yup.number().min(100).max(999).required("Card CV number is required.")
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            payWithCard({ variables: {
                card: {
                    cardNumber: values.cardNumber,
                    expMonth: parseInt(values.expMonth),
                    expYear: parseInt(values.expYear),
                    cvcNumber: parseInt(values.cvcNumber),
                    paymentType: 'CARD'
                },
                uid: orders.map(order => order.orderUid)
            }}).then((data) => {
                setStatus({ success: true });
                setSubmitting(false);
                if (data.data && data.data.payWithCard) next(data.data.payWithCard.sourceId);
            })
            .catch(err => {
                setStatus({ success: false });
                setSubmitting(false);
                setErrors({ submit: err.message });
            });
        }}
    >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <Grid component="form" noValidate onSubmit={handleSubmit} container spacing={3}>
                <Grid item xs={12} md={6}>
                <TextField
                    name="cardName"
                    label="Name on card"
                    fullWidth
                    autoComplete="cc-name"
                    value={values.cardName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    error={Boolean(touched.cardName && errors.cardName)}
                    helperText={Boolean(touched.cardName && errors.cardName) && errors.cardName}
                />
                </Grid>
                <Grid item xs={12} md={6}>
                <TextField
                    type="number"
                    name="cardNumber"
                    label="Card number"
                    fullWidth
                    value={values.cardNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
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
                    error={Boolean(touched.cardNumber && errors.cardNumber)}
                    helperText={Boolean(touched.cardNumber && errors.cardNumber) && errors.cardNumber}
                />
                </Grid>
                <Grid item xs={12} md={3}>
                <TextField
                    type="number"
                    name="expMonth"
                    label="Expiry Month"
                    fullWidth
                    value={values.expMonth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    error={Boolean(touched.expMonth && errors.expMonth)}
                    helperText={Boolean(touched.expMonth && errors.expMonth) && errors.expMonth}
                />
                </Grid>
                <Grid item xs={12} md={3}>
                <TextField
                    type="number"
                    name="expYear"
                    label="Expiry Year"
                    fullWidth
                    value={values.expYear}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    error={Boolean(touched.expYear && errors.expYear)}
                    helperText={Boolean(touched.expYear && errors.expYear) && errors.expYear}
                />
                </Grid>
                <Grid item xs={12} md={6}>
                <TextField
                    type="number"
                    name="cvcNumber"
                    label="CVV"
                    fullWidth
                    value={values.cvcNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="standard"
                    error={Boolean(touched.cvcNumber && errors.cvcNumber)}
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
                    helperText={Boolean(touched.cvcNumber && errors.cvcNumber) && errors.cvcNumber}
                />
                </Grid>
                <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                    label="Remember credit card details for next time"
                />
                </Grid>
                <Grid item xs={12}>
                    {errors.submit && (
                        <FormHelperText error>{errors.submit}</FormHelperText>
                    )}

                    {cardError && (
                        <FormHelperText error>{cardError.message}</FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton 
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Pay With Card
                    </LoadingButton>
                </Grid>
            </Grid>
        )}
    </Formik>
    </React.Fragment>
  );
}