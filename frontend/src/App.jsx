import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import AdminDashboard from './pages/AdminDashboard';
import './i18n';

const WHATSAPP_NUMBER = '966547305234';

function WhatsAppButton() {
  const handleClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello,%20I%20need%20AC%20repair%20service`, '_blank');
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        zIndex: 9999,
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng') || 'en';
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [i18n]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboardWrapper onLoginClick={() => setShowAdminLogin(true)} />} />
        <Route path="/*" element={
          <>
            <Navbar onAdminClick={() => setShowAdminLogin(true)} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/appointment" element={<Appointment />} />
            </Routes>
            <WhatsAppButton />
          </>
        } />
      </Routes>
      {showAdminLogin && <AdminLoginModal onClose={() => setShowAdminLogin(false)} />}
    </BrowserRouter>
  );
}

function AdminDashboardWrapper({ onLoginClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  
  useEffect(() => {
    if (!token && location.pathname !== '/admin') {
      onLoginClick();
    }
  }, [location, token, onLoginClick]);

  if (!token) {
    return null;
  }
  
  return <AdminDashboard />;
}

function AdminLoginModal({ onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminAPI, setAdminAPI] = useState(null);

  useEffect(() => {
    import('./api/service').then(module => {
      setAdminAPI(module.adminAPI);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminAPI) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Logging in with:', form);
      const res = await adminAPI.login(form);
      console.log('Login response:', res.data);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      onClose();
      window.location.href = '/admin/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network')) {
        setError('Server is not connected. Please make sure backend is running on port 5000');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="login-header">
          <div className="login-icon">🔧</div>
          <h2>A/C Workshop</h2>
          <p>Admin Panel Login</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              placeholder="Enter username"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder="Enter password"
              required 
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
