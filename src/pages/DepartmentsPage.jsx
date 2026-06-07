import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { submitAdmissionsEnquiry } from '../utils/storage';
import '../assets/css/style.css';
import '../assets/css/departments.css';
import '../assets/css/professional.css'; /* Reuses modal styling rules */

const depts = [
  { 
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', 
    name: 'Computer Science & Engineering', 
    category: 'computing',
    desc: 'The Department of CSE offers programs in AI, Machine Learning, Data Science, Cloud Computing and Cybersecurity. Our graduates are placed in top MNCs worldwide.', 
    tags: ['AI & ML', 'Data Science', 'Cloud', 'Cybersecurity', 'Web Dev'], 
    faculty: '60+', 
    students: '1200', 
    courses: '8', 
    placement: '98%',
    detailedInfo: {
      overview: 'The Computer Science & Engineering department is the largest and most sought-after program at BEC. Established in 2016, the department has grown to become a center of excellence in computer education and research. Our curriculum is regularly updated to include cutting-edge technologies and industry demands.',
      infrastructure: 'The department houses 12 advanced computer laboratories with over 600 high-performance workstations, dedicated servers for cloud computing, AI/ML clusters, and cybersecurity labs. Students have 24/7 access to licensed software including MATLAB, Python, AWS, Azure, and various development tools.',
      specializations: ['Artificial Intelligence & Machine Learning', 'Data Science & Big Data Analytics', 'Cloud Computing & DevOps', 'Cybersecurity & Ethical Hacking', 'Full Stack Web Development', 'Mobile Application Development', 'Internet of Things (IoT)', 'Blockchain Technology'],
      researchAreas: 'Active research in Deep Learning, Natural Language Processing, Computer Vision, Distributed Systems, Network Security, and Software Engineering. Faculty and students publish papers in IEEE, ACM, Springer journals.',
      careerOpportunities: 'Software Engineer, Data Scientist, AI/ML Engineer, Cloud Architect, Cybersecurity Analyst, Full Stack Developer, DevOps Engineer, Database Administrator, System Analyst, IT Consultant',
      topRecruiters: 'TCS, Infosys, Wipro, Cognizant, Accenture, Amazon, Microsoft, Google, IBM, HCL, Tech Mahindra, Capgemini',
      curriculum: [
        { year: 'Year 1', subjects: 'Engineering Mathematics, Programming in C, Semiconductor Physics, Technical English' },
        { year: 'Year 2', subjects: 'Data Structures, Object-Oriented Programming, Operating Systems, Database Management Systems' },
        { year: 'Year 3', subjects: 'Computer Networks, Artificial Intelligence, Compiler Design, Design & Analysis of Algorithms' },
        { year: 'Year 4', subjects: 'Cloud Computing, Information Security, Elective Specialized Projects, Capstone Thesis' }
      ]
    }
  },
  { 
    img: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&q=80', 
    name: 'Artificial Intelligence & Data Science', 
    category: 'computing',
    desc: 'Focuses on machine learning pipelines, algorithmic modeling, big data frameworks, neural networks, and business intelligence systems.', 
    tags: ['Deep Learning', 'Neural Networks', 'Big Data', 'Predictive Modeling'], 
    faculty: '22+', 
    students: '360', 
    courses: '5', 
    placement: '97%',
    detailedInfo: {
      overview: 'The Department of Artificial Intelligence & Data Science prepares students to lead the data-driven revolution. Bridging mathematics, engineering principles, and statistics, students learn to design algorithms capable of solving complex problems in industrial contexts.',
      infrastructure: 'NVIDIA GPU-accelerated computing lab containing RTX workstations, cloud analytics integrations, dedicated deep learning clusters, and predictive analytics development tools.',
      specializations: ['Deep Neural Networks', 'Natural Language Processing', 'Computer Vision Architectures', 'Big Data Systems engineering', 'Data Visualization & Wrangling'],
      researchAreas: 'Generative AI frameworks, conversational analytics, biomedical predictive modeling, intelligent transport grids, and distributed data systems.',
      careerOpportunities: 'AI Engineer, Data Scientist, NLP Analyst, Machine Learning Scientist, Analytics Lead, Big Data Developer.',
      topRecruiters: 'Amazon Web Services, Microsoft, Google, TCS, Cognizant, Zoho Corporation.',
      curriculum: [
        { year: 'Year 1', subjects: 'Linear Algebra for Machine Learning, C++ Coding, Probability Foundations, Engineering Chemistry' },
        { year: 'Year 2', subjects: 'Data Warehousing, Python Algorithms, Statistical Inference, Artificial Neural Networks' },
        { year: 'Year 3', subjects: 'Deep Learning, Big Data Architectures, Computer Vision, Optimization Methods' },
        { year: 'Year 4', subjects: 'Generative AI Systems, Natural Language Processing, Industry Practicum, Major Project' }
      ]
    }
  },
  { 
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', 
    name: 'Electronics & Communication Engineering', 
    category: 'core',
    desc: 'ECE department focuses on VLSI Design, Embedded Systems, Signal Processing and Communication. Students work on real-world projects with industry partners.', 
    tags: ['VLSI', 'Embedded', 'Signal Processing', 'IoT'], 
    faculty: '45+', 
    students: '980', 
    courses: '7', 
    placement: '95%',
    detailedInfo: {
      overview: 'The ECE department is dedicated to creating engineers proficient in electronics design, communication systems, and embedded technologies. With state-of-the-art laboratories and experienced faculty, we prepare students for careers in electronics manufacturing, telecommunications, and semiconductor industries.',
      infrastructure: 'Advanced VLSI Design Lab with Cadence tools, Embedded Systems Lab with ARM processors, Digital Signal Processing Lab, Communication Systems Lab with RF equipment, Microwave & Antenna Lab, PCB design facilities, and electronics prototyping workshop.',
      specializations: ['VLSI Design & Verification', 'Embedded Systems & IoT', 'Digital Signal Processing', 'Wireless Communication Systems', 'Optical Communication', 'Microwave Engineering', 'Robotics & Automation', 'Electronic Product Design'],
      researchAreas: 'Research focus on VLSI architecture, embedded AI, 5G communication, signal processing algorithms, antenna design, and IoT applications. Collaborations with semiconductor companies for sponsored projects.',
      careerOpportunities: 'VLSI Design Engineer, Embedded Systems Developer, Telecommunications Engineer, Signal Processing Engineer, RF Engineer, Electronics Design Engineer, IoT Developer, Network Engineer, Test Engineer',
      topRecruiters: 'Intel, Qualcomm, Texas Instruments, Samsung, Nokia, Ericsson, Bosch, L&T, ISRO, DRDO, Reliance Jio, Airtel, Huawei',
      curriculum: [
        { year: 'Year 1', subjects: 'Circuit Theory, Semiconductor Devices, Engineering Physics, Technical Communication' },
        { year: 'Year 2', subjects: 'Signals & Systems, Analog Electronics, Microprocessors, Electromagnetic Fields' },
        { year: 'Year 3', subjects: 'Digital Communication, VLSI Design, Digital Signal Processing, Antenna Engineering' },
        { year: 'Year 4', subjects: 'Embedded Systems & IoT, Wireless Networks, Specialized Research Thesis, Capstone Project' }
      ]
    }
  },
  { 
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80', 
    name: 'Electrical & Electronics Engineering', 
    category: 'core',
    desc: 'Covers electric vehicles, high-voltage systems, control design, power electronics, smart grids, and renewable power infrastructure.', 
    tags: ['Smart Grid', 'Electric Vehicles', 'Power Electronics', 'Renewable Energy'], 
    faculty: '32+', 
    students: '640', 
    courses: '6', 
    placement: '93%',
    detailedInfo: {
      overview: 'The Department of Electrical & Electronics Engineering offers comprehensive programs centering on electric drives, smart transmission networks, and alternative energy resources. EEE prepares students to address crucial challenges in industrial automation and clean energy.',
      infrastructure: 'High-voltage machines laboratory, Control Systems workstation setups, Power Electronics simulator labs with MATLAB/Simulink, and digital control system testers.',
      specializations: ['Smart Grid Infrastructures', 'EV Power Train Design', 'Industrial Process Automation', 'Renewable Energy Integration', 'Control Systems Engineering'],
      researchAreas: 'EV battery management controllers, photovoltaic microgrid synchronizations, high-efficiency solar inverters, and power factor optimizations.',
      careerOpportunities: 'Electrical Systems Engineer, Power Grid Analyst, Automation Specialist, Electric Vehicle Developer, Control Architect.',
      topRecruiters: 'ABB, Siemens, Schneider Electric, L&T Construction, Tata Power, BHEL, Bosch.',
      curriculum: [
        { year: 'Year 1', subjects: 'Network Analysis, Electrical Engineering Principles, Mathematics for Engineers, Engineering Graphics' },
        { year: 'Year 2', subjects: 'DC Machines & Transformers, Electronic Circuits, Control Systems, Linear Integrated Circuits' },
        { year: 'Year 3', subjects: 'AC Machines, Power Systems Transmission, Power Electronics, Microcontrollers' },
        { year: 'Year 4', subjects: 'Electric Vehicle Technology, Renewable Energy Grids, Industrial Automation, Capstone Project' }
      ]
    }
  },
  { 
    img: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600&q=80', 
    name: 'Mechanical Engineering', 
    category: 'core',
    desc: 'The Mechanical department covers Design, Manufacturing, Thermal Engineering and Robotics. Equipped with modern CAD/CAM labs and workshops.', 
    tags: ['Design', 'Manufacturing', 'Thermal', 'Robotics', 'CAD/CAM'], 
    faculty: '40+', 
    students: '850', 
    courses: '6', 
    placement: '92%',
    detailedInfo: {
      overview: 'Mechanical Engineering at BEC combines traditional mechanical principles with modern technologies. The department emphasizes hands-on learning through workshops, industrial training, and project-based education. Our graduates are equipped to work in automotive, aerospace, manufacturing, and energy sectors.',
      infrastructure: 'Fully-equipped machine shop, CNC machining center, CAD/CAM lab with CATIA and SolidWorks, Thermal Engineering lab, Fluid Mechanics lab, Metrology lab, Materials Testing lab, Robotics lab, and 3D printing facility for rapid prototyping.',
      specializations: ['Product Design & Development', 'Computer-Aided Manufacturing', 'Thermal Power Engineering', 'Automobile Engineering', 'Robotics & Mechatronics', 'Finite Element Analysis', 'Production Planning & Control', 'Industrial Automation'],
      researchAreas: 'Research in additive manufacturing, renewable energy systems, composite materials, computational fluid dynamics, heat transfer optimization, and industrial automation. Funded projects from AICTE and DST.',
      careerOpportunities: 'Design Engineer, Production Engineer, Quality Control Engineer, Automobile Engineer, HVAC Engineer, CAD/CAM Engineer, Maintenance Engineer, Project Manager, Manufacturing Analyst',
      topRecruiters: 'Tata Motors, Mahindra, Ashok Leyland, L&T, Bosch, Hyundai, TVS Motors, Cummins, Thermax, Siemens, ABB, Caterpillar',
      curriculum: [
        { year: 'Year 1', subjects: 'Engineering Graphics, Basic Mechanical Systems, Applied Physics, Computational Coding' },
        { year: 'Year 2', subjects: 'Thermodynamics, Strength of Materials, Kinematics of Machines, Manufacturing Processes' },
        { year: 'Year 3', subjects: 'Heat & Mass Transfer, CAD/CAM Systems, Design of Machine Elements, Fluid Dynamics' },
        { year: 'Year 4', subjects: 'Industrial Robotics, Finite Element Analysis, Thermal Systems Engineering, Graduation Project' }
      ]
    }
  },
  { 
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80', 
    name: 'Civil Engineering', 
    category: 'core',
    desc: 'Civil Engineering department offers programs in Structural, Environmental and Transportation Engineering with state-of-the-art survey and material testing labs.', 
    tags: ['Structural', 'Environmental', 'Transport', 'Surveying'], 
    faculty: '35+', 
    students: '720', 
    courses: '6', 
    placement: '90%',
    detailedInfo: {
      overview: 'The Civil Engineering department at BEC focuses on infrastructure development, sustainable construction, and urban planning. With a strong foundation in core civil engineering subjects and modern construction technologies, our graduates contribute to nation-building projects in roads, bridges, buildings, and water systems.',
      infrastructure: 'Structural Engineering lab, Concrete Technology lab, Soil Mechanics lab, Environmental Engineering lab, Highway Engineering lab, Survey lab with Total Station and GPS, Computer-Aided Design lab with AutoCAD and Revit, Geotechnical testing equipment.',
      specializations: ['Structural Engineering & Design', 'Environmental Engineering', 'Transportation Engineering', 'Geotechnical Engineering', 'Construction Management', 'Water Resources Engineering', 'Urban Planning', 'Building Information Modeling (BIM)'],
      researchAreas: 'Research areas include sustainable construction materials, earthquake-resistant structures, wastewater treatment, traffic management systems, soil stabilization, and green building technologies.',
      careerOpportunities: 'Civil Engineer, Structural Designer, Site Engineer, Project Manager, Quality Control Engineer, Urban Planner, Environmental Consultant, Surveyor, Building Inspector, Construction Manager',
      topRecruiters: 'L&T Construction, Tata Projects, GMR, DLF, Shapoorji Pallonji, IVRCL, NCC Limited, Gammon India, PWD, NHAI, Municipal Corporations',
      curriculum: [
        { year: 'Year 1', subjects: 'Engineering Mechanics, Surveying Theory, Applied Geology, Technical Writing' },
        { year: 'Year 2', subjects: 'Strength of Materials, Fluid Mechanics & Machinery, Concrete Technology, GIS Surveying' },
        { year: 'Year 3', subjects: 'Structural Analysis, Geotechnical Engineering, Transportation Systems, Hydrology' },
        { year: 'Year 4', subjects: 'Environmental Engineering, Building Information Modeling, Safety Management, Project' }
      ]
    }
  },
  { 
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80', 
    name: 'Information Technology', 
    category: 'computing',
    desc: 'IT department specializes in Web Technologies, Cloud Computing, Cybersecurity and Mobile App Development. Industry-oriented curriculum with live project exposure.', 
    tags: ['Web Tech', 'Cloud', 'Mobile Apps', 'Security'], 
    faculty: '30+', 
    students: '650', 
    courses: '6', 
    placement: '96%',
    detailedInfo: {
      overview: 'The IT department focuses on software development, system administration, and information management. With emphasis on practical learning and industry collaborations, students gain expertise in web technologies, mobile development, cloud platforms, and enterprise systems.',
      infrastructure: '8 computer labs with 400+ systems, dedicated servers for web hosting, cloud computing lab with AWS and Azure access, mobile app development lab, database management lab, networking lab with Cisco equipment, and software testing lab.',
      specializations: ['Full Stack Web Development', 'Cloud Computing & AWS', 'Mobile App Development (Android/iOS)', 'Information Security', 'Database Management Systems', 'Enterprise Resource Planning', 'Software Testing & Quality Assurance', 'DevOps & Automation'],
      researchAreas: 'Research in cloud security, web analytics, mobile computing, blockchain applications, software quality metrics, and IT service management. Active participation in hackathons and coding competitions.',
      careerOpportunities: 'Software Developer, Web Developer, Mobile App Developer, Cloud Solutions Architect, Database Administrator, IT Security Analyst, DevOps Engineer, System Administrator, Business Analyst, Technical Support Engineer',
      topRecruiters: 'TCS, Infosys, Wipro, Cognizant, HCL, Tech Mahindra, Mindtree, Mphasis, Oracle, SAP, Adobe, Freshworks, Zoho, PayPal',
      curriculum: [
        { year: 'Year 1', subjects: 'Python Programming, Digital System Design, Engineering Calculus, Physical Sciences' },
        { year: 'Year 2', subjects: 'Computer Organization, Software Engineering, Java Coding, Database Implementations' },
        { year: 'Year 3', subjects: 'Web Technologies, Information Security, Mobile Application Development, DevOps Practices' },
        { year: 'Year 4', subjects: 'Big Data Analytics, Cloud Architecture, Automation Scripting, Capstone Project' }
      ]
    }
  },
  { 
    img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80', 
    name: 'Biotechnology', 
    category: 'sciences',
    desc: 'Biotechnology department focuses on Genetic Engineering, Bioinformatics and Pharmaceutical Biotechnology. Well-equipped research labs for cutting-edge experiments.', 
    tags: ['Genetic Engg.', 'Bioinformatics', 'Pharma', 'Research'], 
    faculty: '25+', 
    students: '420', 
    courses: '5', 
    placement: '88%',
    detailedInfo: {
      overview: 'The Biotechnology department bridges biology with technology, focusing on applications in healthcare, pharmaceuticals, agriculture, and environmental conservation. Students receive comprehensive training in molecular biology, genetic engineering, bioinformatics, and bioprocessing.',
      infrastructure: 'Advanced molecular biology lab, microbiology lab with laminar flow hoods, plant tissue culture lab, fermentation technology lab, bioinformatics lab with computational tools, enzyme technology lab, and research facility for final year projects.',
      specializations: ['Genetic Engineering', 'Bioinformatics & Computational Biology', 'Pharmaceutical Biotechnology', 'Industrial Biotechnology', 'Agricultural Biotechnology', 'Environmental Biotechnology', 'Medical Biotechnology', 'Bioprocess Engineering'],
      researchAreas: 'Research in gene therapy, protein engineering, drug discovery, biofuels, nanobiotechnology, and bioremediation. Collaborations with research institutes and pharmaceutical companies for sponsored research.',
      careerOpportunities: 'Biotechnology Researcher, Quality Control Analyst, Bioinformatics Scientist, Clinical Research Associate, Production Manager, Regulatory Affairs Officer, Bioprocess Engineer, Agricultural Scientist, Lab Technician',
      topRecruiters: 'Biocon, Dr. Reddy\'s, Cipla, Sun Pharma, Aurobindo Pharma, Serum Institute, Rasi Seeds, ITC Life Sciences, Syngene, Research Institutes',
      curriculum: [
        { year: 'Year 1', subjects: 'Cell Biology, Organic Chemistry, Calculus Foundations, Analytical Techniques' },
        { year: 'Year 2', subjects: 'Biochemistry, General Microbiology, Molecular Genetics, Stoichiometry' },
        { year: 'Year 3', subjects: 'Bioinformatics Tools, Bioprocess Engineering, Immunotechnology, Enzyme Kinetics' },
        { year: 'Year 4', subjects: 'Clinical Trials Ethics, Nano-Biotechnology, Industrial Training, Research Project' }
      ]
    }
  },
];

