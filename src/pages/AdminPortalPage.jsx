import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import clgLogo from '../assets/images/CLGLOGO.webp';
import {
  getSessionUser, logoutUser,
  getAdminStudents, addAdminStudent, updateAdminStudent, deleteAdminStudent,
  getAdminFaculty, addAdminFaculty, deleteAdminFaculty,
  getNotices, addAdminNotice, deleteAdminNotice,
  getEvents, addAdminEvent, deleteAdminEvent,
  getAdminActivityLogs, getAdmissionsEnquiries,
  updateAdmissionStatus,
  getAdminDepartments, addAdminDepartment, updateAdminDepartment, deleteAdminDepartment, 
  getAdminCourses, addAdminCourse, updateAdminCourse, deleteAdminCourse, 
  getAdminSubjects,
  getAdminBooks, getAdminHostelAllocations, getAdminTransportRoutes,
  getAdminCertificateRequests, approveCertificateRequest, rejectCertificateRequest,
  getAdminComplaints, resolveComplaintTicket, getAdminAllFees
} from '../utils/storage';
import * as XLSX from 'xlsx';
import '../assets/css/admin-portal.css';

// NAV CONFIG
const navGroups = [
  { label: 'Overview', items: [
    { key: 'dashboard', label: 'Dashboard', icon: 'DB' },
  ]},
  { label: 'Academic', items: [
    { key: 'students', label: 'Student Management', icon: 'ST' },
    { key: 'faculty', label: 'Faculty Management', icon: 'FC' },
    { key: 'departments', label: 'Department Management', icon: 'DP' },
    { key: 'courses', label: 'Course Management', icon: 'CS' },
    { key: 'subjects', label: 'Subject Management', icon: 'SB' },
  ]},
  { label: 'Admissions & Attendance', items: [
    { key: 'admissions', label: 'Admissions', icon: 'AD' },
    { key: 'attendance', label: 'Attendance', icon: 'AT' },
    { key: 'timetable', label: 'Timetable', icon: 'TT' },
  ]},
  { label: 'Examination', items: [
    { key: 'examination', label: 'Examination', icon: 'EX' },
    { key: 'results', label: 'Results', icon: 'RS' },
  ]},
  { label: 'Finance', items: [
    { key: 'fees', label: 'Fees Management', icon: 'FE' },
  ]},
  { label: 'Infrastructure', items: [
    { key: 'library', label: 'Library', icon: 'LB' },
    { key: 'hostel', label: 'Hostel', icon: 'HS' },
    { key: 'transport', label: 'Transport', icon: 'TR' },
  ]},
  { label: 'Student Life', items: [
    { key: 'placements', label: 'Placements', icon: 'PL' },
    { key: 'events', label: 'Events', icon: 'EV' },
    { key: 'noticeboard', label: 'Notice Board', icon: 'NB' },
    { key: 'certificates', label: 'Certificates', icon: 'CT' },
    { key: 'complaints', label: 'Complaints', icon: 'CP' },
  ]},
  { label: 'System', items: [
    { key: 'reports', label: 'Reports & Analytics', icon: 'RP' },
    { key: 'users', label: 'User Management', icon: 'UM' },
    { key: 'auditlogs', label: 'Audit Logs', icon: 'AL' },
    { key: 'settings', label: 'Settings', icon: 'SG' },
  ]},
];

const pageTitles = {
  dashboard: 'Dashboard', students: 'Student Management', faculty: 'Faculty Management',
  departments: 'Department Management', courses: 'Course Management', subjects: 'Subject Management',
  admissions: 'Admissions Management', attendance: 'Attendance Management', timetable: 'Timetable Management',
  examination: 'Examination Management', results: 'Results Management', fees: 'Fees Management',
  library: 'Library Management', hostel: 'Hostel Management', transport: 'Transport Management',
  placements: 'Placement Management', events: 'Events Management', noticeboard: 'Notice Board',
  certificates: 'Certificate Management', complaints: 'Complaints & Support',
  reports: 'Reports & Analytics', users: 'User Management', auditlogs: 'System Audit Logs', settings: 'Settings',
};

