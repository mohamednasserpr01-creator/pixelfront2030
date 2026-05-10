import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ position: 'relative' }}>
      {/* 💡 كود الموبايل المعدل لإنهاء أزمة "الطابور" */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .footer-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important; /* عمودين */
            gap: 25px 10px !important; 
          }
          /* العمود الأول (اللوجو): ياخد العرض كله ويتسنتر */
          .footer-col:nth-child(1) {
            grid-column: 1 / -1 !important;
            align-items: center !important;
            text-align: center !important;
          }
          .footer-col:nth-child(1) p {
            max-width: 90% !important;
            margin: 0 auto !important;
          }
          /* العمود التاني والتالت (روابط ودعم): جنب بعض ومتسنترين */
          .footer-col:nth-child(2),
          .footer-col:nth-child(3) {
            align-items: center !important;
            text-align: center !important;
          }
          /* العمود الرابع (التواصل): ياخد العرض كله، بس عناصره جنب بعض */
          .footer-col:nth-child(4) {
            grid-column: 1 / -1 !important;
            align-items: center !important;
            text-align: center !important;
          }
          /* 💡 سحر إخفاء الطابور: العناصر تترص جنب بعض مش تحت بعض */
          .footer-col:nth-child(4) ul {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 15px !important;
          }
          .footer-col h3 {
            font-size: 1.1rem !important;
            margin-bottom: 15px !important;
            color: var(--p-purple) !important;
          }
          .footer-col ul li, .footer-col ul li a {
            font-size: 0.85rem !important;
          }
          .auth-footer {
            /* مساحة من تحت عشان الأزرار العائمة متغطيش الحقوق */
            padding-bottom: 90px !important; 
          }
        }
      `}} />

      <div className="footer-grid">
        
        {/* 1. العمود الأول: اللوجو ووصف الأكاديمية */}
        <div className="footer-col">
          <div className="logo" style={{ marginBottom: '15px' }}>
            <img src="/logo.png" alt="Pixel Academy" style={{ height: '50px' }} />
          </div>
          <p style={{ color: 'var(--txt-mut)', lineHeight: '1.8', fontSize: '0.95rem' }}>
            منصة بيكسل أكاديمي هي بوابتك للتعليم التفاعلي الذكي. نوفر لك أفضل الأدوات والتقنيات.
          </p>
        </div>

        {/* 2. العمود الثاني: روابط سريعة */}
        <div className="footer-col">
          <h3>روابط سريعة</h3>
          <ul>
            <li><Link href="/">الرئيسية</Link></li>
            <li><Link href="/courses">الكورسات</Link></li>
            <li><Link href="/teachers">المدرسين</Link></li>
            <li><Link href="/offers">العروض والخصومات</Link></li>
          </ul>
        </div>

        {/* 3. العمود الثالث: الدعم والمساعدة */}
        <div className="footer-col">
          <h3>الدعم والمساعدة</h3>
          <ul>
            <li><Link href="/knowledge-bank">بنك المعرفة</Link></li>
            <li><Link href="/support-room">غرفة الدعم</Link></li>
            <li><Link href="/contact">تواصل معنا</Link></li>
            <li><Link href="/faq">الأسئلة الشائعة</Link></li>
          </ul>
        </div>

        {/* 4. العمود الرابع: معلومات التواصل */}
        <div className="footer-col">
          <h3>تواصل معنا</h3>
          <ul>
            <li>📍 الإسكندرية، مصر</li>
            <li>📞 الدعم الفني: <span dir="ltr">01033259951</span></li>
            <li>📞 واتساب: <span dir="ltr">01221466441</span></li>
            <li>✉️ info@pixelacademy.com</li>
          </ul>
        </div>

      </div>

      {/* الجزء السفلي: السوشيال ميديا وحقوق الملكية */}
      <div 
        className="auth-footer" 
        style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          padding: '25px 0', 
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px'
        }}
      >
        <div className="social-links" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <a href="https://www.facebook.com/NasourMedia/" target="_blank" rel="noreferrer" title="Facebook">
             <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/nasourr__media/" target="_blank" rel="noreferrer" title="Instagram">
             <FaInstagram />
          </a>
          <a href="https://www.tiktok.com/@nasourmedia" target="_blank" rel="noreferrer" title="TikTok">
             <FaTiktok />
          </a>
          <a href="#" target="_blank" rel="noreferrer" title="YouTube">
             <FaYoutube />
          </a>
        </div>
        
        <div className="copyright" style={{ color: 'var(--txt-mut)', fontSize: '0.95rem', fontWeight: 'bold', textAlign: 'center' }}>
          جميع الحقوق محفوظة 2027 ©{' '}
          <a 
            href="https://www.facebook.com/NasourMedia" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#ff007f', 
              textDecoration: 'none', 
              fontWeight: '900',
              letterSpacing: '1px'
            }}
          >
            Nasour
          </a>
        </div>
      </div>
    </footer>
  );
}