import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../assets/css/placements.css';

function PlacementsPage() {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeYear, setActiveYear] = useState(1);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Recruiter Data
  const recruiters = [
    {
      name: 'Zoho Corporation',
      category: 'IT / Tech',
      package: '8.5 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      details: {
        eligibility: '7.0 CGPA and above, no standing backlogs at the time of drive',
        hiredCount: 42,
        location: 'Chennai / Tenkasi, Tamil Nadu',
        roles: ['Software Developer', 'Quality Assurance Engineer', 'Technical Support Engineer'],
        stages: [
          'Round 1: Written Aptitude, Logical Reasoning & Basic Programming MCQs',
          'Round 2: Code Construction Round (Advanced Algorithms & Problem solving)',
          'Round 3: System Design and Technical Face-to-Face Interview',
          'Round 4: General HR Discussion'
        ]
      }
    },
    {
      name: 'TATA Consultancy Services',
      category: 'Consulting & Services',
      package: '6.5 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      details: {
        eligibility: '6.0 CGPA and above, maximum 1 standing backlog allowed during registration',
        hiredCount: 110,
        location: 'Pan India (Chennai, Bangalore, Pune, Noida)',
        roles: ['Systems Engineer (Ninja)', 'Developer (Digital)', 'Researcher (Prime)'],
        stages: [
          'Round 1: TCS NQT Online Test (Numerical Ability, Reasoning, Verbal & Coding)',
          'Round 2: Technical Panel Interview',
          'Round 3: Managerial & HR Panel Verification'
        ]
      }
    },
    {
      name: 'Infosys',
      category: 'Consulting & Services',
      package: '5.0 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
      details: {
        eligibility: '6.5 CGPA and above, no active backlogs',
        hiredCount: 85,
        location: 'Bangalore, Mysore, Pune, India',
        roles: ['System Engineer Specialist', 'Power Programmer', 'Associate Software Engineer'],
        stages: [
          'Round 1: Infosys Certification Test (Logical, Mathematical, Verbal, Pseudocode)',
          'Round 2: Specialized Hands-on Coding Assessment',
          'Round 3: Combined Technical & HR Interview'
        ]
      }
    },
    {
      name: 'Wipro',
      category: 'Consulting & Services',
      package: '4.5 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      details: {
        eligibility: '6.0 CGPA and above, no standing backlogs',
        hiredCount: 72,
        location: 'Bangalore, Chennai, Hyderabad, India',
        roles: ['Project Engineer (Elite)', 'Developer (Turbo)'],
        stages: [
          'Round 1: Wipro Elite Online Assessment (Aptitude, Essay writing, Coding)',
          'Round 2: Technical Interview',
          'Round 3: HR Panel Interview'
        ]
      }
    },
    {
      name: 'Cognizant',
      category: 'Consulting & Services',
      package: '5.5 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      details: {
        eligibility: '6.0 CGPA and above, maximum 1 backlog permitted',
        hiredCount: 95,
        location: 'Chennai, Coimbatore, Bangalore, India',
        roles: ['Programmer Analyst Trainee', 'GenC Elevate Developer'],
        stages: [
          'Round 1: Online Cognitive & Technical Assessment',
          'Round 2: Subject Matter Expert Interview',
          'Round 3: General HR Panel'
        ]
      }
    },
    {
      name: 'HCL Technologies',
      category: 'Consulting & Services',
      package: '4.8 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      details: {
        eligibility: '6.0 CGPA and above, no active backlogs',
        hiredCount: 50,
        location: 'Noida, Chennai, Madurai, India',
        roles: ['Graduate Engineer Trainee', 'Network Support Associate'],
        stages: [
          'Round 1: Online Technical and Aptitude Assessment',
          'Round 2: Face-to-Face Technical Interview',
          'Round 3: HR Verification Round'
        ]
      }
    },
    {
      name: 'Amazon',
      category: 'IT / Tech',
      package: '12.0 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      details: {
        eligibility: '7.5 CGPA and above, clean academic track records without history of backlogs',
        hiredCount: 8,
        location: 'Bangalore, Hyderabad, Chennai, India',
        roles: ['Software Development Engineer I (SDE-1)', 'Cloud Support Associate'],
        stages: [
          'Round 1: Online Coding Test (3 DSA Problems & Workstyle Simulation)',
          'Round 2: Technical Interview 1 (Advanced Data Structures)',
          'Round 3: Technical Interview 2 (System Design & Leadership Principles)',
          'Round 4: Bar Raiser Interview'
        ]
      }
    },
    {
      name: 'Accenture',
      category: 'Consulting & Services',
      package: '6.0 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      ),
      details: {
        eligibility: '6.5 CGPA and above, no standing backlogs',
        hiredCount: 65,
        location: 'Bangalore, Hyderabad, Pune, India',
        roles: ['Associate Software Engineer', 'Advanced Application Engineering Analyst'],
        stages: [
          'Round 1: Cognitive, Technical & Coding Assessment',
          'Round 2: Technical Face-to-Face Panel',
          'Round 3: Communication Assessment and HR Review'
        ]
      }
    },
    {
      name: 'L&T Technology Services',
      category: 'Core Engineering',
      package: '5.2 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      details: {
        eligibility: '7.0 CGPA and above, Core engineering branches only (Mech, Civil, EEE, ECE)',
        hiredCount: 15,
        location: 'Chennai, Vadodara, Mumbai, India',
        roles: ['Design Engineer (Mechanical / Core)', 'Graduate Engineer Trainee'],
        stages: [
          'Round 1: Online Technical Assessment (Domain Specific)',
          'Round 2: Technical Panel Interview (Design principles)',
          'Round 3: Managerial & HR Panel'
        ]
      }
    },
    {
      name: 'Hyundai Motors',
      category: 'Core Engineering',
      package: '6.8 LPA',
      icon: (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      ),
      details: {
        eligibility: '7.0 CGPA and above, Mechanical, Automobile, and Electrical streams only',
        hiredCount: 12,
        location: 'Chennai Automotive Plant, Tamil Nadu',
        roles: ['Production Management Trainee', 'Embedded Systems Quality Analyst'],
        stages: [
          'Round 1: Online Core Engineering & Reasoning Assessment',
          'Round 2: Technical Group Discussion / Design Simulation',
          'Round 3: Technical Panel Interview',
          'Round 4: General HR Discussion'
        ]
      }
    }
  ];

  // Training roadmap data
  const trainingRoadmap = {
    1: [
      { num: 'Module 01', title: 'English Communication', desc: 'Comprehensive coaching in professional grammar, presentation skills, and public speaking.' },
      { num: 'Module 02', title: 'Basic Problem Solving', desc: 'Introduction to algorithmic logic, simple arithmetic puzzles, and flowcharts.' },
      { num: 'Module 03', title: 'Orientation Program', desc: 'Introductory seminars from corporate alumni detailing career pathways and options.' }
    ],
    2: [
      { num: 'Module 01', title: 'Quantitative Aptitude', desc: 'Focus on speed arithmetic, numerical concepts, time/distance problems, and ratios.' },
      { num: 'Module 02', title: 'Logical Reasoning', desc: 'Puzzles, data interpretation, verbal reasoning, syllogisms, and spatial logical thinking.' },
      { num: 'Module 03', title: 'Fundamentals of Coding', desc: 'Core programming syntax, object-oriented concepts, and basic structures using C++ or Java.' }
    ],
    3: [
      { num: 'Module 01', title: 'Data Structures & Algorithms', desc: 'Advanced trees, graphs, search algorithms, dynamic programming, and complexity.' },
      { num: 'Module 02', title: 'Competitive Coding Bootcamps', desc: 'Intensive practice sessions on platforms like HackerRank, LeetCode, and CodeChef.' },
      { num: 'Module 03', title: 'Mock Interviews & GDs', desc: 'Simulated technical/HR panels, group discussions, and resume writing workshops.' }
    ],
    4: [
      { num: 'Module 01', title: 'Company Specific Preparation', desc: 'Aptitude and coding patterns based on past recruitment papers of major recruiters.' },
      { num: 'Module 02', title: 'Domain Elective Bootcamps', desc: 'Core specialization prep: Fullstack development, Cloud architectures, Core Electrical, or Robotics.' },
      { num: 'Module 03', title: 'Recruitment Drives', desc: 'On-campus placement scheduling, off-campus referrals, and post-selection handholding.' }
    ]
  };

  // Department Placement percentages
  const departmentStats = [
    { dept: 'Computer Science & Engineering', percentage: 98 },
    { dept: 'Electronics & Communication Engineering', percentage: 97 },
    { dept: 'Artificial Intelligence & Data Science', percentage: 96 },
    { dept: 'Information Technology', percentage: 95 },
    { dept: 'Electrical & Electronics Engineering', percentage: 92 },
    { dept: 'Mechanical Engineering', percentage: 90 },
    { dept: 'Civil Engineering', percentage: 88 }
  ];

  // FAQ Accordion items
  const placementFAQs = [
    {
      q: 'Who is eligible to register for placements at BEC?',
      a: 'All pre-final and final year students who have maintained a minimum of 6.0 CGPA and have no standing backlogs are eligible to register for the campus placement process. A registration portal opens at the start of the 7th semester.'
    },
    {
      q: 'Does the college support internships during the final year?',
      a: 'Yes, students are highly encouraged to undertake project-based internships in companies. Our placement cell assists in securing internship-cum-placement offers, allowing students to work with recruiters in the 8th semester.'
    },
    {
      q: 'What is a Dream Offer policy at Best Engineering College?',
      a: 'To ensure equal opportunities, once a student secures an offer, they cannot participate in other drives, unless the company falls into the "Dream Offer" category. A Dream Offer is characterized by a salary package that is at least 1.5 times the value of the student\'s first offer.'
    },
    {
      q: 'Is placement training compulsory for students?',
      a: 'Yes, placement training is integrated into the academic curriculum starting from the second year. Attending these modules and clearing weekly assessments is mandatory for qualifying for on-campus drives.'
    }
  ];

  // Filters
  const filteredRecruiters = recruiters.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <div className="placements-body-bg">
        <div style={{ height: '30px' }}></div>
        
        {/* Factual, Formal Hero Banner Section */}
        <section className="place-hero">
          <div className="place-hero-content">
            <span className="place-officer-tag">Liaison &amp; Training Division</span>
            <h1>Campus Placement &amp; Training Cell</h1>
            <p>
              The Placement and Training Cell at Best Engineering College operates as a structured department bridging academic instruction and corporate recruitment.
              The cell manages year-round training programs in quantitative aptitude, technical programming, soft skills, and mock interview panels. We coordinate
              campus recruitment schedules with major recruiters to recruit graduates across computing, core engineering, and consulting services.
            </p>

            <div className="place-stats-grid">
              {[
                { val: '95%', label: 'Placement Rate' },
                { val: '1200+', label: 'Students Placed' },
                { val: '12.0 LPA', label: 'Highest Package' },
                { val: '4.2 LPA', label: 'Average Package' },
                { val: '150+', label: 'Recruiter Network' }
              ].map(stat => (
                <div className="place-stat-card" key={stat.label}>
                  <h3>{stat.val}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Placement Officer Message */}
        <section className="place-section">
          <div className="place-officer-grid">
            <div className="place-officer-img-wrap">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt="Mrs. P. Kavitha" />
            </div>
            <div className="place-officer-content">
              <span className="place-officer-tag">Leadership Profile</span>
              <h2 className="place-section-title">Message from Placement Director</h2>
              <span className="designation">Mrs. P. Kavitha (Head - Corporate Relations)</span>
              <div className="place-section-title-line"></div>
              <p className="place-officer-quote">
                "We believe that every engineer graduating from BEC holds the potential to drive global engineering solutions.
                Our mission is to align students' strengths with industrial demands, ensuring a seamless transition from the classroom to corporate boardrooms."
              </p>
              <p className="place-officer-bio">
                Mrs. Kavitha has over 18 years of corporate placement experience, having previously managed campus relations
                for top-tier technology companies. She leads our placement cell with a team of professional mentors,
                connecting students with top software developers, core consulting companies, and innovative startups.
              </p>
            </div>
          </div>
        </section>

        {/* Placement Training Roadmap */}
        <section className="place-section">
          <h2 className="place-section-title">Placement Training Roadmap</h2>
          <p className="place-section-sub">
            Our structured multi-year training program is designed to develop students' analytical, technical, and soft skills gradually.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-roadmap-tabs">
            {[1, 2, 3, 4].map(year => (
              <button
                key={year}
                className={`place-roadmap-tab ${activeYear === year ? 'active' : ''}`}
                onClick={() => setActiveYear(year)}
              >
                Year {year} Program
              </button>
            ))}
          </div>

          <div className="place-roadmap-content">
            {trainingRoadmap[activeYear].map(module => (
              <div className="place-roadmap-card" key={module.num}>
                <div className="card-num">{module.num}</div>
                <h4>{module.title}</h4>
                <p>{module.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* [NEW] Industry MOUs & Centers of Excellence */}
        <section className="place-section">
          <h2 className="place-section-title">Industry Collaborations &amp; MOUs</h2>
          <p className="place-section-sub">
            Establishing joint laboratory units and specialized curriculum integrations to align course training directly with corporate engineering benchmarks.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-mou-grid">
            {[
              { company: 'Virtusa', type: 'Center of Excellence', desc: 'Full Stack Java Engineering Lab offering internships and domain certification modules.' },
              { company: 'Cognizant', type: 'Collaborative Cloud Hub', desc: 'Established to train CSE/IT students in cloud infrastructure deployment.' },
              { company: 'Hyundai Motors', type: 'Core Automotive Lab', desc: 'Facilitates practical training in electric vehicle technologies and automotive diagnostics.' },
              { company: 'Oracle Academy', type: 'Database Technologies Center', desc: 'Provides institutional resources and course certifications in SQL and Database Administration.' }
            ].map(mou => (
              <div className="place-mou-card" key={mou.company}>
                <h4>{mou.company}</h4>
                <span>{mou.type}</span>
                <p>{mou.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* [NEW] Higher Education & Competitive Examinations Cell */}
        <section className="place-section">
          <h2 className="place-section-title">Higher Education &amp; GATE Guidance Cell</h2>
          <p className="place-section-sub">
            Providing institutional support and training resources to facilitate student success in national and international competitive examinations.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-higher-edu">
            <div className="place-higher-edu-card">
              <h4>GATE Coaching Program</h4>
              <p>
                Our specialized GATE training operates in collaboration with domain experts to assist students aiming for public sector undertakings (PSUs) or post-graduate engineering degrees in premier Indian institutions (IITs/IISc).
              </p>
              <ul className="place-higher-edu-list">
                <li>Subject-wise analytical mock test modules conducted weekly</li>
                <li>Specialized focus on engineering mathematics and core engineering streams</li>
                <li>One-on-one doubt clarification classes with expert external faculty</li>
              </ul>
            </div>

            <div className="place-higher-edu-card">
              <h4>Global Education Support (GRE / TOEFL / IELTS)</h4>
              <p>
                The college higher education advisory desk provides application support, resume writing guidelines, and letters of recommendation for students seeking overseas Master of Science (MS) programs.
              </p>
              <ul className="place-higher-edu-list">
                <li>Institutional library database containing competitive study manuals</li>
                <li>Verbal reasoning and quantitative mock tests administered monthly</li>
                <li>Statement of Purpose (SOP) drafting workshops led by English faculty</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Placement Statistics Visual Section (Flat CSS Layout) */}
        <section className="place-section dark">
          <h2 className="place-section-title">Department-wise Placements (2024-25)</h2>
          <p className="place-section-sub">
            A visual representation of our recent year's recruitment success across core engineering and computing departments.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-chart-wrap">
            {departmentStats.map(stat => (
              <div className="place-chart-row" key={stat.dept}>
                <div className="place-chart-label">{stat.dept}</div>
                <div className="place-chart-bar-bg">
                  <div className="place-chart-bar-fill" style={{ width: `${stat.percentage}%` }}></div>
                </div>
                <div className="place-chart-value">{stat.percentage}%</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recruiter Directory */}
        <section className="place-section">
          <h2 className="place-section-title">Corporate Recruiter Directory</h2>
          <p className="place-section-sub">
            Explore our network of companies that actively hire graduates from Best Engineering College. Click any card to view detailed recruiter insights.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-directory-controls">
            <div className="place-search-box">
              <input
                type="text"
                className="place-search-input"
                placeholder="Search by recruiter name or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="place-filter-tabs">
              {['All', 'IT / Tech', 'Core Engineering', 'Consulting & Services'].map(cat => (
                <button
                  key={cat}
                  className={`place-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="place-recruiters-grid">
            {filteredRecruiters.map(r => (
              <div className="place-recruiter-card" key={r.name} onClick={() => setSelectedCompany(r)}>
                <div className="place-recruiter-logo">
                  {r.icon}
                </div>
                <h4>{r.name}</h4>
                <span className="category">{r.category}</span>
                <span className="package">{r.package}</span>
              </div>
            ))}
            {filteredRecruiters.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                No companies match your search criteria.
              </p>
            )}
          </div>
        </section>

        {/* [NEW] Placement Policy & Code of Conduct */}
        <section className="place-section">
          <h2 className="place-section-title">Placement Policy &amp; Code of Conduct</h2>
          <p className="place-section-sub">
            Official operational rules governing student participation in on-campus recruitment schedules.
          </p>
          <div className="place-section-title-line"></div>

          <ul className="place-policy-list">
            <li><strong>Single Offer Rule</strong>: Once a candidate secures an offer from a company, they are excluded from participating in subsequent recruitment drives to ensure equitable opportunities, except in designated "Dream Offer" classifications.</li>
            <li><strong>Dream Offer Qualification</strong>: A selected candidate may participate in subsequent drives only if the subsequent corporate recruiter offers a package valued at least 1.5 times the candidate's initial secured offer.</li>
            <li><strong>Backlog Restrictions</strong>: Candidates registering for campus selection must have zero active/standing academic backlogs at the time of company registration.</li>
            <li><strong>Attendance Mandate</strong>: A minimum of 85% attendance in all pre-placement soft skill and technical bootcamps is required to secure eligibility status for recruitment schedules.</li>
          </ul>
        </section>

        {/* Placement Testimonials */}
        <section className="place-section">
          <h2 className="place-section-title">Success Stories</h2>
          <p className="place-section-sub">
            Hear what our recent alumni have to say about their journey through our placement training cell.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-testimonial-grid">
            {[
              {
                name: 'Arjun Ramesh',
                role: 'Associate Software Engineer at TCS',
                desc: 'The mock interviews and competitive coding sessions held during the third year built my programming confidence. I secured my offer in the very first round!',
                img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80'
              },
              {
                name: 'Priya Lakshmi',
                role: 'Consultant at Infosys',
                desc: 'From resume workshops to specialized soft skills classes, the placement cell left no stone unturned in shaping our profiles for recruitment panels.',
                img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80'
              },
              {
                name: 'Karthik Raj',
                role: 'Software Developer at Zoho',
                desc: 'The technical bootcamp and continuous problem-solving practice sessions held on campus prepared me directly for Zoho\'s intensive coding interview.',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80'
              }
            ].map(t => (
              <div className="place-testimonial-card" key={t.name}>
                <span className="quote-icon">“</span>
                <p>{t.desc}</p>
                <div className="place-testimonial-author">
                  <img src={t.img} alt={t.name} />
                  <div>
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* [NEW] Placement Advisory Board */}
        <section className="place-section">
          <h2 className="place-section-title">Placement Advisory Board</h2>
          <p className="place-section-sub">
            Our advisory board consists of senior faculty and industry consultants who direct BEC's corporate relations strategy.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-advisory-grid">
            {[
              { name: 'Dr. M. Jagath', role: 'Principal & Advisory Head', desc: 'Overlooks institutional alignment with industrial curriculum standards.' },
              { name: 'Mrs. P. Kavitha', role: 'Convener & Placement Director', desc: 'Manages all corporate relationships, internships, and recruiter agreements.' },
              { name: 'Dr. R. Subramaniam', role: 'Management Advisor', desc: 'Coordinates strategic partnerships with global software and engineering agencies.' },
              { name: 'Mr. S. Karthikeyan', role: 'Student Placement Coordinator', desc: 'Represents candidate concerns and handles student registrations.' }
            ].map(member => (
              <div className="place-advisory-card" key={member.name}>
                <h4>{member.name}</h4>
                <span>{member.role}</span>
                <p>{member.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Placement FAQs Accordion */}
        <section className="place-section" style={{ marginBottom: '30px' }}>
          <h2 className="place-section-title">Frequently Asked Questions</h2>
          <p className="place-section-sub">
            Find answers to common questions about our college placement registrations, eligibility, and rules.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-faq-wrapper">
            {placementFAQs.map((faq, index) => (
              <div
                className={`place-faq-item ${activeFaq === index ? 'active' : ''}`}
                key={faq.q}
              >
                <button
                  className="place-faq-header"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <h4>{faq.q}</h4>
                  <span className="place-faq-icon">+</span>
                </button>
                <div className="place-faq-body" style={{ maxHeight: activeFaq === index ? '300px' : '0' }}>
                  <div className="place-faq-body-content">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* [NEW] Placement Office Corporate Contacts Panel */}
        <section className="place-section">
          <h2 className="place-section-title">Corporate Liaison Contact Desk</h2>
          <p className="place-section-sub">
            For corporate inquiries regarding campus placement dates, infrastructure facilities, or pre-placement talk logistics.
          </p>
          <div className="place-section-title-line"></div>

          <div className="place-contact-panel">
            <div className="place-contact-item">
              <h5>Official Correspondence</h5>
              <p>
                Best Engineering College Placement Cell<br />
                NH-48, Pennalur Village, Kanchipuram - 602 117<br />
                Tamil Nadu, India
              </p>
            </div>
            <div className="place-contact-item">
              <h5>Electronic Mail Coordinates</h5>
              <p>
                Mrs. P. Kavitha (Head): placements@bec.edu.in<br />
                General Inquiries: placementoffice@bec.edu.in<br />
                Student Liaison Desk: placementcell@bec.edu.in
              </p>
            </div>
            <div className="place-contact-item">
              <h5>Telecommunication Support</h5>
              <p>
                Direct Line: +91 44 2716 3000 (Ext: 450)<br />
                Corporate Enquiries: +91 98765 50004<br />
                Operational Hours: 08:30 AM to 04:30 PM (Mon - Sat)
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="company-modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="company-modal-content" onClick={e => e.stopPropagation()}>
            <button className="company-modal-close" onClick={() => setSelectedCompany(null)}>×</button>
            <div className="company-modal-header">
              <div className="company-modal-logo">{selectedCompany.icon}</div>
              <div>
                <h3>{selectedCompany.name}</h3>
                <span className="category">{selectedCompany.category}</span>
              </div>
            </div>
            <div className="company-modal-body">
              <div className="company-modal-info-grid">
                <div className="info-item">
                  <h5>Average Package</h5>
                  <p>{selectedCompany.package}</p>
                </div>
                <div className="info-item">
                  <h5>Hired Last Year</h5>
                  <p>{selectedCompany.details.hiredCount} Students</p>
                </div>
                <div className="info-item" style={{ gridColumn: 'span 2' }}>
                  <h5>Eligibility Criteria</h5>
                  <p style={{ fontSize: '13.5px', fontWeight: '500' }}>{selectedCompany.details.eligibility}</p>
                </div>
                <div className="info-item" style={{ gridColumn: 'span 2' }}>
                  <h5>Primary Locations</h5>
                  <p style={{ fontSize: '13.5px', fontWeight: '500' }}>{selectedCompany.details.location}</p>
                </div>
              </div>

              <div className="company-modal-text-section">
                <h4>Roles Frequently Recruited</h4>
                <p style={{ color: '#475569', fontSize: '13.5px' }}>
                  {selectedCompany.details.roles.join(', ')}
                </p>
              </div>

              <div className="company-modal-text-section">
                <h4>Recruitment Process Stages</h4>
                <ol style={{ paddingLeft: '20px', margin: '0' }}>
                  {selectedCompany.details.stages.map((stage, idx) => (
                    <li key={idx} style={{ color: '#475569', fontSize: '13.5px', marginBottom: '6px' }}>{stage}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default PlacementsPage;
