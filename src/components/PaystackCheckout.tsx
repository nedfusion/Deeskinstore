import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard } from 'lucide-react';

interface PaystackCheckoutProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  disabled?: boolean;
}

const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({
  amount,
  email,
  onSuccess,
  onClose,
  disabled = false,
}) => {
  const config = {
    reference: `DSS-${new Date().getTime()}`,
    email,
    amount: Math.round(amount * 100),
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    currency: 'NGN',
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    initializePayment(
      (reference) => {
        onSuccess(reference.reference);
      },
      () => {
        onClose();
      }
    );
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className="w-full bg-[#0d0499] text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <CreditCard className="h-5 w-5" />
      Pay ₦{amount.toLocaleString()} with Paystack
    </button>
  );
};

export default PaystackCheckout;
