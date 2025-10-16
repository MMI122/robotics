import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CreditCard,
  AccountBalanceWallet,
  LocalShipping,
} from '@mui/icons-material';
import PayPalPayment from './PayPalPayment';

interface PaymentMethodSelectorProps {
  orderId: number;
  amount: number;
  onPaymentSuccess: (details: any) => void;
  onPaymentError?: (error: any) => void;
}

type PaymentMethod = 'stripe' | 'paypal' | 'cod';

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  orderId,
  amount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const theme = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paypal');
  const [showPayment, setShowPayment] = useState(false);

  const paymentMethods = [
    {
      id: 'stripe' as PaymentMethod,
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: CreditCard,
      available: false, // Set to true when Stripe is implemented
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      description: 'Pay with your PayPal account or credit card',
      icon: AccountBalanceWallet,
      available: true,
    },
    {
      id: 'cod' as PaymentMethod,
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: LocalShipping,
      available: true,
    },
  ];

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMethod(event.target.value as PaymentMethod);
    setShowPayment(false);
  };

  const handleContinuePayment = () => {
    if (selectedMethod === 'cod') {
      // Handle cash on delivery
      onPaymentSuccess({
        payment_method: 'cod',
        status: 'pending',
        message: 'Order placed successfully. You will pay upon delivery.',
      });
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (details: any) => {
    onPaymentSuccess({
      ...details,
      payment_method: selectedMethod,
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Select Payment Method
      </Typography>

      <RadioGroup
        value={selectedMethod}
        onChange={handleMethodChange}
        sx={{ mb: 3 }}
      >
        <Grid container spacing={2}>
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isDisabled = !method.available;

            return (
              <Grid item xs={12} key={method.id}>
                <Card
                  sx={{
                    border: '2px solid',
                    borderColor: selectedMethod === method.id 
                      ? theme.palette.primary.main 
                      : 'transparent',
                    backgroundColor: isDisabled 
                      ? alpha(theme.palette.action.disabled, 0.05)
                      : selectedMethod === method.id
                        ? alpha(theme.palette.primary.main, 0.05)
                        : 'transparent',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: isDisabled 
                        ? 'transparent'
                        : selectedMethod === method.id
                          ? theme.palette.primary.main
                          : alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                  onClick={() => !isDisabled && setSelectedMethod(method.id)}
                >
                  <CardContent sx={{ py: 2 }}>
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      disabled={isDisabled}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <IconComponent 
                            sx={{ 
                              mr: 2, 
                              color: isDisabled 
                                ? theme.palette.action.disabled
                                : theme.palette.primary.main 
                            }} 
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 500,
                                color: isDisabled 
                                  ? theme.palette.action.disabled
                                  : 'inherit'
                              }}
                            >
                              {method.name}
                              {isDisabled && (
                                <Typography 
                                  component="span" 
                                  variant="caption" 
                                  sx={{ ml: 1, color: theme.palette.warning.main }}
                                >
                                  (Coming Soon)
                                </Typography>
                              )}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={isDisabled ? 'text.disabled' : 'text.secondary'}
                            >
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ 
                        margin: 0, 
                        width: '100%',
                        '& .MuiFormControlLabel-label': { 
                          width: '100%' 
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>

      {!showPayment && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleContinuePayment}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {selectedMethod === 'cod' ? 'Place Order' : 'Continue to Payment'}
        </Button>
      )}

      {showPayment && selectedMethod === 'paypal' && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 3 }} />
          <PayPalPayment
            orderId={orderId}
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={onPaymentError}
            onCancel={() => setShowPayment(false)}
          />
        </Box>
      )}

      {showPayment && selectedMethod === 'stripe' && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Stripe payment integration coming soon...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PaymentMethodSelector;