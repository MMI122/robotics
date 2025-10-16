import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { paypalAPI } from '../../services/api';
import { toast } from 'react-toastify';

interface PayPalPaymentProps {
  orderId: number;
  amount: number;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  orderId,
  amount,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    return (
      <Alert severity="error">
        PayPal is not configured. Please contact support.
      </Alert>
    );
  }

  const initialOptions = {
    clientId: paypalClientId,
    currency: "USD",
    intent: "capture",
    components: "buttons",
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paypalAPI.createPayment(orderId);
      
      if (response.data.success) {
        return response.data.data!.paypal_order_id;
      } else {
        throw new Error(response.data.message || 'Failed to create PayPal order');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create PayPal order';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await paypalAPI.capturePayment({
        paypal_order_id: data.orderID,
        order_id: orderId,
      });

      if (response.data.success) {
        toast.success('Payment completed successfully!');
        onSuccess(response.data.data);
      } else {
        throw new Error(response.data.message || 'Payment capture failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment capture failed';
      setError(errorMessage);
      toast.error(errorMessage);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const onPayPalError = (err: any) => {
    console.error('PayPal Error:', err);
    const errorMessage = 'PayPal payment failed. Please try again.';
    setError(errorMessage);
    toast.error(errorMessage);
    if (onError) {
      onError(err);
    }
  };

  const onPayPalCancel = () => {
    toast.info('Payment was cancelled');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2">Processing payment...</Typography>
        </Box>
      )}

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 40,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onPayPalError}
          onCancel={onPayPalCancel}
          disabled={loading}
        />
      </PayPalScriptProvider>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Secure payment powered by PayPal
        </Typography>
      </Box>
    </Box>
  );
};

export default PayPalPayment;