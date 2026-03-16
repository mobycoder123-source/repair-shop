import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Home() {
  const { t } = useTranslation();

  const services = [
    { key: 'ac', icon: '❄️', img: 'https://www.unlimitedheatingcooling.com/wp-content/uploads/2023/02/Air-Conditioner-Repairing.jpg' },
    { key: 'fridge', icon: '🧊', img: 'https://appliancerepairexpert.ca/wp-content/uploads/2022/02/Hero-img.jpg' },
    { key: 'washing', icon: '🧺', img: 'https://www.samatechnicalservices.com/wp-content/uploads/2022/09/Washing-Machine-Repair-Saadiyat-Beach-residence.jpg' },
    { key: 'oven', icon: '🍳', img: 'https://supercareappliance.com/wp-content/uploads/2024/03/oven_repair_super_care_appliance_repair-1-scaled.jpg' }
  ];

  const brands = [
    { name: 'Samsung', img: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.TytaTqcBng9CTQFzf5OFEAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', product: t('home.brands.samsung') },
    { name: 'LG', img: 'https://www.microled-info.com/sites/default/files/2022-10/LG-Electronics-hQ.jpg', product: t('home.brands.lg') },
    { name: 'Carrier', img: 'https://nigeriacontractor.com/wp-content/uploads/2021/02/CARRIER-HI-WALL-SPLIT-AIR-CONDITIONER-akpo-oyegwa-refrigeration-company.png', product: t('home.brands.carrier') },
    { name: 'Toshiba', img: 'https://global-uploads.webflow.com/63181806578f4d0e37af7b40/63281305e6b8038980fb4ebe_toshiba-aircon.png', product: t('home.brands.toshiba') },
    { name: 'Sanyo', img: 'https://ts1.tc.mm.bing.net/th/id/R-C.6b0b16bcc3f51bef85dca9778562371f?rik=XeTOpZRl9FIqDg&riu=http%3a%2f%2fimage5.suning.cn%2fb2c%2fcatentries%2f000000000617176296_1_800x800.jpg&ehk=2TgVWfrWw4aM3mRie1nnErWAgCkMNSIY8GL7GPBF8Do%3d&risl=&pid=ImgRaw&r=0', product: t('home.brands.sanyo') }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>{t('home.heroTitle')}</h1>
          <p>{t('home.heroSubtitle')}</p>
          <div className="hero-btns">
            <Link to="/appointment" className="btn-primary">
              📅 {t('home.ctaPrimary')}
            </Link>
            <Link to="/services" className="btn-secondary">{t('home.ctaSecondary')}</Link>
          </div>
          <div className="hero-contact-info">
            <p>📞 <a href="tel:+966547305234">{t('home.footerPhone')}</a></p>
            <p>📧 repaircenter896@gmail.com</p>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://img.freepik.com/premium-photo/repairing-air-conditioner_63097-2443.jpg" alt="Professional AC Technician at Work" />
        </div>
      </section>

      <section className="services-preview">
        <h2>{t('home.featuredServices')}</h2>
        <p className="section-subtitle">{t('home.expertRepair')}</p>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.key} className="service-card">
              <img src={service.img} alt={t(`services.${service.key}`)} />
              <div className="service-icon">{service.icon}</div>
              <h3>{t(`services.${service.key}`)}</h3>
              <p>{t(`services.${service.key}Desc`)}</p>
              <Link to="/services" className="learn-more">{t('home.learnMore')} →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="brands-section">
        <h2>{t('home.brandsWeService')}</h2>
        <p className="section-subtitle">{t('home.serviceRepair')}</p>
        <div className="brands-grid">
          {brands.map(brand => (
            <div key={brand.name} className="brand-card">
              <img src={brand.img} alt={brand.name} className="brand-img" />
              <div className="brand-name">{brand.name}</div>
              <p className="brand-products">{brand.product}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="availability-section">
        <div className="availability-card">
          <h2>📅 {t('home.availability')}</h2>
          <p className="availability-time">{t('home.availabilityNote')}</p>
          <Link to="/appointment" className="btn-primary">{t('home.bookNow')}</Link>
        </div>
      </section>

      <section className="testimonials">
        <h2>{t('home.testimonials')}</h2>
        <p className="section-subtitle">{t('home.reviews')}</p>
        <div className="rating">⭐⭐⭐⭐⭐ <span>{t('home.rating')}</span></div>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"{t('home.review1')}"</p>
            <span>- {t('home.customer1')}</span>
          </div>
          <div className="testimonial">
            <p>"{t('home.review2')}"</p>
            <span>- {t('home.customer2')}</span>
          </div>
          <div className="testimonial">
            <p>"{t('home.review3')}"</p>
            <span>- {t('home.customer3')}</span>
          </div>
        </div>
        <p className="trusted-tagline">🏆 {t('home.trusted')}</p>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo.svg" alt="Logo" style={{width: '60px', height: '60px', marginRight: '10px'}} />
            <span>A/C Workshop</span>
          </div>
          <p>{t('home.footerServices')}</p>
          <p>📍 {t('home.footerAddress')}</p>
          <p>📞 {t('home.footerPhone')}</p>
          <div className="footer-divider"></div>
          <p>© 2024 {t('home.footerCopyright')}</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