function DepartmentsPage() {
  const [expandedDept, setExpandedDept] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  /* Custom Enquiry Modal States */
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedDeptName, setSelectedDeptName] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const toggleDepartment = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  const handleEnquireClick = (deptName) => {
    setSelectedDeptName(deptName);
    setShowEnquiryModal(true);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    await submitAdmissionsEnquiry({
      ...enquiryForm,
      dept: selectedDeptName,
      date: new Date().toISOString()
    });
    setEnquirySuccess(true);
  };

  const filteredDepts = depts.filter(d => {
    const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      
      <div className="dept-banner">
        <span className="section-tag">Academics</span>
        <h2>Our Engineering Departments</h2>
        <p>Explore our eight engineering departments offering advanced undergraduate and research programs equipped with top-tier laboratories and academic mentors.</p>
      </div>

      {/* SEARCH AND FILTER CONTROLS */}
      <div className="dept-controls">
        <input 
          type="text" 
          placeholder="Search by name, description or tags (e.g. VLSI, Python)..." 
          className="dept-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="dept-filter-tabs">
          {[
            { id: 'all', label: 'All Fields' },
            { id: 'computing', label: 'Computing & IT' },
            { id: 'core', label: 'Core Engineering' },
            { id: 'sciences', label: 'Applied Sciences' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`dept-filter-btn ${filterCategory === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DEPARTMENTS CARD GRID */}
      <div style={{ margin: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {filteredDepts.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '35px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h4 style={{ fontSize: '18px', color: '#1a1a1a', fontWeight: '700', marginBottom: '8px' }}>No Departments Found</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>Your search terms do not match any available departments. Try adjusting your query or category filters.</p>
          </div>
        ) : (
          filteredDepts.map(d => (
            <div key={d.name} className="dept-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '36px' }}>
                <div style={{ flex: '1', minWidth: '260px', maxWidth: '380px' }}>
                  <img src={d.img} alt={d.name} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '22px', display: 'block' }} />
                </div>
                <div style={{ flex: '2', minWidth: '260px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>{d.name}</h3>
                  <p style={{ fontSize: '13.5px', color: '#666', lineHeight: '1.85', marginBottom: '14px', fontWeight: '300' }}>{d.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {d.tags.map(t => <span key={t} style={{ background: '#f5f5f5', color: '#333', fontSize: '11px', fontWeight: '600', padding: '5px 14px', borderRadius: '35px', border: '1px solid #ddd' }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                    {[['Faculty', d.faculty], ['Students', d.students], ['Courses', d.courses], ['Placement', d.placement]].map(([label, val]) => (
                      <div key={label} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '16px', padding: '12px 18px', textAlign: 'center', minWidth: '90px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#c9a84c', lineHeight: '1' }}>{val}</h4>
                        <p style={{ fontSize: '11px', color: '#888', marginTop: '3px' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => toggleDepartment(d.name)} 
                      className="dept-card-btn"
                    >
                      {expandedDept === d.name ? 'Show Less' : 'Learn More'}
                    </button>
                    <button 
                      onClick={() => handleEnquireClick(d.name)}
                      className="dept-enquire-btn"
                    >
                      Enquire Admission
                    </button>
                  </div>
                </div>
              </div>

              {expandedDept === d.name && (
                <div style={{ marginTop: '30px', padding: '30px', background: '#f9f9f9', borderRadius: '22px', border: '1px solid #e5e5e5' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>Department Overview</h4>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>{d.detailedInfo.overview}</p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>Infrastructure &amp; Facilities</h4>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>{d.detailedInfo.infrastructure}</p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>Specializations Offered</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                      {d.detailedInfo.specializations.map(spec => (
                        <div key={spec} style={{ background: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '13px', color: '#444' }}>
                          • {spec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Semester Curriculum Roadmap */}
                  <div className="curriculum-section" style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>Syllabus &amp; Curriculum Outline</h4>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '14px' }}>Explore the core curriculum roadmap spanning the undergraduate years.</p>
                    <div className="sem-grid">
                      {d.detailedInfo.curriculum.map(c => (
                        <div key={c.year} className="sem-box">
                          <h5>{c.year}</h5>
                          <p>{c.subjects}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>Research Areas</h4>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>{d.detailedInfo.researchAreas}</p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>Career Opportunities</h4>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>{d.detailedInfo.careerOpportunities}</p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>Top Recruiters</h4>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>{d.detailedInfo.topRecruiters}</p>
                  </div>

                  <div style={{ marginTop: '20px', padding: '16px', background: '#e6f7ff', borderLeft: '4px solid #2b6cb0', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1a202c', fontWeight: '500' }}>
                      <strong>Want to know more?</strong> Contact the department office or visit during campus tours. Email: {d.name.toLowerCase().replace(/\s+/g, '').replace('&', 'and')}@bec.edu.in
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* DEPARTMENT SPECIFIC ENQUIRY MODAL */}
      {showEnquiryModal && (
        <div className="custom-modal-overlay" onClick={() => { setShowEnquiryModal(false); setEnquirySuccess(false); }}>
          <div className="custom-modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => { setShowEnquiryModal(false); setEnquirySuccess(false); }}>×</button>
            <div className="modal-body">
              <h3 className="modal-title">Department Enquiry</h3>
              <p className="modal-sub">Enquire admissions for **{selectedDeptName}**</p>
              
              {enquirySuccess ? (
                <div className="enquiry-success-box">
                  <h4>Enquiry Logged Successfully</h4>
                  <p>Your request for the department of **{selectedDeptName}** has been recorded. Our academic team will get in touch with you shortly.</p>
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
                    <label>Target Department</label>
                    <input
                      type="text"
                      disabled
                      value={selectedDeptName}
                      style={{ background: '#e2e8f0', color: '#4a5568' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Queries or Comments</label>
                    <textarea
                      rows="3"
                      placeholder="Type your questions here..."
                      value={enquiryForm.notes}
                      onChange={e => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-gold form-submit-btn">Submit Department Enquiry</button>
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

export default DepartmentsPage;
