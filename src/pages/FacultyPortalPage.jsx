import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clgLogo from '../assets/images/CLGLOGO.webp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  getSessionUser, logoutUser, getStudents, getFacultyAssignments,
  saveClassAttendance, saveStudentMarks, uploadFacultyAssignment,
  deleteFacultyAssignment, getFacultyLeaveRequests, actionLeaveRequest,
  sendFacultyNotification, updateFacultyProfile, getMarks,
  getAssignmentSubmissions, uploadFacultyPhoto, getAdminCourses, getTimetable
} from '../utils/storage';
import * as XLSX from 'xlsx';
import '../assets/css/faculty-portal.css';

/* ─────────────── static data ─────────────── */
const TIME_SLOTS = ['8:00–9:00', '9:00–10:00', '10:00–11:00', 'Lunch', '1:00–2:00', '2:00–3:00', '3:00–4:00'];




/* ─────────────── helpers ─────────────── */
function grade(val, max = 25) {
  const p = (val / max) * 100;
  return p >= 90 ? 'A+' : p >= 80 ? 'A' : p >= 70 ? 'B+' : p >= 60 ? 'B' : p >= 50 ? 'C' : 'F';
}

// Leave requests are loaded from the backend API in useEffect below.

const navItems = [
  { key: 'dashboard',   label: 'Dashboard'          },
  { key: 'profile',     label: 'My Profile'         },
  { key: 'attendance',  label: 'Attendance'         },
  { key: 'marks',       label: 'Marks Entry'        },
  { key: 'students',    label: 'Student List'       },
  { key: 'assignments', label: 'Assignments'        },
  { key: 'courses',     label: 'My Courses'         },
  { key: 'timetable',   label: 'Timetable'         },
  { key: 'leave',       label: 'Leave Requests'     },
  { key: 'communicate', label: 'Communication'      },
];

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function FacultyPortalPage() {
  const navigate   = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage]               = useState('dashboard');
  const [chartsMounted, setChartsMounted] = useState(false);
  useEffect(() => { setChartsMounted(true); }, []);
  const [sideOpen, setSideOpen]       = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const [facultyStudents, setFacultyStudents] = useState([]);
  const [marksData, setMarksData]     = useState([]);
  const [search, setSearch]           = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [assignForm, setAssignForm]   = useState({ title: '', course: 'CS3351 / 21CS-A', desc: '', due: '', maxMarks: 10 });
  const [attCourse, setAttCourse]     = useState('CS3351 / 21CS-A');
  const [attDate, setAttDate]         = useState(new Date().toISOString().split('T')[0]);
  const [attData, setAttData]         = useState([]);
  const [msgForm, setMsgForm]         = useState({ to: 'All My Students', subject: '', message: '' });
  const [sentMessages, setSentMessages] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notif, setNotif]             = useState({ show: false, text: '', type: 'success' });
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [marksCourse, setMarksCourse] = useState('CS3351 / 21CS-A');
  const [marksAssessment, setMarksAssessment] = useState('ia1');
  const [assignDeleteConfirm, setAssignDeleteConfirm] = useState(null);
  const [viewSubmissionsAssignmentId, setViewSubmissionsAssignmentId] = useState(null);
  const [viewSubmissionsTitle, setViewSubmissionsTitle] = useState('');
  const [submissionsList, setSubmissionsList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [weeklyTimetable, setWeeklyTimetable] = useState({});
  const [todaySchedule, setTodaySchedule] = useState([]);

  /* ── auth & data load ── */
  useEffect(() => {
    const init = async () => {
      const session = await getSessionUser();
      if (!session || !session.success || session.type !== 'faculty') {
        navigate('/faculty-login');
        return;
      }
      const loggedFaculty = session.user;
      setFacultyData(loggedFaculty);
      setProfileForm({
        name: loggedFaculty.name || '',
        empId: loggedFaculty.empId || '',
        dept: loggedFaculty.dept || '',
        designation: loggedFaculty.designation || '',
        qualification: loggedFaculty.qualification || '',
        experience: loggedFaculty.experience || '',
        email: loggedFaculty.email || '',
        phone: loggedFaculty.phone || '',
        specialization: loggedFaculty.specialization || '',
        joiningDate: loggedFaculty.joiningDate || '',
      });
      try {
        const students = await getStudents(loggedFaculty.dept);
        setFacultyStudents(students);
        setMarksData(students.map(s => ({
          roll: s.roll, name: s.name, cls: s.cls,
          ia1: s.ia, ia2: s.ia2, assignment: s.assignment
        })));
        setAttData(students.map(s => ({ roll: s.roll, name: s.name, cls: s.cls, present: true })));

        setIsLoading(false); // Unblock UI instantly

        // Lazy load the rest in the background
        getFacultyAssignments().then(setAssignments).catch(() => {});
        getFacultyLeaveRequests().then(setLeaveRequests).catch(() => {});
        
        getAdminCourses().then(allCourses => {
          const myCourses = allCourses.filter(c => c.dept === loggedFaculty.dept);
          const mappedCourses = myCourses.map((c, i) => ({
            id: c._id || `c-${i}`,
            code: c.code,
            name: c.name,
            cls: c.cls || (i % 2 === 0 ? '21CS-A' : '21CS-B'),
            sem: c.sem,
            credits: c.credits,
            students: c.studentsCount || 0,
            classes: c.classesTotal || 0,
            done: c.classesCompleted || 0,
            pct: 0
          }));
          setCourses(mappedCourses);
        }).catch(() => {});

        getTimetable(loggedFaculty.dept, 5).then(timetable => {
          const mappedTimetable = {};
          if (timetable && timetable.length > 0) {
            timetable.forEach(item => {
              mappedTimetable[item.day] = item.slots.map((slot, idx) => {
                if (slot === '—' || slot === 'Lunch') return slot;
                return `${slot} / ${idx % 2 === 0 ? '21CS-A' : '21CS-B'}`;
              });
            });
            setWeeklyTimetable(mappedTimetable);
          } else {
            setWeeklyTimetable({});
          }
          const getTodaySchedule = (timetableList) => {
            if (!timetableList || timetableList.length === 0) return [];
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayName = days[new Date().getDay()];
            const dayName = (todayName === 'Sun' || todayName === 'Sat') ? 'Mon' : todayName;
            const daySchedule = timetableList.find(d => d.day === dayName);
            if (!daySchedule) return [];
            const timeSlots = [
              "09:00 AM",
              "10:00 AM",
              "11:00 AM",
              "12:00 PM",
              "02:00 PM",
              "03:00 PM",
              "04:00 PM"
            ];
            return daySchedule.slots.map((slot, i) => {
              if (slot === 'Lunch' || slot === '—') return null;
              return {
                time: timeSlots[i],
                subject: slot,
                section: i % 2 === 0 ? '21CS-A' : '21CS-B',
                room: "Assigned Room",
                type: "Theory"
              };
            }).filter(Boolean);
          };
          const derivedSchedule = getTodaySchedule(timetable);
          setTodaySchedule(derivedSchedule);
        }).catch(() => {});

      } catch (err) {
        console.error('Error loading faculty portal data:', err);
      }
    };
    init();
  }, [navigate]);
  // Update marks data when selected course changes
  useEffect(() => {
    const courseCode = marksCourse.split('/')[0].trim();
    const courseInfo = courses.find(c => c.code === courseCode);
    const subjectName = courseInfo ? courseInfo.name : 'Data Structures';
    
    const updateMarksForCourse = async () => {
      try {
        const updated = await Promise.all(marksData.map(async (student) => {
          const record = await getMarks(student.roll);
          let ia1Val = 20;
          let ia2Val = 18;
          let assignVal = 8;
          if (record && record.subjects) {
            const subRecord = record.subjects.find(sub => sub.name === subjectName);
            if (subRecord) {
              ia1Val = subRecord.ia1 ?? 0;
              ia2Val = subRecord.ia2 ?? 0;
              assignVal = subRecord.assignment ?? 0;
            }
          }
          return {
            ...student,
            ia1: ia1Val,
            ia2: ia2Val,
            assignment: assignVal
          };
        }));
        setMarksData(updated);
      } catch (err) {
        console.error(err);
      }
    };
    if (marksData.length > 0) {
      updateMarksForCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marksCourse, courses]);

  /* ── Excel Upload Handlers ── */
  const handleAttendanceExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
      
      setAttData(prev => prev.map(student => {
        const row = data.find(r => String(r.roll) === String(student.roll) || String(r['Roll No']) === String(student.roll));
        if (row) {
           const val = String(row.status || row.Status || row.present || row.Present || '').toUpperCase();
           const present = val === 'P' || val === 'PRESENT' || val === '1' || val === 'TRUE';
           return { ...student, present };
        }
        return student;
      }));
      toast("Attendance mapped from Excel!");
    };
    reader.readAsBinaryString(file);
  };

  const handleMarksExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
      
      setMarksData(prev => prev.map(student => {
        const row = data.find(r => String(r.roll) === String(student.roll) || String(r['Roll No']) === String(student.roll));
        if (row) {
           return { 
             ...student, 
             ia1: row.ia1 !== undefined ? Number(row.ia1) : student.ia1,
             ia2: row.ia2 !== undefined ? Number(row.ia2) : student.ia2,
             assignment: row.assignment !== undefined ? Number(row.assignment) : student.assignment,
           };
        }
        return student;
      }));
      toast("Marks mapped from Excel!");
    };
    reader.readAsBinaryString(file);
  };


  /* ── toast ── */
  const toast = (text, type = 'success') => {
    setNotif({ show: true, text, type });
    setTimeout(() => setNotif(n => ({ ...n, show: false })), 3200);
  };

  /* ── derived ── */
  const filteredStudents = facultyStudents.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q))
        && (!classFilter || s.cls === classFilter);
  });

  const filteredMarks = marksData.filter(s =>
    !classFilter || s.cls === classFilter
  );

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
      <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTop: '4px solid #1e3a5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontWeight: 600 }}>Loading Faculty Portal…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!facultyData) return (
    <div className="fp-loading">
      <div className="fp-spinner" />
      <p>Loading portal...</p>
    </div>
  );

  const facultyName        = facultyData.name        || 'Dr. Faculty';
  const facultyEmpId       = facultyData.empId       || 'FAC-001';
  const facultyDept        = facultyData.dept        || '';
  const facultyDesignation = facultyData.designation || '';
  const initials           = facultyName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const deptFull = { CSE: 'Computer Science & Engineering', ECE: 'Electronics & Communication', Mech: 'Mechanical Engineering', Civil: 'Civil Engineering', IT: 'Information Technology' };

  /* ── handlers ── */
  /* ── handlers ── */
  const handleAttSave = async () => {
    const attSection = attCourse.includes('/') ? attCourse.split('/')[1].trim() : '21CS-A';
    const displayedAttData = attData.filter(s => s.cls === attSection);
    
    try {
      const res = await saveClassAttendance(attCourse, attDate, displayedAttData);
      if (res && res.success) {
        const students = await getStudents(facultyDept);
        setFacultyStudents(students);
        toast(`Attendance saved successfully for ${attCourse} on ${attDate}`);
      } else {
        toast('Failed to save attendance', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error saving attendance', 'error');
    }
  };

  const handleMarksSave = async () => {
    try {
      const res = await saveStudentMarks(marksCourse, marksData);
      if (res && res.success) {
        toast('Marks saved successfully.');
      } else {
        toast('Failed to save marks.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error saving marks.', 'error');
    }
  };

  const handleUploadAssignment = async (e) => {
    e.preventDefault();
    if (!assignForm.title || !assignForm.due) { toast('Please fill title and due date.', 'error'); return; }
    
    try {
      const newA = await uploadFacultyAssignment({
        ...assignForm,
        facultyName
      });
      if (newA) {
        const assignList = await getFacultyAssignments();
        setAssignments(assignList);
        setAssignForm({ title: '', course: 'CS3351 / 21CS-A', desc: '', due: '', maxMarks: 10 });
        toast('Assignment uploaded and distributed to students.');
      } else {
        toast('Failed to upload assignment.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error uploading assignment.', 'error');
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      const res = await deleteFacultyAssignment(id);
      if (res && res.success) {
        const assignList = await getFacultyAssignments();
        setAssignments(assignList);
        setAssignDeleteConfirm(null);
        toast('Assignment removed.', 'info');
      } else {
        toast('Failed to delete assignment.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error deleting assignment.', 'error');
    }
  };

  const handleViewSubmissions = async (assignmentId, title) => {
    setViewSubmissionsAssignmentId(assignmentId);
    setViewSubmissionsTitle(title);
    setSubmissionsList([]);
    try {
      const subs = await getAssignmentSubmissions(assignmentId);
      setSubmissionsList(subs || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load submissions.', 'error');
    }
  };

  const handleDownloadSubmittedFile = (submittedFile) => {
    if (!submittedFile || !submittedFile.data) {
      toast('No file attached or file data is missing.', 'error');
      return;
    }
    try {
      const link = document.createElement('a');
      link.href = submittedFile.data;
      link.download = submittedFile.name || 'submission';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast('File download initiated.');
    } catch (err) {
      console.error(err);
      toast('Error downloading file.', 'error');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgForm.subject || !msgForm.message) { toast('Please fill subject and message.', 'error'); return; }
    
    try {
      const res = await sendFacultyNotification(msgForm);
      if (res && res.success) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const updatedMsg = [{ title: msgForm.subject, to: msgForm.to, date: dateStr }, ...sentMessages];
        setSentMessages(updatedMsg);
        setMsgForm(f => ({ ...f, subject: '', message: '' }));
        toast('Message sent successfully.');
      } else {
        toast('Failed to send message.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error sending message.', 'error');
    }
  };

  const handleLeaveAction = async (id, action) => {
    let dbId = id;
    if (typeof id === 'string' && id.includes('-')) {
      const item = leaveRequests.find(l => l.id === id);
      if (item) dbId = item._id || item.id;
    }
    
    try {
      const res = await actionLeaveRequest(dbId, action);
      if (res) {
        const leaves = await getFacultyLeaveRequests();
        setLeaveRequests(leaves);
        toast(`Leave request ${action.toLowerCase()}.`, action === 'Approved' ? 'success' : 'error');
      } else {
        toast('Failed to action leave request.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error processing leave request.', 'error');
    }
  };

  const handleProfileSave = async () => {
    try {
      const updated = await updateFacultyProfile(facultyData.empId, profileForm);
      if (updated) {
        setFacultyData(updated);
        setProfileEdit(false);
        toast('Profile updated successfully.');
      } else {
        toast('Failed to update profile.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error saving profile.', 'error');
    }
  };

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="fp-root">
      {/* TOAST */}
      {notif.show && (
        <div className={`fp-toast fp-toast--${notif.type}`}>{notif.text}</div>
      )}

      {/* SIDEBAR */}
      <aside className={`fp-sidebar${sideOpen ? '' : ' fp-sidebar--closed'}`}>
        <div className="fp-sidebar-logo">
          <img src={clgLogo} alt="BEC Logo" />
          <div className="fp-sidebar-logo-text">
            <span className="fp-sidebar-college">BEC Portal</span>
            <span className="fp-sidebar-role">Faculty Dashboard</span>
          </div>
        </div>

        <div className="fp-sidebar-profile">
          <div className="fp-sidebar-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {facultyData.profilePhoto ? (
              <img src={facultyData.profilePhoto} alt={facultyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : initials}
          </div>
          <div className="fp-sidebar-info">
            <span className="fp-sidebar-name">{facultyName}</span>
            <span className="fp-sidebar-emp">{facultyEmpId} &middot; {facultyDept}</span>
          </div>
        </div>

        <nav className="fp-nav">
          <p className="fp-nav-label">Main Menu</p>
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              className={`fp-nav-item${page === key ? ' fp-nav-item--active' : ''}`}
              onClick={() => setPage(key)}
            >
              <span className="fp-nav-dot" />
              {label}
            </button>
          ))}
        </nav>

        <button className="fp-sidebar-logout" onClick={async () => { await logoutUser(); navigate('/portal'); }}>
          Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <div className={`fp-main${sideOpen ? '' : ' fp-main--wide'}`}>
        {/* TOPBAR */}
        <header className="fp-topbar">
          <button className="fp-hamburger" onClick={() => setSideOpen(o => !o)}>
            <span /><span /><span />
          </button>
          <div className="fp-topbar-breadcrumb">
            <span className="fp-topbar-home" onClick={() => setPage('dashboard')}>Faculty Portal</span>
            <span className="fp-topbar-sep">/</span>
            <span className="fp-topbar-current">{navItems.find(n => n.key === page)?.label}</span>
          </div>
          <div className="fp-topbar-right">
            <button className="ap-btn danger sm" onClick={async () => { await logoutUser(); navigate('/portal'); }} style={{ marginLeft: '10px', marginRight: '10px', height: '32px', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', padding: '0 12px', cursor: 'pointer', fontWeight: 600 }}>
              Sign Out
            </button>
            <div className="fp-topbar-user">
              <div className="fp-topbar-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {facultyData.profilePhoto ? (
                  <img src={facultyData.profilePhoto} alt={facultyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : initials}
              </div>
              <div className="fp-topbar-userinfo">
                <span className="fp-topbar-name">{facultyName}</span>
                <span className="fp-topbar-designation">{facultyDesignation}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="fp-content">

          {/* ══ DASHBOARD ══ */}
          {page === 'dashboard' && (
            <div className="fp-section">
              <div className="fp-welcome-banner">
                <div>
                  <h1 className="fp-welcome-title">Good morning, {facultyName.split(' ').slice(0, 2).join(' ')}</h1>
                  <p className="fp-welcome-sub">Semester 5 &mdash; {deptFull[facultyDept] || facultyDept} &mdash; Academic Year 2024-25</p>
                </div>
                <div className="fp-welcome-badge">
                  <span>Semester 5</span>
                  <span className="fp-dot">•</span>
                  <span>{facultyDept} Dept.</span>
                </div>
              </div>

              <div className="fp-kpi-grid">
                {[
                  { label: 'Total Students',        value: facultyStudents.length, sub: 'Across all sections' },
                  { label: 'Courses Assigned',      value: courses.length,         sub: 'This semester' },
                  { label: 'Classes This Week',     value: 18,                     sub: 'Theory + Lab' },
                  { label: 'Pending Evaluations',   value: 5,                      sub: 'Assignments to grade' },
                ].map(({ label, value, sub }) => (
                  <div className="fp-kpi-card" key={label}>
                    <div className="fp-kpi-value">{value}</div>
                    <div className="fp-kpi-label">{label}</div>
                    <div className="fp-kpi-sub">{sub}</div>
                  </div>
                ))}
              </div>

              <div className="fp-dash-grid">
                {/* Today's Schedule */}
                <div className="fp-card">
                  <div className="fp-card-header">
                    <h3 className="fp-card-title">Today's Schedule</h3>
                    <span className="fp-card-tag">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="fp-schedule-list">
                    {todaySchedule.length > 0 ? (
                      todaySchedule.map(({ time, subject, section, room, type }) => (
                        <div className="fp-schedule-item" key={time}>
                          <div className="fp-schedule-time">{time}</div>
                          <div className="fp-schedule-info">
                            <span className="fp-schedule-subject">{subject}</span>
                            <span className="fp-schedule-meta">{section} &middot; {room}</span>
                          </div>
                          <span className={`fp-badge fp-badge--${type.toLowerCase()}`}>{type}</span>
                        </div>
                      ))
                    ) : (
                      <div className="fp-schedule-item">
                        <div className="fp-schedule-info">
                          <span className="fp-schedule-subject">No Classes Today</span>
                          <span className="fp-schedule-meta">Enjoy your day off!</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="fp-card">
                  <div className="fp-card-header">
                    <h3 className="fp-card-title">Quick Actions</h3>
                  </div>
                  <div className="fp-quick-grid">
                    {[
                      { key: 'attendance',  label: 'Mark Attendance',  desc: 'Record today\'s attendance'  },
                      { key: 'marks',       label: 'Enter Marks',       desc: 'Update IA marks'             },
                      { key: 'assignments', label: 'Upload Assignment', desc: 'Post a new assignment'       },
                      { key: 'students',    label: 'View Students',     desc: 'Browse student list'         },
                      { key: 'communicate', label: 'Send Message',      desc: 'Announce to students'        },
                      { key: 'leave',       label: 'Leave Requests',    desc: `${leaveRequests.filter(l=>l.status==='Pending').length} pending approval` },
                    ].map(({ key, label, desc }) => (
                      <button key={key} className="fp-quick-btn" onClick={() => setPage(key)}>
                        <span className="fp-quick-label">{label}</span>
                        <span className="fp-quick-desc">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attendance Overview */}
                <div className="fp-card" style={{ gridColumn: '1 / -1' }}>
                  <div className="fp-card-header">
                    <h3 className="fp-card-title">Class Attendance Overview</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, height: '300px' }}>
                      {chartsMounted && (
                      <ResponsiveContainer width="99%" height={280}>
                        <BarChart
                          data={courses.map(c => {
                            const sect = facultyStudents.filter(s => s.cls === c.cls);
                            const avg = sect.length ? Math.round(sect.reduce((a, s) => a + s.att, 0) / sect.length) : 0;
                            return { name: c.name, avgAtt: avg };
                          })}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip cursor={{ fill: 'transparent' }} />
                          <Legend />
                          <Bar dataKey="avgAtt" fill="#3b82f6" name="Average Attendance (%)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <table className="fp-table">
                    <thead>
                      <tr><th>Course</th><th>Section</th><th>Avg Att.</th><th>At Risk</th></tr>
                    </thead>
                    <tbody>
                      {courses.map(c => {
                        const sect = facultyStudents.filter(s => s.cls === c.cls);
                        const avg = sect.length ? Math.round(sect.reduce((a, s) => a + s.att, 0) / sect.length) : 0;
                        const risk = sect.filter(s => s.att < 75).length;
                        return (
                          <tr key={c.id}>
                            <td>{c.name}</td><td>{c.cls}</td>
                            <td><span className={`fp-badge ${avg < 75 ? 'fp-badge--at-risk' : 'fp-badge--good'}`}>{avg}%</span></td>
                            <td>{risk > 0 ? <span className="fp-badge fp-badge--at-risk">{risk} students</span> : <span className="fp-badge fp-badge--good">None</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                    </div>
                  </div>
                </div>

                {/* Academic Performance Analytics */}
                <div className="fp-card" style={{ gridColumn: '1 / -1' }}>
                  <div className="fp-card-header">
                    <h3 className="fp-card-title">Academic Performance Analytics</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, height: '300px' }}>
                      {chartsMounted && (
                      <ResponsiveContainer width="99%" height={280}>
                        <BarChart
                          data={courses.map(c => {
                            const sect = marksData.filter(s => s.cls === c.cls);
                            const avgIA1 = sect.length ? Math.round(sect.reduce((a, s) => a + (s.ia1 || 0), 0) / sect.length) : 0;
                            const avgIA2 = sect.length ? Math.round(sect.reduce((a, s) => a + (s.ia2 || 0), 0) / sect.length) : 0;
                            return { name: c.name, IA1: avgIA1, IA2: avgIA2 };
                          })}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 25]} />
                          <Tooltip cursor={{ fill: 'transparent' }} />
                          <Legend />
                          <Bar dataKey="IA1" fill="#10b981" name="Avg IA-1 (Out of 25)" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar dataKey="IA2" fill="#8b5cf6" name="Avg IA-2 (Out of 25)" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Assignments */}
                <div className="fp-card">
                  <div className="fp-card-header">
                    <h3 className="fp-card-title">Recent Assignments</h3>
                    <button className="fp-link-btn" onClick={() => setPage('assignments')}>View All</button>
                  </div>
                  <div className="fp-assign-mini-list">
                    {assignments.slice(0, 3).map(a => (
                      <div className="fp-assign-mini" key={a.id}>
                        <div>
                          <div className="fp-assign-mini-title">{a.title}</div>
                          <div className="fp-assign-mini-meta">{a.course} &middot; Due: {a.due}</div>
                        </div>
                        <span className={`fp-badge ${a.status === 'Active' ? 'fp-badge--active' : 'fp-badge--closed'}`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ PROFILE ══ */}
          {page === 'profile' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">My Profile</h2>
                  <p className="fp-section-sub">Manage your personal and professional information</p>
                </div>
                {!profileEdit
                  ? <button className="fp-btn fp-btn--primary" onClick={() => setProfileEdit(true)}>Edit Profile</button>
                  : <div style={{ display: 'flex', gap: 10 }}>
                      <button className="fp-btn fp-btn--ghost" onClick={() => setProfileEdit(false)}>Cancel</button>
                      <button className="fp-btn fp-btn--primary" onClick={handleProfileSave}>Save Changes</button>
                    </div>
                }
              </div>

              <div className="fp-profile-layout">
                {/* Left card */}
                <div className="fp-card fp-profile-left-card">
                  <div className="fp-profile-avatar-lg" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {facultyData.profilePhoto ? (
                      <img src={facultyData.profilePhoto} alt={facultyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : initials}
                  </div>
                  <h3 className="fp-profile-name">{facultyData.name || profileForm.name}</h3>
                  <p className="fp-profile-desig">{facultyData.designation || profileForm.designation}</p>
                  <span className="fp-badge fp-badge--dept">{deptFull[facultyDept] || facultyDept}</span>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                    <label htmlFor="faculty-photo-upload" style={{
                      padding: '6px 14px',
                      background: '#1e3a5f',
                      color: '#fff',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'background 0.2s',
                    }}>
                      Upload Photo
                    </label>
                    <input 
                      id="faculty-photo-upload" 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const base64Photo = reader.result;
                          const res = await uploadFacultyPhoto(facultyEmpId, base64Photo);
                          if (res && res.success) {
                            setFacultyData(prev => ({ ...prev, profilePhoto: base64Photo }));
                            alert('Profile photo updated successfully!');
                          } else {
                            alert('Failed to update profile photo.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                  <div className="fp-profile-stats">
                    <div className="fp-pstat"><span className="fp-pstat-val">3</span><span className="fp-pstat-label">Courses</span></div>
                    <div className="fp-pstat"><span className="fp-pstat-val">{facultyStudents.length}</span><span className="fp-pstat-label">Students</span></div>
                    <div className="fp-pstat"><span className="fp-pstat-val">12</span><span className="fp-pstat-label">Yrs Exp</span></div>
                  </div>
                </div>

                {/* Right details */}
                <div className="fp-profile-right-panel">
                  <div className="fp-card fp-profile-detail-card">
                    <h4 className="fp-card-title" style={{ marginBottom: 20 }}>Personal Information</h4>
                    <div className="fp-profile-grid">
                      {[
                        { label: 'Full Name',      field: 'name',           type: 'text' },
                        { label: 'Employee ID',    field: 'empId',          type: 'text', readOnly: true },
                        { label: 'Department',     field: 'dept',           type: 'select', opts: ['CSE','ECE','Mech','Civil','IT'] },
                        { label: 'Designation',    field: 'designation',    type: 'select', opts: ['Professor','Assoc. Professor','Asst. Professor','Lecturer'] },
                        { label: 'Qualification',  field: 'qualification',  type: 'select', opts: ['Ph.D','M.Tech','M.E','M.Phil','B.Tech'] },
                        { label: 'Experience',     field: 'experience',     type: 'text' },
                        { label: 'Email Address',  field: 'email',          type: 'email' },
                        { label: 'Phone Number',   field: 'phone',          type: 'tel' },
                        { label: 'Specialization', field: 'specialization', type: 'text' },
                        { label: 'Joining Date',   field: 'joiningDate',    type: 'text', readOnly: true },
                      ].map(({ label, field, type, readOnly, opts }) => (
                        <div className="fp-field" key={field}>
                          <label className="fp-field-label">{label}</label>
                          {profileEdit && !readOnly
                            ? type === 'select'
                              ? <select className="fp-input" value={profileForm[field] || ''} onChange={e => setProfileForm(f => ({ ...f, [field]: e.target.value }))}>
                                  {opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                              : <input className="fp-input" type={type} value={profileForm[field] || ''} onChange={e => setProfileForm(f => ({ ...f, [field]: e.target.value }))} />
                            : <p className="fp-field-value">{profileForm[field] || '—'}</p>
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ ATTENDANCE ══ */}
          {page === 'attendance' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">Attendance Management</h2>
                  <p className="fp-section-sub">Mark and manage student attendance for your classes</p>
                </div>
              </div>

              <div className="fp-card fp-filter-bar">
                <div className="fp-filter-row">
                  <div className="fp-field">
                    <label className="fp-field-label">Course / Section</label>
                    <select className="fp-input" value={attCourse} onChange={e => setAttCourse(e.target.value)}>
                      <option>CS3351 / 21CS-A</option>
                      <option>CS3351 / 21CS-B</option>
                      <option>CS3352 / 21CS-A</option>
                    </select>
                  </div>
                  <div className="fp-field">
                    <label className="fp-field-label">Date</label>
                    <input className="fp-input" type="date" value={attDate} onChange={e => setAttDate(e.target.value)} />
                  </div>
                  <div className="fp-field" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
                    <button className="fp-btn fp-btn--outline fp-btn--sm" onClick={() => setAttData(p => p.map(s => s.cls === (attCourse.includes('/') ? attCourse.split('/')[1].trim() : '21CS-A') ? { ...s, present: true } : s))}>Mark All Present</button>
                    <button className="fp-btn fp-btn--ghost fp-btn--sm" onClick={() => setAttData(p => p.map(s => s.cls === (attCourse.includes('/') ? attCourse.split('/')[1].trim() : '21CS-A') ? { ...s, present: false } : s))}>Mark All Absent</button>
                    <label className="fp-btn fp-btn--primary fp-btn--sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Upload Excel
                      <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={handleAttendanceExcelUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="fp-card" style={{ padding: 0 }}>
                <div className="fp-table-wrap">
                  <table className="fp-table fp-table--att">
                    <thead>
                      <tr>
                        <th>#</th><th>Roll No.</th><th>Student Name</th><th>Section</th>
                        <th>Status</th><th>Mark Present</th><th>Mark Absent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attData.filter(s => s.cls === (attCourse.includes('/') ? attCourse.split('/')[1].trim() : '21CS-A')).map((s, i) => (
                        <tr key={s.roll} className={s.present ? '' : 'fp-row--absent'}>
                          <td>{i + 1}</td><td>{s.roll}</td><td>{s.name}</td><td>{s.cls}</td>
                          <td><span className={`fp-badge ${s.present ? 'fp-badge--present' : 'fp-badge--absent'}`}>{s.present ? 'Present' : 'Absent'}</span></td>
                          <td>
                            <label className="fp-radio-label">
                              <input type="radio" name={`att-${s.roll}`} checked={s.present} onChange={() => setAttData(p => p.map(x => x.roll === s.roll ? { ...x, present: true } : x))} />
                              Present
                            </label>
                          </td>
                          <td>
                            <label className="fp-radio-label fp-radio-label--absent">
                              <input type="radio" name={`att-${s.roll}`} checked={!s.present} onChange={() => setAttData(p => p.map(x => x.roll === s.roll ? { ...x, present: false } : x))} />
                              Absent
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="fp-table-footer">
                  <span>
                    Present: <strong>{attData.filter(s => s.cls === (attCourse.includes('/') ? attCourse.split('/')[1].trim() : '21CS-A') && s.present).length}</strong> &nbsp;|&nbsp;
                    Absent: <strong>{attData.filter(s => s.cls === (attCourse.includes('/') ? attCourse.split('/')[1].trim() : '21CS-A') && !s.present).length}</strong> &nbsp;|&nbsp;
                    Total: <strong>{attData.filter(s => s.cls === (attCourse.includes('/') ? attCourse.split('/')[1].trim() : '21CS-A')).length}</strong>
                  </span>
                  <button className="fp-btn fp-btn--primary" onClick={handleAttSave}>Save Attendance</button>
                </div>
              </div>
            </div>
          )}

          {/* ══ MARKS ENTRY ══ */}
          {page === 'marks' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">Marks Entry</h2>
                  <p className="fp-section-sub">Enter and update internal assessment marks for your students</p>
                </div>
              </div>

              <div className="fp-card fp-filter-bar">
                <div className="fp-filter-row">
                  <div className="fp-field">
                    <label className="fp-field-label">Course</label>
                    <select className="fp-input" value={marksCourse} onChange={e => setMarksCourse(e.target.value)}>
                      <option>CS3351 / 21CS-A</option>
                      <option>CS3351 / 21CS-B</option>
                      <option>CS3352 / 21CS-A</option>
                    </select>
                  </div>
                  <div className="fp-field">
                    <label className="fp-field-label">Assessment Type</label>
                    <select className="fp-input" value={marksAssessment} onChange={e => setMarksAssessment(e.target.value)}>
                      <option value="ia1">Internal Assessment 1 (Max: 25)</option>
                      <option value="ia2">Internal Assessment 2 (Max: 25)</option>
                      <option value="assignment">Assignment (Max: 10)</option>
                    </select>
                  </div>
                  <div className="fp-field" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
                    <button className="fp-btn fp-btn--outline fp-btn--sm" onClick={() => setClassFilter(f => f === '21CS-A' ? '' : '21CS-A')}>
                      {classFilter === '21CS-A' ? 'Show All' : 'Filter 21CS-A'}
                    </button>
                    <label className="fp-btn fp-btn--primary fp-btn--sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Upload Excel
                      <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={handleMarksExcelUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="fp-card" style={{ padding: 0 }}>
                <div className="fp-table-wrap">
                  <table className="fp-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Roll No.</th><th>Student Name</th><th>Section</th>
                        <th>IA 1 (25)</th><th>IA 2 (25)</th><th>Assign. (10)</th><th>Total (60)</th><th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMarks.map((s, i) => {
                        const total = s.ia1 + s.ia2 + s.assignment;
                        const g = grade(total, 60);
                        return (
                          <tr key={s.roll}>
                            <td>{i + 1}</td><td>{s.roll}</td><td>{s.name}</td><td>{s.cls}</td>
                            <td>
                              <input className="fp-marks-input" type="number" value={s.ia1} min={0} max={25}
                                onChange={e => setMarksData(p => p.map((m, j) => m.roll === s.roll ? { ...m, ia1: Math.min(25, Math.max(0, parseInt(e.target.value) || 0)) } : m))} />
                            </td>
                            <td>
                              <input className="fp-marks-input" type="number" value={s.ia2} min={0} max={25}
                                onChange={e => setMarksData(p => p.map((m, j) => m.roll === s.roll ? { ...m, ia2: Math.min(25, Math.max(0, parseInt(e.target.value) || 0)) } : m))} />
                            </td>
                            <td>
                              <input className="fp-marks-input" type="number" value={s.assignment} min={0} max={10}
                                onChange={e => setMarksData(p => p.map((m, j) => m.roll === s.roll ? { ...m, assignment: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) } : m))} />
                            </td>
                            <td><strong>{total}</strong></td>
                            <td><span className={`fp-grade fp-grade--${g.replace('+', 'p')}`}>{g}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="fp-table-footer">
                  <span>Showing {filteredMarks.length} of {marksData.length} students</span>
                  <button className="fp-btn fp-btn--primary" onClick={handleMarksSave}>Save Marks</button>
                </div>
              </div>
            </div>
          )}

          {/* ══ STUDENTS ══ */}
          {page === 'students' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">Student List</h2>
                  <p className="fp-section-sub">View and filter students across your assigned sections</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="fp-badge fp-badge--info">{filteredStudents.length} students</span>
                </div>
              </div>

              <div className="fp-card fp-filter-bar">
                <div className="fp-filter-row">
                  <div className="fp-field" style={{ flex: 2 }}>
                    <label className="fp-field-label">Search Student</label>
                    <input className="fp-input" placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="fp-field">
                    <label className="fp-field-label">Filter by Section</label>
                    <select className="fp-input" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                      <option value="">All Sections</option>
                      <option value="21CS-A">21CS-A</option>
                      <option value="21CS-B">21CS-B</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="fp-card" style={{ padding: 0 }}>
                <div className="fp-table-wrap">
                  <table className="fp-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Roll No.</th><th>Name</th><th>Section</th>
                        <th>Attendance</th><th>Att. %</th><th>IA Average</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s, i) => (
                        <tr key={s.roll}>
                          <td>{i + 1}</td>
                          <td><span className="fp-roll">{s.roll}</span></td>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.cls}</td>
                          <td>
                            <div className="fp-mini-bar">
                              <div className="fp-mini-fill" style={{ width: `${s.att}%`, background: s.att < 75 ? '#dc3545' : s.att < 85 ? '#f59e0b' : '#16a34a' }} />
                            </div>
                          </td>
                          <td>
                            <span className={`fp-badge ${s.att < 75 ? 'fp-badge--at-risk' : s.att < 85 ? 'fp-badge--warn' : 'fp-badge--good'}`}>{s.att}%</span>
                          </td>
                          <td>{s.ia}/25</td>
                          <td>
                            <span className={`fp-badge ${s.status === 'Active' ? 'fp-badge--active' : s.status === 'Low Att.' ? 'fp-badge--warn' : 'fp-badge--at-risk'}`}>{s.status}</span>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr><td colSpan="8" className="fp-no-data">No students found matching the criteria.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ ASSIGNMENTS ══ */}
          {page === 'assignments' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">Assignments</h2>
                  <p className="fp-section-sub">Upload and manage assignments for your courses</p>
                </div>
              </div>

              <div className="fp-two-col">
                {/* Upload Form */}
                <div className="fp-card">
                  <h3 className="fp-card-title" style={{ marginBottom: 20 }}>Upload New Assignment</h3>
                  <form onSubmit={handleUploadAssignment}>
                    <div className="fp-field" style={{ marginBottom: 16 }}>
                      <label className="fp-field-label">Assignment Title *</label>
                      <input className="fp-input" placeholder="e.g. Binary Tree Implementation" value={assignForm.title}
                        onChange={e => setAssignForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="fp-field" style={{ marginBottom: 16 }}>
                      <label className="fp-field-label">Course / Section *</label>
                      <select className="fp-input" value={assignForm.course} onChange={e => setAssignForm(f => ({ ...f, course: e.target.value }))}>
                        <option>CS3351 / 21CS-A</option>
                        <option>CS3351 / 21CS-B</option>
                        <option>CS3352 / 21CS-A</option>
                      </select>
                    </div>
                    <div className="fp-field" style={{ marginBottom: 16 }}>
                      <label className="fp-field-label">Description</label>
                      <textarea className="fp-input fp-textarea" rows={3} placeholder="Describe the assignment requirements..."
                        value={assignForm.desc} onChange={e => setAssignForm(f => ({ ...f, desc: e.target.value }))} />
                    </div>
                    <div className="fp-two-col-sm" style={{ marginBottom: 16 }}>
                      <div className="fp-field">
                        <label className="fp-field-label">Due Date *</label>
                        <input className="fp-input" type="date" value={assignForm.due} onChange={e => setAssignForm(f => ({ ...f, due: e.target.value }))} />
                      </div>
                      <div className="fp-field">
                        <label className="fp-field-label">Max Marks</label>
                        <input className="fp-input" type="number" value={assignForm.maxMarks} min={1} max={100}
                          onChange={e => setAssignForm(f => ({ ...f, maxMarks: parseInt(e.target.value) || 10 }))} />
                      </div>
                    </div>
                    <button type="submit" className="fp-btn fp-btn--primary" style={{ width: '100%' }}>Upload Assignment</button>
                  </form>
                </div>

                {/* Assignment List */}
                <div className="fp-card">
                  <h3 className="fp-card-title" style={{ marginBottom: 20 }}>Uploaded Assignments</h3>
                  <div className="fp-assign-list">
                    {assignments.map(a => (
                      <div className="fp-assign-row" key={a.id}>
                        <div className="fp-assign-body">
                          <div className="fp-assign-title">{a.title}</div>
                          <div className="fp-assign-meta">
                            <span>{a.course}</span>
                            <span className="fp-dot">•</span>
                            <span>Due: {a.due}</span>
                            <span className="fp-dot">•</span>
                            <span>Max: {a.maxMarks}</span>
                            <span className="fp-dot">•</span>
                            <span>{a.submissions} submissions</span>
                          </div>
                        </div>
                        <div className="fp-assign-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`fp-badge ${a.status === 'Active' ? 'fp-badge--active' : 'fp-badge--closed'}`}>{a.status}</span>
                          <button className="fp-btn fp-btn--ghost" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
                            onClick={() => handleViewSubmissions(a.id || a._id, a.title)}>
                            View Submissions
                          </button>
                          <button className="fp-icon-btn fp-icon-btn--danger" title="Remove assignment"
                            onClick={() => setAssignDeleteConfirm(a.id || a._id)}>&#x2715;</button>
                        </div>
                      </div>
                    ))}
                    {assignments.length === 0 && <p className="fp-no-data">No assignments uploaded yet.</p>}
                  </div>
                </div>
              </div>

              {/* Delete Confirm */}
              {assignDeleteConfirm && (
                <div className="fp-modal-overlay">
                  <div className="fp-modal">
                    <h4>Remove Assignment</h4>
                    <p>Are you sure you want to remove this assignment? This cannot be undone.</p>
                    <div className="fp-modal-actions">
                      <button className="fp-btn fp-btn--ghost" onClick={() => setAssignDeleteConfirm(null)}>Cancel</button>
                      <button className="fp-btn fp-btn--danger" onClick={() => handleDeleteAssignment(assignDeleteConfirm)}>Remove</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submissions Modal */}
              {viewSubmissionsAssignmentId && (
                <div className="fp-modal-overlay">
                  <div className="fp-modal" style={{ maxWidth: '600px', width: '90%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0 }}>Submissions: {viewSubmissionsTitle}</h4>
                      <button className="fp-icon-btn" style={{ fontSize: '18px' }} onClick={() => setViewSubmissionsAssignmentId(null)}>&#x2715;</button>
                    </div>
                    
                    <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                      {submissionsList.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '20px 0' }}>No submissions received yet for this assignment.</p>
                      ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                              <th style={{ padding: '10px', fontSize: '12px', textAlign: 'left' }}>Roll No</th>
                              <th style={{ padding: '10px', fontSize: '12px', textAlign: 'left' }}>Student Name</th>
                              <th style={{ padding: '10px', fontSize: '12px', textAlign: 'center' }}>Submitted File</th>
                              <th style={{ padding: '10px', fontSize: '12px', textAlign: 'center' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissionsList.map(s => (
                              <tr key={s._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '10px', fontSize: '12px' }}>{s.rollNo}</td>
                                <td style={{ padding: '10px', fontSize: '12px' }}><strong>{s.studentName}</strong></td>
                                <td style={{ padding: '10px', fontSize: '11px', color: '#475569', textAlign: 'center' }}>
                                  {s.submittedFile?.name || 'File.pdf'}
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                  <button className="fp-btn fp-btn--primary" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
                                    onClick={() => handleDownloadSubmittedFile(s.submittedFile)}>
                                    Download File
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                    
                    <div className="fp-modal-actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="fp-btn fp-btn--ghost" onClick={() => setViewSubmissionsAssignmentId(null)}>Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ COURSES ══ */}
          {page === 'courses' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">My Courses</h2>
                  <p className="fp-section-sub">Courses assigned to you for this semester</p>
                </div>
              </div>

              <div className="fp-courses-grid">
                {courses.map(c => (
                  <div className="fp-course-card" key={c.id}>
                    <div className="fp-course-header">
                      <div className="fp-course-code-badge">{c.code}</div>
                      <span className={`fp-badge ${c.pct >= 80 ? 'fp-badge--good' : c.pct >= 60 ? 'fp-badge--warn' : 'fp-badge--at-risk'}`}>{c.pct}% done</span>
                    </div>
                    <h3 className="fp-course-name">{c.name}</h3>
                    <p className="fp-course-section">{c.cls} &mdash; Semester {c.sem}</p>
                    <div className="fp-course-meta-row">
                      <div className="fp-cmeta"><span className="fp-cmeta-val">{c.students}</span><span className="fp-cmeta-label">Students</span></div>
                      <div className="fp-cmeta"><span className="fp-cmeta-val">{c.credits}</span><span className="fp-cmeta-label">Credits</span></div>
                      <div className="fp-cmeta"><span className="fp-cmeta-val">{c.done}/{c.classes}</span><span className="fp-cmeta-label">Classes</span></div>
                    </div>
                    <div className="fp-progress-wrap">
                      <div className="fp-progress-bar">
                        <div className="fp-progress-fill" style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="fp-progress-label">Syllabus Completion</span>
                    </div>
                    <div className="fp-course-footer">
                      <button className="fp-btn fp-btn--sm fp-btn--outline" onClick={() => setPage('attendance')}>Attendance</button>
                      <button className="fp-btn fp-btn--sm fp-btn--outline" onClick={() => setPage('marks')}>Marks</button>
                      <button className="fp-btn fp-btn--sm fp-btn--outline" onClick={() => setPage('assignments')}>Assignments</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Syllabus Topics Table */}
              <div className="fp-card" style={{ marginTop: 24 }}>
                <div className="fp-card-header"><h3 className="fp-card-title">DS Course — Syllabus Topics</h3></div>
                <div className="fp-table-wrap">
                  <table className="fp-table">
                    <thead><tr><th>#</th><th>Unit</th><th>Topic</th><th>Hours</th><th>Status</th></tr></thead>
                    <tbody>
                      {[
                        [1, 'Unit I',   'Linear Data Structures',           12, 'Completed' ],
                        [2, 'Unit II',  'Trees and Tree Traversal',         10, 'Completed' ],
                        [3, 'Unit III', 'Graphs and Graph Algorithms',      10, 'Completed' ],
                        [4, 'Unit IV',  'Sorting and Searching Algorithms', 8,  'In Progress'],
                        [5, 'Unit V',   'Hashing and File Structures',      6,  'Pending'   ],
                      ].map(([no, unit, topic, hrs, stat]) => (
                        <tr key={no}>
                          <td>{no}</td><td>{unit}</td><td>{topic}</td><td>{hrs} hrs</td>
                          <td><span className={`fp-badge ${stat === 'Completed' ? 'fp-badge--good' : stat === 'In Progress' ? 'fp-badge--warn' : 'fp-badge--info'}`}>{stat}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ TIMETABLE ══ */}
          {page === 'timetable' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">Timetable</h2>
                  <p className="fp-section-sub">Your weekly class schedule for Semester 5</p>
                </div>
              </div>

              <div className="fp-card" style={{ padding: 0 }}>
                <div className="fp-table-wrap">
                  <table className="fp-table fp-timetable">
                    <thead>
                      <tr>
                        <th>Day</th>
                        {TIME_SLOTS.map(t => <th key={t}>{t}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(weeklyTimetable).map(([day, slots]) => (
                        <tr key={day}>
                          <td className="fp-tt-day">{day}</td>
                          {slots.map((slot, i) => (
                            <td key={i} className={`fp-tt-cell${slot === 'Lunch' ? ' fp-tt-lunch' : slot === '—' ? ' fp-tt-empty' : ''}`}>
                              {slot !== '—' && slot !== 'Lunch' ? (
                                <span className="fp-tt-subject">{slot}</span>
                              ) : slot === 'Lunch' ? (
                                <span className="fp-tt-lunch-label">Lunch</span>
                              ) : '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="fp-card" style={{ marginTop: 24 }}>
                <h3 className="fp-card-title" style={{ marginBottom: 16 }}>Today's Detailed Schedule</h3>
                <div className="fp-schedule-list">
                  {todaySchedule && todaySchedule.length > 0 ? (
                    todaySchedule.map(({ time, subject, section, room, type }) => (
                      <div className="fp-schedule-item fp-schedule-item--lg" key={time}>
                        <div className="fp-schedule-time-block">
                          <span className="fp-schedule-time">{time}</span>
                        </div>
                        <div className="fp-schedule-divider" />
                        <div className="fp-schedule-info">
                          <span className="fp-schedule-subject">{subject}</span>
                          <span className="fp-schedule-meta">{section} &middot; {room}</span>
                        </div>
                        <span className={`fp-badge fp-badge--${type.toLowerCase()}`}>{type}</span>
                      </div>
                    ))
                  ) : (
                    <div className="fp-schedule-item fp-schedule-item--lg">
                      <div className="fp-schedule-info">
                        <span className="fp-schedule-subject">No Classes Today</span>
                        <span className="fp-schedule-meta">Enjoy your day off!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ LEAVE REQUESTS ══ */}
          {page === 'leave' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">Leave Requests</h2>
                  <p className="fp-section-sub">Review and approve student leave applications</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span className="fp-badge fp-badge--warn">{leaveRequests.filter(l => l.status === 'Pending').length} Pending</span>
                </div>
              </div>

              <div className="fp-leave-summary">
                {[
                  { label: 'Total Requests',  val: leaveRequests.length,                              color: 'info'    },
                  { label: 'Pending',         val: leaveRequests.filter(l=>l.status==='Pending').length,  color: 'warn'  },
                  { label: 'Approved',        val: leaveRequests.filter(l=>l.status==='Approved').length, color: 'good'  },
                  { label: 'Rejected',        val: leaveRequests.filter(l=>l.status==='Rejected').length, color: 'at-risk'},
                ].map(({ label, val, color }) => (
                  <div className="fp-leave-stat" key={label}>
                    <span className={`fp-leave-stat-val fp-leave-stat-val--${color}`}>{val}</span>
                    <span className="fp-leave-stat-label">{label}</span>
                  </div>
                ))}
              </div>

              <div className="fp-card" style={{ padding: 0 }}>
                <div className="fp-table-wrap">
                  <table className="fp-table">
                    <thead>
                      <tr><th>#</th><th>Roll No.</th><th>Student Name</th><th>Leave Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((l, i) => (
                        <tr key={l.id}>
                          <td>{i + 1}</td>
                          <td><span className="fp-roll">{l.roll}</span></td>
                          <td><strong>{l.name}</strong></td>
                          <td>{l.type}</td>
                          <td>{l.from}</td>
                          <td>{l.to}</td>
                          <td>{l.reason}</td>
                          <td><span className={`fp-badge ${l.status === 'Approved' ? 'fp-badge--good' : l.status === 'Rejected' ? 'fp-badge--at-risk' : 'fp-badge--warn'}`}>{l.status}</span></td>
                          <td>
                            {l.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="fp-btn fp-btn--xs fp-btn--primary" onClick={() => handleLeaveAction(l.id, 'Approved')}>Approve</button>
                                <button className="fp-btn fp-btn--xs fp-btn--danger" onClick={() => handleLeaveAction(l.id, 'Rejected')}>Reject</button>
                              </div>
                            ) : <span style={{ color: '#999', fontSize: 13 }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ COMMUNICATION ══ */}
          {page === 'communicate' && (
            <div className="fp-section">
              <div className="fp-section-header">
                <div>
                  <h2 className="fp-section-title">Student Communication</h2>
                  <p className="fp-section-sub">Send announcements and messages to your students</p>
                </div>
              </div>

              <div className="fp-two-col">
                <div className="fp-card">
                  <h3 className="fp-card-title" style={{ marginBottom: 20 }}>Send Announcement</h3>
                  <form onSubmit={handleSendMessage}>
                    <div className="fp-field" style={{ marginBottom: 16 }}>
                      <label className="fp-field-label">To</label>
                      <select className="fp-input" value={msgForm.to} onChange={e => setMsgForm(f => ({ ...f, to: e.target.value }))}>
                        <option>All My Students</option>
                        <option>21CS-A Students</option>
                        <option>21CS-B Students</option>
                        <option>CS3351 Enrolled</option>
                        <option>CS3352 Enrolled</option>
                      </select>
                    </div>
                    <div className="fp-field" style={{ marginBottom: 16 }}>
                      <label className="fp-field-label">Subject *</label>
                      <input className="fp-input" placeholder="Message subject" value={msgForm.subject}
                        onChange={e => setMsgForm(f => ({ ...f, subject: e.target.value }))} />
                    </div>
                    <div className="fp-field" style={{ marginBottom: 16 }}>
                      <label className="fp-field-label">Message *</label>
                      <textarea className="fp-input fp-textarea" rows={6} placeholder="Type your announcement here..."
                        value={msgForm.message} onChange={e => setMsgForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    <button type="submit" className="fp-btn fp-btn--primary" style={{ width: '100%' }}>Send Message</button>
                  </form>
                </div>

                <div className="fp-card">
                  <h3 className="fp-card-title" style={{ marginBottom: 20 }}>Sent Messages</h3>
                  <div className="fp-msg-list">
                    {sentMessages.map((m, i) => (
                      <div className="fp-msg-row" key={i}>
                        <div className="fp-msg-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        </div>
                        <div className="fp-msg-body">
                          <div className="fp-msg-title">{m.title}</div>
                          <div className="fp-msg-meta">To: {m.to} &middot; {m.date}</div>
                        </div>
                        <span className="fp-badge fp-badge--good">Sent</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
