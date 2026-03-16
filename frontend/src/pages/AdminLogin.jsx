import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../api/service';
import './Admin.css';

function AdminLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await adminAPI.login(form);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(t('adminLogin.loginError'));
    }
    setLoading(false);
  };

  return (
    <div className="admin-login" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="login-container">
        <h1>{t('adminLogin.title')}</h1>
        <p>{t('adminLogin.subtitle')}</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('adminLogin.username')}</label>
            <input 
              type="text" 
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              placeholder={t('adminLogin.enterUsername')}
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('adminLogin.password')}</label>
            <input 
              type="password" 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder={t('adminLogin.enterPassword')}
              required 
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? t('adminLogin.loggingIn') : t('adminLogin.login')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
