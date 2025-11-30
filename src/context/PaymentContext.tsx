import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PaymentGateway = 'paystack' | 'stripe';

interface PaymentState {
  selectedGateway: PaymentGateway;
  isProcessing: boolean;
}

interface PaymentContextType {
  state: PaymentState;
  setPaymentGateway: (gateway: PaymentGateway) => void;
  setProcessing: (processing: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PaymentState>({
    selectedGateway: 'paystack',
    isProcessing: false,
  });

  const setPaymentGateway = (gateway: PaymentGateway) => {
    setState(prev => ({ ...prev, selectedGateway: gateway }));
  };

  const setProcessing = (processing: boolean) => {
    setState(prev => ({ ...prev, isProcessing: processing }));
  };

  return (
    <PaymentContext.Provider value={{ state, setPaymentGateway, setProcessing }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
