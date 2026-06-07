import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { initializeDefaultData, submitAdmissionsEnquiry } from '../utils/storage';
import '../assets/css/professional.css';
import principalImg from '../assets/images/principal.jpg';

/* ─── Animated Counter Hook ─────────────────────────────── */
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Intersection Observer Hook ────────────────────────── */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Stat Counter Component ────────────────────────────── */
function StatCounter({ value, suffix = '', label, prefix = '' }) {
  const [ref, inView] = useInView(0.2);
  const count = useCounter(value, 2000, inView);
  return (
    <div className="hstat" ref={ref}>
      <h3>{prefix}{count}{suffix}</h3>
      <p>{label}</p>
    </div>
  );
}

/* ─── Ticker items (static, outside component) ──────────── */
const TICKER_ITEMS = [
  'B.E/B.Tech Admissions 2025-26 through TNEA Counselling',
  'Last Date for Application: 31st July 2025',
  'Even Semester Examinations from June 10, 2025',
  'Campus Placement Drive — TCS, Cognizant, Infosys confirmed',
  'National Symposium "TECHVISTA 2025" on July 5th',
  'NAAC A Grade Re-accreditation received – Score 3.24/4.0',
];

/* ─── Main Home Component ─────────────────────────────────── */
function Home() {
  const [showCollegeDetails, setShowCollegeDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('vision');
  const [newsIndex, setNewsIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  /* New Interactive Modals States */
  const [showTourModal, setShowTourModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [tourSlideIndex, setTourSlideIndex] = useState(0);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    dept: 'Computer Science Engineering',
    notes: ''
  });

  const tourSlides = [
    { img: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', title: 'Main Campus Block', desc: 'Our architectural main building features smart classrooms, computer centers, and administrative departments.' },
    { img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80', title: 'Central Digital Library', desc: 'Housing over 50,000 reference volumes, NPTEL databases, and high-speed research work terminals.' },
    { img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', title: 'Advanced Computing Center', desc: 'Equipped with the latest hardware infrastructure, high-speed networking, and AI development setups.' },
    { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', title: 'Sports Grounds & Courts', desc: 'Spacious fields and courts supporting cricket, football, basketball, and athletic training.' },
  ];

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    await submitAdmissionsEnquiry({ ...enquiryForm, date: new Date().toISOString() });
    setEnquirySuccess(true);
  };

  const nextTourSlide = () => {
    setTourSlideIndex((prev) => (prev + 1) % tourSlides.length);
  };

  const prevTourSlide = () => {
    setTourSlideIndex((prev) => (prev - 1 + tourSlides.length) % tourSlides.length);
  };

  useEffect(() => {
    initializeDefaultData();
  }, []);

  /* Auto rotate news ticker */
  useEffect(() => {
    const t = setInterval(() => setNewsIndex(i => (i + 1) % TICKER_ITEMS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) { setNewsletterSent(true); setNewsletterEmail(''); }
  };

  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg-overlay"></div>
        <div className="hero-left">
          <div className="hero-pill">
            <span className="hero-pill-dot"></span>
            Affiliated to Anna University, Chennai
          </div>
          <h1 className="hero-heading">
            Shaping <span className="highlight">Visionary</span><br />
            Engineers of <span className="highlight">Tomorrow</span>
          </h1>
          <p className="hero-desc">
            NAAC A Grade · NBA Accredited · ISO 9001:2015 Certified<br />
            Approved by AICTE, New Delhi · Autonomous Institution since 2016
          </p>
          <div className="hero-actions">
            <a href="/admissions" className="btn-gold">
              <span>Apply for 2025-26</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/departments" className="btn-border">Explore Departments</a>
          </div>
          <div className="hero-stats">
            <StatCounter value={9} suffix="+" label="Years of Excellence" />
            <div className="hstat-divider"></div>
            <StatCounter value={5000} suffix="+" label="Students" />
            <div className="hstat-divider"></div>
            <StatCounter value={95} suffix="%" label="Placements" />
            <div className="hstat-divider"></div>
            <StatCounter value={200} suffix="+" label="Faculty" />
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80"
              alt="BEC Campus"
              className="hero-img"
            />
            
            {/* CAMPUS TOUR INTERACTIVE PLAY BUTTON */}
            <div className="hero-tour-btn" onClick={() => setShowTourModal(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Play Tour</span>
            </div>

            {/* ADMISSIONS ENQUIRY GLASS CARD */}
            <div className="hero-admission-badge glass-card" onClick={() => setShowEnquiryModal(true)}>
              <div className="badge-icon">✓</div>
              <div>
                <h4>Enroll Now</h4>
                <p>Enquiry Form &amp; Fees</p>
              </div>
            </div>

            <div className="hero-badge glass-card">
              <div className="badge-line"></div>
              <div>
                <h4>NAAC A Grade</h4>
                <p>Score: 3.24 / 4.0</p>
              </div>
            </div>
            <div className="hero-badge-2 glass-card">
              <div className="badge-svg-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
               </div>
               <div>
                 <h4>Top 50</h4>
                 <p>Engineering Colleges — Tamil Nadu</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* ── LIVE TICKER ───────────────────────────────────── */}
      <div className="ticker-wrap">
        <span className="ticker-label"><span className="ticker-live-dot"></span> Live</span>
        <div className="ticker-animated">
          <span key={newsIndex} className="ticker-slide">{TICKER_ITEMS[newsIndex]}</span>
        </div>
        <div className="ticker-dots">
          {TICKER_ITEMS.map((_, i) => (
            <span key={i} className={`tdot${i === newsIndex ? ' active' : ''}`} onClick={() => setNewsIndex(i)}></span>
          ))}
        </div>
      </div>

      {/* ── RANKINGS & ACCREDITATIONS ─────────────────────── */}
      <section className="rankings-section">
        <div className="rankings-inner">
          <div className="rank-card">
            <div className="rank-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div className="rank-info">
              <h4>NAAC A Grade</h4>
              <p>National Assessment &amp; Accreditation Council</p>
            </div>
          </div>
          <div className="rank-divider"></div>
          <div className="rank-card">
            <div className="rank-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
            </div>
            <div className="rank-info">
              <h4>NBA Accredited</h4>
              <p>All Eligible UG Programs Accredited</p>
            </div>
          </div>
          <div className="rank-divider"></div>
          <div className="rank-card">
            <div className="rank-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="rank-info">
              <h4>ISO 9001:2015</h4>
              <p>Quality Management Certified Institution</p>
            </div>
          </div>
          <div className="rank-divider"></div>
          <div className="rank-card">
            <div className="rank-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div className="rank-info">
              <h4>AICTE Approved</h4>
              <p>All India Council for Technical Education</p>
            </div>
          </div>
          <div className="rank-divider"></div>
          <div className="rank-card">
            <div className="rank-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M2 22h20" />
                <path d="M12 2L2 7h20z" />
                <path d="M6 12v-5M10 12v-5M14 12v-5M18 12v-5" />
              </svg>
            </div>
            <div className="rank-info">
              <h4>Anna University</h4>
              <p>Autonomous Affiliated Institution</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────── */}
      <section className="about-section">
        <div className="about-img">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&q=80" alt="About BEC" />
          <div className="about-img-badge">
            <span>Est. 2016</span>
          </div>
        </div>
        <div className="about-text">
          <p className="section-tag">Who We Are</p>
          <h2>About Best Engineering College</h2>
          <p>
            Best Engineering College is a premier autonomous institution affiliated to Anna University, Chennai.
            Established in 2016, we have consistently maintained high academic standards with NAAC A Grade
            accreditation and NBA accreditation for all eligible programs.
          </p>
          <p>
            Spread across 50 acres, our campus boasts modern infrastructure, smart classrooms, high-speed Wi-Fi,
            and a central digital library. We offer B.E./B.Tech programs in six core disciplines with an annual
            intake of 840 students, guided by 200+ qualified faculty members.
          </p>

          {/* Tabs */}
          <div className="about-tabs">
            {['vision', 'mission', 'values'].map(tab => (
              <button key={tab} className={`tab-btn${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {activeTab === 'vision' && (
              <p>To be a globally recognized center of excellence in engineering education, producing skilled
                professionals who contribute to technological advancement and societal development.</p>
            )}
            {activeTab === 'mission' && (
              <p>Providing quality technical education through modern methodologies, industry collaborations,
                and research opportunities to nurture competent, socially responsible engineers.</p>
            )}
            {activeTab === 'values' && (
              <p>Integrity, Innovation, Excellence, Inclusivity, and Industry-readiness — the five pillars
                that guide every decision and initiative at Best Engineering College.</p>
            )}
          </div>

          <div className="about-tags">
            <span>NAAC A Grade</span>
            <span>NBA Accredited</span>
            <span>Anna University</span>
            <span>ISO Certified</span>
            <span>AICTE Approved</span>
            <span>Autonomous</span>
          </div>

          {showCollegeDetails && (
            <div className="about-more-content">
              <h3>Academic Excellence</h3>
              <p>Best Engineering College operates under autonomous status, allowing us to design innovative curricula,
                flexible examination systems, and choice-based credit systems. Our academic programs meet international
                standards while addressing local industry needs.</p>
              <h3 style={{ marginTop: '20px' }}>Infrastructure &amp; Facilities</h3>
              <p>Our campus boasts 75+ well-equipped laboratories with equipment valued at over ₹25 crores. The central
                library houses 50,000+ books, 150+ journals, and e-resources including IEEE, Springer, and Elsevier.</p>
              <h3 style={{ marginTop: '20px' }}>Research &amp; Innovation</h3>
              <p>We have filed 15+ patents and completed 25+ sponsored research projects funded by AICTE, DST, and
                private industries. Our IEDC supports student startups and technology commercialization.</p>
              <div className="about-more-grid" style={{ marginTop: '20px' }}>
                {[
                  { title: 'Academic Support', text: 'Personal mentoring, remedial classes, doubt-clearing sessions, and parent-teacher meetings.' },
                  { title: 'Career Training', text: 'Aptitude training, communication skills, mock interviews, resume building, and placement prep.' },
                  { title: 'Student Life', text: 'Technical clubs, cultural festivals, NSS camps, NCC parades, and industrial visits.' },
                  { title: 'Health & Safety', text: 'On-campus medical center, counseling services, anti-ragging committee, and women safety cell.' },
                  { title: 'Global Exposure', text: 'International collaborations, student exchange programs, and global internship opportunities.' },
                  { title: 'Scholarships', text: 'Government scholarships, merit awards, sports scholarships, and alumni scholarships.' },
                ].map((item, i) => (
                  <div key={i}>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="button" className="btn-gold about-read-btn" onClick={() => setShowCollegeDetails(prev => !prev)}>
            {showCollegeDetails ? 'Show Less ▲' : 'Read More ▼'}
          </button>
        </div>
      </section>

      {/* ── PRINCIPAL'S MESSAGE ───────────────────────────── */}
      <section className="principal-section">
        <div className="principal-bg"></div>
        <div className="principal-content">
          <div className="principal-img-col">
            <div className="principal-img-frame">
              <img
                src={principalImg}
                alt="Principal Dr. M. Jagath"
              />
            </div>
            <div className="principal-signature">
              <span>Dr. M. Jagath</span>
              <small>Principal & Director</small>
            </div>
          </div>
          <div className="principal-text-col">
            <p className="section-tag">Leadership</p>
            <h2>Principal's Message</h2>
            <div className="quote-mark">"</div>
            <p className="principal-quote">
              At Best Engineering College, we believe education is not merely the transfer of knowledge —
              it is the cultivation of curious minds and compassionate leaders. Our institution stands as
              a beacon of academic excellence, where every student is equipped not just with technical
              expertise but with the values, vision, and versatility to make a meaningful difference in
              the world.
            </p>
            <p className="principal-quote" style={{ marginTop: '16px' }}>
              We continue to invest in world-class infrastructure, expert faculty, and industry
              partnerships to ensure every graduate of BEC emerges as a confident, competitive, and
              ethical professional ready for the challenges of tomorrow.
            </p>
            <div className="principal-stats-row">
              <div className="p-stat">
                <h4>Ph.D</h4>
                <span>Qualification</span>
              </div>
              <div className="p-stat">
                <h4>25+ Yrs</h4>
                <span>Experience</span>
              </div>
              <div className="p-stat">
                <h4>50+</h4>
                <span>Publications</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY HIGHLIGHTS (Icon Feature Grid) ───────────── */}
      <section className="highlights-section">
        <p className="section-tag center">Why Choose Us</p>
        <h2 className="sec-title">Our Key Strengths</h2>
        <p className="sec-sub">A comprehensive ecosystem designed for academic and professional success</p>
        <div className="highlights-grid">
          {[
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, title: 'Expert Faculty', desc: '85% of faculty hold Ph.D. degrees from premier institutions like IITs, NITs, and Anna University.' },
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, title: 'World-Class Infrastructure', desc: '50 acres campus with smart classrooms, 75+ labs, high-speed Wi-Fi, and central air conditioning.' },
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>, title: '95% Placements', desc: 'Dedicated placement cell with 150+ companies visiting campus. Highest package: 8.5 LPA.' },
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Industry Tie-Ups', desc: 'MoUs with TCS, Infosys, Wipro, Bosch, L&T for internships, projects, and guest lectures.' },
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>, title: 'Research & Innovation', desc: '15+ patents filed, 25+ funded projects, IEDC supporting student startups and innovation.' },
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: 'Global Exposure', desc: 'International collaborations, student exchange, foreign university partnerships, global internships.' },
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title: 'Sports & Culture', desc: 'Active sports teams, cultural clubs, NSS, NCC units — complete holistic development.' },
            { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, title: 'Digital Library', desc: '50,000+ books, IEEE, Springer, Elsevier access, 150+ journals, available 24/7.' },
          ].map((item, i) => (
            <div className="highlight-card" key={i}>
              <div className="highlight-icon">{item.svg}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEPARTMENTS ───────────────────────────────────── */}
      <section className="dept-section">
        <p className="section-tag center">Academics</p>
        <h2 className="sec-title">Our Departments</h2>
        <p className="sec-sub">Six world-class engineering programs with industry-aligned curriculum</p>
        <div className="dept-row">
          {[
            { img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', title: 'Computer Science Engineering', sub: 'AI · Machine Learning · Data Science · Cybersecurity', intake: 180, color: '#6366f1' },
            { img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', title: 'Electronics & Communication', sub: 'VLSI · Embedded Systems · Signal Processing', intake: 120, color: '#0ea5e9' },
            { img: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400&q=80', title: 'Mechanical Engineering', sub: 'Design · Manufacturing · Thermal Engineering', intake: 180, color: '#f59e0b' },
            { img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80', title: 'Civil Engineering', sub: 'Structural · Environmental · Transport', intake: 120, color: '#10b981' },
            { img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80', title: 'Information Technology', sub: 'Web · Cloud Computing · Cybersecurity', intake: 120, color: '#8b5cf6' },
            { img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80', title: 'Biotechnology', sub: 'Genetic Engineering · Bioinformatics', intake: 60, color: '#ef4444' },
          ].map((dept, i) => (
            <div className="dept-box" key={i}>
              <div className="dept-top">
                <img src={dept.img} alt={dept.title} />
                <div className="dept-overlay" style={{ background: dept.color + 'cc' }}>
                  <span>Intake: {dept.intake}</span>
                </div>
              </div>
              <div className="dept-info">
                <div className="dept-accent" style={{ background: dept.color }}></div>
                <h3>{dept.title}</h3>
                <p>{dept.sub}</p>
                <a href="/">Explore Program →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACHIEVEMENTS STRIP ────────────────────────────── */}
      <section className="achievement-section">
        <div className="achievement-inner">
          <p className="section-tag center" style={{ color: '#fbbf24' }}>Milestones & Awards</p>
          <h2 className="sec-title" style={{ color: '#fff' }}>Our Achievements</h2>
          <div className="achievement-grid">
            {[
              { num: '1200+', label: 'Students Placed (2024)' },
              { num: '8.5 LPA', label: 'Highest Package' },
              { num: '150+', label: 'Recruiting Companies' },
              { num: '15+', label: 'Patents Filed' },
              { num: '25+', label: 'Funded Research Projects' },
              { num: '50+', label: 'International Publications' },
              { num: '20+', label: 'Student Clubs' },
              { num: '3.24/4', label: 'NAAC Score' },
            ].map((a, i) => (
              <div className="achievement-card" key={i}>
                <h3>{a.num}</h3>
                <p>{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS & EVENTS ─────────────────────────────────── */}
      <section className="ne-section">
        <div className="ne-left">
          <p className="section-tag">Latest</p>
          <h2>Announcements</h2>
          <ul className="news-list">
            {[
              { tag: 'tag-new', label: 'New', text: 'Admissions open for 2025-26 academic year. Apply before July 31.' },
              { tag: 'tag-event', label: 'Event', text: 'End Semester Exams — All Years Even Semester Examinations on June 10.' },
              { tag: 'tag-notice', label: 'Notice', text: 'Semester exam timetable published. Check student portal now.' },
              { tag: 'tag-new', label: 'New', text: 'Campus recruitment drive by TCS, Infosys and Wipro on June 15.' },
              { tag: 'tag-notice', label: 'Notice', text: 'Anti-ragging committee meeting scheduled for 10th June 2025.' },
              { tag: 'tag-event', label: 'Event', text: 'National Symposium TECHVISTA 2025 — July 5, Main Auditorium.' },
            ].map((n, i) => (
              <li key={i}>
                <span className={n.tag}>{n.label}</span>
                <p>{n.text}</p>
              </li>
            ))}
          </ul>
          <a href="/" className="view-all-link">View All Announcements →</a>
        </div>
        <div className="ne-right">
          <p className="section-tag">Schedule</p>
          <h2>Upcoming Events</h2>
          {[
            { day: '10', month: 'Jun', title: 'Even Semester Examinations', sub: 'End Semester Exams — All Years' },
            { day: '15', month: 'Jun', title: 'Campus Placement Drive', sub: 'TCS, Infosys, Wipro — Main Auditorium' },
            { day: '20', month: 'Jun', title: 'Industry 4.0 Workshop', sub: 'Two-day workshop by CSE Department' },
            { day: '25', month: 'Jun', title: 'Final Year Project Expo', sub: 'All Departments | Main Block' },
            { day: '05', month: 'Jul', title: 'TECHVISTA 2025', sub: 'National Symposium — All Departments' },
          ].map((ev, i) => (
            <div className="ev-card" key={i}>
              <div className="ev-date">
                <span>{ev.day}</span>
                {ev.month}
              </div>
              <div className="ev-detail">
                <h4>{ev.title}</h4>
                <p>{ev.sub}</p>
              </div>
              <div className="ev-arrow">→</div>
            </div>
          ))}
          <a href="/" className="view-all-link">View Full Calendar →</a>
        </div>
      </section>

      {/* ── FACILITIES ────────────────────────────────────── */}
      <section className="fac-section">
        <p className="section-tag center">Campus Life</p>
        <h2 className="sec-title">World-Class Facilities</h2>
        <p className="sec-sub">Everything you need for an exceptional college experience</p>
        <div className="fac-row">
          {[
            { img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&q=80', title: 'Central Library', desc: '50,000+ books, journals and digital resources available 24/7', tag: '50,000+ Books' },
            { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80', title: 'Sports Complex', desc: 'Cricket, Football, Basketball, Badminton, and indoor game facilities', tag: '10+ Sports' },
            { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=80', title: 'Hostel', desc: 'Separate hostels for boys (600) and girls (400) with all modern amenities', tag: '1000 Capacity' },
            { img: 'https://images.unsplash.com/photo-1532094349884-543559059a6b?w=500&q=80', title: 'Research Labs', desc: '75+ advanced labs equipped for cutting-edge research valued at ₹25 Cr+', tag: '75+ Labs' },
          ].map((fac, i) => (
            <div className="fac-box" key={i}>
              <img src={fac.img} alt={fac.title} />
              <div className="fac-tag">{fac.tag}</div>
              <div className="fac-info">
                <h3>{fac.title}</h3>
                <p>{fac.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAMPUS GALLERY ────────────────────────────────── */}
      <section className="gallery-section">
        <p className="section-tag center">Gallery</p>
        <h2 className="sec-title">Campus Gallery</h2>
        <p className="sec-sub">A glimpse of life at Best Engineering College</p>
        <div className="gallery-grid">
          <div className="gallery-item gallery-big">
            <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80" alt="Campus" />
            <div className="gallery-label">Main Campus</div>
          </div>
          {[
            { src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', label: 'Computer Lab' },
            { src: 'https://images.unsplash.com/photo-1532094349884-543559059a6b?w=400&q=80', label: 'Research Lab' },
            { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80', label: 'Central Library' },
            { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80', label: 'Sports Ground' },
            { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80', label: 'Civil Block' },
          ].map((g, i) => (
            <div className="gallery-item" key={i}>
              <img src={g.src} alt={g.label} />
              <div className="gallery-label">{g.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="testi-section">
        <p className="section-tag center">Student Voice</p>
        <h2 className="sec-title">What Our Students Say</h2>
        <p className="sec-sub">Hear from the students who studied and succeeded here</p>
        <div className="testi-row">
          {[
            { img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', name: 'Arjun Kumar', course: 'B.E. CSE, Batch 2022', company: 'TCS', quote: '"The faculty here are very supportive and always ready to help. I got placed in TCS through the campus drive. BEC gave me the foundation I needed for my career."' },
            { img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80', name: 'Priya Lakshmi', course: 'B.E. ECE, Batch 2023', company: 'Infosys', quote: '"The labs and equipment are excellent. I completed my final year project on embedded systems with full support from the department. Highly recommend BEC!"' },
            { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', name: 'Rahul Sharma', course: 'B.E. Mech, Batch 2021', company: 'L&T', quote: '"Sports facilities and hostel life at BEC are great. I was part of the cricket team and also secured a job at L&T. A truly complete college experience!"' },
          ].map((t, i) => (
            <div className="testi-box" key={i}>
              <div className="testi-quote-icon">"</div>
              <p>{t.quote}</p>
              <div className="stars">★★★★★</div>
              <div className="testi-top">
                <img src={t.img} alt={t.name} />
                <div>
                  <h4>{t.name}</h4>
                  <span>{t.course}</span>
                  <div className="testi-company">Now at {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALUMNI SPOTLIGHT ──────────────────────────────── */}
      <section className="alumni-section">
        <div className="alumni-bg"></div>
        <div className="alumni-inner">
          <p className="section-tag center" style={{ color: '#fbbf24' }}>Our Pride</p>
          <h2 className="sec-title" style={{ color: '#fff' }}>Distinguished Alumni</h2>
          <p className="sec-sub" style={{ color: 'rgba(255,255,255,0.65)' }}>BEC graduates making an impact across the globe</p>
          <div className="alumni-grid">
            {[
              { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', name: 'Karthik Rajan', batch: 'CSE 2018', role: 'Senior SDE', company: 'Google', location: 'Bengaluru', color: '#4285F4' },
              { img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', name: 'Divya Nair', batch: 'ECE 2019', role: 'VLSI Design Engineer', company: 'Intel', location: 'Hyderabad', color: '#0071C5' },
              { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', name: 'Suresh Mohan', batch: 'MECH 2017', role: 'Product Engineer', company: 'Bosch', location: 'Coimbatore', color: '#E20613' },
              { img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80', name: 'Ananya Priya', batch: 'IT 2020', role: 'Data Scientist', company: 'Amazon', location: 'Chennai', color: '#FF9900' },
            ].map((a, i) => (
              <div className="alumni-card" key={i}>
                <div className="alumni-photo-ring" style={{ borderColor: a.color }}>
                  <img src={a.img} alt={a.name} />
                </div>
                <div className="alumni-company-badge" style={{ background: a.color }}>{a.company}</div>
                <h3>{a.name}</h3>
                <p className="alumni-role">{a.role}</p>
                <span className="alumni-meta">{a.batch} &nbsp;·&nbsp; {a.location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDENT LIFE ──────────────────────────────────── */}
      <section className="slife-section">
        <p className="section-tag center">Beyond Academics</p>
        <h2 className="sec-title">Student Life at BEC</h2>
        <p className="sec-sub">A vibrant campus where every student finds their passion</p>
        <div className="slife-grid">
          <div className="slife-card slife-big">
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=80" alt="Hackathon" />
            <div className="slife-overlay">
              <div className="slife-tag">Tech</div>
              <h3>Annual Hackathon</h3>
              <p>48-hour coding marathon with 500+ participants and ₹1L prize pool</p>
              <div className="slife-stat">500+ Participants</div>
            </div>
          </div>
          <div className="slife-card">
            <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" alt="Cultural Fest" />
            <div className="slife-overlay">
              <div className="slife-tag">Culture</div>
              <h3>AARAMBH Fest</h3>
              <p>3-day inter-college cultural festival with 2000+ participants</p>
              <div className="slife-stat">2000+ Participants</div>
            </div>
          </div>
          <div className="slife-card">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80" alt="NSS" />
            <div className="slife-overlay">
              <div className="slife-tag">Social</div>
              <h3>NSS & NCC Units</h3>
              <p>Active NSS, NCC and Rotaract clubs driving community service</p>
              <div className="slife-stat">300+ Volunteers</div>
            </div>
          </div>
          <div className="slife-card">
            <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80" alt="Sports" />
            <div className="slife-overlay">
              <div className="slife-tag">Sports</div>
              <h3>Inter-College Sports</h3>
              <p>State-level winners in cricket, football, chess and kabaddi</p>
              <div className="slife-stat">15+ Trophies</div>
            </div>
          </div>
          <div className="slife-card">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80" alt="Workshop" />
            <div className="slife-overlay">
              <div className="slife-tag">Skills</div>
              <h3>Industry Workshops</h3>
              <p>Monthly workshops by industry experts from top MNCs and startups</p>
              <div className="slife-stat">40+ Workshops/Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACADEMIC & INDUSTRY PARTNERS ──────────────────── */}
      <section className="partners-section">
        <p className="section-tag center">Collaborations</p>
        <h2 className="sec-title">Academic &amp; Industry Partners</h2>
        <p className="sec-sub">MoUs with leading universities, research labs and global companies</p>
        <div className="partners-tabs-row">
          <div className="partner-group">
            <h4 className="partner-group-title">Universities &amp; Research</h4>
            <div className="partner-logo-row">
              {[
                { name: 'IIT Madras',      logo: 'https://www.google.com/s2/favicons?domain=iitm.ac.in&sz=64' },
                { name: 'Anna University', logo: 'https://www.google.com/s2/favicons?domain=annauniv.edu&sz=64' },
                { name: 'NIT Trichy',      logo: 'https://www.google.com/s2/favicons?domain=nitt.edu&sz=64' },
                { name: 'VIT Vellore',     logo: 'https://www.google.com/s2/favicons?domain=vit.ac.in&sz=64' },
                { name: 'BITS Pilani',     logo: 'https://www.google.com/s2/favicons?domain=bits-pilani.ac.in&sz=64' },
              ].map((p, i) => (
                <div className="partner-logo-box" key={i}>
                  <img src={p.logo} alt={p.name} onError={e => e.target.style.opacity = '0'} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="partner-divider-v"></div>
          <div className="partner-group">
            <h4 className="partner-group-title">Industry MoUs</h4>
            <div className="partner-logo-row">
              {[
                { name: 'Microsoft',  logo: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64' },
                { name: 'SAP',        logo: 'https://www.google.com/s2/favicons?domain=sap.com&sz=64' },
                { name: 'Oracle',     logo: 'https://www.google.com/s2/favicons?domain=oracle.com&sz=64' },
                { name: 'Siemens',    logo: 'https://www.google.com/s2/favicons?domain=siemens.com&sz=64' },
                { name: 'Bosch',      logo: 'https://www.google.com/s2/favicons?domain=bosch.com&sz=64' },
              ].map((p, i) => (
                <div className="partner-logo-box" key={i}>
                  <img src={p.logo} alt={p.name} onError={e => e.target.style.opacity = '0'} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="partners-cta">
          <p>Interested in partnering with BEC?</p>
          <a href="/" className="btn-gold">Explore Collaboration →</a>
        </div>
      </section>

      {/* ── TOP RECRUITERS ────────────────────────────────── */}
      <section className="recruit-section">
        <p className="section-tag center">Placements</p>
        <h2 className="sec-title">Our Top Recruiters</h2>
        <p className="sec-sub">150+ leading companies hire our graduates every year</p>
        <div className="recruit-row">
          {[
            { name: 'TCS',           domain: 'tcs.com',           color: '#0096D8', logo: 'https://www.google.com/s2/favicons?domain=tcs.com&sz=128' },
            { name: 'Infosys',       domain: 'infosys.com',       color: '#007CC3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png' },
            { name: 'Wipro',         domain: 'wipro.com',         color: '#341C5C', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png' },
            { name: 'Cognizant',     domain: 'cognizant.com',     color: '#1C4DA1', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Cognizant%27s_logo.svg/200px-Cognizant%27s_logo.svg.png' },
            { name: 'HCL',           domain: 'hcltech.com',       color: '#0076C0', logo: 'https://www.google.com/s2/favicons?domain=hcltech.com&sz=128' },
            { name: 'Accenture',     domain: 'accenture.com',     color: '#A100FF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png' },
            { name: 'Capgemini',     domain: 'capgemini.com',     color: '#0070AD', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Capgemini_201x_logo.svg/200px-Capgemini_201x_logo.svg.png' },
            { name: 'IBM',           domain: 'ibm.com',           color: '#006699', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png' },
            { name: 'Tech Mahindra', domain: 'techmahindra.com',  color: '#E3002B', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Tech_Mahindra_new_logo.svg/200px-Tech_Mahindra_new_logo.svg.png' },
            { name: 'L&T',           domain: 'larsentoubro.com',  color: '#F7941D', logo: 'https://www.google.com/s2/favicons?domain=larsentoubro.com&sz=128' },
            { name: 'Amazon',        domain: 'amazon.com',        color: '#FF9900', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png' },
            { name: 'Zoho',          domain: 'zoho.com',          color: '#E42527', logo: 'https://www.google.com/s2/favicons?domain=zoho.com&sz=128' },
            { name: 'Freshworks',    domain: 'freshworks.com',    color: '#25C16F', logo: 'https://www.google.com/s2/favicons?domain=freshworks.com&sz=128' },
            { name: "BYJU'S",        domain: 'byjus.com',         color: '#7B2D8B', logo: 'https://www.google.com/s2/favicons?domain=byjus.com&sz=128' },
            { name: 'Hexaware',      domain: 'hexaware.com',      color: '#E02A2A', logo: 'https://www.google.com/s2/favicons?domain=hexaware.com&sz=128' },
            { name: 'Mphasis',       domain: 'mphasis.com',       color: '#005BAA', logo: 'https://www.google.com/s2/favicons?domain=mphasis.com&sz=128' },
          ].map((company, i) => (
            <div className="recruit-box" key={i}>
              <img
                src={company.logo}
                alt={company.name}
                className="recruit-logo"
                onError={(e) => {
                  if (!e.target.dataset.fb) {
                    /* First fallback: Google Favicon (always works) */
                    e.target.dataset.fb = '1';
                    e.target.src = `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`;
                  } else {
                    /* Last resort: show branded color initial */
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
              <div className="recruit-initial" style={{ display: 'none', background: company.color }}>
                {company.name.charAt(0)}
              </div>
              <span>{company.name}</span>
            </div>
          ))}
        </div>
        <div className="recruit-stats">
          {[
            { num: '1200+', label: 'Students Placed' },
            { num: '95%', label: 'Placement Rate' },
            { num: '8.5 LPA', label: 'Highest Package' },
            { num: '150+', label: 'Recruiting Companies' },
          ].map((s, i) => (
            <div className="rs-box" key={i}>
              <h3>{s.num}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADMISSION PROCESS ─────────────────────────────── */}
      <section className="admission-section">
        <p className="section-tag center">Admissions</p>
        <h2 className="sec-title">How to Apply</h2>
        <p className="sec-sub">Simple 5-step process to join Best Engineering College</p>
        <div className="admission-row">
          {[
            { num: '01', title: 'Register Online', desc: 'Fill the online application form with your basic details and academic records.' },
            { num: '02', title: 'Submit Documents', desc: 'Upload your 10th, 12th marksheets, transfer certificate and community certificate.' },
            { num: '03', title: 'TNEA Counselling', desc: 'Attend TNEA counselling by Anna University and select Best Engineering College.' },
            { num: '04', title: 'Pay Fees', desc: 'Complete the fee payment online or at the college office to confirm your seat.' },
            { num: '05', title: 'Join Classes', desc: 'Collect your ID card, attend orientation and begin your journey at BEC.' },
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className="admission-box">
                <div className="adm-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {i < arr.length - 1 && <div className="adm-arrow">&#8594;</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="adm-bottom">
          <p>Admissions open for 2025-26 &nbsp;|&nbsp; Last date: <strong>July 31, 2025</strong></p>
          <a href="/" className="btn-gold">Apply Now</a>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="faq-section">
        <p className="section-tag center">FAQ</p>
        <h2 className="sec-title">Frequently Asked Questions</h2>
        <p className="sec-sub">Common questions about admissions, programs, and campus life</p>
        <div className="faq-list">
          {[
            { q: 'What programs does Best Engineering College offer?', a: 'We offer B.E. and B.Tech programs in Computer Science, Electronics, Mechanical, Civil, Information Technology, and Biotechnology. We also offer M.E. and Ph.D programs in select disciplines.' },
            { q: 'Is Best Engineering College affiliated to Anna University?', a: 'Yes, Best Engineering College is an autonomous institution affiliated to Anna University, Chennai. All degrees are awarded by Anna University.' },
            { q: 'What is the placement record of the college?', a: 'We maintain a 95% placement rate. Top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, and many more. Our dedicated placement cell works year-round to connect students with top companies.' },
            { q: 'Does the college provide hostel facilities?', a: 'Yes, we have separate hostel facilities for boys (600 capacity) and girls (400 capacity) with all modern amenities including Wi-Fi, mess, laundry, and 24/7 security.' },
            { q: 'How can I apply for admission?', a: 'Admissions are based on TNEA counselling for B.E. programs. You can also visit our admissions office or apply online through our student portal. Contact us at admissions@bec.edu.in for more details.' },
            { q: 'Is the college NAAC accredited?', a: 'Yes, Best Engineering College is NAAC accredited with an A Grade (Score: 3.24/4.0). We are also NBA accredited and ISO 9001:2015 certified, ensuring the highest standards of education.' },
            { q: 'Are scholarships available for students?', a: 'Yes, we offer various scholarships including government scholarships, merit-based scholarships, sports scholarships, and EWS support. Visit the scholarship cell for more information.' },
            { q: 'When was the college established?', a: 'Best Engineering College was established in 2016 and has since grown into a premier technical institution with excellent infrastructure and experienced faculty.' },
          ].map((faq, i) => (
            <div className="faq-item" key={i}>
              <div className="faq-q" onClick={(e) => e.currentTarget.parentElement.classList.toggle('open')}>
                <span>{faq.q}</span>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-a">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPLORE MORE ──────────────────────────────────── */}
      <section className="explore-section">
        <p className="section-tag center">Resources</p>
        <h2 className="sec-title">Explore More</h2>
        <p className="sec-sub">Discover academic resources, research publications, and campus information</p>
        <div className="explore-grid">
          {[
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: 'Academic Calendar', desc: 'View semester schedules, exam timetables, and important academic dates for 2025-26.', link: '/', label: 'View Calendar →' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>, title: 'Research & Publications', desc: 'Access research papers, journals, and publications by our faculty and students.', link: '/', label: 'Explore Research →' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, title: 'Course Curriculum', desc: 'Detailed syllabus and course structure for all B.E/B.Tech programs offered.', link: '/', label: 'View Syllabus →' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>, title: 'Student Achievements', desc: 'Awards, competitions, hackathons, and recognitions earned by our students.', link: '/', label: 'View Achievements →' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: 'E-Learning Portal', desc: 'Access online lectures, study materials, and digital resources 24/7.', link: '/portal', label: 'Access Portal →' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, title: 'Examination Cell', desc: 'Hall tickets, results, revaluation applications, and grade cards.', link: '/', label: 'Exam Info →' },
          ].map((card, i) => (
            <div className="explore-card" key={i}>
              <div className="explore-icon">{card.svg}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <a href={card.link} className="explore-link">{card.label}</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────── */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Stay Updated with BEC</h2>
            <p>Subscribe to our newsletter for the latest announcements, events, and campus news.</p>
          </div>
          {newsletterSent ? (
            <div className="newsletter-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Thank you for subscribing! You'll hear from us soon.
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-gold">Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-left">
            <p className="section-tag">Get In Touch</p>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px' }}>Contact Us</h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginBottom: '28px' }}>
              Have questions about admissions, courses, or campus life? We're here to help.
            </p>
            <div className="contact-info-box">
              <div className="cinfo-item">
                <div className="cinfo-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Best Engineering College<br />NH-48, Pennalur Village<br />Sriperumbudur Taluk<br />Kanchipuram - 602 117, Tamil Nadu</p>
                </div>
              </div>
              <div className="cinfo-item">
                <div className="cinfo-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73A16 16 0 0 0 15.27 16.1l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p>Office: +91 44 2716 3000<br />Admissions: +91 98765 43210<br />Mon–Sat: 9:00 AM – 5:00 PM</p>
                </div>
              </div>
              <div className="cinfo-item">
                <div className="cinfo-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p>General: info@bec.edu.in<br />Admissions: admissions@bec.edu.in<br />Placements: placements@bec.edu.in</p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-right">
            <div className="contact-form-card">
              <h3>Send us a Message</h3>
              <form className="contact-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" placeholder="Enter your name" required />
                </div>
                <div className="form-row-two">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" placeholder="your@email.com" required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select required>
                    <option value="">Select a topic</option>
                    <option>Admission Enquiry</option>
                    <option>Course Information</option>
                    <option>Placement Cell</option>
                    <option>Campus Visit</option>
                    <option>General Query</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea rows="4" placeholder="Type your message here..." required></textarea>
                </div>
                <button type="submit" className="contact-submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ─────────────────────────────────── */}
      <section className="contact-strip">
        <div className="contact-strip-inner">
          <div className="contact-item">
            <div className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <h4>Address</h4>
              <p>NH-48, Pennalur Village, Sriperumbudur Taluk,<br />Kanchipuram - 602 117, Tamil Nadu</p>
            </div>
          </div>
          <div className="contact-divider"></div>
          <div className="contact-item">
            <div className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73A16 16 0 0 0 15.27 16.1l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <h4>Phone</h4>
              <p>+91 44 2716 3000</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
          <div className="contact-divider"></div>
          <div className="contact-item">
            <div className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h4>Email</h4>
              <p>admissions@bec.edu.in</p>
              <p>info@bec.edu.in</p>
            </div>
          </div>
          <div className="contact-divider"></div>
          <div className="contact-item">
            <div className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h4>Working Hours</h4>
              <p>Monday–Saturday</p>
              <p>9:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAMPUS TOUR VIRTUAL MODAL ───────────────────────── */}
      {showTourModal && (
        <div className="custom-modal-overlay" onClick={() => setShowTourModal(false)}>
          <div className="custom-modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTourModal(false)}>×</button>
            <div className="modal-body">
              <h3 className="modal-title">BEC Campus Tour</h3>
              <p className="modal-sub">Take a virtual journey through our premium infrastructure</p>
              
              <div className="tour-slideshow">
                <img
                  src={tourSlides[tourSlideIndex].img}
                  alt={tourSlides[tourSlideIndex].title}
                  className="tour-slide-img"
                />
                <button className="tour-nav-btn tour-nav-prev" onClick={prevTourSlide}>‹</button>
                <button className="tour-nav-btn tour-nav-next" onClick={nextTourSlide}>›</button>
                
                <div className="tour-slide-content">
                  <h4>{tourSlides[tourSlideIndex].title}</h4>
                  <p>{tourSlides[tourSlideIndex].desc}</p>
                </div>
              </div>
              
              <p className="modal-text">Our 50-acre smart campus supports collaborative learning, research investigations, and a vibrant community life. We invite you to visit Pennalur in person for a guided tour.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMISSIONS ENQUIRY FORM MODAL ────────────────────── */}
      {showEnquiryModal && (
        <div className="custom-modal-overlay" onClick={() => setShowEnquiryModal(false)}>
          <div className="custom-modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowEnquiryModal(false)}>×</button>
            <div className="modal-body">
              <h3 className="modal-title">Admission Enquiry</h3>
              <p className="modal-sub">Submit your details to receive curriculum information and fee structures.</p>
              
              {enquirySuccess ? (
                <div className="enquiry-success-box">
                  <h4>Enquiry Logged Successfully</h4>
                  <p>Our admissions officer will call you at the provided phone number to discuss your entry queries.</p>
                  <button type="button" className="btn-gold" style={{ border: 'none', cursor: 'pointer' }} onClick={() => { setShowEnquiryModal(false); setEnquirySuccess(false); }}>Close</button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit}>
                  <div className="form-group">
                    <label>Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter student's full name"
                      value={enquiryForm.name}
                      onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter parent/student email"
                      value={enquiryForm.email}
                      onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="Enter 10-digit mobile number"
                      value={enquiryForm.phone}
                      onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Department *</label>
                    <select
                      value={enquiryForm.dept}
                      onChange={e => setEnquiryForm({ ...enquiryForm, dept: e.target.value })}
                    >
                      <option value="Computer Science Engineering">Computer Science Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Biotechnology">Biotechnology</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Query details</label>
                    <textarea
                      rows="3"
                      placeholder="Enter any questions regarding fees, scholarship, or hostels"
                      value={enquiryForm.notes}
                      onChange={e => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-gold form-submit-btn">Submit Enquiry Form</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Home;
