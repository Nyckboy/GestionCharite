import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5faff] p-6 font-['Inter',sans-serif] selection:bg-[#d6e3ff] selection:text-[#002045]">
      <div className="relative max-w-lg overflow-hidden rounded-3xl border border-[#dee3e8] bg-white p-12 text-center shadow-[0px_8px_16px_rgba(26,54,93,0.04)]">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-[#002045] via-[#48bb78] to-[#002045]"></div>

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#eff4f9] shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-[#002045]">
              explore_off
            </span>

            {/* Little floating question mark */}
            <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ffdad6] text-sm font-black text-[#ba1a1a] shadow-sm">
              ?
            </div>
          </div>
        </div>

        {/* Typography */}
        <h1 className="mb-2 text-7xl font-black tracking-tighter text-[#002045]">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-[#171c20]">Destination Unknown</h2>
        <p className="mb-10 text-sm leading-relaxed font-medium text-[#74777f]">
          We can't seem to find the page you're looking for. It might have been moved, renamed, or
          temporarily deactivated by the system administrators.
        </p>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#002045] px-6 py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#1a365d] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Home Base
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#c4c6cf] bg-white px-6 py-3.5 font-bold text-[#43474e] transition-all hover:bg-[#eff4f9]"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Go Back
          </button>
        </div>
      </div>

      {/* Subtle Footer branding */}
      <div className="mt-8 text-xs font-bold tracking-widest text-[#74777f] uppercase">
        Gestion Charité — System Error
      </div>
    </div>
  );
};

export default NotFound;
