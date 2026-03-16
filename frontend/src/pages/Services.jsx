import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Services.css';

function Services() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultServicesList = [
    { 
      _id: '1',
      name: 'AC Repair', 
      nameArabic: 'إصلاح التكييف', 
      description: 'Expert AC repair services for all brands including Samsung, LG, Carrier, Toshiba, and more. We fix cooling issues, gas refilling, motor repair, wiring problems, and complete AC servicing.', 
      descriptionArabic: 'خدمات إصلاح التكييف لجميع العلامات التجارية. نحن نصلح مشاكل التبريد وتعبئة الغاز وإصلاح المحرك والأسلاك وخدمة التكييف الكاملة.',
      icon: '❄️', 
      image: 'https://tse2.mm.bing.net/th/id/OIP.ewVnCEifcfyP8zs-1MFClQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
      issues: ['Not cooling', 'Water leakage', 'Strange noise', 'Gas refilling', 'Motor repair', 'Not turning on'],
      issuesArabic: ['لا يبرد', 'تسرب الماء', 'صوت غريب', 'تعبئة الغاز', 'إصلاح المحرك', 'لا يعمل']
    },
    { 
      _id: '2',
      name: 'AC Installation', 
      nameArabic: 'تركيب التكييف', 
      description: 'Professional AC installation services for split AC, window AC, and central AC. Our experts handle proper wiring, gas charging, stand installation, and complete setup.', 
      descriptionArabic: 'خدمات تركيب التكييف المهنية للتكييف الشباكي والمركزي. يتعامل خبراؤنا مع التمديدات الكهربائية وتعبئة الغاز وتركيب الساند والإعداد الكامل.',
      icon: '🔧', 
      image: 'https://images.ctfassets.net/jarihqritqht/4knOOisMqWwK8mfzzrRWPK/a3770b5cddf13b155b65696c716a0386/technician-repairing-air-conditioner.jpg',
      issues: ['New AC installation', 'AC relocation', 'Gas charging after install', 'Wiring setup', 'Stand installation', 'AC removal'],
      issuesArabic: ['تركيب تكييف جديد', 'نقل التكييف', 'تعبئة الغاز بعد التركيب', 'تمديد الأسلاك', 'تركيب ستاند', 'إزالة التكييف']
    },
    { 
      _id: '3',
      name: 'AC Service', 
      nameArabic: 'صيانة التكييف', 
      description: 'Regular AC maintenance and servicing to keep your AC running efficiently. Includes professional cleaning, filter replacement, gas check, coil cleaning, and performance check.', 
      descriptionArabic: 'صيانة التكييف الدورية للحفاظ على تشغيل التكييف بكفاءة. يشمل التنظيف الاحترافي واستبدال الفلاتر وفحص الغاز وتنظيف الملفات وفحص الأداء.',
      icon: '🛠️', 
      image: 'https://tse2.mm.bing.net/th/id/OIP.Kq3OrTMOI6f9u7N2WtL1fQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
      issues: ['Annual service', 'Filter cleaning', 'Gas check', 'Coil cleaning', 'Performance check', 'Drain pipe cleaning'],
      issuesArabic: ['صيانة سنوية', 'تنظيف الفلاتر', 'فحص الغاز', 'تنظيف الملفات', 'فحص الأداء', 'تنظيف مصرف المياه']
    },
    { 
      _id: '4',
      name: 'Refrigerator', 
      nameArabic: 'الثلاجات', 
      description: 'Expert refrigerator repair services for all brands. We fix cooling problems, ice maker issues, compressor replacement, gas charging, and door seal replacement.', 
      descriptionArabic: 'خدمات إصلاح الثلاجات لجميع العلامات التجارية. نصلح مشاكل التبريد وإصلاح صانع الثلج واستبدال الضاغط وشحن الغاز واستبدال مانعة التسرب.',
      icon: '🧊', 
      image: 'https://thermadorrepairgroup.com/wp-content/uploads/2019/11/Refrigeratorrepair.jpg',
      issues: ['Not cooling', 'Ice buildup', 'Water leakage', 'Compressor issue', 'Door seal replacement', 'Strange sounds'],
      issuesArabic: ['لا يبرد', 'تراكم الجليد', 'تسرب الماء', 'مشكلة الضاغط', 'استبدال مانعة التسرب', 'أصوات غريبة']
    },
    { 
      _id: '5',
      name: 'Washing Machine', 
      nameArabic: 'غسالات', 
      description: 'Professional washing machine repair services for all front load and top load machines. We handle motor repair, drainage issues, door lock problems, and all major brands.', 
      descriptionArabic: 'خدمات إصلاح الغسالات المهنية لجميع الغسالات الأمامية والعلوية. نتعامل مع إصلاح المحرك ومشاكل التصريف ومشاكل قفل الباب.',
      icon: '🧺', 
      image: 'https://www.samatechnicalservices.com/wp-content/uploads/2022/09/Washing-Machine-Repair-Saadiyat-Beach-residence.jpg',
      issues: ['Not spinning', 'Water not draining', 'Noise during operation', 'Door lock issue', 'Motor repair', 'Water filling problem'],
      issuesArabic: ['لا يدور', 'لا يصرف الماء', 'ضوضاء أثناء التشغيل', 'مشكلة قفل الباب', 'إصلاح المحرك', 'مشكلة ملء الماء']
    },
    { 
      _id: '6',
      name: 'Oven & Kitchen', 
      nameArabic: 'الأفران والمطبخ', 
      description: 'Expert oven and kitchen appliance repair services. We service built-in ovens, free-standing ovens, microwave ovens, and all kitchen appliances.', 
      descriptionArabic: 'خدمات إصلاح الأفران ومعدات المطبخ المهنية. نخدم الأفران المدمجة والميكرويف وجميع أجهزة المطبخ.',
      icon: '🍳', 
      image: 'https://tse1.mm.bing.net/th/id/OIP.lflzUkoOu9lKqCJ8oWofWAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      issues: ['Not heating', 'Temperature inconsistency', 'Sparking', 'Door glass replacement', 'Timer issues', 'Not turning on'],
      issuesArabic: ['لا يسخن', 'عدم انتظام الحرارة', 'الشرر', 'استبدال زجاج الباب', 'مشاكل المؤقت', 'لا يعمل']
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://mobycoder-repair-shop.hf.space/api/services');
        if (response.data && response.data.length > 0) {
          setServices(response.data);
        } else {
          setServices(defaultServicesList);
        }
      } catch (error) {
        console.log('Using default services');
        setServices(defaultServicesList);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const isArabic = i18n.language === 'ar';

  const brands = [
    { name: 'Samsung', nameArabic: 'سامسونج', img: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.TytaTqcBng9CTQFzf5OFEAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', product: 'All Home Appliances', productArabic: 'جميع الأجهزة المنزلية' },
    { name: 'LG', nameArabic: 'إل جي', img: 'https://www.microled-info.com/sites/default/files/2022-10/LG-Electronics-hQ.jpg', product: 'Refrigerators, AC, Washing', productArabic: 'ثلاجات، تكييف، غسالات' },
    { name: 'Carrier', nameArabic: 'كاريير', img: 'https://nigeriacontractor.com/wp-content/uploads/2021/02/CARRIER-HI-WALL-SPLIT-AIR-CONDITIONER-akpo-oyegwa-refrigeration-company.png', product: 'AC & HVAC Systems', productArabic: 'تكييف وأنظمة التدفئة' },
    { name: 'Toshiba', nameArabic: 'توشيبا', img: 'https://global-uploads.webflow.com/63181806578f4d0e37af7b40/63281305e6b8038980fb4ebe_toshiba-aircon.png', product: 'AC & Electronics', productArabic: 'تكييف وإلكترونيات' },
    { name: 'Sanyo', nameArabic: 'سانيو', img: 'https://ts1.tc.mm.bing.net/th/id/R-C.6b0b16bcc3f51bef85dca9778562371f?rik=XeTOpZRl9FIqDg&riu=http%3a%2f%2fimage5.suning.cn%2fb2c%2fcatentries%2f000000000617176296_1_800x800.jpg&ehk=2TgVWfrWw4aM3mRie1nnErWAgCkMNSIY8GL7GPBF8Do%3d&risl=&pid=ImgRaw&r=0', product: 'Refrigerators & AC', productArabic: 'ثلاجات وتكييف' }
  ];

  return (
    <div className="services-page">
      <section className="page-header">
        <h1>{t('services.title')}</h1>
        <p>{t('home.heroSubtitle')}</p>
      </section>

      <section className="services-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          services.map((service) => (
            <div key={service._id} className="service-detail">
              <div className="service-img">
                <img src={service.image || 'https://www.ambientedge.com/wp-content/uploads/2021/02/kingman-heating-and-air-conditioning-repair-and-service-experts-what-happens-if-you-dont-service-your-air-conditioner.jpg'} alt={isArabic ? service.nameArabic : service.name} />
                <div className="service-icon">{service.icon || '🔧'}</div>
              </div>
              <div className="service-info">
                <h2>{isArabic ? service.nameArabic : service.name}</h2>
                <p>{isArabic ? service.descriptionArabic : service.description}</p>
                {service.price && <p><strong>{isArabic ? 'السعر' : 'Price'}:</strong> {service.price}</p>}
                {service.duration && <p><strong>{isArabic ? 'المدة' : 'Duration'}:</strong> {service.duration}</p>}
                {(service.issues && service.issues.length > 0) || (service.issuesArabic && service.issuesArabic.length > 0) ? (
                  <>
                    <h4>{t('services.commonIssues')}</h4>
                    <ul>
                      {(isArabic ? service.issuesArabic : service.issues || []).map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <Link to="/appointment" className="btn-primary">{t('services.getQuote')}</Link>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="brands-list">
        <h2>{t('services.brands')}</h2>
        <p className="section-subtitle">{t('services.certifiedTech')}</p>
        <div className="brands-detail">
          {brands.map(brand => (
            <div key={brand.name} className="brand-detail-card">
              <img src={brand.img} alt={isArabic ? brand.nameArabic : brand.name} className="brand-detail-img" />
              <div className="brand-badge">{isArabic ? brand.nameArabic : brand.name}</div>
              <p>{isArabic ? brand.productArabic : brand.product}</p>
              <Link to="/appointment" className="btn-outline">{t('services.getQuote')}</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;
