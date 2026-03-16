import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onAdminClick }) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('i18nextLng', lang);
    setLangOpen(false);
  };

  const currentLang = i18n.language || 'en';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <img src="/logo.svg" alt="A/C Workshop Logo" className="nav-logo-img" />
          <span className="brand-text">A/C Workshop</span>
        </Link>
        
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>{t('nav.services')}</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>
          <Link to="/appointment" className="btn-nav" onClick={() => setMenuOpen(false)}>📅 {t('nav.appointment')}</Link>
          <button className="btn-admin" onClick={() => { setMenuOpen(false); onAdminClick && onAdminClick(); }}>{t('nav.admin')}</button>
          
          <div className="lang-dropdown">
            <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
              🌐 {currentLang === 'en' ? 'EN' : 'عربي'}
            </button>
            {langOpen && (
              <div className="lang-menu">
                <button 
                  className={currentLang === 'en' ? 'active' : ''} 
                  onClick={() => changeLanguage('en')}
                >
                  🇺🇸 English
                </button>
                <button 
                  className={currentLang === 'ar' ? 'active' : ''} 
                  onClick={() => changeLanguage('ar')}
                >
                  🇸🇦 العربية
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
