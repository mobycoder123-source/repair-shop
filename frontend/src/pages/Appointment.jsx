import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appointmentAPI, availabilityAPI } from '../api/service';
import axios from 'axios';
import './Appointment.css';

function Appointment() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);

  const isArabic = i18n.language === 'ar';

  const defaultServicesList = [
    { _id: '1', name: 'AC Repair', nameArabic: 'إصلاح التكييف' },
    { _id: '2', name: 'AC Installation', nameArabic: 'تركيب التكييف' },
    { _id: '3', name: 'AC Service', nameArabic: 'صيانة التكييف' },
    { _id: '4', name: 'Refrigerator', nameArabic: 'الثلاجات' },
    { _id: '5', name: 'Washing Machine', nameArabic: 'غسالات' },
    { _id: '6', name: 'Oven & Kitchen', nameArabic: 'الأفران والمطبخ' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await axios.get('https://mobycoder-repair-shop.hf.space/api/services');
        if (servicesRes.data && servicesRes.data.length > 0) {
          setServices(servicesRes.data);
        } else {
          setServices(defaultServicesList);
        }
      } catch (err) {
        console.log('Using default services');
        setServices(defaultServicesList);
      }
      fetchAvailability();
    };
    fetchData();
  }, []);

  const getServiceOptions = () => {
    return services.map(svc => ({
      value: svc._id,
      label: isArabic ? svc.nameArabic : svc.name
    }));
  };

  const defaultSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);

      const res = await availabilityAPI.get({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const { availability, bookedSlots: booked } = res.data;
      
      const available = availability?.filter(a => !a.isBlocked).map(a => a.date.split('T')[0]) || [];
      setAvailableDates(available);
      setBookedSlots(booked || {});
    } catch (err) {
      console.log('Using default dates');
      const dates = [];
      for (let i = 1; i <= 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        if (d.getDay() !== 0) {
          dates.push(d.toISOString().split('T')[0]);
        }
      }
      setAvailableDates(dates);
    }
  };

  const handleDateChange = (date) => {
    setForm({ ...form, preferredDate: date, preferredTime: '' });
    const booked = bookedSlots[date] || [];
    setTimeSlots(defaultSlots.filter(slot => !booked.includes(slot)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await appointmentAPI.create(form);
      setRefNumber(res.data.referenceNumber || 'ACW-' + Date.now());
      setSubmitted(true);
    } catch (err) {
      setError(t('appointment.bookingFailed'));
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="appointment-page">
        <section className="page-header">
          <h1>✅ {t('appointment.success')}</h1>
        </section>
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>{t('appointment.thankYou')}</h2>
          <p>{t('appointment.bookedSuccess')}</p>
          <div className="ref-number">{refNumber}</div>
          <p>{t('appointment.willContact')}</p>
          <p>{t('appointment.contactDirectly')}: <strong>{t('contact.phoneNumber')}</strong></p>
          <a href="https://wa.me/966547305234" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
            💬 {t('contact.whatsapp')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <section className="page-header">
        <h1>{t('appointment.title')}</h1>
        <p>{t('appointment.info')}</p>
      </section>

      <section className="appointment-form-section">
        {error && <div className="error-message" style={{marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px'}}>{error}</div>}
        
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('appointment.name')}</label>
              <input 
                type="text" 
                value={form.customerName}
                onChange={(e) => setForm({...form, customerName: e.target.value})}
                placeholder="Your full name"
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('appointment.phone')}</label>
              <input 
                type="tel" 
                value={form.customerPhone}
                onChange={(e) => setForm({...form, customerPhone: e.target.value})}
                placeholder="Your phone number"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('appointment.emailOptional')}</label>
            <input 
              type="email" 
              value={form.customerEmail}
              onChange={(e) => setForm({...form, customerEmail: e.target.value})}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>{t('appointment.address')}</label>
            <input 
              type="text" 
              value={form.customerAddress}
              onChange={(e) => setForm({...form, customerAddress: e.target.value})}
              placeholder={isArabic ? 'عنوانك في الجبيل' : 'Your address in Al Jubail'}
            />
          </div>

          <div className="form-group">
            <label>{t('appointment.service')}</label>
            <select 
              value={form.serviceType}
              onChange={(e) => setForm({...form, serviceType: e.target.value})}
              required
            >
              <option value="">{t('appointment.selectService')}</option>
              {services.length > 0 ? services.map(s => (
                <option key={s._id} value={isArabic ? s.nameArabic : s.name}>
                  {isArabic ? s.nameArabic : s.name}
                </option>
              )) : getServiceOptions().map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('appointment.date')}</label>
              <input 
                type="date" 
                value={form.preferredDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('appointment.time')}</label>
              <select 
                value={form.preferredTime}
                onChange={(e) => setForm({...form, preferredTime: e.target.value})}
                required
                disabled={!form.preferredDate}
              >
                <option value="">{t('appointment.selectTime')}</option>
                {(timeSlots.length > 0 ? timeSlots : defaultSlots).map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{t('appointment.notes')}</label>
            <textarea 
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              placeholder="Describe your issue or any special requirements..."
            ></textarea>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? t('appointment.submitting') : t('appointment.submit')}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Appointment;
