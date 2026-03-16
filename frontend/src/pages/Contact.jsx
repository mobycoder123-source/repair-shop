import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contactAPI } from '../api/service';
import './Contact.css';

function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await contactAPI.create(form);
      setSubmitted(true);
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network')) {
        setError(t('common.serverError') || 'Server is not connected. Please try again later or call us directly at 54 730 5234');
      } else {
        setError(err.response?.data?.message || t('common.sendFailed') || 'Failed to send message. Please try again or call us directly.');
      }
    }
    setLoading(false);
  };

  const services = [
    t('appointment.acRepair'),
    t('appointment.acInstallation'),
    t('appointment.acService'),
    t('appointment.fridgeRepair'),
    t('appointment.washingRepair'),
    t('appointment.ovenRepair'),
    t('appointment.other')
  ];

  const hours = [
    { day: 'sun', hours: t('contact.closed') },
    { day: 'mon', hours: '9:00 AM - 6:00 PM' },
    { day: 'tue', hours: '9:00 AM - 6:00 PM' },
    { day: 'wed', hours: '9:00 AM - 6:00 PM' },
    { day: 'thu', hours: '9:00 AM - 6:00 PM' },
    { day: 'fri', hours: '9:00 AM - 6:00 PM' },
    { day: 'sat', hours: '10:00 AM - 4:00 PM' }
  ];

  return (
    <div className="contact-page">
      <section className="page-header">
        <h1>{t('contact.title')}</h1>
        <p>{t('home.heroSubtitle')}</p>
      </section>

      <section className="contact-content">
        <div className="contact-grid">
          <div className="contact-form-section">
            <h2>{t('contact.form')}</h2>
            {error && <div className="error-message">{error}</div>}
            {submitted ? (
              <div className="success-message">
                <span>✓</span>
                <h3>{t('contact.thankYou')}</h3>
                <p>{t('contact.inquiryReceived')}</p>
                <p>{t('contact.confirmationEmail')}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.name')}</label>
                    <input 
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder={t('contact.yourName')}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.phone')}</label>
                    <input 
                      type="tel" 
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      placeholder={t('contact.yourPhone')}
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.email')}</label>
                    <input 
                      type="email" 
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder={t('contact.yourEmail')}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.service')}</label>
                    <select 
                      value={form.service}
                      onChange={(e) => setForm({...form, service: e.target.value})}
                      required
                    >
                      <option value="">{t('contact.selectService')}</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group full">
                  <label>{t('contact.message')}</label>
                  <textarea 
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    placeholder="Describe your issue or requirements..."
                  ></textarea>
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Sending...' : t('contact.submit')}
                </button>
              </form>
            )}
            </div>

            <div className="contact-info-section">
              <div className="info-card">
              <h3>📍 Address</h3>
              <p>3966 Prince Muteb St, Al Merqab Dist.</p>
              <p>Unit 7267, Al Jubail 35514, Saudi Arabia</p>
            </div>

              <div className="info-card">
              <h3>📞 {t('contact.phone')}</h3>
              <a href="tel:+966547305234" className="contact-link">{t('contact.phoneNumber')}</a>
              <p className="contact-sub">{t('contact.whatsapp')}</p>
            </div>

            <div className="info-card">
              <h3>✉️ {t('contact.email')}</h3>
              <a href="mailto:repaircenter896@gmail.com" className="contact-link">{t('contact.emailAddress')}</a>
            </div>

            <div className="info-card">
              <h3>{t('contact.hours')}</h3>
              <div className="hours-table">
                {hours.map(h => (
                  <div key={h.day} className="hours-row">
                    <span>{t(`contact.days.${h.day}`)}</span>
                    <span>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="map-container">
              <a 
                href="https://www.google.com/maps/search/Al+Jubail,+Prince+Metib+St,+Saudi+Arabia" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{display: 'block', textDecoration: 'none'}}
              >
                <div style={{width: '100%', height: '220px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white', textAlign: 'center', padding: '20px', boxSizing: 'border-box', position: 'relative', overflow: 'hidden'}}>
                  <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                    <span style={{fontSize: '48px', marginBottom: '10px'}}>📍</span>
                    <h3 style={{margin: '0 0 5px', fontSize: '18px'}}>A/C Workshop</h3>
                    <p style={{margin: '0', fontSize: '14px', opacity: 0.9}}>3966 Prince Muteb St, Al Merqab Dist.</p>
                    <p style={{margin: '5px 0 0', fontSize: '14px', opacity: 0.9}}>Unit 7267, Al Jubail 35514, Saudi Arabia</p>
                    <p style={{margin: '15px 0 0', fontSize: '12px', opacity: 0.7, textDecoration: 'underline'}}>Click to view on Google Maps</p>
                  </div>
                </div>
              </a>
            </div>

            <a href="https://wa.me/966547305234?text=Hello,%20I%20need%20AC%20repair%20service" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
              💬 {t('contact.whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
