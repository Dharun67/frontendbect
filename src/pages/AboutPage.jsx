import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../assets/css/style.css';
import '../assets/css/aboutpage.css';
import principalImg from '../assets/images/principal.jpg';

function AboutPage() {
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [activeFaq, setActiveFaq] = useState(null);

  const milestones = [
    { year: '2016', category: 'establishment', title: 'College Founded', desc: 'Best Engineering College established with CSE and ECE departments. First batch of 300 students admitted.' },
    { year: '2018', category: 'establishment', title: 'New Departments Added', desc: 'Mechanical, Civil, IT and Biotechnology departments launched. Student strength crossed 1500.' },
    { year: '2019', category: 'accreditation', title: 'ISO Certification', desc: 'Received ISO 9001:2015 certification for quality management systems in education and administration.' },
    { year: '2021', category: 'accreditation', title: 'NAAC A Grade', desc: 'Accredited with NAAC A Grade — a recognition of our academic quality, infrastructure and student outcomes.' },
    { year: '2022', category: 'accreditation', title: 'NBA Accreditation', desc: 'CSE, ECE and Mechanical departments received NBA accreditation from the National Board of Accreditation.' },
    { year: '2024', category: 'scale', title: '5000+ Students', desc: 'Student enrollment crossed 5000. Placement rate reached an all-time high of 95% with 150+ recruiting companies.' },
  ];

  const filteredMilestones = timelineFilter === 'all'
    ? milestones
    : milestones.filter(m => m.category === timelineFilter);

  return (
    <>
      <Navbar />

      <section className="page-banner">
        <div className="banner-content">
          <p className="section-tag">About Us</p>
          <h2>Building Engineers,<br />Shaping <span className="highlight">Futures</span></h2>
          <p>Established in 2016, Best Engineering College has grown into one of Tamil Nadu's most respected technical institutions, committed to academic excellence and student success.</p>
        </div>
        <div className="banner-img">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&q=80" alt="College Campus" />
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card"><h3>9+</h3><p>Years of Excellence</p></div>
        <div className="stat-card"><h3>5000+</h3><p>Students Enrolled</p></div>
        <div className="stat-card"><h3>200+</h3><p>Expert Faculty</p></div>
        <div className="stat-card"><h3>95%</h3><p>Placement Rate</p></div>
        <div className="stat-card"><h3>150+</h3><p>Recruiting Companies</p></div>
        <div className="stat-card"><h3>6</h3><p>Departments</p></div>
      </section>

      <section className="vm-section">
        <div className="vm-box">
          <div className="vm-icon"><div className="icon-vision"></div></div>
          <h3>Our Vision</h3>
          <p>To be a globally recognized institution that produces technically skilled, ethically grounded and socially responsible engineers who contribute meaningfully to society and industry.</p>
        </div>
        <div className="vm-box">
          <div className="vm-icon"><div className="icon-mission"></div></div>
          <h3>Our Mission</h3>
          <p>To provide quality technical education through experienced faculty, modern infrastructure and strong industry partnerships, enabling students to achieve their full potential in their careers.</p>
        </div>
        <div className="vm-box">
          <div className="vm-icon"><div className="icon-values"></div></div>
          <h3>Our Values</h3>
          <p>Integrity, Innovation, Inclusiveness and Excellence are the four pillars that guide every decision we make — from curriculum design to student welfare and campus development.</p>
        </div>
      </section>

      <section className="pillars-section">
        <p className="section-tag center">Pillars</p>
        <h2 className="sec-title">Our Strategic Pillars</h2>
        <p className="sec-sub">The four core areas that define our commitment to engineering excellence</p>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-card-num">01</div>
            <h3>Academic Excellence</h3>
            <p>Developing an industry-aligned curriculum that emphasizes problem-solving, active learning, and critical thinking under the guidance of expert faculty members.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-card-num">02</div>
            <h3>Research &amp; Innovation</h3>
            <p>Promoting a culture of scientific inquiry, patent filings, and technology transfer through state-of-the-art research centers and industry collaborations.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-card-num">03</div>
            <h3>Industry Integration</h3>
            <p>Fostering deep partnerships with top-tier global corporations for internships, industrial training, sponsored projects, and campus recruitments.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-card-num">04</div>
            <h3>Holistic Development</h3>
            <p>Nurturing leadership qualities, ethical frameworks, social responsibilities, and physical well-being through sports, arts, and community engagement programs.</p>
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="history-text">
          <p className="section-tag">Our Story</p>
          <h2>A Decade of Academic Excellence</h2>
          <p>Best Engineering College was founded in 2016 with a single vision — to provide affordable, quality engineering education to students from all backgrounds. Starting with just two departments and 300 students, the college has grown rapidly into a full-fledged technical institution.</p>
          <p>Over the years, we have earned NAAC A Grade accreditation, NBA accreditation for multiple departments, and ISO certification — all testaments to our unwavering commitment to quality. Today, we are home to over 5000 students and 200 faculty members across six departments.</p>
          <p>Our alumni are working in top companies across India and abroad, and many have gone on to pursue higher studies at prestigious universities. We are proud of every student who has walked through our gates and carried the BEC name forward.</p>
          <div className="history-tags">
            <span>Founded 2016</span><span>NAAC A Grade</span><span>NBA Accredited</span><span>ISO Certified</span><span>Anna University Affiliated</span>
          </div>
        </div>
        <div className="history-img">
          <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=700&q=80" alt="Campus Central Court" />
        </div>
      </section>

      <section className="wcu-section">
        <div className="wcu-img">
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80" alt="Students studying together" />
        </div>
        <div className="wcu-text">
          <p className="section-tag">Why Choose Us</p>
          <h2>A Premier Gateway to Professional Success</h2>
          <p>We provide a comprehensive educational ecosystem designed to foster intellectual growth and professional competence. Our commitment to student success is reflected in every aspect of campus life.</p>
          <div className="wcu-list">
            <div className="wcu-item">
              <div className="wcu-icon-marker"></div>
              <div className="wcu-item-content">
                <h4>Doctoral &amp; Experienced Faculty</h4>
                <p>Over 70% of our senior faculty members hold PhDs from institutions of national repute, ensuring expert guidance and academic mentorship.</p>
              </div>
            </div>
            <div className="wcu-item">
              <div className="wcu-icon-marker"></div>
              <div className="wcu-item-content">
                <h4>Exceptional Placement Training</h4>
                <p>Our dedicated Placement and Training Cell offers tailored bootcamps, coding practice, and mock interviews from the second year onwards.</p>
              </div>
            </div>
            <div className="wcu-item">
              <div className="wcu-icon-marker"></div>
              <div className="wcu-item-content">
                <h4>Advanced Labs &amp; Smart Campus</h4>
                <p>Fully equipped department-specific laboratories, smart classrooms, and 24/7 high-speed Wi-Fi access support modern study and research needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="milestone-section">
        <p className="section-tag center">Journey</p>
        <h2 className="sec-title">Our Milestones</h2>
        <p className="sec-sub">Key achievements in our growth story</p>

        <div className="timeline-filters">
          <button
            onClick={() => setTimelineFilter('all')}
            className={`filter-btn ${timelineFilter === 'all' ? 'active' : ''}`}
          >
            All Milestones
          </button>
          <button
            onClick={() => setTimelineFilter('establishment')}
            className={`filter-btn ${timelineFilter === 'establishment' ? 'active' : ''}`}
          >
            Establishment (2016-2018)
          </button>
          <button
            onClick={() => setTimelineFilter('accreditation')}
            className={`filter-btn ${timelineFilter === 'accreditation' ? 'active' : ''}`}
          >
            Accreditations (2019-2022)
          </button>
          <button
            onClick={() => setTimelineFilter('scale')}
            className={`filter-btn ${timelineFilter === 'scale' ? 'active' : ''}`}
          >
            Scale &amp; Placement (2024)
          </button>
        </div>

        <div className="milestone-list">
          {filteredMilestones.map(m => (
            <div className="milestone-item" key={m.year}>
              <div className="ms-year">{m.year}</div>
              <div className="ms-line"></div>
              <div className="ms-content"><h4>{m.title}</h4><p>{m.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="leadership-section">
        <p className="section-tag center">Leadership</p>
        <h2 className="sec-title">Our Management</h2>
        <p className="sec-sub">The people who guide Best Engineering College</p>
        <div className="leader-row">
          {[
            { img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80', name: 'Dr. R. Subramaniam', role: 'Chairman', desc: 'A visionary leader with 30+ years in education management. Founded BEC with the goal of making quality engineering education accessible to all.' },
            { img: principalImg, name: 'Dr. M. Jagath', role: 'Principal', desc: 'PhD from IIT Madras with 25 years of academic experience. Leads the college with a focus on research, innovation and student welfare.' },
            { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80', name: 'Dr. K. Rajendran', role: 'Dean - Academics', desc: 'Oversees curriculum development, faculty training and academic quality. Has published 40+ research papers in international journals.' },
            { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80', name: 'Mrs. P. Kavitha', role: 'Placement Officer', desc: 'Manages industry relations and campus recruitment. Built strong ties with 150+ companies ensuring consistent placement success.' },
          ].map(l => (
            <div className="leader-card" key={l.name}>
              <div className="leader-img-wrap"><img src={l.img} alt={l.role} /></div>
              <h3>{l.name}</h3>
              <span>{l.role}</span>
              <p>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="accred-section">
        <p className="section-tag center">Recognition</p>
        <h2 className="sec-title">Accreditations &amp; Certifications</h2>
        <p className="sec-sub">Our quality is recognised by leading bodies in India</p>
        <div className="accred-row">
          {[
            { 
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              ), 
              name: 'NAAC', 
              desc: 'National Assessment and Accreditation Council — A Grade' 
            },
            { 
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 11l2 2 4-4" />
                </svg>
              ), 
              name: 'NBA', 
              desc: 'National Board of Accreditation — CSE, ECE, Mech' 
            },
            { 
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 22v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M2 22h20" />
                  <path d="M12 2L2 7h20z" />
                  <line x1="6" y1="16" x2="6" y2="11" />
                  <line x1="12" y1="16" x2="12" y2="11" />
                  <line x1="18" y1="16" x2="18" y2="11" />
                </svg>
              ), 
              name: 'Anna University', 
              desc: 'Affiliated to Anna University, Chennai — Autonomous Status' 
            },
            { 
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              ), 
              name: 'ISO 9001:2015', 
              desc: 'Certified for Quality Management Systems in Education' 
            },
            { 
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              ), 
              name: 'UGC Recognised', 
              desc: 'Recognised by the University Grants Commission of India' 
            },
            { 
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              ), 
              name: 'AICTE Approved', 
              desc: 'Approved by All India Council for Technical Education' 
            },
          ].map(a => (
            <div className="accred-box" key={a.name}>
              <div className="accred-icon-wrap">{a.icon}</div>
              <h3>{a.name}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="satisfaction-section">
        <div className="satisfaction-left">
          <p className="section-tag">Student Feedback</p>
          <h2>What Our Students &amp; Parents Say</h2>
          <p>We take pride in the trust our students and their families place in us. Here is what they have to say about their experience at Best Engineering College.</p>
          <div className="satisfaction-stats">
            <div className="sat-stat"><h3>98%</h3><p>Student Satisfaction Rate</p></div>
            <div className="sat-stat"><h3>96%</h3><p>Parent Satisfaction Rate</p></div>
            <div className="sat-stat"><h3>4.8/5</h3><p>Average Rating</p></div>
          </div>
        </div>
        <div className="satisfaction-right">
          <div className="sat-card">
            <div className="sat-top">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80" alt="Alumnus Rajesh" />
              <div>
                <h4>Rajesh Kumar</h4>
                <span>CSE Alumnus, Class of 2022</span>
              </div>
            </div>
            <p>"The academic training and practical lab experience at Best Engineering College provided a strong foundation. The career guidance and mock interviews conducted by the placement cell were crucial in helping me secure a role at a leading technology corporation."</p>
            <div className="stars">★★★★★</div>
          </div>
          <div className="sat-card">
            <div className="sat-top">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Alumna Sneha" />
              <div>
                <h4>Sneha Harish</h4>
                <span>ECE Alumna, Class of 2023</span>
              </div>
            </div>
            <p>"Participating in hands-on workshops and industry-sponsored projects allowed me to develop real-world problem-solving skills. The placement cell is highly active and brings top-tier companies to campus."</p>
            <div className="stars">★★★★★</div>
          </div>
          <div className="sat-card">
            <div className="sat-top">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80" alt="Parent Ramakrishnan" />
              <div>
                <h4>Dr. M. Ramakrishnan</h4>
                <span>Parent of Alumnus</span>
              </div>
            </div>
            <p>"As a parent, I am highly satisfied with the academic discipline, security, and holistic development opportunities offered by the college. The faculty members are very supportive and keep parents informed about student progress."</p>
            <div className="stars">★★★★★</div>
          </div>
        </div>
      </section>

      <section className="infra-section">
        <p className="section-tag center">Infrastructure</p>
        <h2 className="sec-title">World-Class Infrastructure</h2>
        <p className="sec-sub">Built to support learning, research and student life</p>
        <div className="infra-row">
          {[
            { img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80', title: '30+ Laboratories', desc: 'Fully equipped labs for every department with the latest hardware and software tools.' },
            { img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&q=80', title: 'Central Library', desc: '50,000+ books, e-journals, NPTEL access and a dedicated reading hall open 7 days a week.' },
            { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80', title: 'Sports Complex', desc: 'Cricket ground, football field, basketball and badminton courts with a fully equipped gym.' },
            { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=80', title: 'Hostel Facilities', desc: 'Separate hostels for boys and girls with Wi-Fi, mess, laundry and 24/7 security.' },
          ].map(i => (
            <div className="infra-box" key={i.title}>
              <img src={i.img} alt={i.title} />
              <div className="infra-info"><h3>{i.title}</h3><p>{i.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="research-centers-section">
        <p className="section-tag center">Research &amp; Development</p>
        <h2 className="sec-title">Collaborative Research Centers</h2>
        <p className="sec-sub">Fostering innovation through dedicated industry-sponsored research clusters</p>
        <div className="research-grid">
          <div className="research-card">
            <h4>Center for Artificial Intelligence &amp; Deep Learning</h4>
            <p>Focuses on computer vision, deep reinforcement learning, natural language processing, and medical image analytics. Equipped with state-of-the-art server racks and computing workstations.</p>
          </div>
          <div className="research-card">
            <h4>VLSI &amp; Embedded Systems Development Division</h4>
            <p>Dedicated to chip verification architectures, SoC design prototypes, and hardware security frameworks. Operates in collaboration with leading semiconductor design laboratories.</p>
          </div>
          <div className="research-card">
            <h4>Renewable Energy &amp; Smart Grid Laboratory</h4>
            <p>Conducts advanced experimentation in photovoltaic cell efficiencies, clean wind integration systems, and microgrid management protocols to address global environmental issues.</p>
          </div>
          <div className="research-card">
            <h4>Advanced Composite Materials Research Facility</h4>
            <p>Examines properties of lightweight engineering polymers, structural alloys, and nanomaterial coatings. Serves as a testing center for regional aerospace and automotive engineering projects.</p>
          </div>
        </div>
      </section>

      <section className="mou-section">
        <p className="section-tag center">Corporate Integration</p>
        <h2 className="sec-title">Strategic Industrial Partnerships</h2>
        <p className="sec-sub">Active collaborations providing students with internships, industry certifications, and joint research ventures</p>
        <div className="mou-grid">
          <div className="mou-card">
            <div className="mou-partner-header">
              <h5>Microsoft Learn Career Alliance</h5>
            </div>
            <p>Enables students to access specialized cloud computing certifications, Azure sandboxes, and expert lectures directly from senior Microsoft architects.</p>
          </div>
          <div className="mou-card">
            <div className="mou-partner-header">
              <h5>Oracle Academy Program</h5>
            </div>
            <p>Provides curriculum integration for advanced database administration, Java programming, and cloud infrastructure architectures, aligning academics with corporate expectations.</p>
          </div>
          <div className="mou-card">
            <div className="mou-partner-header">
              <h5>Cisco Networking Academy (NetAcad)</h5>
            </div>
            <p>A specialized facility where students train on networking design, enterprise routing, switching protocols, and internet security, working towards CCNA certifications.</p>
          </div>
        </div>
      </section>

      <section className="clubs-section">
        <p className="section-tag center">Campus Life</p>
        <h2 className="sec-title">Co-Curricular &amp; Technical Clubs</h2>
        <p className="sec-sub">Enabling holistic growth and technical leadership through student-led initiatives</p>
        <div className="clubs-grid">
          <div className="club-card">
            <h5>The Coding &amp; Hackathon Society</h5>
            <p>Conducts weekly algorithmic practice sessions, programming bootcamps, and mock competitive code reviews. Prepares students for national hackathons and developer summits.</p>
          </div>
          <div className="club-card">
            <h5>Robotics &amp; Automation Guild</h5>
            <p>Provides hands-on experience in microcontroller programming, automated sensor calibration, and mechanical structural prototyping. Competes in international design challenges.</p>
          </div>
          <div className="club-card">
            <h5>Eco-Restoration &amp; Social Service Unit</h5>
            <p>Organizes community development drives, environmental sustainability workshops, tree plantations, and health clinics in neighboring villages under National Service Schemes.</p>
          </div>
          <div className="club-card">
            <h5>Literary, Debating &amp; Editorial Council</h5>
            <p>Enhances public speaking capability, verbal articulation, and soft skills through debate panels, public speaking forums, and the publication of the annual college journal.</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <p className="section-tag center">Support</p>
        <h2 className="sec-title">Frequently Asked Questions</h2>
        <p className="sec-sub">Find answers to common inquiries about Best Engineering College</p>
        <div className="faq-list">
          {[
            {
              q: "What is the accreditation status of Best Engineering College?",
              a: "Best Engineering College is affiliated to Anna University, Chennai, and approved by the All India Council for Technical Education (AICTE), New Delhi. It is accredited with an 'A' Grade by the National Assessment and Accreditation Council (NAAC). Furthermore, our core programs, including Computer Science & Engineering, Electronics & Communication Engineering, and Mechanical Engineering, are accredited by the National Board of Accreditation (NBA)."
            },
            {
              q: "What is the training methodology of the Placement Cell?",
              a: "Our Placement and Training Cell implements a structured, multi-stage training program starting from the second year of study. This includes training in quantitative aptitude, logical reasoning, verbal ability, coding skills, and soft skills. Additionally, we conduct regular mock interviews, group discussions, and industry interaction sessions led by corporate professionals to prepare students for top MNCs."
            },
            {
              q: "How does the institution support research and student innovation?",
              a: "The college hosts a dedicated Research & Development (R&D) Cell and an Innovation & Entrepreneurship Development Cell (IEDC). Students are encouraged to participate in national hackathons, publish papers in indexed journals, and develop prototypes for real-world problems. We provide funding support for student-led projects and assist with intellectual property and patent filings."
            },
            {
              q: "What facilities are provided in the campus hostels?",
              a: "We offer separate, secure, and modern hostel facilities for male and female students. The hostels feature spacious rooms, high-speed Wi-Fi connectivity, a modern hygienic mess serving nutritious food, laundry services, indoor sports rooms, a gymnasium, and 24/7 medical assistance and security personnel."
            },
            {
              q: "Does the college offer scholarships and financial aid?",
              a: "Yes, Best Engineering College offers a range of scholarships based on academic merit, sports achievements, and socio-economic background. We also facilitate the application process for government scholarships, community scholarships, and first-generation graduate concessions to ensure engineering education is accessible to all deserving students."
            }
          ].map((item, index) => (
            <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <h4>{item.q}</h4>
                <span className="faq-icon-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AboutPage;