//  COMPONENT 
function AdminPortalPage() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stuSearch, setStuSearch] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [admissionsFilter, setAdmissionsFilter] = useState({ status: '', dept: '', search: '' });
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [viewModal, setViewModal] = useState({ open: false, data: null, type: '' });
  const [admissionDetailModal, setAdmissionDetailModal] = useState({ open: false, data: null });
  const [reviewNotes, setReviewNotes] = useState('');
  const [newAdmissionBadge, setNewAdmissionBadge] = useState(false);
  const prevEnquiryCount = useRef(0);
  const navigate = useNavigate();

  // Search and filter states for new pages
  const [courseSearch, setCourseSearch] = useState('');
  const [courseDeptFilter, setCourseDeptFilter] = useState('');
  const [courseSemFilter, setCourseSemFilter] = useState('');

  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectDeptFilter, setSubjectDeptFilter] = useState('');
  const [subjectSemFilter, setSubjectSemFilter] = useState('');

  const [bookSearch, setBookSearch] = useState('');
  const [bookCatFilter, setBookCatFilter] = useState('');

  const [certSearch, setCertSearch] = useState('');
  const [certTypeFilter, setCertTypeFilter] = useState('');
  const [certStatusFilter, setCertStatusFilter] = useState('');

  const [feeSearch, setFeeSearch] = useState('');
  const [feeDeptFilter, setFeeDeptFilter] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState('');

  const [stuData, setStuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [facultyData, setFacultyData] = useState([]);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  // Database-driven dynamic collections
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [hostelAllocations, setHostelAllocations] = useState([]);
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [allFees, setAllFees] = useState([]);

  const [newStudent, setNewStudent] = useState({ 
    roll: '', name: '', email: '', password: '', phone: '', dob: '', gender: 'Male',
    dept: 'CSE', sem: 1, bloodGroup: '', parentName: '', parentPhone: '', address: '',
    religion: '', community: 'General', nationality: 'Indian', aadharNumber: ''
  });
  const [newFaculty, setNewFaculty] = useState({ name: '', empId: '', dept: 'CSE', designation: 'Asst. Professor', email: '', phone: '', qualification: 'Ph.D', experience: '', specialization: '', password: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', category: 'General', type: 'general' });
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', venue: '', status: 'Upcoming' });
  const [newDepartment, setNewDepartment] = useState({ name: '', hod: '', icon: '🏛️', color: '#3b82f6', accreditation: '' });
  const [newCourse, setNewCourse] = useState({ code: '', name: '', dept: 'CSE', sem: 1, credits: 3, type: 'Core', faculty: '' });

  const loadEnquiries = useCallback(async () => {
    try {
      const enqList = await getAdmissionsEnquiries();
      const list = enqList || [];
      setEnquiries(list);
      if (prevEnquiryCount.current > 0 && list.length > prevEnquiryCount.current) {
        setNewAdmissionBadge(true);
      }
      prevEnquiryCount.current = list.length;
    } catch (err) { /* ignore */ }
  }, []);

  useEffect(() => {
    const init = async () => {
      const session = await getSessionUser();
      if (!session || !session.success || session.type !== 'admin') {
        navigate('/admin-login');
        return;
      }

      try {
        const [
          students, faculty, noticeList, eventList, logs,
          depts, crs, subs, bks, hostel, transport, certs, comps, fees
        ] = await Promise.all([
          getAdminStudents(),
          getAdminFaculty(),
          getNotices(),
          getEvents(),
          getAdminActivityLogs(),
          getAdminDepartments(),
          getAdminCourses(),
          getAdminSubjects(),
          getAdminBooks(),
          getAdminHostelAllocations(),
          getAdminTransportRoutes(),
          getAdminCertificateRequests(),
          getAdminComplaints(),
          getAdminAllFees(),
        ]);
        setStuData(students || []);
        setFacultyData(faculty || []);
        setNotices(noticeList || []);
        setEvents(eventList || []);
        setActivityLogs(logs || []);
        setDepartments(depts || []);
        setCourses(crs || []);
        setSubjects(subs || []);
        setBooks(bks || []);
        setHostelAllocations(hostel || []);
        setTransportRoutes(transport || []);
        setCertificates(certs || []);
        setComplaints(comps || []);
        setAllFees(fees || []);
        await loadEnquiries();
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();

    // Real-time polling: refresh admissions every 30 seconds
    const pollInterval = setInterval(() => {
      loadEnquiries();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [navigate, loadEnquiries]);

  // Handle admission status update
  const handleAdmissionStatus = async (id, status, notes = '') => {
    const updated = await updateAdmissionStatus(id, status, notes);
    if (updated) {
      setEnquiries(prev => prev.map(e => (e._id === id || e.id === id) ? { ...e, status: updated.status, reviewNotes: updated.reviewNotes, reviewedBy: updated.reviewedBy } : e));
      setAdmissionDetailModal({ open: false, data: null });
      setReviewNotes('');
    }
  };



  const handleStudentExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
      
      let successCount = 0;
      for (const row of data) {
        if (!row.roll || !row.name) continue;
        const newStu = {
          roll: String(row.roll),
          name: row.name,
          email: row.email || `${row.roll}@bect.edu.in`,
          password: row.password || String(row.roll),
          dept: row.dept || 'CSE',
          sem: Number(row.sem) || 1,
          phone: String(row.phone || ''),
          gender: row.gender || 'Male',
        };
        const res = await addAdminStudent(newStu);
        if (res) successCount++;
      }
      alert(`Successfully imported ${successCount} students.`);
      const updatedStudents = await getAdminStudents();
      setStuData(updatedStudents || []);
    };
    reader.readAsBinaryString(file);
  };

  const filteredStudents = stuData.filter(s => {
    const q = stuSearch.toLowerCase();
    return !q || s.name?.toLowerCase().includes(q) || s.roll?.toLowerCase().includes(q) || s.dept?.toLowerCase().includes(q);
  });
  const filteredFaculty = facultyData.filter(f => {
    const q = facultySearch.toLowerCase();
    return !q || f.name?.toLowerCase().includes(q) || f.empId?.toLowerCase().includes(q) || f.dept?.toLowerCase().includes(q);
  });

  const handleLogout = async () => { await logoutUser(); navigate('/portal'); };
  const closeModal = () => setModal({ open: false, type: '', data: null });
  const closeViewModal = () => setViewModal({ open: false, data: null, type: '' });

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#0f172a' }}>
      <div style={{ width: 48, height: 48, border: '4px solid #1e293b', borderTop: '4px solid #f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading Admin Portal…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const openModal = (type, data = null) => {
    setModal({ open: true, type, data });
    if (type === 'editStudent' && data) {
      setNewStudent({
        roll: data.roll || '',
        name: data.name || '',
        email: data.email || '',
        password: data.password || '',
        phone: data.phone || '',
        dob: data.dob || '',
        gender: data.gender || 'Male',
        dept: data.dept || '',
        sem: data.sem || 1,
        bloodGroup: data.bloodGroup || '',
        parentName: data.parentName || '',
        parentPhone: data.parentPhone || '',
        address: data.address || '',
        religion: data.religion || '',
        community: data.community || 'General',
        nationality: data.nationality || 'Indian',
        aadharNumber: data.aadharNumber || ''
      });
    } else if (type === 'student') {
      setNewStudent({ 
        roll: '', name: '', email: '', password: '', phone: '', dob: '', gender: 'Male',
        dept: 'CSE', sem: 1, bloodGroup: '', parentName: '', parentPhone: '', address: '',
        religion: '', community: 'General', nationality: 'Indian', aadharNumber: ''
      });
    } else if (type === 'editDepartment' && data) {
      setNewDepartment({ name: data.name || '', hod: data.hod || '', icon: data.icon || '🏛️', color: data.color || '#3b82f6', accreditation: data.accreditation || '' });
    } else if (type === 'department') {
      setNewDepartment({ name: '', hod: '', icon: '🏛️', color: '#3b82f6', accreditation: '' });
    } else if (type === 'editCourse' && data) {
      setNewCourse({ code: data.code || '', name: data.name || '', dept: data.dept || 'CSE', sem: data.sem || 1, credits: data.credits || 3, type: data.type || 'Core', faculty: data.faculty || '' });
    } else if (type === 'course') {
      setNewCourse({ code: '', name: '', dept: 'CSE', sem: 1, credits: 3, type: 'Core', faculty: '' });
    }
  };


  //  RENDERS 

  const renderDashboard = () => (
    <div className="ap-page">
      <div className="ap-welcome">
        <div>
          <h2>Welcome back, Admin! </h2>
          <p>Best Engineering College  Full system overview</p>
        </div>
        <span className="ap-badge"> Academic Year 2025-26</span>
      </div>

      <div className="ap-stats">
        {[
          ['','' + stuData.length,'Total Students','blue'],
          ['','' + facultyData.length,'Active Faculty','green'],
          ['','6','Departments','gold'],
          ['','48','Courses','purple'],
          ['','' + enquiries.length,'Applications','cyan'],
          ['','47.6Cr','Fee Collected','green'],
          ['','94%','Placement Rate','pink'],
          ['','75+','Equipped Labs','orange'],
        ].map(([icon, val, label, color]) => (
          <div className="ap-stat" key={label}>
            <div className={`ap-stat-icon ${color}`}>{icon}</div>
            <div className="ap-stat-text">
              <h3>{val}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-dash-row">
        <div className="ap-dash-box" style={{ height: '350px' }}>
          <h4> Today's Attendance Summary</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'CSE', present: 1180, total: 1200 },
                { name: 'ECE', present: 940, total: 980 },
                { name: 'Mech', present: 800, total: 850 },
                { name: 'Civil', present: 685, total: 720 },
                { name: 'IT', present: 620, total: 650 },
                { name: 'Biotech', present: 390, total: 420 },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="Present Students" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="#e2e8f0" name="Total Students" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="ap-dash-box" style={{ height: '350px' }}>
          <h4> Department-wise Fee Collection (Cr)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'CSE', collected: 11.2, target: 12.0 },
                { name: 'ECE', collected: 8.8, target: 10.0 },
                { name: 'Mech', collected: 9.5, target: 10.0 },
                { name: 'Civil', collected: 6.8, target: 8.0 },
                { name: 'IT', collected: 7.2, target: 8.0 },
                { name: 'Biotech', collected: 4.1, target: 4.5 },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#3b82f6" name="Collected (Cr)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#e2e8f0" name="Target (Cr)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ap-dash-row">
        <div className="ap-dash-box">
          <h4> Recent Activities</h4>
          {activityLogs.slice(0, 8).map((log, i) => (
            <div className="ap-activity-item" key={log._id || i}>
              <div className="ap-activity-dot" style={{background:'#10b981'}}/>
              <span className="ap-activity-text">{log.user}: {log.action} - {log.details}</span>
              <span className="ap-activity-time">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}</span>
            </div>
          ))}
          {activityLogs.length === 0 && (
            <div className="ap-empty-row" style={{fontSize:13,color:'#64748b',padding:'10px 0'}}>No recent activity logs.</div>
          )}
        </div>
        <div className="ap-dash-box">
          <h4> Quick Actions</h4>
          <div className="ap-quick-actions" style={{marginBottom:20}}>
            {[
              ['','Add Student',()=>openModal('student')],
              ['','Add Faculty',()=>openModal('faculty')],
              ['','New Admission',()=>setPage('admissions')],
              ['','Post Notice',()=>openModal('notice')],
              ['','Add Event',()=>openModal('event')],
              ['','View Reports',()=>setPage('reports')],
              ['','Fee Records',()=>setPage('fees')],
              ['','Settings',()=>setPage('settings')],
            ].map(([icon,label,fn]) => (
              <button key={label} className="ap-quick-btn" onClick={fn}>
                <span className="ap-qb-icon">{icon}</span>{label}
              </button>
            ))}
          </div>
          <h4 style={{marginTop:8}}> Pending Action Items</h4>
          {[
            ['Review 15 pending admission apps','15','High','#ef4444'],
            ['Approve 8 faculty leave requests','8','Medium','#f59e0b'],
            ['Process 23 fee confirmations','23','Medium','#f59e0b'],
            ['Update exam timetable','1','High','#ef4444'],
            ['Verify 12 document submissions','12','Low','#10b981'],
          ].map(([task,count,pri,color]) => (
            <div key={task} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid #f1f5f9'}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>{count}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{task}</div>
                <div style={{fontSize:11,color:'#94a3b8'}}>Priority: <span style={{color,fontWeight:700}}>{pri}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ap-dash-row">
        <div className="ap-dash-box">
          <h4> Upcoming Events</h4>
          {[
            {day:'15',month:'Jul',title:'Annual Tech Fest 2025',desc:'Three-day technical festival at Main Auditorium'},
            {day:'20',month:'Jun',title:'Sports Day 2025',desc:'Inter-department sports competition'},
            {day:'25',month:'Jun',title:'Workshop on AI/ML',desc:'Two-day workshop at Seminar Hall'},
            {day:'01',month:'Jul',title:'Odd Semester Begins',desc:'Academic Year 2025-26 Odd Semester'},
          ].map((ev,i) => (
            <div className="ap-event-card" key={i}>
              <div className="ap-event-date"><span className="day">{ev.day}</span><span className="month">{ev.month}</span></div>
              <div className="ap-event-info"><h4>{ev.title}</h4><p>{ev.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="ap-dash-box">
          <h4> Quick Statistics</h4>
          {[
            ['Today\'s Classes','142 / 150','Conducted','#10b981'],
            ['Active Assignments','68','Pending Submission','#f59e0b'],
            ['Library Books Issued','2,340','Currently Out','#3b82f6'],
            ['Hostel Occupancy','920 / 1000','Students','#8b5cf6'],
            ['Transport Routes','45','Active Routes','#06b6d4'],
            ['Exam Schedule','12','Upcoming Tests','#ec4899'],
          ].map(([label,value,sub,color]) => (
            <div key={label} style={{padding:'12px',marginBottom:10,background:'#f8fafc',borderRadius:10,borderLeft:`4px solid ${color}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:'#1e293b'}}>{label}</div>
                  <div style={{fontSize:12,color:'#64748b',marginTop:2}}>{sub}</div>
                </div>
                <div style={{fontWeight:800,fontSize:20,color}}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Student Management</h2><p>Manage all enrolled students  {stuData.length} total</p></div>
        <div className="ap-page-actions" style={{ display: 'flex', gap: '10px' }}>
          <label className="ap-btn sm outline" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            Upload Excel
            <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={handleStudentExcelUpload} />
          </label>
          <button className="ap-btn sm gold" onClick={() => openModal('student')}>+ Add Student</button>
        </div>
      </div>
      <div className="ap-adm-stats" style={{gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))'}}>
        {[
          ['Active',stuData.filter(s=>s.status==='Active').length,'green'],
          ['On Leave',stuData.filter(s=>s.status==='On Leave').length,'yellow'],
          ['CSE',stuData.filter(s=>s.dept==='CSE').length,'blue'],
          ['ECE',stuData.filter(s=>s.dept==='ECE').length,'purple'],
          ['IT',stuData.filter(s=>s.dept==='IT').length,'cyan'],
        ].map(([label,val,cls]) => (
          <div className={`ap-adm-card ${cls}`} key={label}><h4>{val}</h4><p>{label}</p></div>
        ))}
      </div>
      <div className="ap-controls">
        <input placeholder=" Search students..." value={stuSearch} onChange={e=>setStuSearch(e.target.value)} />
        <select onChange={e=>setStuSearch(e.target.value===''?'':e.target.value)}>
          <option value="">All Departments</option>
          {['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}
        </select>
        <select onChange={e=>{if(e.target.value) setStuSearch('sem'+e.target.value);}}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>
      <div className="ap-table-wrap">
        <div className="ap-scroll-table">
          <table className="ap-table">
            <thead><tr><th>#</th><th>Photo</th><th>Roll No.</th><th>Name</th><th>Dept.</th><th>Sem</th><th>Email</th><th>Phone</th><th>Blood</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredStudents.map((s,i) => (
                <tr key={s._id || s.id}>
                  <td>{i+1}</td>
                  <td>
                    {s.profilePhoto ? (
                      <img src={s.profilePhoto} alt={s.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                        {s.name?.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{s.roll}</td>
                  <td style={{fontWeight:600}}>{s.name}</td>
                  <td><span className="badge badge-blue">{s.dept}</span></td>
                  <td>{s.sem}</td><td style={{fontSize:12}}>{s.email}</td>
                  <td style={{fontSize:12}}>{s.phone||''}</td>
                  <td><span className="badge badge-purple">{s.bloodGroup||''}</span></td>
                  <td><span className={s.status==='Active'?'badge-ok':'badge-warn'}>{s.status}</span></td>
                  <td>
                    <button className="ap-act-btn view" onClick={()=>setViewModal({open:true,data:s,type:'student'})}> View</button>
                    <button className="ap-act-btn edit" onClick={()=>openModal('editStudent',s)}> Edit</button>
                    <button className="ap-act-btn del" onClick={async () => {
                      if (window.confirm(`Delete ${s.name}?`)) {
                        const res = await deleteAdminStudent(s._id || s.id);
                        if (res && res.success) {
                          setStuData(stuData.filter(st => st._id !== s._id && st.id !== s.id));
                        } else {
                          alert("Failed to delete student");
                        }
                      }
                    }}> Del</button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length===0 && <tr><td colSpan="10"><div className="ap-empty"><div className="ap-empty-icon"></div><p>No students found</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFaculty = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Faculty Management</h2><p>{facultyData.length} faculty members registered</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm gold" onClick={()=>openModal('faculty')}>+ Add Faculty</button>
        </div>
      </div>
      <div className="ap-adm-stats" style={{gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))'}}>
        {[
          ['Active',facultyData.filter(f=>f.status==='Active').length,'green'],
          ['On Leave',facultyData.filter(f=>f.status==='On Leave').length,'yellow'],
          ['Professors',facultyData.filter(f=>f.designation?.includes('Professor')&&!f.designation?.includes('Asst')&&!f.designation?.includes('Assoc')).length,'blue'],
          ['Assoc. Prof',facultyData.filter(f=>f.designation?.includes('Assoc')).length,'purple'],
          ['Asst. Prof',facultyData.filter(f=>f.designation?.includes('Asst')).length,'cyan'],
        ].map(([label,val,cls]) => (
          <div className={`ap-adm-card ${cls}`} key={label}><h4>{val}</h4><p>{label}</p></div>
        ))}
      </div>
      <div className="ap-controls">
        <input placeholder=" Search faculty..." value={facultySearch} onChange={e=>setFacultySearch(e.target.value)} />
        <select onChange={e=>setFacultySearch(e.target.value===''?'':e.target.value)}>
          <option value="">All Departments</option>
          {['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="ap-table-wrap">
        <div className="ap-scroll-table">
          <table className="ap-table">
            <thead><tr><th>#</th><th>Photo</th><th>Emp ID</th><th>Name</th><th>Dept.</th><th>Designation</th><th>Qualification</th><th>Specialization</th><th>Experience</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredFaculty.map((f,i) => (
                <tr key={f._id || f.id}>
                  <td>{i+1}</td>
                  <td>
                    {f.profilePhoto ? (
                      <img src={f.profilePhoto} alt={f.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                        {f.name?.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{f.empId}</td>
                  <td style={{fontWeight:600}}>{f.name}</td>
                  <td><span className="badge badge-blue">{f.dept}</span></td>
                  <td>{f.designation}</td>
                  <td><span className="badge badge-purple">{f.qualification||''}</span></td>
                  <td style={{fontSize:12}}>{f.specialization||''}</td>
                  <td>{f.experience||''}</td>
                  <td><span className={f.status==='Active'?'badge-ok':'badge-warn'}>{f.status}</span></td>
                  <td>
                    <button className="ap-act-btn view" onClick={()=>setViewModal({open:true,data:f,type:'faculty'})}> View</button>
                    <button className="ap-act-btn del" onClick={async () => {
                      if (window.confirm(`Delete ${f.name}?`)) {
                        const res = await deleteAdminFaculty(f._id || f.id);
                        if (res && res.success) {
                          setFacultyData(facultyData.filter(fc => fc._id !== f._id && fc.id !== f.id));
                        } else {
                          alert("Failed to delete faculty");
                        }
                      }
                    }}> Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Department Management</h2><p>{departments.length} departments across Best Engineering College</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm gold" onClick={()=>openModal('department')}>+ Create Department</button>
        </div>
      </div>
      <div className="ap-dept-grid">
        {departments.map((d) => (
          <div className="ap-dept-card" key={d._id || d.id}>
            <div className="ap-dept-icon" style={{background:`${d.color}20`,color:d.color}}>{d.icon}</div>
            <h4>{d.name}</h4>
            <p style={{fontWeight:600,color:'#374151',marginBottom:10}}>HOD: {d.hod}</p>
            <div className="ap-dept-meta">
              <span>{d.facultyCount}</span><span>{d.studentCount}</span><span>{d.labCount}</span>
              <span>{d.ugCourses} Courses</span><span>{d.pgCourses} PG</span>
            </div>
            <div style={{fontSize:12,color:'#10b981',fontWeight:700,marginBottom:14,background:'#f0fdf4',padding:'4px 10px',borderRadius:6,display:'inline-block'}}>{d.accreditation}</div>
            <div style={{display:'flex',gap:8}}>
              <button className="ap-btn sm outline" style={{flex:1}} onClick={()=>alert(`${d.name}\nHOD: ${d.hod}\n${d.facultyCount}, ${d.studentCount}\nAccreditation: ${d.accreditation}`)}>View Details</button>
              <button className="ap-btn sm ghost" onClick={()=>openModal('editDepartment', d)}>Edit</button>
              <button className="ap-btn sm ghost" style={{color: '#ef4444', borderColor: '#fee2e2'}} onClick={async () => {
                if (window.confirm(`Delete department ${d.name}?`)) {
                  const res = await deleteAdminDepartment(d._id || d.id);
                  if (res && res.success) {
                    setDepartments(departments.filter(dept => dept._id !== d._id && dept.id !== d.id));
                  } else {
                    alert("Failed to delete department");
                  }
                }
              }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourses = () => {
    const filteredCourses = courses.filter(c => {
      const q = courseSearch.toLowerCase();
      const matchSearch = !q || c.code?.toLowerCase().includes(q) || c.name?.toLowerCase().includes(q);
      const matchDept = !courseDeptFilter || c.dept === courseDeptFilter;
      const matchSem = !courseSemFilter || c.sem === parseInt(courseSemFilter);
      return matchSearch && matchDept && matchSem;
    });

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Course Management</h2><p>All academic programs — {courses.length} courses listed</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm gold" onClick={()=>openModal('course')}>+ Add Course</button>
          </div>
        </div>
        <div className="ap-controls">
          <input 
            placeholder=" Search by code or name..." 
            value={courseSearch}
            onChange={e=>setCourseSearch(e.target.value)}
          />
          <select value={courseDeptFilter} onChange={e=>setCourseDeptFilter(e.target.value === 'All Departments' ? '' : e.target.value)}>
            <option>All Departments</option>
            {['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={courseSemFilter} onChange={e=>setCourseSemFilter(e.target.value === 'All Semesters' ? '' : e.target.value)}>
            <option>All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
        <div className="ap-table-wrap">
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>#</th><th>Code</th><th>Course Name</th><th>Dept</th><th>Sem</th><th>Credits</th><th>Type</th><th>Faculty</th><th>Students</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredCourses.map((c, i) => (
                  <tr key={c._id || c.code}>
                    <td>{i+1}</td>
                    <td style={{fontWeight:700,color:'#2563eb'}}>{c.code}</td>
                    <td style={{fontWeight:600}}>{c.name}</td>
                    <td><span className="badge badge-blue">{c.dept}</span></td>
                    <td>{c.sem}</td>
                    <td><span className="badge badge-purple">{c.credits}</span></td>
                    <td><span className={c.type==='Core'?'badge-ok':'badge-warn'}>{c.type}</span></td>
                    <td style={{fontSize:12}}>{c.faculty}</td>
                    <td>{c.studentsCount || 0}</td>
                    <td>
                      <button className="ap-act-btn edit" onClick={()=>openModal('editCourse', c)}>Edit</button>
                      <button className="ap-act-btn del" onClick={async () => {
                        if (window.confirm(`Delete Course ${c.code}?`)) {
                          const res = await deleteAdminCourse(c._id || c.id);
                          if (res && res.success) {
                            setCourses(courses.filter(crs => crs._id !== c._id && crs.id !== c.id));
                          } else {
                            alert("Failed to delete course");
                          }
                        }
                      }}>Del</button>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr><td colSpan="10" style={{textAlign:'center',padding:20,color:'#64748b'}}>No courses found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSubjects = () => {
    const filteredSubjects = subjects.filter(s => {
      const q = subjectSearch.toLowerCase();
      const matchSearch = !q || s.code?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q);
      const matchDept = !subjectDeptFilter || s.dept === subjectDeptFilter;
      const matchSem = !subjectSemFilter || s.sem === parseInt(subjectSemFilter);
      return matchSearch && matchDept && matchSem;
    });

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Subject Management</h2><p>Create and map subjects to courses and semesters</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm gold" onClick={()=>openModal('subject')}>+ Create Subject</button>
          </div>
        </div>
        <div className="ap-controls">
          <input 
            placeholder=" Search subjects..."
            value={subjectSearch}
            onChange={e=>setSubjectSearch(e.target.value)}
          />
          <select value={subjectDeptFilter} onChange={e=>setSubjectDeptFilter(e.target.value === 'All Departments' ? '' : e.target.value)}>
            <option>All Departments</option>
            {['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={subjectSemFilter} onChange={e=>setSubjectSemFilter(e.target.value === 'All Semesters' ? '' : e.target.value)}>
            <option>All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
        <div className="ap-table-wrap">
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>#</th><th>Subject Code</th><th>Subject Name</th><th>Dept</th><th>Semester</th><th>Credits</th><th>L-T-P</th><th>Faculty Assigned</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredSubjects.map((s, i) => (
                  <tr key={s._id || s.code}>
                    <td>{i+1}</td>
                    <td style={{fontWeight:700,color:'#2563eb'}}>{s.code}</td>
                    <td style={{fontWeight:600}}>{s.name}</td>
                    <td><span className="badge badge-blue">{s.dept}</span></td>
                    <td>{s.sem}</td>
                    <td><span className="badge badge-purple">{s.credits}</span></td>
                    <td><span className="badge badge-cyan">{s.ltp}</span></td>
                    <td style={{fontSize:12}}>{s.faculty}</td>
                    <td>
                      <button className="ap-act-btn edit" onClick={()=>alert(`Edit Subject: ${s.name}`)}>Edit</button>
                      <button className="ap-act-btn del" onClick={()=>alert('Delete confirmation')}>Del</button>
                    </td>
                  </tr>
                ))}
                {filteredSubjects.length === 0 && (
                  <tr><td colSpan="9" style={{textAlign:'center',padding:20,color:'#64748b'}}>No subjects found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAdmissions = () => {
    const admissionEnquiries = enquiries.filter(e => e.type === 'admission' || !e.type);

    const filteredAdmissions = admissionEnquiries.filter(e => {
      const matchSearch = !admissionsFilter.search || 
        e.name?.toLowerCase().includes(admissionsFilter.search.toLowerCase()) ||
        e.appId?.toLowerCase().includes(admissionsFilter.search.toLowerCase()) ||
        e.department?.toLowerCase().includes(admissionsFilter.search.toLowerCase());

      const matchStatus = !admissionsFilter.status || e.status === admissionsFilter.status;
      const matchDept = !admissionsFilter.dept || e.department?.includes(admissionsFilter.dept);

      return matchSearch && matchStatus && matchDept;
    });

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Admissions Management</h2><p>Academic Year 2025-26 application tracking</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm" onClick={()=>alert('Download Merit List PDF')}> Merit List</button>
            <button className="ap-btn sm gold" onClick={()=>openModal('admission')}>+ New Application</button>
          </div>
        </div>
        <div className="ap-adm-stats">
          <div className="ap-adm-card"><h4>{admissionEnquiries.length}</h4><p>Total Applications</p></div>
          <div className="ap-adm-card green"><h4>{admissionEnquiries.filter(e => e.status === 'Approved').length}</h4><p>Approved</p></div>
          <div className="ap-adm-card yellow"><h4>{admissionEnquiries.filter(e => e.status === 'Pending' || e.status === 'Under Review').length}</h4><p>Under Review</p></div>
          <div className="ap-adm-card red"><h4>{admissionEnquiries.filter(e => e.status === 'Rejected').length}</h4><p>Rejected</p></div>
          <div className="ap-adm-card blue"><h4>{admissionEnquiries.filter(e => e.status === 'Document Verification').length}</h4><p>Doc Verification</p></div>
        </div>
        <div className="ap-controls">
          <input 
            placeholder=" Search by name, app ID, course..."
            value={admissionsFilter.search}
            onChange={e => setAdmissionsFilter({ ...admissionsFilter, search: e.target.value })}
          />
          <select 
            value={admissionsFilter.status}
            onChange={e => setAdmissionsFilter({ ...admissionsFilter, status: e.target.value === 'All Status' ? '' : e.target.value })}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Under Review</option>
            <option>Document Verification</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <select 
            value={admissionsFilter.dept}
            onChange={e => setAdmissionsFilter({ ...admissionsFilter, dept: e.target.value === 'All Courses' ? '' : e.target.value })}
          >
            <option>All Courses</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>Mech</option>
            <option>Civil</option>
            <option>IT</option>
            <option>Biotech</option>
          </select>
        </div>
        <div className="ap-table-wrap">
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>#</th><th>App ID</th><th>Name</th><th>Course</th><th>10th %</th><th>12th %</th><th>Category</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredAdmissions.map((e, i) => (
                  <tr key={e._id || e.id}>
                    <td>{i+1}</td>
                    <td style={{fontWeight:700,fontSize:12,color:'#2563eb'}}>{e.appId || (e._id ? e._id.substring(18) : 'PENDING')}</td>
                    <td style={{fontWeight:600}}>{e.name || `${e.firstName || ''} ${e.lastName || ''}`}</td>
                    <td>{e.department || 'B.E. CSE'}</td>
                    <td>{e.tenthPercent ? `${e.tenthPercent}%` : '—'}</td>
                    <td>{e.twelfthPercent ? `${e.twelfthPercent}%` : '—'}</td>
                    <td><span className="badge badge-cyan">{e.community || 'General'}</span></td>
                    <td>{e.date}</td>
                    <td><span className={e.status==='Approved'?'badge-ok':(e.status==='Pending'||e.status==='Under Review'||e.status==='Document Verification')?'badge-warn':'badge-low'}>{e.status}</span></td>
                    <td>
                      <button className="ap-act-btn view" onClick={() => { e.tempStatus = e.status; setAdmissionDetailModal({ open: true, data: e }); }}>Review / Decision</button>
                    </td>
                  </tr>
                ))}
                {filteredAdmissions.length === 0 && (
                  <tr><td colSpan="10" style={{textAlign:'center',padding:20,color:'#64748b'}}>No applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendance = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Attendance Management</h2><p>Track and manage student & faculty attendance</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm" onClick={()=>alert('Download Attendance Report')}> Export Report</button>
          <button className="ap-btn sm gold" onClick={()=>openModal('markAttendance')}>+ Mark Attendance</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card green"><h4>96.2%</h4><p>Today's Average</p></div>
        <div className="ap-adm-card blue"><h4>4,620</h4><p>Present Today</p></div>
        <div className="ap-adm-card yellow"><h4>182</h4><p>Absent Today</p></div>
        <div className="ap-adm-card red"><h4>48</h4><p>Below 75%</p></div>
      </div>
      <h3 style={{fontWeight:700,fontSize:16,color:'#0f172a',marginBottom:16}}>Department-wise Attendance (Today)</h3>
      <div className="ap-table-wrap">
        <div className="ap-scroll-table">
          <table className="ap-table">
            <thead><tr><th>Department</th><th>Total Students</th><th>Present</th><th>Absent</th><th>Percentage</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {[
                ['CSE',1200,1180,20,98,'Excellent'],
                ['ECE',980,940,40,96,'Excellent'],
                ['Mech',850,800,50,94,'Good'],
                ['Civil',720,685,35,95,'Excellent'],
                ['IT',650,620,30,95,'Excellent'],
                ['Biotech',420,390,30,93,'Good'],
              ].map(([dept,total,pres,abs,pct,status]) => (
                <tr key={dept}>
                  <td style={{fontWeight:700}}>{dept}</td>
                  <td>{total}</td>
                  <td style={{color:'#10b981',fontWeight:700}}>{pres}</td>
                  <td style={{color:'#ef4444',fontWeight:700}}>{abs}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{flex:1,background:'#e2e8f0',borderRadius:10,height:8,overflow:'hidden',minWidth:80}}>
                        <div style={{height:'100%',width:`${pct}%`,background:pct>=95?'#10b981':'#f59e0b',borderRadius:10}}/>
                      </div>
                      <span style={{fontWeight:700,color:pct>=95?'#10b981':'#f59e0b',minWidth:38}}>{pct}%</span>
                    </div>
                  </td>
                  <td><span className={pct>=95?'badge-ok':'badge-warn'}>{status}</span></td>
                  <td><button className="ap-act-btn view" onClick={()=>alert(`View detailed attendance for ${dept}`)}>View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ap-dash-row" style={{marginTop:20}}>
        <div className="ap-dash-box">
          <h4> Students Below 75% Attendance</h4>
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>Roll No.</th><th>Name</th><th>Dept</th><th>Attendance %</th><th>Action</th></tr></thead>
              <tbody>
                {[['21CS004','Amit Kumar','CSE','72%'],['21EC007','Suresh M','ECE','68%'],['21ME003','Rohit P','Mech','70%'],['21CV002','Nisha R','Civil','73%']].map(([roll,name,dept,pct]) => (
                  <tr key={roll}>
                    <td style={{fontWeight:700,color:'#ef4444'}}>{roll}</td>
                    <td>{name}</td>
                    <td><span className="badge badge-blue">{dept}</span></td>
                    <td><span className="badge-low">{pct}</span></td>
                    <td><button className="ap-act-btn warn" onClick={()=>alert(`Send attendance warning to ${name}`)}> Notify</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="ap-dash-box">
          <h4> Monthly Attendance Trend</h4>
          {[['Jan','96.2%','#10b981'],['Feb','95.8%','#10b981'],['Mar','94.5%','#f59e0b'],['Apr','96.0%','#10b981'],['May','93.8%','#f59e0b'],['Jun','95.1%','#10b981']].map(([month,pct,color]) => (
            <div className="ap-progress-row" key={month}>
              <span className="ap-progress-label" style={{width:40}}>{month}</span>
              <div className="ap-progress-bar-wrap">
                <div className="ap-progress-bar" style={{width:pct,background:color}}/>
              </div>
              <span style={{fontWeight:700,color,minWidth:50,textAlign:'right'}}>{pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Timetable Management</h2><p>Create and manage class & lab schedules</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm outline" onClick={()=>alert('Download timetable PDF')}> Export</button>
          <button className="ap-btn sm gold" onClick={()=>openModal('timetable')}>+ Create Timetable</button>
        </div>
      </div>
      <div className="ap-controls">
        <select><option>CSE  Semester 5</option><option>CSE  Semester 3</option><option>ECE  Semester 5</option><option>Mech  Semester 5</option></select>
        <select><option>Academic Year 2025-26</option></select>
      </div>
      <div className="ap-dash-box" style={{marginBottom:20}}>
        <h4> CSE  Semester 5 Weekly Timetable</h4>
        <div className="ap-tt-grid">
          <table className="ap-tt-table">
            <thead>
              <tr><th>Day</th><th>8:00-9:00</th><th>9:00-10:00</th><th>10:15-11:15</th><th>11:15-12:15</th><th>1:00-2:00</th><th>2:00-3:00</th><th>3:00-4:00</th></tr>
            </thead>
            <tbody>
              {[
                ['Mon','DS','OS','','CN','SE','',''],
                ['Tue','DBMS','','DS','DBMS Lab','DBMS Lab','DBMS Lab',''],
                ['Wed','OS','CN','SE','DBMS','','',''],
                ['Thu','DS','DBMS','','CN Lab','CN Lab','CN Lab',''],
                ['Fri','CN','OS','DS','SE','DBMS','',''],
              ].map(([day,...slots]) => (
                <tr key={day}>
                  <td className="day-cell">{day}</td>
                  {slots.map((slot,i) => (
                    <td key={i} className={
                      slot===''?'free-cell':
                      slot.includes('Lunch')?'break-cell':
                      slot.includes('Lab')?'lab-cell':'subject-cell'
                    }>{slot}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ap-dash-row">
        <div className="ap-dash-box">
          <h4> Faculty Schedule Summary</h4>
          <table className="ap-table" style={{minWidth:'auto'}}>
            <thead><tr><th>Faculty</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Total Hrs</th></tr></thead>
            <tbody>
              {[
                ['Dr. Ramesh Kumar',3,2,2,2,2,'11 hrs'],
                ['Dr. Priya Nair',4,4,3,3,3,'17 hrs'],
                ['Dr. Anand Rajan',3,3,3,3,3,'15 hrs'],
                ['Prof. Kumar S.',2,2,3,3,2,'12 hrs'],
              ].map(([name,...hrs]) => (
                <tr key={name}>
                  <td style={{fontWeight:600,fontSize:13}}>{name}</td>
                  {hrs.slice(0,-1).map((h,i)=><td key={i} style={{textAlign:'center',color:h>=4?'#ef4444':'#374151'}}>{h}</td>)}
                  <td><span className="badge badge-blue">{hrs[hrs.length-1]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ap-dash-box">
          <h4> Lab Schedule</h4>
          <table className="ap-table" style={{minWidth:'auto'}}>
            <thead><tr><th>Lab</th><th>Day</th><th>Time</th><th>Dept/Sem</th><th>Faculty</th></tr></thead>
            <tbody>
              {[
                ['CS Lab 1','Tue','1:00-4:00','CSE Sem 5','Dr. Priya Nair'],
                ['CS Lab 2','Thu','1:00-4:00','CSE Sem 5','Prof. Kumar Raj'],
                ['EC Lab 1','Wed','1:00-4:00','ECE Sem 5','Dr. Anand Rajan'],
                ['Mech Lab','Mon','1:00-4:00','Mech Sem 5','Prof. Kumar S'],
                ['Civil Lab','Fri','1:00-4:00','Civil Sem 5','Dr. Meena T'],
              ].map(([lab,day,time,dept,fac]) => (
                <tr key={lab}>
                  <td style={{fontWeight:600}}>{lab}</td>
                  <td><span className="badge badge-purple">{day}</span></td>
                  <td style={{fontSize:12}}>{time}</td>
                  <td><span className="badge badge-cyan">{dept}</span></td>
                  <td style={{fontSize:12}}>{fac}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderExamination = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Examination Management</h2><p>End-semester exams, hall allocation & scheduling</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm outline" onClick={()=>alert('Generate Hall Tickets PDF')}> Hall Tickets</button>
          <button className="ap-btn sm gold" onClick={()=>openModal('exam')}>+ Create Exam</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card blue"><h4>24</h4><p>Exams Scheduled</p></div>
        <div className="ap-adm-card yellow"><h4>12</h4><p>Upcoming</p></div>
        <div className="ap-adm-card green"><h4>8</h4><p>Completed</p></div>
        <div className="ap-adm-card purple"><h4>4</h4><p>Halls Allocated</p></div>
      </div>
      <h3 style={{fontWeight:700,fontSize:16,color:'#0f172a',marginBottom:12}}> Exam Schedule  Semester 5</h3>
      <div className="ap-table-wrap" style={{marginBottom:20}}>
        <div className="ap-scroll-table">
          <table className="ap-table">
            <thead><tr><th>#</th><th>Subject Code</th><th>Subject Name</th><th>Dept</th><th>Exam Date</th><th>Time</th><th>Duration</th><th>Hall</th><th>Invigilator</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ['CS501','Data Structures','CSE','Jul 15, 2025','10:00 AM','3 hrs','Hall A','Dr. Ramesh Kumar','Scheduled'],
                ['CS502','Operating Systems','CSE','Jul 16, 2025','10:00 AM','3 hrs','Hall B','Dr. Priya Nair','Scheduled'],
                ['CS503','DBMS','CSE','Jul 17, 2025','10:00 AM','3 hrs','Hall A','Prof. Kumar Raj','Scheduled'],
                ['EC501','VLSI Design','ECE','Jul 15, 2025','2:00 PM','3 hrs','Hall C','Dr. Anand Rajan','Scheduled'],
                ['ME501','Thermal Engg','Mech','Jul 16, 2025','10:00 AM','3 hrs','Hall D','Prof. Kumar S','Scheduled'],
              ].map(([code,name,dept,date,time,dur,hall,inv,status],i) => (
                <tr key={code}>
                  <td>{i+1}</td>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{code}</td>
                  <td style={{fontWeight:600}}>{name}</td>
                  <td><span className="badge badge-blue">{dept}</span></td>
                  <td>{date}</td><td>{time}</td><td>{dur}</td>
                  <td><span className="badge badge-purple">{hall}</span></td>
                  <td style={{fontSize:12}}>{inv}</td>
                  <td><span className="badge-ok">{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ap-dash-row">
        <div className="ap-dash-box">
          <h4> Hall Allocation</h4>
          <table className="ap-table" style={{minWidth:'auto'}}>
            <thead><tr><th>Hall</th><th>Capacity</th><th>Block</th><th>Allocated</th><th>Available</th></tr></thead>
            <tbody>
              {[['Hall A',120,'Main Block','Jul 15-20','Yes'],['Hall B',100,'Main Block','Jul 15-20','Yes'],['Hall C',80,'New Block','Jul 15-18','Yes'],['Hall D',60,'Lab Block','Jul 15-20','Yes']].map(([hall,cap,block,dates,avail]) => (
                <tr key={hall}><td style={{fontWeight:700}}>{hall}</td><td>{cap}</td><td>{block}</td><td style={{fontSize:12}}>{dates}</td><td><span className="badge-ok">{avail}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ap-dash-box">
          <h4> Invigilator Assignment</h4>
          <table className="ap-table" style={{minWidth:'auto'}}>
            <thead><tr><th>Faculty</th><th>Date</th><th>Hall</th><th>Duty</th></tr></thead>
            <tbody>
              {[['Dr. Ramesh Kumar','Jul 15','Hall A','Morning'],['Dr. Priya Nair','Jul 16','Hall B','Morning'],['Dr. Anand Rajan','Jul 15','Hall C','Afternoon'],['Prof. Kumar S.','Jul 16','Hall D','Morning']].map(([name,date,hall,duty]) => (
                <tr key={name+date}><td style={{fontWeight:600,fontSize:13}}>{name}</td><td style={{fontSize:12}}>{date}</td><td><span className="badge badge-purple">{hall}</span></td><td><span className={duty==='Morning'?'badge-ok':'badge-warn'}>{duty}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Results Management</h2><p>Upload marks, calculate GPA/CGPA and publish results</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm outline" onClick={()=>alert('Publish results to student portals')}> Publish Results</button>
          <button className="ap-btn sm gold" onClick={()=>openModal('uploadMarks')}> Upload Marks</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card green"><h4>89.2%</h4><p>Pass Percentage</p></div>
        <div className="ap-adm-card blue"><h4>8.45</h4><p>Average GPA</p></div>
        <div className="ap-adm-card yellow"><h4>48</h4><p>Arrear Students</p></div>
        <div className="ap-adm-card purple"><h4>12</h4><p>Rank Holders</p></div>
      </div>
      <div className="ap-controls">
        <select><option>CSE  Semester 5</option><option>CSE  Semester 3</option><option>ECE  Semester 5</option></select>
        <select><option>All Subjects</option><option>CS501 - DS</option><option>CS502 - OS</option><option>CS503 - DBMS</option></select>
        <input placeholder=" Search student..." />
      </div>
      <div className="ap-table-wrap">
        <div className="ap-scroll-table">
          <table className="ap-table">
            <thead><tr><th>#</th><th>Roll No.</th><th>Name</th><th>IA1</th><th>IA2</th><th>Assignment</th><th>Internal Total</th><th>Semester Grade</th><th>CGPA</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ['21CS001','Arjun Ramesh',22,20,9,51,'A (9.0)','8.45','Pass'],
                ['21CS002','Priya Lakshmi',23,22,10,55,'A+ (10)','9.12','Pass'],
                ['21CS003','Ravi Kumar',18,17,8,43,'B+ (8.0)','7.82','Pass'],
                ['21CS004','Anitha S',15,14,7,36,'B (7.0)','7.20','Pass'],
                ['21CS005','Karthik V',12,11,6,29,'C (6.0)','6.50','Pass'],
                ['21CS006','Deepa M',8,9,5,22,'D (5.0)','5.80','Arrear'],
              ].map(([roll,name,ia1,ia2,asgn,total,grade,cgpa,status],i) => (
                <tr key={roll}>
                  <td>{i+1}</td>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{roll}</td>
                  <td style={{fontWeight:600}}>{name}</td>
                  <td>{ia1}/25</td><td>{ia2}/25</td><td>{asgn}/10</td>
                  <td style={{fontWeight:700}}>{total}/60</td>
                  <td><span className={status==='Pass'?'badge-ok':'badge-low'}>{grade}</span></td>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{cgpa}</td>
                  <td><span className={status==='Pass'?'badge-ok':'badge-low'}>{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFees = () => {
    const filteredFees = allFees.filter(f => {
      const q = feeSearch.toLowerCase();
      const matchSearch = !q || f.rollNo?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q);
      const matchDept = !feeDeptFilter || f.dept === feeDeptFilter;
      const matchStatus = !feeStatusFilter || 
        (feeStatusFilter === 'Fully Paid' && f.due === 0) || 
        (feeStatusFilter === 'Partial' && f.paid > 0 && f.due > 0) || 
        (feeStatusFilter === 'Overdue' && f.paid === 0 && f.due > 0);
      return matchSearch && matchDept && matchStatus;
    });

    const totalExpected = allFees.reduce((sum, f) => sum + (f.total || 0), 0);
    const totalCollected = allFees.reduce((sum, f) => sum + (f.paid || 0), 0);
    const totalPending = allFees.reduce((sum, f) => sum + (f.due || 0), 0);
    const totalDefaulters = allFees.filter(f => f.due > 30000).length;

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Fees Management</h2><p>Academic Year 2025-26 fee collection overview</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm outline" onClick={()=>openModal('feeStructure')}> Fee Structure</button>
            <button className="ap-btn sm gold" onClick={()=>openModal('addPayment')}>+ Record Payment</button>
          </div>
        </div>
        <div className="ap-adm-stats">
          <div className="ap-adm-card green"><h4>₹{(totalCollected/10000000).toFixed(2)} Cr</h4><p>Total Collected</p></div>
          <div className="ap-adm-card yellow"><h4>₹{(totalPending/10000000).toFixed(2)} Cr</h4><p>Pending</p></div>
          <div className="ap-adm-card"><h4>₹{(totalExpected/10000000).toFixed(2)} Cr</h4><p>Total Expected</p></div>
          <div className="ap-adm-card red"><h4>{totalDefaulters}</h4><p>Defaulters (>₹30k)</p></div>
          <div className="ap-adm-card blue"><h4>15</h4><p>Scholarships</p></div>
        </div>
        <div className="ap-controls">
          <input 
            placeholder=" Search by name or roll no..."
            value={feeSearch}
            onChange={e=>setFeeSearch(e.target.value)}
          />
          <select value={feeDeptFilter} onChange={e=>setFeeDeptFilter(e.target.value === 'All Departments' ? '' : e.target.value)}>
            <option>All Departments</option>
            {['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={feeStatusFilter} onChange={e=>setFeeStatusFilter(e.target.value === 'All Status' ? '' : e.target.value)}>
            <option>All Status</option>
            <option>Fully Paid</option>
            <option>Partial</option>
            <option>Overdue</option>
          </select>
        </div>
        <div className="ap-table-wrap">
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>#</th><th>Roll No.</th><th>Name</th><th>Dept</th><th>Sem</th><th>Total Fee</th><th>Paid</th><th>Pending</th><th>Last Payment</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredFees.map((f, i) => {
                  const status = f.due === 0 ? 'Paid' : f.paid > 0 ? 'Partial' : 'Overdue';
                  return (
                    <tr key={f._id || f.rollNo}>
                      <td>{i+1}</td>
                      <td style={{fontWeight:700,color:'#2563eb'}}>{f.rollNo}</td>
                      <td style={{fontWeight:600}}>{f.name}</td>
                      <td><span className="badge badge-blue">{f.dept}</span></td>
                      <td>{f.sem}</td>
                      <td>₹{f.total?.toLocaleString()}</td>
                      <td style={{color:'#10b981',fontWeight:700}}>₹{f.paid?.toLocaleString()}</td>
                      <td style={{color:f.due===0?'#64748b':'#ef4444',fontWeight:700}}>₹{f.due?.toLocaleString()}</td>
                      <td style={{fontSize:12}}>{f.history && f.history[0] ? f.history[0].date : 'N/A'}</td>
                      <td><span className={status==='Paid'?'badge-ok':status==='Partial'?'badge-warn':'badge-low'}>{status}</span></td>
                      <td>
                        <button className="ap-act-btn view" onClick={()=>alert(`Fee receipt for ${f.name}`)}> Receipt</button>
                        {status!=='Paid' && <button className="ap-act-btn warn" onClick={()=>alert(`Send reminder to ${f.name}`)}> Remind</button>}
                      </td>
                    </tr>
                  );
                })}
                {filteredFees.length === 0 && (
                  <tr><td colSpan="11" style={{textAlign:'center',padding:20,color:'#64748b'}}>No fee records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderLibrary = () => {
    const filteredBooks = books.filter(b => {
      const q = bookSearch.toLowerCase();
      const matchSearch = !q || b.bookId?.toLowerCase().includes(q) || b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
      const matchCat = !bookCatFilter || b.category === bookCatFilter;
      return matchSearch && matchCat;
    });

    const totalBooks = books.reduce((sum, b) => sum + (b.copies || 0), 0);
    const issuedBooks = books.reduce((sum, b) => sum + ((b.copies - b.available) || 0), 0);
    const availableBooks = books.reduce((sum, b) => sum + (b.available || 0), 0);
    const lowStockBooks = books.filter(b => b.available > 0 && b.available <= 3).length;

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Library Management</h2><p>Book inventory, issue/return tracking and fines</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm outline" onClick={()=>openModal('returnBook')}> Return Book</button>
            <button className="ap-btn sm gold" onClick={()=>openModal('issueBook')}> Issue Book</button>
            <button className="ap-btn sm ghost" onClick={()=>openModal('addBook')}>+ Add Book</button>
          </div>
        </div>
        <div className="ap-adm-stats">
          <div className="ap-adm-card blue"><h4>{totalBooks.toLocaleString()}</h4><p>Total Books</p></div>
          <div className="ap-adm-card yellow"><h4>{issuedBooks.toLocaleString()}</h4><p>Books Issued</p></div>
          <div className="ap-adm-card green"><h4>{availableBooks.toLocaleString()}</h4><p>Available</p></div>
          <div className="ap-adm-card red"><h4>{lowStockBooks}</h4><p>Low Stock Categories</p></div>
          <div className="ap-adm-card purple"><h4>₹8,400</h4><p>Fines Collected</p></div>
        </div>
        <div className="ap-dash-row">
          <div className="ap-dash-box" style={{gridColumn:'1/-1'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:12}}>
              <h4> Book Inventory</h4>
              <div className="ap-controls" style={{margin:0}}>
                <input 
                  placeholder=" Search books..."
                  value={bookSearch}
                  onChange={e=>setBookSearch(e.target.value)}
                />
                <select value={bookCatFilter} onChange={e=>setBookCatFilter(e.target.value === 'All Categories' ? '' : e.target.value)}>
                  <option>All Categories</option>
                  <option>CS</option>
                  <option>Electronics</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                  <option>IT</option>
                  <option>Biology</option>
                </select>
              </div>
            </div>
            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead><tr><th>#</th><th>Book ID</th><th>Title</th><th>Author</th><th>Category</th><th>Dept</th><th>Copies</th><th>Available</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredBooks.map((b, i) => (
                    <tr key={b._id || b.bookId}>
                      <td>{i+1}</td>
                      <td style={{fontWeight:700,color:'#2563eb',fontSize:12}}>{b.bookId}</td>
                      <td style={{fontWeight:600}}>{b.title}</td>
                      <td style={{fontSize:12}}>{b.author}</td>
                      <td><span className="badge badge-blue">{b.category}</span></td>
                      <td><span className="badge badge-cyan">{b.dept}</span></td>
                      <td>{b.copies}</td>
                      <td style={{fontWeight:700,color:b.available===0?'#ef4444':b.available<=3?'#f59e0b':'#10b981'}}>{b.available}</td>
                      <td><span className={b.available===0?'badge-low':b.available<=3?'badge-warn':'badge-ok'}>{b.status}</span></td>
                      <td>
                        <button className="ap-act-btn view" onClick={()=>alert(`Issue book: ${b.title}`)}> Issue</button>
                        <button className="ap-act-btn edit" onClick={()=>alert(`Edit: ${b.title}`)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                  {filteredBooks.length === 0 && (
                    <tr><td colSpan="10" style={{textAlign:'center',padding:20,color:'#64748b'}}>No books found in inventory.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="ap-dash-row">
          <div className="ap-dash-box">
            <h4> Overdue Books</h4>
            <table className="ap-table" style={{minWidth:'auto'}}>
              <thead><tr><th>Roll No.</th><th>Book</th><th>Issued</th><th>Due Date</th><th>Fine</th><th>Action</th></tr></thead>
              <tbody>
                {[['21CS001','Intro to Algorithms','May 1','May 15','₹150'],['21EC005','VLSI Design','May 5','May 19','₹100'],['21ME003','Fluid Mech','Apr 28','May 12','₹250']].map(([roll,book,issued,due,fine]) => (
                  <tr key={roll+book}>
                    <td style={{fontWeight:700,color:'#ef4444'}}>{roll}</td>
                    <td style={{fontSize:12}}>{book}</td>
                    <td style={{fontSize:12}}>{issued}</td>
                    <td style={{fontSize:12,color:'#ef4444'}}>{due}</td>
                    <td style={{fontWeight:700,color:'#ef4444'}}>{fine}</td>
                    <td><button className="ap-act-btn warn" onClick={()=>alert(`Send notice to ${roll}`)}> Notify</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ap-dash-box">
            <h4> Department-wise Book Usage</h4>
            {[['CSE',680,850,80],['ECE',540,650,83],['Mech',420,520,81],['Civil',380,450,84],['IT',320,400,80],['Biotech',240,280,86]].map(([dept,used,total,pct]) => (
              <div className="ap-progress-row" key={dept}>
                <span className="ap-progress-label">{dept}</span>
                <div className="ap-progress-bar-wrap">
                  <div className="ap-progress-bar" style={{width:`${pct}%`,background:'#3b82f6'}}/>
                </div>
                <span className="ap-progress-count">{used}/{total}</span>
                <span className="ap-progress-pct" style={{color:'#3b82f6'}}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHostel = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Hostel Management</h2><p>Room allocation, occupancy and hostel fee tracking</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm gold" onClick={()=>openModal('allocateRoom')}>+ Allocate Room</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card blue"><h4>1,000</h4><p>Total Rooms</p></div>
        <div className="ap-adm-card red"><h4>920</h4><p>Occupied</p></div>
        <div className="ap-adm-card green"><h4>80</h4><p>Vacant</p></div>
        <div className="ap-adm-card yellow"><h4>12</h4><p>Under Maintenance</p></div>
        <div className="ap-adm-card purple"><h4>92%</h4><p>Occupancy Rate</p></div>
      </div>
      <div className="ap-dash-row">
        <div className="ap-dash-box">
          <h4> Block-wise Room Status — Block A (Boys)</h4>
          <div className="ap-room-grid">
            {Array.from({length:40},(_,i)=>i+101).map(room => {
              const status = room<=135 ? 'occupied' : room<=137 ? 'maintenance' : 'vacant';
              return <div key={room} className={`ap-room ${status}`} onClick={()=>alert(`Room ${room}: ${status}`)}>{room}</div>;
            })}
          </div>
          <div style={{display:'flex',gap:16,marginTop:16,flexWrap:'wrap'}}>
            {[['occupied','#fee2e2','#991b1b','Occupied'],['vacant','#d1fae5','#065f46','Vacant'],['maintenance','#fef3c7','#92400e','Maintenance']].map(([cls,bg,color,label]) => (
              <div key={cls} style={{display:'flex',alignItems:'center',gap:6,fontSize:12}}>
                <div style={{width:14,height:14,borderRadius:4,background:bg,border:`2px solid ${color}`}}/>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ap-dash-box">
          <h4> Recent Allocations</h4>
          <table className="ap-table" style={{minWidth:'auto'}}>
            <thead><tr><th>Room</th><th>Student</th><th>Roll</th><th>Block</th><th>Allotted</th></tr></thead>
            <tbody>
              {hostelAllocations.map((a) => (
                <tr key={a._id || a.room}>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{a.room}</td>
                  <td style={{fontWeight:600,fontSize:13}}>{a.student}</td>
                  <td style={{fontSize:12}}>{a.roll}</td>
                  <td><span className="badge badge-blue">{a.block}</span></td>
                  <td style={{fontSize:12}}>{a.date}</td>
                </tr>
              ))}
              {hostelAllocations.length === 0 && (
                <tr><td colSpan="5" style={{textAlign:'center',padding:20,color:'#64748b'}}>No allocations found.</td></tr>
              )}
            </tbody>
          </table>
          <div className="ap-divider"/>
          <h4> Hostel Fee Status</h4>
          {[['Block A (Boys)','23 L','2.1 L','#10b981',92],['Block B (Girls)','18 L','1.5 L','#f59e0b',92],['Block C (Boys)','12 L','1.0 L','#3b82f6',92]].map(([block,collected,pending,color,pct]) => (
            <div className="ap-progress-row" key={block} style={{flexWrap:'wrap',gap:6}}>
              <span style={{fontWeight:600,fontSize:13,flex:1}}>{block}</span>
              <span style={{fontWeight:700,color:'#10b981',fontSize:12}}>{collected}</span>
              <span style={{fontWeight:700,color:'#ef4444',fontSize:12,marginLeft:8}}>Due: {pending}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransport = () => {
    const totalBuses = transportRoutes.length;
    const activeRoutes = transportRoutes.filter(r => r.status === 'Active').length;
    const studentsUsing = transportRoutes.reduce((sum, r) => sum + (r.students || 0), 0);
    const maintenanceBuses = transportRoutes.filter(r => r.status === 'Maintenance').length;

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Transport Management</h2><p>Bus routes, drivers and student allocation</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm gold" onClick={()=>openModal('addBus')}>+ Add Bus/Route</button>
          </div>
        </div>
        <div className="ap-adm-stats">
          <div className="ap-adm-card blue"><h4>{totalBuses}</h4><p>Total Buses</p></div>
          <div className="ap-adm-card green"><h4>{activeRoutes}</h4><p>Active Routes</p></div>
          <div className="ap-adm-card yellow"><h4>{studentsUsing.toLocaleString()}</h4><p>Students Using</p></div>
          <div className="ap-adm-card red"><h4>{maintenanceBuses}</h4><p>Under Maintenance</p></div>
        </div>
        <div className="ap-table-wrap">
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>#</th><th>Bus No.</th><th>Route Name</th><th>Route Area</th><th>Stops</th><th>Driver</th><th>Driver Contact</th><th>Capacity</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {transportRoutes.map((r, i) => (
                  <tr key={r._id || r.busNo}>
                    <td>{i+1}</td>
                    <td style={{fontWeight:700,color:'#2563eb',fontSize:12}}>{r.busNo}</td>
                    <td style={{fontWeight:600}}>{r.route}</td>
                    <td style={{fontSize:12}}>{r.area}</td>
                    <td>{r.stops}</td>
                    <td>{r.driver}</td>
                    <td style={{fontSize:12}}>{r.contact}</td>
                    <td>{r.capacity}</td>
                    <td style={{fontWeight:700,color:r.students/r.capacity>0.9?'#ef4444':'#10b981'}}>{r.students}/{r.capacity}</td>
                    <td><span className={r.status==='Active'?'badge-ok':'badge-warn'}>{r.status}</span></td>
                    <td>
                      <button className="ap-act-btn view" onClick={()=>alert(`Route: ${r.route}\nDriver: ${r.driver}\nContact: ${r.contact}`)}>View</button>
                      <button className="ap-act-btn edit" onClick={()=>alert(`Edit route: ${r.route}`)}>Edit</button>
                    </td>
                  </tr>
                ))}
                {transportRoutes.length === 0 && (
                  <tr><td colSpan="11" style={{textAlign:'center',padding:20,color:'#64748b'}}>No transport routes found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPlacements = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Placement Management</h2><p>Campus drives, company registrations and placement records</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm outline" onClick={()=>alert('Download placement report')}> Report</button>
          <button className="ap-btn sm gold" onClick={()=>openModal('addCompany')}>+ Add Company</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card green"><h4>94%</h4><p>Placement Rate</p></div>
        <div className="ap-adm-card blue"><h4>215</h4><p>Students Placed</p></div>
        <div className="ap-adm-card purple"><h4>45</h4><p>Companies Visited</p></div>
        <div className="ap-adm-card gold" style={{borderTop:'3px solid #D4AF37'}}><h4>12 LPA</h4><p>Highest Package</p></div>
        <div className="ap-adm-card cyan"><h4>4.2 LPA</h4><p>Average Package</p></div>
      </div>
      <div className="ap-dash-row">
        <div className="ap-dash-box">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h4> Companies Registered</h4>
            <button className="ap-btn sm gold" onClick={()=>openModal('addCompany')}>+ Add</button>
          </div>
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>#</th><th>Company</th><th>Sector</th><th>Visit Date</th><th>Offers Made</th><th>Package</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  ['TCS','IT Services','May 20, 2025',45,'3.5 LPA','Completed'],
                  ['Infosys','IT Consulting','May 22, 2025',38,'4.0 LPA','Completed'],
                  ['Wipro','IT Services','May 25, 2025',32,'3.8 LPA','Completed'],
                  ['Cognizant','IT Services','Jun 1, 2025',28,'3.6 LPA','Completed'],
                  ['Amazon','E-Commerce','Jun 10, 2025',12,'8.5 LPA','Completed'],
                  ['Google','Tech',  'Jun 15, 2025',5,'18 LPA','Upcoming'],
                  ['Microsoft','Tech','Jun 20, 2025',8,'12 LPA','Upcoming'],
                ].map(([company,sector,date,offers,pkg,status],i) => (
                  <tr key={company}>
                    <td>{i+1}</td>
                    <td style={{fontWeight:700}}>{company}</td>
                    <td><span className="badge badge-blue">{sector}</span></td>
                    <td style={{fontSize:12}}>{date}</td>
                    <td style={{fontWeight:700,color:'#10b981'}}>{offers}</td>
                    <td style={{fontWeight:700,color:'#2563eb'}}>{pkg}</td>
                    <td><span className={status==='Completed'?'badge-ok':'badge-warn'}>{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="ap-dash-box">
          <h4> Upcoming Drives</h4>
          {[
            {company:'Google',date:'Jun 15',positions:5,eligibility:'CSE/IT - 8.0 CGPA',color:'#10b981'},
            {company:'Microsoft',date:'Jun 20',positions:8,eligibility:'All - 7.5 CGPA',color:'#3b82f6'},
            {company:'Zoho',date:'Jun 25',positions:15,eligibility:'CSE/IT/ECE - 7.0 CGPA',color:'#8b5cf6'},
            {company:'HCL Technologies',date:'Jul 01',positions:20,eligibility:'All Branches - 6.5 CGPA',color:'#f59e0b'},
          ].map(ev => (
            <div key={ev.company} style={{padding:'14px',background:'#f8fafc',borderRadius:10,marginBottom:10,borderLeft:`4px solid ${ev.color}`}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontWeight:700,fontSize:14}}>{ev.company}</span>
                <span className="badge badge-purple">{ev.date}</span>
              </div>
              <div style={{fontSize:12,color:'#64748b'}}>{ev.positions} positions  {ev.eligibility}</div>
              <button className="ap-btn sm" style={{marginTop:8}} onClick={()=>alert(`Schedule drive for ${ev.company}`)}>Manage Drive</button>
            </div>
          ))}
          <div className="ap-divider"/>
          <h4 style={{marginBottom:12}}> Dept-wise Placement %</h4>
          {[['CSE',98],['ECE',95],['IT',94],['Mech',92],['Civil',88],['Biotech',82]].map(([dept,pct]) => (
            <div className="ap-progress-row" key={dept}>
              <span className="ap-progress-label">{dept}</span>
              <div className="ap-progress-bar-wrap">
                <div className="ap-progress-bar" style={{width:`${pct}%`,background:pct>=95?'#10b981':'#3b82f6'}}/>
              </div>
              <span className="ap-progress-pct" style={{color:'#10b981',fontWeight:700}}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Events Management</h2><p>Workshops, seminars, fests and college events</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm gold" onClick={()=>openModal('event')}>+ Create Event</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card blue"><h4>8</h4><p>Upcoming Events</p></div>
        <div className="ap-adm-card green"><h4>24</h4><p>Completed 2025</p></div>
        <div className="ap-adm-card yellow"><h4>3</h4><p>Ongoing</p></div>
        <div className="ap-adm-card purple"><h4>1,840</h4><p>Registrations</p></div>
      </div>
      <div className="ap-controls">
        <input placeholder=" Search events..."/>
        <select><option>All Types</option><option>Tech Fest</option><option>Workshop</option><option>Seminar</option><option>Sports</option><option>Cultural</option></select>
        <select><option>All Status</option><option>Upcoming</option><option>Ongoing</option><option>Completed</option></select>
      </div>
      <div className="ap-table-wrap">
        <div className="ap-scroll-table">
          <table className="ap-table">
            <thead><tr><th>#</th><th>Event Name</th><th>Type</th><th>Date</th><th>Venue</th><th>Organizer</th><th>Registrations</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev._id || ev.id || i}>
                  <td>{i+1}</td>
                  <td style={{fontWeight:700}}>{ev.title}</td>
                  <td><span className="badge badge-blue">Event</span></td>
                  <td style={{fontSize:12}}>{ev.date}</td>
                  <td style={{fontSize:12}}>{ev.venue}</td>
                  <td style={{fontSize:12}}>Admin</td>
                  <td style={{fontWeight:700,color:'#2563eb'}}>0</td>
                  <td><span className={ev.status==='Upcoming'?'badge-ok':ev.status==='Ongoing'?'badge-warn':'badge-low'}>{ev.status}</span></td>
                  <td>
                    <button className="ap-act-btn view" onClick={()=>alert(`Event: ${ev.title}\nVenue: ${ev.venue}\nDate: ${ev.date}\nDesc: ${ev.description}`)}>View</button>
                    <button className="ap-act-btn del" onClick={async () => {
                      if (window.confirm(`Delete event "${ev.title}"?`)) {
                        const success = await deleteAdminEvent(ev._id || ev.id);
                        if (success) {
                          setEvents(events.filter(item => item._id !== ev._id && item.id !== ev.id));
                        } else {
                          alert("Failed to delete event");
                        }
                      }
                    }}>Del</button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && <tr><td colSpan="9" style={{textAlign:'center',padding:20,color:'#64748b'}}>No events found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNoticeBoard = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Notice Board</h2><p>Post announcements, circulars and urgent alerts</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm danger" onClick={()=>openModal('notice',{type:'urgent'})}> Urgent Alert</button>
          <button className="ap-btn sm gold" onClick={()=>openModal('notice')}>+ Post Notice</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card blue"><h4>{notices.length}</h4><p>Total Notices</p></div>
        <div className="ap-adm-card red"><h4>2</h4><p>Urgent Alerts</p></div>
        <div className="ap-adm-card yellow"><h4>5</h4><p>Pinned</p></div>
      </div>
      <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
        <div style={{flex:'1 1 520px'}}>
          <h3 style={{fontWeight:700,fontSize:16,marginBottom:12,color:'#0f172a'}}> Pinned Notices</h3>
          {notices.filter(n => n.pinned).map((n,i) => (
            <div key={n._id || n.id || i} className="ap-notice-item urgent">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                <h5>{n.title}</h5>
                <span className="badge-low" style={{marginLeft:8,flexShrink:0}}>Urgent</span>
              </div>
              <p>{n.content}</p>
              <div className="ap-notice-meta">
                <span> {n.date || (n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '')}</span>
                <span className="badge badge-blue">{n.category}</span>
                <button className="ap-act-btn del" onClick={async () => {
                  if (window.confirm(`Delete notice "${n.title}"?`)) {
                    const success = await deleteAdminNotice(n._id || n.id);
                    if (success) {
                      setNotices(notices.filter(item => item._id !== n._id && item.id !== n.id));
                    } else {
                      alert("Failed to delete notice");
                    }
                  }
                }}>Delete</button>
              </div>
            </div>
          ))}
          {notices.filter(n => n.pinned).length === 0 && <p style={{fontSize:13,color:'#64748b',marginBottom:20}}>No pinned notices.</p>}

          <h3 style={{fontWeight:700,fontSize:16,marginBottom:12,marginTop:20,color:'#0f172a'}}> General Notices</h3>
          {notices.filter(n => !n.pinned).map((n,i) => (
            <div key={n._id || n.id || i} className="ap-notice-item general">
              <h5>{n.title}</h5><p>{n.content}</p>
              <div className="ap-notice-meta">
                <span> {n.date || (n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '')}</span>
                <span className="badge badge-cyan">{n.category}</span>
                <button className="ap-act-btn del" onClick={async () => {
                  if (window.confirm(`Delete notice "${n.title}"?`)) {
                    const success = await deleteAdminNotice(n._id || n.id);
                    if (success) {
                      setNotices(notices.filter(item => item._id !== n._id && item.id !== n.id));
                    } else {
                      alert("Failed to delete notice");
                    }
                  }
                }}>Delete</button>
              </div>
            </div>
          ))}
          {notices.filter(n => !n.pinned).length === 0 && <p style={{fontSize:13,color:'#64748b'}}>No general notices.</p>}
        </div>
        <div style={{flex:'0 1 300px'}}>
          <h3 style={{fontWeight:700,fontSize:16,marginBottom:12,color:'#0f172a'}}> Notice Categories</h3>
          <div className="ap-dash-box">
            {[['','Urgent / Emergency','2'],['','Exam / Results','5'],['','Fee / Finance','3'],['','Events / Activities','8'],['','Holiday Notices','4'],['','Academic','6'],['','Transport','2']].map(([icon,cat,count]) => (
              <div className="ap-info-row" key={cat}>
                <span className="label">{icon} {cat}</span>
                <span className="value badge-blue" style={{padding:'2px 10px',borderRadius:20,fontSize:12}}>{count} notices</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  const renderCertificates = () => {
    const filteredCertificates = certificates.filter(c => {
      const q = certSearch.toLowerCase();
      const matchSearch = !q || c.roll?.toLowerCase().includes(q) || c.student?.toLowerCase().includes(q);
      const matchType = !certTypeFilter || c.type === certTypeFilter;
      const matchStatus = !certStatusFilter || c.status === certStatusFilter;
      return matchSearch && matchType && matchStatus;
    });

    const pendingCount = certificates.filter(c => c.status === 'Pending').length;
    const approvedCount = certificates.filter(c => c.status === 'Approved').length;
    const bonafideCount = certificates.filter(c => c.type === 'Bonafide').length;
    const tcCount = certificates.filter(c => c.type === 'Transfer Certificate').length;
    const ccCount = certificates.filter(c => c.type === 'Course Completion').length;

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Certificate Management</h2><p>Bonafide, Transfer and Course Completion certificates</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm gold" onClick={()=>openModal('issueCert')}> Issue Certificate</button>
          </div>
        </div>
        <div className="ap-adm-stats">
          <div className="ap-adm-card yellow"><h4>{pendingCount}</h4><p>Pending Requests</p></div>
          <div className="ap-adm-card green"><h4>{approvedCount}</h4><p>Approved 2025</p></div>
          <div className="ap-adm-card blue"><h4>{bonafideCount}</h4><p>Bonafide</p></div>
          <div className="ap-adm-card purple"><h4>{tcCount}</h4><p>Transfer Cert</p></div>
          <div className="ap-adm-card cyan"><h4>{ccCount}</h4><p>Course Completion</p></div>
        </div>
        <div className="ap-controls">
          <input 
            placeholder=" Search by roll no or name..."
            value={certSearch}
            onChange={e=>setCertSearch(e.target.value)}
          />
          <select value={certTypeFilter} onChange={e=>setCertTypeFilter(e.target.value === 'All Types' ? '' : e.target.value)}>
            <option>All Types</option>
            <option>Bonafide</option>
            <option>Transfer Certificate</option>
            <option>Course Completion</option>
          </select>
          <select value={certStatusFilter} onChange={e=>setCertStatusFilter(e.target.value === 'All Status' ? '' : e.target.value)}>
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="ap-table-wrap">
          <div className="ap-scroll-table">
            <table className="ap-table">
              <thead><tr><th>#</th><th>Request ID</th><th>Student</th><th>Roll No.</th><th>Dept</th><th>Cert Type</th><th>Purpose</th><th>Applied Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredCertificates.map((c, i) => (
                  <tr key={c._id || c.certId}>
                    <td>{i+1}</td>
                    <td style={{fontWeight:700,color:'#2563eb',fontSize:12}}>{c.certId}</td>
                    <td style={{fontWeight:600}}>{c.student}</td>
                    <td style={{fontSize:12}}>{c.roll}</td>
                    <td><span className="badge badge-blue">{c.dept}</span></td>
                    <td><span className="badge badge-purple">{c.type}</span></td>
                    <td style={{fontSize:12}}>{c.purpose}</td>
                    <td style={{fontSize:12}}>{c.date}</td>
                    <td><span className={c.status==='Approved'?'badge-ok':c.status==='Pending'?'badge-warn':'badge-low'}>{c.status}</span></td>
                    <td>
                      {c.status==='Pending' && (
                        <>
                          <button className="ap-act-btn approve" onClick={async () => {
                            const res = await approveCertificateRequest(c._id || c.id);
                            if (res) {
                              setCertificates(prev => prev.map(item => (item._id === c._id || item.id === c.id) ? { ...item, status: "Approved" } : item));
                              alert('Certificate request approved!');
                            }
                          }}> Approve</button>
                          <button className="ap-act-btn del" onClick={async () => {
                            const res = await rejectCertificateRequest(c._id || c.id);
                            if (res) {
                              setCertificates(prev => prev.map(item => (item._id === c._id || item.id === c.id) ? { ...item, status: "Rejected" } : item));
                              alert('Certificate request rejected!');
                            }
                          }}> Reject</button>
                        </>
                      )}
                      {c.status==='Approved' && <button className="ap-act-btn view" onClick={()=>alert(`Download certificate: ${c.certId}`)}> Download</button>}
                    </td>
                  </tr>
                ))}
                {filteredCertificates.length === 0 && (
                  <tr><td colSpan="10" style={{textAlign:'center',padding:20,color:'#64748b'}}>No certificate requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderComplaints = () => {
    const openCount = complaints.filter(c => c.status === 'Open').length;
    const progressCount = complaints.filter(c => c.status === 'In Progress').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

    return (
      <div className="ap-page">
        <div className="ap-page-header">
          <div><h2>Complaints & Support</h2><p>Student grievances, ticket tracking and feedback</p></div>
          <div className="ap-page-actions">
            <button className="ap-btn sm gold" onClick={()=>openModal('newComplaint')}>+ New Ticket</button>
          </div>
        </div>
        <div className="ap-adm-stats">
          <div className="ap-adm-card red"><h4>{openCount}</h4><p>Open Tickets</p></div>
          <div className="ap-adm-card yellow"><h4>{progressCount}</h4><p>In Progress</p></div>
          <div className="ap-adm-card green"><h4>{resolvedCount}</h4><p>Resolved</p></div>
          <div className="ap-adm-card blue"><h4>{complaints.length}</h4><p>Total Tickets</p></div>
        </div>
        {complaints.map(t => (
          <div key={t._id || t.ticketId} className="ap-ticket">
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:6,flexWrap:'wrap'}}>
                <span className="ap-ticket-id">{t.ticketId}</span>
                <span className={t.priority==='High'?'badge-low':t.priority==='Medium'?'badge-warn':'badge-ok'}>{t.priority}</span>
                <span className="badge badge-blue">{t.category}</span>
              </div>
              <h5>{t.title}</h5>
              <p style={{marginTop:4}}>{t.student}</p>
              <div className="ap-ticket-meta">
                <span style={{fontSize:12,color:'#94a3b8'}}> {t.date}</span>
                <span className={t.status==='Open'?'badge-low':t.status==='In Progress'?'badge-warn':'badge-ok'}>{t.status}</span>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
              {t.status!=='Resolved' && <button className="ap-act-btn approve" onClick={async () => {
                const res = await resolveComplaintTicket(t._id || t.id);
                if (res) {
                  setComplaints(prev => prev.map(item => (item._id === t._id || item.id === t.id) ? { ...item, status: "Resolved" } : item));
                  alert('Complaint resolved successfully!');
                }
              }}> Resolve</button>}
              <button className="ap-act-btn view" onClick={()=>alert(`View ticket: ${t.ticketId}`)}>View</button>
            </div>
          </div>
        ))}
        {complaints.length === 0 && (
          <div className="ap-empty"><div className="ap-empty-icon"></div><p>No support tickets found.</p></div>
        )}
      </div>
    );
  };
  const renderReports = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Reports & Analytics</h2><p>Generate comprehensive reports for all modules</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm outline" onClick={()=>alert('Export all reports as ZIP')}> Export All</button>
        </div>
      </div>
      <div className="ap-report-grid">
        {[
          ['','Student Reports','Enrollment, department-wise, semester-wise, demographic analysis','Export Excel'],
          ['','Faculty Reports','Workload, attendance, feedback ratings, research publications','Export PDF'],
          ['','Attendance Reports','Daily, monthly, subject-wise, department-wise attendance trends','Export Excel'],
          ['','Fee Reports','Collection status, defaulters, scholarship, payment trends','Export PDF'],
          ['','Placement Reports','Company-wise, package-wise, department-wise placement analytics','Export Excel'],
          ['','Exam & Results','Grade distribution, CGPA trends, arrear analysis, toppers','Export PDF'],
          ['','Library Reports','Book usage, overdue, fine collection, department-wise usage','Export Excel'],
          ['','Hostel Reports','Occupancy, maintenance, fee collection, complaints','Export PDF'],
          ['','Transport Reports','Route-wise students, bus utilization, maintenance records','Export Excel'],
          ['','Department Reports','Accreditation, faculty strength, student intake, performance','Export PDF'],
          ['','Notice & Events','Notices posted, event registrations, participation rates','Export Excel'],
          ['','Complaints Report','Ticket resolution time, category-wise analysis, feedback','Export PDF'],
        ].map(([icon,title,desc,action]) => (
          <div className="ap-report-card" key={title} onClick={()=>alert(`${title}\n\n${desc}\n\nGenerating ${action.includes('PDF')?'PDF':'Excel'} report...`)}>
            <div style={{fontSize:32,marginBottom:12}}>{icon}</div>
            <h4>{title}</h4>
            <p style={{fontSize:13,lineHeight:1.5,color:'#64748b',minHeight:60,marginBottom:14}}>{desc}</p>
            <button className="ap-btn" style={{width:'100%'}} onClick={e=>{e.stopPropagation();alert(`Generating: ${title}`)}}>{action}</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>User Management</h2><p>Admin accounts, roles, permissions and access control</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm gold" onClick={()=>openModal('addUser')}>+ Add User</button>
        </div>
      </div>
      <div className="ap-adm-stats">
        <div className="ap-adm-card blue"><h4>3</h4><p>Admin Accounts</p></div>
        <div className="ap-adm-card green"><h4>{facultyData.length}</h4><p>Faculty Accounts</p></div>
        <div className="ap-adm-card purple"><h4>{stuData.length}</h4><p>Student Accounts</p></div>
        <div className="ap-adm-card red"><h4>2</h4><p>Inactive Accounts</p></div>
      </div>
      <div className="ap-dash-row">
        <div className="ap-dash-box">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h4> Admin Accounts</h4>
            <button className="ap-btn sm gold" onClick={()=>openModal('addUser')}>+ Add Admin</button>
          </div>
          <table className="ap-table" style={{minWidth:'auto'}}>
            <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {[
                ['admin','System Administrator','Super Admin','admin@bec.edu.in','Active'],
                ['staff1','Staff Account 1','Staff','staff1@bec.edu.in','Active'],
                ['registrar','Registrar Office','Registrar','registrar@bec.edu.in','Active'],
              ].map(([uname,name,role,email,status],i) => (
                <tr key={uname}>
                  <td>{i+1}</td>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{uname}</td>
                  <td style={{fontWeight:600}}>{name}</td>
                  <td><span className={role==='Super Admin'?'badge-low':role==='Registrar'?'badge-blue':'badge-warn'}>{role}</span></td>
                  <td style={{fontSize:12}}>{email}</td>
                  <td><span className="badge-ok">{status}</span></td>
                  <td>
                    <button className="ap-act-btn edit" onClick={()=>alert(`Edit user: ${uname}`)}>Edit</button>
                    <button className="ap-act-btn warn" onClick={()=>alert(`Reset password for: ${uname}`)}> Reset</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ap-dash-box">
          <h4> Roles & Permissions</h4>
          {[
            ['Super Admin','Full access to all modules','#ef4444'],
            ['Registrar','Admissions, Student, Reports','#3b82f6'],
            ['Faculty','View grades, attendance, own profile','#10b981'],
            ['Staff','Limited admin access, reports','#f59e0b'],
            ['Student','View own portal data only','#8b5cf6'],
          ].map(([role,perms,color]) => (
            <div key={role} style={{padding:'12px',background:'#f8fafc',borderRadius:10,marginBottom:10,borderLeft:`4px solid ${color}`}}>
              <div style={{fontWeight:700,fontSize:14,color:'#0f172a',marginBottom:4}}>{role}</div>
              <div style={{fontSize:12,color:'#64748b'}}>{perms}</div>
              <button className="ap-act-btn edit" style={{marginTop:8}} onClick={()=>alert(`Edit permissions for: ${role}`)}>Edit Permissions</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const inp = { padding:'10px 14px', border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:14, fontFamily:'Inter, sans-serif', outline:'none', background:'#fff', width:'100%', boxSizing:'border-box' };

  const renderAuditLogs = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>System Audit Logs</h2><p>Track all admin and user activities across the platform</p></div>
        <div className="ap-page-actions">
          <button className="ap-btn sm outline" onClick={()=>alert('Export Logs to CSV')}> Export Logs</button>
        </div>
      </div>
      <div className="ap-table-wrap" style={{ marginTop: '20px' }}>
        <div className="ap-scroll-table">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action Type</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log, i) => (
                <tr key={log._id || i}>
                  <td style={{ fontSize: 12 }}>{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}</td>
                  <td style={{ fontWeight: 600 }}>{log.user}</td>
                  <td><span className="badge badge-blue">{log.action}</span></td>
                  <td>{log.details}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{log.ip || '192.168.1.1'}</td>
                </tr>
              ))}
              {activityLogs.length === 0 && (
                <tr><td colSpan="5" style={{textAlign:'center',padding:20,color:'#64748b'}}>No activity logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="ap-page">
      <div className="ap-page-header">
        <div><h2>Settings</h2><p>College information, academic year & system configuration</p></div>
      </div>
      <div className="ap-settings-grid">
        <div className="ap-settings-box">
          <h4> College Information</h4>
          {[['College Name','text','Best Engineering College'],['Affiliation','text','Anna University, Chennai'],['University Code','text','1234'],['NAAC Grade','text','A Grade (3.24/4.0)'],['Established','text','2016'],['Email','email','info@bec.edu.in'],['Phone','tel','+91 44 2716 3000'],['Website','text','www.bec.edu.in']].map(([label,type,val]) => (
            <div className="ap-form-group" key={label}><label>{label}</label><input type={type} defaultValue={val} style={inp}/></div>
          ))}
          <button className="ap-btn" onClick={()=>alert('College information saved!')}>Save Changes</button>
        </div>
        <div className="ap-settings-box">
          <h4> Academic Settings</h4>
          <div className="ap-form-group"><label>Current Academic Year</label><input type="text" defaultValue="2025-2026" style={inp}/></div>
          <div className="ap-form-group"><label>Current Semester</label><select style={inp}><option>Odd Semester (Jul-Nov)</option><option>Even Semester (Dec-Apr)</option></select></div>
          <div className="ap-form-group"><label>Semester Start Date</label><input type="date" defaultValue="2025-07-01" style={inp}/></div>
          <div className="ap-form-group"><label>Semester End Date</label><input type="date" defaultValue="2025-11-30" style={inp}/></div>
          <div className="ap-form-group"><label>Minimum Attendance (%)</label><input type="number" defaultValue={75} style={inp}/></div>
          <div className="ap-form-group"><label>Internal Assessment Weightage (%)</label><input type="number" defaultValue={40} style={inp}/></div>
          <div className="ap-form-group"><label>Pass Marks (%)</label><input type="number" defaultValue={50} style={inp}/></div>
          <button className="ap-btn" onClick={()=>alert('Academic settings saved!')}>Save Changes</button>
        </div>
        <div className="ap-settings-box">
          <h4> Fee Structure</h4>
          <div className="ap-form-group"><label>Tuition Fee per Semester ()</label><input type="number" defaultValue={55000} style={inp}/></div>
          <div className="ap-form-group"><label>Hostel Fee per Semester ()</label><input type="number" defaultValue={25000} style={inp}/></div>
          <div className="ap-form-group"><label>Transport Fee per Semester ()</label><input type="number" defaultValue={7500} style={inp}/></div>
          <div className="ap-form-group"><label>Library Fine (/day)</label><input type="number" defaultValue={10} style={inp}/></div>
          <div className="ap-form-group"><label>Late Fee Fine (/day)</label><input type="number" defaultValue={50} style={inp}/></div>
          <div className="ap-form-group"><label>Payment Due Date (Day)</label><input type="number" defaultValue={10} style={inp}/></div>
          <button className="ap-btn" onClick={()=>alert('Fee structure updated!')}>Save Changes</button>
        </div>
        <div className="ap-settings-box">
          <h4> Notification Settings</h4>
          {[['Email Notifications',true],['SMS Alerts to Students',true],['SMS Alerts to Parents',false],['Auto Fee Reminders',true],['Attendance Alerts (Below 75%)',true],['Assignment Due Reminders',true],['Exam Schedule Notifications',true]].map(([label,checked]) => (
            <div className="ap-toggle-row" key={label}>
              <span>{label}</span>
              <label className="ap-toggle"><input type="checkbox" defaultChecked={checked}/><span className="ap-slider"/></label>
            </div>
          ))}
          <button className="ap-btn" style={{marginTop:16}} onClick={()=>alert('Notification settings saved!')}>Save Preferences</button>
        </div>
        <div className="ap-settings-box">
          <h4> System Preferences</h4>
          {[['Maintenance Mode',false],['Allow Student Self-Registration',false],['Show College Announcements',true],['Enable Online Fee Payment',true],['Allow Faculty Marks Entry',true],['Enable Student Feedback',true],['Show Placement Statistics',true]].map(([label,checked]) => (
            <div className="ap-toggle-row" key={label}>
              <span>{label}</span>
              <label className="ap-toggle"><input type="checkbox" defaultChecked={checked}/><span className="ap-slider"/></label>
            </div>
          ))}
          <button className="ap-btn" style={{marginTop:16}} onClick={()=>alert('System preferences saved!')}>Save Preferences</button>
        </div>
        <div className="ap-settings-box">
          <h4> Change Admin Password</h4>
          {[['Current Password','password','Enter current password'],['New Password','password','Min 8 characters'],['Confirm Password','password','Re-enter new password']].map(([label,type,ph]) => (
            <div className="ap-form-group" key={label}><label>{label}</label><input type={type} placeholder={ph} style={inp}/></div>
          ))}
          <button className="ap-btn danger" onClick={()=>alert('Password updated! Please login again.')}>Update Password</button>
          <div className="ap-divider"/>
          <h4 style={{marginBottom:14}}> Integrations</h4>
          <div className="ap-form-group"><label>SMS Gateway API Key</label><input type="text" placeholder="Enter SMS API key" style={inp}/></div>
          <div className="ap-form-group"><label>Email Service Provider</label><select style={inp}><option>AWS SES</option><option>SendGrid</option><option>Gmail SMTP</option></select></div>
          <div className="ap-form-group"><label>Payment Gateway</label><select style={inp}><option>Razorpay</option><option>Paytm</option><option>CCAvenue</option></select></div>
          <button className="ap-btn" onClick={()=>alert('Integration settings saved!')}>Save Settings</button>
        </div>
        <div className="ap-settings-box">
          <h4> Backup & Data</h4>
          <div className="ap-info-row"><span className="label">Last Backup</span><span className="value">Jun 5, 2025  2:30 AM</span></div>
          <div className="ap-info-row"><span className="label">Database Size</span><span className="value">4.8 GB</span></div>
          <div className="ap-info-row"><span className="label">Next Auto-Backup</span><span className="value">Jun 6, 2025  2:00 AM</span></div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:20}}>
            <button className="ap-btn success" onClick={()=>alert('Starting database backup...')}> Create Backup Now</button>
            <button className="ap-btn warning" onClick={()=>alert('Restore from backup...')}> Restore from Backup</button>
            <button className="ap-btn ghost" onClick={()=>alert('Export all data as CSV/Excel')}> Export All Data</button>
          </div>
        </div>
      </div>
    </div>
  );

  //  MODAL FORMS 
  const renderModal = () => {
    if (!modal.open) return null;
    const isStudent = modal.type === 'student' || modal.type === 'editStudent';
    const isFaculty = modal.type === 'faculty';
    const isNotice = modal.type === 'notice';
    const isEvent = modal.type === 'event';
    const isDepartment = modal.type === 'department' || modal.type === 'editDepartment';
    const isCourse = modal.type === 'course' || modal.type === 'editCourse';

    const title = {
      student:'Add New Student', editStudent:'Edit Student', faculty:'Add New Faculty',
      notice:'Post Notice / Announcement', event:'Create Event',
      course:'Add New Course', editCourse:'Edit Course', subject:'Create New Subject',
      department:'Add New Department', editDepartment:'Edit Department',
      admission:'New Application', addUser:'Add Admin User',
      uploadMarks:'Upload Marks', markAttendance:'Mark Attendance',
      timetable:'Create Timetable', exam:'Schedule Exam',
      issueBook:'Issue Book', addBook:'Add New Book', returnBook:'Return Book',
      allocateRoom:'Allocate Hostel Room', addBus:'Add Bus / Route',
      addCompany:'Register Company', issueCert:'Issue Certificate',
      newComplaint:'New Support Ticket', feeStructure:'Fee Structure Setup', addPayment:'Record Payment',
    }[modal.type] || 'Action';

    const handleAddStudent = async () => {
      if (!newStudent.roll || !newStudent.name || !newStudent.email || !newStudent.password || !newStudent.phone || !newStudent.dob) { 
        alert('Please fill all required fields (Roll, Name, Email, Phone, DOB, Password)!'); 
        return; 
      }
      if (modal.type === 'editStudent' && modal.data) {
        const res = await updateAdminStudent(modal.data._id || modal.data.id, newStudent);
        if (res && !res.error) {
          setStuData(stuData.map(s => (s._id === res._id || s.id === res.id) ? res : s));
          alert('Student updated successfully!'); closeModal();
        } else {
          alert('Failed to update student');
        }
      } else {
        const res = await addAdminStudent({ ...newStudent, status: 'Active', profileCompleted: true });
        if (res && !res.error) {
          setStuData([...stuData, res]);
          setNewStudent({ 
            roll: '', name: '', email: '', password: '', phone: '', dob: '', gender: 'Male',
            dept: 'CSE', sem: 1, bloodGroup: '', parentName: '', parentPhone: '', address: '',
            religion: '', community: 'General', nationality: 'Indian', aadharNumber: ''
          });
          alert('Student created successfully with complete profile!'); closeModal();
        } else {
          alert(res?.error || 'Failed to add student');
        }
      }
    };
    const handleAddFaculty = async () => {
      if (!newFaculty.name || !newFaculty.empId || !newFaculty.email || !newFaculty.password) { alert('Please fill required fields!'); return; }
      const res = await addAdminFaculty({ ...newFaculty, status: 'Active' });
      if (res && !res.error) {
        setFacultyData([...facultyData, res]);
        setNewFaculty({ name:'', empId:'', dept:'CSE', designation:'Asst. Professor', email:'', phone:'', qualification:'Ph.D', experience:'', specialization:'', password:'' });
        alert('Faculty added successfully!'); closeModal();
      } else {
        alert(res?.error || 'Failed to add faculty');
      }
    };
    const handleAddNotice = async () => {
      if (!newNotice.title || !newNotice.content) { alert('Please fill required fields!'); return; }
      const res = await addAdminNotice({ 
        ...newNotice, 
        date: new Date().toISOString().split('T')[0], 
        status: 'Active', 
        pinned: newNotice.type === 'urgent' 
      });
      if (res && !res.error) {
        setNotices([res, ...notices]);
        setNewNotice({ title:'', content:'', category:'General', type:'general' });
        alert('Notice posted!'); closeModal();
      } else {
        alert('Failed to post notice');
      }
    };
    const handleAddEvent = async () => {
      if (!newEvent.title || !newEvent.date) { alert('Please fill required fields!'); return; }
      const res = await addAdminEvent({ ...newEvent, image: '' });
      if (res && !res.error) {
        setEvents([res, ...events]);
        setNewEvent({ title:'', description:'', date:'', venue:'', status:'Upcoming' });
        alert('Event created!'); closeModal();
      } else {
        alert('Failed to create event');
      }
    };

    const handleAddCourse = async () => {
      if (!newCourse.code || !newCourse.name) { alert('Please fill required fields!'); return; }
      let res;
      if (modal.type === 'editCourse' && modal.data) {
        res = await updateAdminCourse(modal.data._id || modal.data.id, newCourse);
      } else {
        res = await addAdminCourse(newCourse);
      }
      if (res && !res.error) {
        if (modal.type === 'editCourse') {
          setCourses(courses.map(c => (c._id === res._id || c.id === res.id) ? res : c));
        } else {
          setCourses([...courses, res]);
        }
        alert(`Course ${modal.type === 'editCourse' ? 'updated' : 'added'}!`); closeModal();
      } else {
        alert('Failed to save course');
      }
    };

    const handleAddDepartment = async () => {
      if (!newDepartment.name || !newDepartment.hod) { alert('Please fill required fields!'); return; }
      let res;
      if (modal.type === 'editDepartment' && modal.data) {
        res = await updateAdminDepartment(modal.data._id || modal.data.id, newDepartment);
      } else {
        res = await addAdminDepartment(newDepartment);
      }
      if (res && !res.error) {
        if (modal.type === 'editDepartment') {
          setDepartments(departments.map(d => (d._id === res._id || d.id === res.id) ? res : d));
        } else {
          setDepartments([...departments, res]);
        }
        alert(`Department ${modal.type === 'editDepartment' ? 'updated' : 'added'}!`); closeModal();
      } else {
        alert('Failed to save department');
      }
    };

    return (
      <div className="ap-modal open" onClick={e => { if(e.target.className.includes('ap-modal open')) closeModal(); }}>
        <div className={`ap-modal-box${modal.type==='feeStructure' || isStudent?' wide':''}`}>
          <div className="ap-modal-head">
            <h4>{title}</h4>
            <button className="ap-modal-close" onClick={closeModal}></button>
          </div>
          <div className="ap-modal-body">
            {isStudent && (
              <>
                <h5 style={{fontSize:14,fontWeight:700,color:'#0f172a',marginBottom:12,borderBottom:'2px solid #f59e0b',paddingBottom:6}}>Basic Information</h5>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Roll Number *</label><input type="text" placeholder="e.g. 21CS007" style={inp} value={newStudent.roll} onChange={e=>setNewStudent({...newStudent,roll:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Full Name *</label><input type="text" placeholder="Student name" style={inp} value={newStudent.name} onChange={e=>setNewStudent({...newStudent,name:e.target.value})}/></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Email *</label><input type="email" placeholder="student@bec.edu.in" style={inp} value={newStudent.email} onChange={e=>setNewStudent({...newStudent,email:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Phone *</label><input type="tel" placeholder="10-digit phone" style={inp} value={newStudent.phone} onChange={e=>setNewStudent({...newStudent,phone:e.target.value})}/></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Date of Birth *</label><input type="date" style={inp} value={newStudent.dob} onChange={e=>setNewStudent({...newStudent,dob:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Gender *</label><select style={inp} value={newStudent.gender} onChange={e=>setNewStudent({...newStudent,gender:e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Blood Group</label><select style={inp} value={newStudent.bloodGroup} onChange={e=>setNewStudent({...newStudent,bloodGroup:e.target.value})}><option value="">Select</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b=><option key={b}>{b}</option>)}</select></div>
                  <div className="ap-form-group"><label>Aadhar Number</label><input type="text" placeholder="12-digit Aadhar" style={inp} value={newStudent.aadharNumber} onChange={e=>setNewStudent({...newStudent,aadharNumber:e.target.value})}/></div>
                </div>
                <h5 style={{fontSize:14,fontWeight:700,color:'#0f172a',marginTop:20,marginBottom:12,borderBottom:'2px solid #f59e0b',paddingBottom:6}}>Academic Details</h5>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Department *</label><select style={inp} value={newStudent.dept} onChange={e=>setNewStudent({...newStudent,dept:e.target.value})}>{['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}</select></div>
                  <div className="ap-form-group"><label>Semester *</label><input type="number" min={1} max={8} placeholder="1-8" style={inp} value={newStudent.sem} onChange={e=>setNewStudent({...newStudent,sem:parseInt(e.target.value)||1})}/></div>
                </div>
                <h5 style={{fontSize:14,fontWeight:700,color:'#0f172a',marginTop:20,marginBottom:12,borderBottom:'2px solid #f59e0b',paddingBottom:6}}>Parent/Guardian Details</h5>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Parent Name</label><input type="text" placeholder="Parent/Guardian name" style={inp} value={newStudent.parentName} onChange={e=>setNewStudent({...newStudent,parentName:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Parent Phone</label><input type="tel" placeholder="Parent contact" style={inp} value={newStudent.parentPhone} onChange={e=>setNewStudent({...newStudent,parentPhone:e.target.value})}/></div>
                </div>
                <h5 style={{fontSize:14,fontWeight:700,color:'#0f172a',marginTop:20,marginBottom:12,borderBottom:'2px solid #f59e0b',paddingBottom:6}}>Additional Information</h5>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Religion</label><input type="text" placeholder="Religion" style={inp} value={newStudent.religion} onChange={e=>setNewStudent({...newStudent,religion:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Community</label><select style={inp} value={newStudent.community} onChange={e=>setNewStudent({...newStudent,community:e.target.value})}><option>General</option><option>OBC</option><option>SC</option><option>ST</option></select></div>
                </div>
                <div className="ap-form-group"><label>Address</label><textarea placeholder="Full residential address" style={{...inp,minHeight:60,resize:'vertical'}} value={newStudent.address} onChange={e=>setNewStudent({...newStudent,address:e.target.value})}/></div>
                <h5 style={{fontSize:14,fontWeight:700,color:'#0f172a',marginTop:20,marginBottom:12,borderBottom:'2px solid #f59e0b',paddingBottom:6}}>Login Credentials</h5>
                <div className="ap-form-group"><label>Login Password *</label><input type="text" placeholder="Create password" style={inp} value={newStudent.password} onChange={e=>setNewStudent({...newStudent,password:e.target.value})}/></div>
                <div style={{background:'#dcfce7',border:'1px solid #86efac',padding:'12px',borderRadius:'8px',fontSize:'13px',color:'#14532d',marginTop:'16px'}}>
                  <strong>✓ Complete Profile:</strong> All student information will be managed by admin. No dummy data will be shown.
                </div>
              </>
            )}
            {isFaculty && (
              <>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Full Name *</label><input type="text" placeholder="Faculty name" style={inp} value={newFaculty.name} onChange={e=>setNewFaculty({...newFaculty,name:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Employee ID *</label><input type="text" placeholder="FAC-CSE-00X" style={inp} value={newFaculty.empId} onChange={e=>setNewFaculty({...newFaculty,empId:e.target.value})}/></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Department</label><select style={inp} value={newFaculty.dept} onChange={e=>setNewFaculty({...newFaculty,dept:e.target.value})}>{['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}</select></div>
                  <div className="ap-form-group"><label>Designation</label><select style={inp} value={newFaculty.designation} onChange={e=>setNewFaculty({...newFaculty,designation:e.target.value})}>{['Professor','Assoc. Professor','Asst. Professor'].map(d=><option key={d}>{d}</option>)}</select></div>
                </div>
                <div className="ap-form-group"><label>Email Address *</label><input type="email" placeholder="faculty@bec.edu.in" style={inp} value={newFaculty.email} onChange={e=>setNewFaculty({...newFaculty,email:e.target.value})}/></div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Phone Number</label><input type="tel" style={inp} value={newFaculty.phone} onChange={e=>setNewFaculty({...newFaculty,phone:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Qualification</label><select style={inp} value={newFaculty.qualification} onChange={e=>setNewFaculty({...newFaculty,qualification:e.target.value})}>{['Ph.D','M.Tech','M.E','M.Sc'].map(q=><option key={q}>{q}</option>)}</select></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Experience</label><input type="text" placeholder="e.g. 8 years" style={inp} value={newFaculty.experience} onChange={e=>setNewFaculty({...newFaculty,experience:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Login Password *</label><input type="text" placeholder="Create password" style={inp} value={newFaculty.password} onChange={e=>setNewFaculty({...newFaculty,password:e.target.value})}/></div>
                </div>
                <div className="ap-form-group"><label>Specialization</label><input type="text" placeholder="e.g. Machine Learning" style={inp} value={newFaculty.specialization} onChange={e=>setNewFaculty({...newFaculty,specialization:e.target.value})}/></div>
              </>
            )}
            {isNotice && (
              <>
                <div className="ap-form-group"><label>Notice Title *</label><input type="text" placeholder="Enter notice title" style={inp} value={newNotice.title} onChange={e=>setNewNotice({...newNotice,title:e.target.value})}/></div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Category</label><select style={inp} value={newNotice.category} onChange={e=>setNewNotice({...newNotice,category:e.target.value})}>{['General','Exam','Holiday','Finance','Event','Academic','Transport'].map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="ap-form-group"><label>Type</label><select style={inp} value={newNotice.type} onChange={e=>setNewNotice({...newNotice,type:e.target.value})}><option value="general">General</option><option value="urgent">Urgent</option></select></div>
                </div>
                <div className="ap-form-group"><label>Notice Content *</label><textarea placeholder="Enter notice details..." style={{...inp,minHeight:100,resize:'vertical'}} value={newNotice.content} onChange={e=>setNewNotice({...newNotice,content:e.target.value})}/></div>
              </>
            )}
            {isEvent && (
              <>
                <div className="ap-form-group"><label>Event Title *</label><input type="text" placeholder="Event name" style={inp} value={newEvent.title} onChange={e=>setNewEvent({...newEvent,title:e.target.value})}/></div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Event Date *</label><input type="date" style={inp} value={newEvent.date} onChange={e=>setNewEvent({...newEvent,date:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Venue</label><input type="text" placeholder="Venue / Location" style={inp} value={newEvent.venue} onChange={e=>setNewEvent({...newEvent,venue:e.target.value})}/></div>
                </div>
                <div className="ap-form-group"><label>Description</label><textarea placeholder="Event description..." style={{...inp,minHeight:80}} value={newEvent.description} onChange={e=>setNewEvent({...newEvent,description:e.target.value})}/></div>
                <div className="ap-form-group"><label>Status</label><select style={inp} value={newEvent.status} onChange={e=>setNewEvent({...newEvent,status:e.target.value})}><option>Upcoming</option><option>Ongoing</option><option>Completed</option></select></div>
              </>
            )}
            {isDepartment && (
              <>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Department Name *</label><input type="text" placeholder="e.g. Computer Science" style={inp} value={newDepartment.name} onChange={e=>setNewDepartment({...newDepartment,name:e.target.value})}/></div>
                  <div className="ap-form-group"><label>HOD Name *</label><input type="text" placeholder="HOD Name" style={inp} value={newDepartment.hod} onChange={e=>setNewDepartment({...newDepartment,hod:e.target.value})}/></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Icon (Emoji/Text)</label><input type="text" placeholder="🏛️" style={inp} value={newDepartment.icon} onChange={e=>setNewDepartment({...newDepartment,icon:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Theme Color</label><input type="color" style={{...inp, height: '42px', padding: '0 4px'}} value={newDepartment.color} onChange={e=>setNewDepartment({...newDepartment,color:e.target.value})}/></div>
                </div>
                <div className="ap-form-group"><label>Accreditation</label><input type="text" placeholder="e.g. NAAC A++ (Valid till 2027)" style={inp} value={newDepartment.accreditation} onChange={e=>setNewDepartment({...newDepartment,accreditation:e.target.value})}/></div>
              </>
            )}
            {isCourse && (
              <>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Course Code *</label><input type="text" placeholder="e.g. CS101" style={inp} value={newCourse.code} onChange={e=>setNewCourse({...newCourse,code:e.target.value})}/></div>
                  <div className="ap-form-group"><label>Course Name *</label><input type="text" placeholder="e.g. Data Structures" style={inp} value={newCourse.name} onChange={e=>setNewCourse({...newCourse,name:e.target.value})}/></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Department</label><select style={inp} value={newCourse.dept} onChange={e=>setNewCourse({...newCourse,dept:e.target.value})}>{['CSE','ECE','Mech','Civil','IT','Biotech'].map(d=><option key={d}>{d}</option>)}</select></div>
                  <div className="ap-form-group"><label>Semester</label><input type="number" min={1} max={8} style={inp} value={newCourse.sem} onChange={e=>setNewCourse({...newCourse,sem:parseInt(e.target.value)||1})}/></div>
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group"><label>Credits</label><input type="number" min={1} style={inp} value={newCourse.credits} onChange={e=>setNewCourse({...newCourse,credits:parseInt(e.target.value)||3})}/></div>
                  <div className="ap-form-group"><label>Type</label><select style={inp} value={newCourse.type} onChange={e=>setNewCourse({...newCourse,type:e.target.value})}><option>Core</option><option>Elective</option><option>Lab</option></select></div>
                </div>
                <div className="ap-form-group"><label>Faculty Assigned</label><input type="text" placeholder="Faculty name" style={inp} value={newCourse.faculty} onChange={e=>setNewCourse({...newCourse,faculty:e.target.value})}/></div>
              </>
            )}
            {!isStudent && !isFaculty && !isNotice && !isEvent && !isDepartment && !isCourse && (
              <div className="ap-empty"><div className="ap-empty-icon"></div><p>Form for <strong>{title}</strong>  action logged successfully.<br/><span style={{fontSize:12,color:'#94a3b8'}}>Full implementation available in production build.</span></p></div>
            )}
          </div>
          <div className="ap-modal-footer">
            <button className="ap-btn ghost" onClick={closeModal}>Cancel</button>
            <button className="ap-btn gold" onClick={isStudent ? handleAddStudent : isFaculty ? handleAddFaculty : isNotice ? handleAddNotice : isEvent ? handleAddEvent : isDepartment ? handleAddDepartment : isCourse ? handleAddCourse : () => { alert(`${title} action completed!`); closeModal(); }}>
              {isStudent ? (modal.type==='editStudent'?'Update Student':'Add Student') : isFaculty ? 'Add Faculty' : isNotice ? 'Post Notice' : isEvent ? 'Create Event' : isDepartment ? (modal.type==='editDepartment'?'Update Department':'Add Department') : isCourse ? (modal.type==='editCourse'?'Update Course':'Add Course') : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // DETAIL MODAL FOR ADMISSIONS
  const renderAdmissionDetailModal = () => {
    if (!admissionDetailModal.open || !admissionDetailModal.data) return null;
    const d = admissionDetailModal.data;
    
    return (
      <div className="ap-modal open" onClick={e => { if(e.target.className.includes('ap-modal open')) setAdmissionDetailModal({ open: false, data: null }); }}>
        <div className="ap-modal-box wide">
          <div className="ap-modal-head">
            <h4>Application Details: {d.appId || (d._id ? d._id.substring(18).toUpperCase() : 'PENDING')}</h4>
            <button className="ap-modal-close" onClick={() => setAdmissionDetailModal({ open: false, data: null })}></button>
          </div>
          <div className="ap-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '16px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: 12, color: '#fff' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#f59e0b', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800 }}>
                {d.name?.charAt(0) || d.firstName?.charAt(0) || '?'}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{d.name || `${d.firstName || ''} ${d.lastName || ''}`}</h3>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 13 }}>Applied on: {d.date || 'Unknown'}</p>
              </div>
              <span className={d.status === 'Approved' ? 'badge-ok' : d.status === 'Rejected' ? 'badge-low' : 'badge-warn'} style={{ marginLeft: 'auto' }}>
                {d.status || 'Pending'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="ap-dash-box" style={{ margin: 0 }}>
                <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Personal Information</h4>
                <div className="ap-info-row"><span className="label">Full Name</span><span className="value">{d.name || `${d.firstName || ''} ${d.lastName || ''}`}</span></div>
                <div className="ap-info-row"><span className="label">Email</span><span className="value">{d.email}</span></div>
                <div className="ap-info-row"><span className="label">Phone</span><span className="value">{d.phone || d.parentMobile || ''}</span></div>
                <div className="ap-info-row"><span className="label">Gender</span><span className="value">{d.gender || ''}</span></div>
                <div className="ap-info-row"><span className="label">DOB</span><span className="value">{d.dob || ''}</span></div>
                <div className="ap-info-row"><span className="label">Community</span><span className="value">{d.community || ''}</span></div>
                <div className="ap-info-row"><span className="label">Aadhar</span><span className="value">{d.aadharNumber || ''}</span></div>
                <div className="ap-info-row"><span className="label">Address</span><span className="value">{d.address ? `${d.address}, ${d.city || ''}, ${d.state || ''} - ${d.pincode || ''}` : ''}</span></div>
              </div>

              <div className="ap-dash-box" style={{ margin: 0 }}>
                <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Academic Information</h4>
                <div className="ap-info-row"><span className="label">12th Percentage</span><span className="value" style={{ fontWeight: 700, color: '#2563eb' }}>{d.twelfthPercent || ''}%</span></div>
                <div className="ap-info-row"><span className="label">12th Physics</span><span className="value">{d.twelfthPhysics || ''}</span></div>
                <div className="ap-info-row"><span className="label">12th Chemistry</span><span className="value">{d.twelfthChemistry || ''}</span></div>
                <div className="ap-info-row"><span className="label">12th Maths</span><span className="value">{d.twelfthMaths || ''}</span></div>
                <div className="ap-info-row"><span className="label">12th College</span><span className="value">{d.collegeName || ''}</span></div>
                <div className="ap-info-row"><span className="label">10th Percentage</span><span className="value">{d.tenthPercent || ''}%</span></div>
                <div className="ap-info-row"><span className="label">TNEA Reg No</span><span className="value">{d.tneaNo || ''}</span></div>
              </div>
            </div>

            <div className="ap-dash-box" style={{ marginTop: 20 }}>
              <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Admission Details & Preferences</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div className="ap-info-row"><span className="label">Preferred Course</span><span className="value" style={{ fontWeight: 700 }}>{d.department || ''}</span></div>
                <div className="ap-info-row"><span className="label">Admission Type</span><span className="value">{d.admissionType || ''}</span></div>
                <div className="ap-info-row"><span className="label">Hostel Required</span><span className="value" style={{ textTransform: 'capitalize' }}>{d.hostelRequired || 'no'}</span></div>
                <div className="ap-info-row"><span className="label">Transport Required</span><span className="value" style={{ textTransform: 'capitalize' }}>{d.transportRequired || 'no'}</span></div>
              </div>
            </div>

            <div className="ap-dash-box" style={{ marginTop: 20, background: '#f8fafc' }}>
              <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Application Status Decision</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Current Status:</span>
                  <span className={d.status === 'Approved' ? 'badge-ok' : d.status === 'Rejected' ? 'badge-low' : 'badge-warn'}>{d.status || 'Pending'}</span>
                </div>
                {d.reviewedBy && (
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    Reviewed by <strong>{d.reviewedBy}</strong>. Note: <em>{d.reviewNotes || 'No notes'}</em>
                  </div>
                )}
                <div className="ap-divider" style={{ margin: '8px 0' }}/>
                <div className="ap-form-group">
                  <label>Update Status</label>
                  <select 
                    style={inp} 
                    defaultValue={d.status || 'Pending'}
                    onChange={e => d.tempStatus = e.target.value}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Document Verification">Document Verification</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="ap-form-group">
                  <label>Review Notes / Decision Remarks</label>
                  <textarea 
                    placeholder="Enter notes for this application..." 
                    style={{ ...inp, minHeight: 80 }}
                    defaultValue={d.reviewNotes || ''}
                    onChange={e => setReviewNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ap-modal-footer">
            <button className="ap-btn ghost" onClick={() => setAdmissionDetailModal({ open: false, data: null })}>Close</button>
            <button 
              className="ap-btn gold" 
              onClick={() => {
                const targetStatus = d.tempStatus || d.status || 'Pending';
                handleAdmissionStatus(d._id || d.id, targetStatus, reviewNotes);
              }}
            >
              Save Decision
            </button>
          </div>
        </div>
      </div>
    );
  };

  //  VIEW MODAL 
  const renderViewModal = () => {
    if (!viewModal.open || !viewModal.data) return null;
    const d = viewModal.data;
    const isStudent = viewModal.type === 'student';
    return (
      <div className="ap-modal open" onClick={e=>{ if(e.target.className.includes('ap-modal open')) closeViewModal(); }}>
        <div className="ap-modal-box">
          <div className="ap-modal-head">
            <h4>{isStudent ? ' Student Profile' : ' Faculty Profile'}</h4>
            <button className="ap-modal-close" onClick={closeViewModal}></button>
          </div>
          <div className="ap-modal-body">
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,padding:'16px',background:'#f8fafc',borderRadius:12}}>
              {d.profilePhoto ? (
                <img src={d.profilePhoto} alt={d.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{width:60,height:60,borderRadius:'50%',background:isStudent ? 'linear-gradient(135deg,#3b82f6,#7c3aed)' : 'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:22,fontWeight:700,flexShrink:0}}>
                  {d.name?.charAt(0)}
                </div>
              )}
              <div>
                <h3 style={{margin:0,fontSize:18,fontWeight:700}}>{d.name}</h3>
                <p style={{margin:'4px 0 0',color:'#64748b',fontSize:13}}>{isStudent ? `Roll: ${d.roll} | ${d.dept}  Sem ${d.sem}` : `${d.empId} | ${d.dept} | ${d.designation}`}</p>
              </div>
              <span className={d.status==='Active'?'badge-ok':'badge-warn'} style={{marginLeft:'auto'}}>{d.status}</span>
            </div>
            {isStudent ? (
              <>
                <div className="ap-info-row"><span className="label">Email</span><span className="value">{d.email}</span></div>
                <div className="ap-info-row"><span className="label">Phone</span><span className="value">{d.phone||''}</span></div>
                <div className="ap-info-row"><span className="label">Date of Birth</span><span className="value">{d.dob||''}</span></div>
                <div className="ap-info-row"><span className="label">Blood Group</span><span className="value"><span className="badge badge-purple">{d.bloodGroup||''}</span></span></div>
                <div className="ap-info-row"><span className="label">Department</span><span className="value">{d.dept}</span></div>
                <div className="ap-info-row"><span className="label">Semester</span><span className="value">{d.sem}</span></div>
                <div className="ap-info-row"><span className="label">Login Password</span><span className="value" style={{fontFamily:'monospace',background:'#f1f5f9',padding:'2px 8px',borderRadius:4}}>{d.password}</span></div>
              </>
            ) : (
              <>
                <div className="ap-info-row"><span className="label">Email</span><span className="value">{d.email}</span></div>
                <div className="ap-info-row"><span className="label">Phone</span><span className="value">{d.phone||''}</span></div>
                <div className="ap-info-row"><span className="label">Qualification</span><span className="value">{d.qualification||''}</span></div>
                <div className="ap-info-row"><span className="label">Experience</span><span className="value">{d.experience||''}</span></div>
                <div className="ap-info-row"><span className="label">Specialization</span><span className="value">{d.specialization||''}</span></div>
                <div className="ap-info-row"><span className="label">Login Password</span><span className="value" style={{fontFamily:'monospace',background:'#f1f5f9',padding:'2px 8px',borderRadius:4}}>{d.password}</span></div>
              </>
            )}
          </div>
          <div className="ap-modal-footer">
            <button className="ap-btn ghost" onClick={closeViewModal}>Close</button>
            <button className="ap-btn gold" onClick={()=>alert(`Edit ${d.name}`)}> Edit</button>
          </div>
        </div>
      </div>
    );
  };

  //  PAGE ROUTER 
  const pageRenderers = {
    dashboard: renderDashboard, students: renderStudents, faculty: renderFaculty,
    departments: renderDepartments, courses: renderCourses, subjects: renderSubjects,
    admissions: renderAdmissions, attendance: renderAttendance, timetable: renderTimetable,
    examination: renderExamination, results: renderResults, fees: renderFees,
    library: renderLibrary, hostel: renderHostel, transport: renderTransport,
    placements: renderPlacements, events: renderEvents, noticeboard: renderNoticeBoard,
    certificates: renderCertificates, complaints: renderComplaints,
    reports: renderReports, users: renderUsers, auditlogs: renderAuditLogs, settings: renderSettings,
  };

  return (
    <div className="ap-layout">
      {/*  SIDEBAR  */}
      <div className={`ap-sidebar${sidebarOpen ? '' : ' closed'}`}>
        <div className="ap-logo">
          <img src={clgLogo} alt="BEC" />
          <div className="ap-logo-text">
            <h3>BEC Admin</h3>
            <span>Management Portal</span>
          </div>
        </div>
        <div className="ap-nav-scroll">
          {navGroups.map(group => (
            <div className="ap-nav-group" key={group.label}>
              <div className="ap-nav-group-label">{group.label}</div>
              {group.items.map(({ key, label, icon }) => (
                <span
                  key={key}
                  className={`ap-link${page === key ? ' active' : ''}`}
                  onClick={() => {
                    setPage(key);
                    if (key === 'admissions') setNewAdmissionBadge(false);
                  }}
                >
                  <span className="ap-link-icon">{icon}</span>
                  {label}
                  {key === 'admissions' && newAdmissionBadge && (
                    <span style={{ marginLeft: 8, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="ap-sidebar-footer">
          <button className="ap-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/*  MAIN  */}
      <div className={`ap-main${sidebarOpen ? '' : ' full'}`}>
        <div className="ap-topbar">
          <button className="ap-menu-btn" onClick={() => setSidebarOpen(o => !o)} title="Toggle Sidebar">
            {sidebarOpen ? '<<' : '>>'}
          </button>
          <div className="ap-topbar-title">{pageTitles[page]}</div>
          <div className="ap-topbar-right">
            <div className="ap-topbar-badge">AY 2025-26</div>
            <div className="ap-user">
              <div className="ap-avatar">AD</div>
              <div className="ap-user-info">
                <span>Administrator</span>
                <small>Super Admin</small>
              </div>
            </div>
          </div>
        </div>

        {(pageRenderers[page] || renderDashboard)()}
      </div>

      {renderAdmissionDetailModal()}
      {renderModal()}
      {renderViewModal()}
    </div>
  );
}

export default AdminPortalPage;

