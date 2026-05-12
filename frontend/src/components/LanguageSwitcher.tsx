import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="cursor-pointer rounded-lg border-none bg-[#eff4f9] px-3 py-1.5 text-sm font-bold text-[#002045] transition-colors outline-none hover:bg-[#d6e3ff] focus:ring-2 focus:ring-[#002045]"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      {/* <option value="ar">العربية</option> */}
    </select>
  );
};

export default LanguageSwitcher;
