import { useState } from 'react';
// mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// components
import { useRouter } from 'next/router';
import PaymentDetails from "./PaymentDetails";
import CardPayment from "./CardPayment";
// types
import { Orders } from "../../../apollo/orders";

type CheckoutOrderProps = {
    orders: Orders[];
    payment: string | null;
}

function getStepContent(step: number, orders: Orders[], next: () => void, success: (id: string) => void) {
    switch (step) {
      case 0:
        return <PaymentDetails orders={orders} next={next} />;
      case 1:
        return <CardPayment orders={orders} next={success} />;
      default:
        throw new Error('Unknown step');
    }
  }

const steps = ['Payment details', 'Pay with Card', 'Transaction Success'];

export default function CheckoutOrder({ orders, payment }: CheckoutOrderProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(payment ? 2 : 0);
  const [success, setSuccess] = useState<string | null>(payment);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleSuccess = (id: string) => setSuccess(id);

  return (
    <Container maxWidth="md" sx={{ mb: 5 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {success ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for completing your transaction, Dear Customer.
                </Typography>
                <Typography variant="subtitle1">
                 {` Your transaction number is #${success.split('_')[1]}. We will send you an update when your order has
                  shipped. Thank you and come again!`}
                </Typography>
                <Button fullWidth onClick={() => router.push("/items")} sx={{ mt: 3, ml: 1 }}>
                    Go back to Home Page
                </Button>
              </>
            ) : (
              <>
                {getStepContent(activeStep, orders, handleNext, handleSuccess)}
              </>
            )}
          </>
        </Paper>
    </Container>
  )
}