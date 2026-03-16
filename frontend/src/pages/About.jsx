import { useTranslation } from 'react-i18next';
import './About.css';

function About() {
  const { t } = useTranslation();

  const reasons = t('about.reasons', { returnObjects: true });

  return (
    <div className="about-page">
      <section className="page-header">
        <h1>{t('about.title')}</h1>
        <p>{t('about.subtitle')}</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <div className="about-text">
            <h2>{t('about.story')}</h2>
            <p>{t('about.storyText')}</p>
            <div className="tech-info">
              <div className="tech-avatar">👨‍🔧</div>
              <h3>Tech. Mohd. Faryad</h3>
              <p>{t('about.techTitle')}</p>
              <p>📞 54 730 5234</p>
              <p>✉️ repaircenter896@gmail.com</p>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&h=550&fit=crop" alt="Professional Technician at Work" />
          </div>
        </div>

        <div className="why-choose">
          <h2>{t('about.whyChoose')}</h2>
          <p className="section-subtitle">{t('about.whySubtitle')}</p>
          <div className="reasons-grid">
            {reasons.map((reason, index) => (
              <div key={index} className="reason-card">
                <div className="reason-icon">{reason.icon}</div>
                <span>{reason.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="trust-section">
          <h2>{t('about.trust')}</h2>
          <p className="section-subtitle">{t('about.ourCommitment')}</p>
          <div className="trust-badges">
            <div className="badge-card">
              <div className="badge-icon">⭐</div>
              <h3>{t('home.rating')}</h3>
              <p>{t('about.basedReviews')}</p>
            </div>
            <div className="badge-card">
              <div className="badge-icon">🛡️</div>
              <h3>{t('about.licensed')}</h3>
              <p>{t('about.certifiedPro')}</p>
            </div>
            <div className="badge-card">
              <div className="badge-icon">📍</div>
              <h3>{t('about.serving')}</h3>
              <p>{t('about.since')}</p>
            </div>
            <div className="badge-card">
              <div className="badge-icon">🏆</div>
              <h3>5000+ {t('admin.appointments')}</h3>
              <p>{t('about.completed')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
