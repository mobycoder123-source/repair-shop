import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appointmentAPI, contactAPI, feedbackAPI } from '../api/service';
import './Admin.css';

function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, today: 0, newContacts: 0, newFeedback: 0 });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/');
      return;
    }
    fetchAppointments();
    fetchContacts();
    fetchFeedbacks();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentAPI.getAll();
      setAppointments(res.data);
      
      const today = new Date().toDateString();
      const pending = res.data.filter(a => a.status === 'pending').length;
      const todayCount = res.data.filter(a => new Date(a.preferredDate).toDateString() === today).length;
      
      setStats(prev => ({ ...prev, total: res.data.length, pending, today: todayCount }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await contactAPI.getAll();
      setContacts(res.data);
      const newCount = res.data.filter(c => c.status === 'new').length;
      setStats(prev => ({ ...prev, newContacts: newCount }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await feedbackAPI.getAll();
      setFeedbacks(res.data);
      const newCount = res.data.filter(f => f.status === 'new').length;
      setStats(prev => ({ ...prev, newFeedback: newCount }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await appointmentAPI.updateStatus(id, status);
      console.log('Status update response:', res.data);
      fetchAppointments();
      const statusMsg = status === 'confirmed' ? t('admin.appointmentConfirmed') : 
                       status === 'cancelled' ? t('admin.appointmentCancelled') : 
                       status === 'completed' ? t('admin.appointmentCompleted') : 
                       t('admin.appointmentUpdated');
      alert(statusMsg);
    } catch (err) {
      console.error('Status update error:', err);
      alert(t('admin.errorUpdating'));
    }
  };

  const handleContactStatusChange = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeedbackStatusChange = async (id, status) => {
    try {
      await feedbackAPI.updateStatus(id, status);
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm(t('admin.confirmDelete') + ' ' + t('admin.feedbackConfirm') + '?')) {
      try {
        await feedbackAPI.delete(id);
        fetchFeedbacks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm(t('admin.confirmDelete') + ' ' + t('admin.appointmentConfirm') + '?')) {
      try {
        await appointmentAPI.delete(id);
        fetchAppointments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm(t('admin.confirmDelete') + ' ' + t('admin.inquiryConfirm') + '?')) {
      try {
        await contactAPI.delete(id);
        fetchContacts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
    <div className="admin-dashboard" dir={isArabic ? 'rtl' : 'ltr'}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/logo.svg" alt="Logo" style={{width: '60px', height: '60px', borderRadius: '50%'}} />
          <h2>{isArabic ? 'ورشة التكييف' : 'A/C Workshop'}</h2>
          <span>{t('admin.adminPanel')}</span>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
            📅 {t('admin.appointments')}
            {stats.pending > 0 && <span className="badge">{stats.pending}</span>}
          </button>
          <button className={activeTab === 'contacts' ? 'active' : ''} onClick={() => setActiveTab('contacts')}>
            💬 {t('admin.inquiries')} {stats.newContacts > 0 && <span className="badge">{stats.newContacts}</span>}
          </button>
          <button className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>
            ⭐ {t('admin.feedback')} {stats.newFeedback > 0 && <span className="badge">{stats.newFeedback}</span>}
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 {t('admin.logout')}
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>👋 {t('admin.dashboard')}</h1>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div>
              <h3>{t('admin.totalAppointments')}</h3>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <div>
              <h3>{t('admin.today')}</h3>
              <p>{stats.today}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <div>
              <h3>{t('admin.pending')}</h3>
              <p>{stats.pending}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💬</span>
            <div>
              <h3>{t('admin.newInquiries')}</h3>
              <p>{stats.newContacts}</p>
            </div>
          </div>
        </div>

        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <h2 style={{color: '#f8fafc', marginBottom: '1.5rem'}}>📅 {t('admin.appointments')}</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.refNumber')}</th>
                    <th>{t('admin.customer')}</th>
                    <th>{t('admin.phone')}</th>
                    <th>{t('admin.email')}</th>
                    <th>{t('admin.service')}</th>
                    <th>{t('admin.date')}</th>
                    <th>{t('admin.time')}</th>
                    <th>{t('admin.status')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan="9" className="no-data">{t('admin.noAppointments')}</td></tr>
                  ) : (
                    appointments.map(apt => (
                      <tr key={apt._id}>
                        <td><strong>{apt.referenceNumber}</strong></td>
                        <td>{apt.customerName}</td>
                        <td><a href={`tel:${apt.customerPhone}`} style={{color: '#38bdf8'}}>{apt.customerPhone}</a></td>
                        <td>{apt.customerEmail || '-'}</td>
                        <td>{apt.serviceType}</td>
                        <td>{new Date(apt.preferredDate).toLocaleDateString()}</td>
                        <td>{apt.preferredTime}</td>
                        <td>
                          <select 
                            value={apt.status} 
                            onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                            className={`status-${apt.status}`}
                          >
                            <option value="pending">{t('admin.pending')}</option>
                            <option value="confirmed">{t('admin.confirmed')}</option>
                            <option value="completed">{t('admin.completed')}</option>
                            <option value="cancelled">{t('admin.cancelled')}</option>
                            <option value="rejected">{t('admin.cancel')}</option>
                          </select>
                        </td>
                        <td>
                          <button className="btn-delete" onClick={() => handleDeleteAppointment(apt._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="appointments-section">
            <h2 style={{color: '#f8fafc', marginBottom: '1.5rem'}}>💬 {t('admin.inquiries')}</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.date')}</th>
                    <th>{t('admin.customer')}</th>
                    <th>{t('admin.phone')}</th>
                    <th>{t('admin.service')}</th>
                    <th>{t('admin.message')}</th>
                    <th>{t('admin.status')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr><td colSpan="7" className="no-data">{t('admin.noInquiries')}</td></tr>
                  ) : (
                    contacts.map(contact => (
                      <tr key={contact._id}>
                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td><strong>{contact.name}</strong></td>
                        <td>
                          <a href={`tel:${contact.phone}`} style={{color: '#38bdf8', marginRight: '8px'}}>📞 {contact.phone}</a>
                          {contact.email && <br />}
                          {contact.email && <a href={`mailto:${contact.email}`} style={{color: '#38bdf8'}}>✉️ {contact.email}</a>}
                        </td>
                        <td>{contact.service || '-'}</td>
                        <td className="message-cell">{contact.message || '-'}</td>
                        <td>
                          <select 
                            value={contact.status} 
                            onChange={(e) => handleContactStatusChange(contact._id, e.target.value)}
                            className={`status-${contact.status}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td>
                          <button className="btn-delete" onClick={() => handleDeleteContact(contact._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="appointments-section">
            <h2 style={{color: '#f8fafc', marginBottom: '1.5rem'}}>⭐ {t('admin.feedback')}</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.date')}</th>
                    <th>{t('admin.customer')}</th>
                    <th>{t('admin.phone')}</th>
                    <th>{t('admin.refNumber')}</th>
                    <th>{t('admin.rating')}</th>
                    <th>{t('admin.feedback')}</th>
                    <th>{t('admin.status')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.length === 0 ? (
                    <tr><td colSpan="8" className="no-data">{t('admin.noFeedback')}</td></tr>
                  ) : (
                    feedbacks.map(feedback => (
                      <tr key={feedback._id}>
                        <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                        <td><strong>{feedback.customerName}</strong></td>
                        <td>
                          <a href={`tel:${feedback.customerPhone}`} style={{color: '#38bdf8', marginRight: '8px'}}>📞 {feedback.customerPhone}</a>
                          {feedback.customerEmail && <br />}
                          {feedback.customerEmail && <a href={`mailto:${feedback.customerEmail}`} style={{color: '#38bdf8'}}>✉️ {feedback.customerEmail}</a>}
                        </td>
                        <td>{feedback.referenceNumber || '-'}</td>
                        <td>{'⭐'.repeat(feedback.rating)} ({feedback.rating}/5)</td>
                        <td className="message-cell">{feedback.feedback}</td>
                        <td>
                          <select 
                            value={feedback.status} 
                            onChange={(e) => handleFeedbackStatusChange(feedback._id, e.target.value)}
                            className={`status-${feedback.status}`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="responded">Responded</option>
                          </select>
                        </td>
                        <td>
                          <button className="btn-delete" onClick={() => handleDeleteFeedback(feedback._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
