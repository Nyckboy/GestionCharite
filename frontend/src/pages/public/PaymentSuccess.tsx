import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentSuccess = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 font-['Inter',sans-serif]">
      <div className="w-full max-w-md text-center">
        {/* Animated Checkmark */}
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#f0fdf4] shadow-sm">
          <span className="material-symbols-outlined text-6xl text-[#166534]">check_circle</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#002045]">
          {t('stripe.successTitle')}
        </h1>
        <p className="mb-10 text-base leading-relaxed text-[#74777f]">
          {t('stripe.successSubtitle')}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#002045] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#1a365d] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
          {t('stripe.backToFeed')}
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
