import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';

interface CheckoutFormProps {
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirects to your new success page
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || t('stripe.unexpectedError'));
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-[#dee3e8] bg-[#eff4f9] p-4">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
          <span className="material-symbols-outlined text-[20px]">error</span>
          {errorMessage}
        </div>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#48bb78] py-4 text-base font-bold text-white transition-all hover:bg-[#38a169] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">lock</span>
          <span>{isProcessing ? t('stripe.processing') : t('stripe.payNow')}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full rounded-xl border border-[#c4c6cf] bg-white py-3.5 text-sm font-bold text-[#43474e] transition-all hover:bg-[#eff4f9] disabled:opacity-50"
        >
          {t('stripe.cancel')}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
