import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Box, CircularProgress, Alert } from '@mui/material';

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ amount, onSuccess, onError }) => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isRejected) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        PayPal failed to load. Please try refreshing the page.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2),
                  currency_code: 'USD',
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const details = await actions.order.capture();
            onSuccess(details);
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError(err);
        }}
        onCancel={() => {
          console.log('PayPal payment cancelled');
        }}
      />
    </Box>
  );
};

export default PayPalPayment;