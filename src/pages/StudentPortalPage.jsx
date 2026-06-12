import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clgLogo from '../assets/images/CLGLOGO.webp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSessionUser, logoutUser, getAttendance, getFees, getTimetable, getAssignments, getNotifications, getResults, submitAssignment, payFeesOnline, submitLeaveApplication, getLeaveApplications, getStudentHallTicket, uploadStudentPhoto, getNotices, getAdminSubjects, getAdminBooks, getPlacements, getAdminTransportRoutes, getAdminHostelAllocations, getStudentComplaints, createStudentComplaint, getStudentCertificates, createCertificateRequest, markNotificationsRead } from '../utils/storage';
import '../assets/css/student-portal.css';

function StudentPortalPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Core Auth & Storage State
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [resultsData, setResultsData] = useState(null);
  const [timetableData, setTimetableData] = useState([]);

  // Live Database Arrays
  const [noticesData, setNoticesData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [placementDrives, setPlacementDrives] = useState([]);
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [hostelAllocation, setHostelAllocation] = useState(null);
  const [certificatesData, setCertificatesData] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [advisorName, setAdvisorName] = useState('Dr. Ramesh Kumar');

  // Layout UI State
  const [activePage, setActivePage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [chartsMounted, setChartsMounted] = useState(false);
  useEffect(() => { setChartsMounted(true); }, []);

  // 1. Interactive States for new features:
  // Academics (Syllabus Modal)
  const [activeSyllabus, setActiveSyllabus] = useState(null);

  // Assignments Upload Simulation
  const [uploadId, setUploadId] = useState(null);
  const [uploadFile, setUploadFile] = useState('');

  // CGPA Calculator
  const [calcGrades, setCalcGrades] = useState({ sem1: '', sem2: '', sem3: '', sem4: '' });
  const [calculatedCgpa, setCalculatedCgpa] = useState(null);

  // Fees Payment Simulation
  const [payAmount, setPayAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Library Reservation State
  const [searchBook, setSearchBook] = useState('');
  const [reservedBooks, setReservedBooks] = useState([]);
  const libraryFines = 0;

  // Placement Job Applications
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Leave Applications list
  const [leavesHistory, setLeavesHistory] = useState([]);
  const [leaveType, setLeaveType] = useState('Medical Leave');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Documents Download status

  // Clubs and Events Registration
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // Grievance Tickets List
  const [supportTickets, setSupportTickets] = useState([]);
  const [ticketCat, setTicketCat] = useState('Academic Issues');
  const [ticketPriority, setTicketPriority] = useState('Low');
  const [ticketDesc, setTicketDesc] = useState('');

  // Load User Data from backend API via MongoDB session
  useEffect(() => {
    const init = async () => {
      const session = await getSessionUser();
      if (!session || !session.success || session.type !== 'student') {
        navigate('/student-login');
        return;
      }
      const student = session.user;
      setStudentData(student);
      const rollNo = student.roll;
      try {
        const [attendance, fees, assignments, notifications] = await Promise.all([
          getAttendance(rollNo),
          getFees(rollNo),
          getAssignments(rollNo),
          getNotifications(rollNo)
        ]);
        setAttendanceData(attendance);
        setFeesData(fees);
        setAssignmentsData(assignments);
        setNotificationsData(notifications);
        
        setIsLoading(false); // Unblock UI instantly

        // Lazy load the rest in the background
        getResults(rollNo).then(setResultsData).catch(() => {});
        getLeaveApplications(rollNo).then(leaves => { if (leaves?.length) setLeavesHistory(leaves); }).catch(() => {});
        getTimetable(student.dept, student.sem || '').then(t => setTimetableData(t || [])).catch(() => {});
        getNotices().then(n => setNoticesData(n || [])).catch(() => {});
        getAdminSubjects().then(s => setSubjectsData(s || [])).catch(() => {});
        getAdminBooks().then(b => setBooksData(b || [])).catch(() => {});
        getPlacements().then(p => setPlacementDrives(p?.drives || [])).catch(() => {});
        getAdminTransportRoutes().then(t => setTransportRoutes(t || [])).catch(() => {});
        getAdminHostelAllocations().then(h => {
          const myHostel = h?.find(x => x.roll === rollNo) || null;
          setHostelAllocation(myHostel);
        }).catch(() => {});
        getStudentComplaints(rollNo).then(t => setSupportTickets(t || [])).catch(() => {});
        getStudentCertificates(rollNo).then(c => setCertificatesData(c || [])).catch(() => {});
        getStudentHallTicket(rollNo).then(h => {
          if (h && h.success) setExamSchedules(h.schedules || []);
        }).catch(() => {});

        const advisorMap = {
          CSE: "Dr. Ramesh Kumar",
          ECE: "Dr. Anand Rajan",
          Mech: "Prof. Kumar Selvam",
          Civil: "Dr. Meena Thangaraj",
          IT: "Dr. Deepa Srinivasan"
        };
        setAdvisorName(advisorMap[student.dept] || "Dr. Ramesh Kumar");
      } catch (e) {
        console.error('Error loading student data from backend:', e);
      }
    };
    init();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/student-login');
  };

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
      <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTop: '4px solid #1e3a5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontWeight: 600 }}>Loading Student Portal…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!studentData) return null;

  const studentName = studentData.name || '';
  const studentRoll = studentData.roll || '';
  const studentDept = studentData.dept || '';
  const studentSem = studentData.sem || '';
  const studentEmail = studentData.email || '';
  const initials = studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const overallAttendance = attendanceData ? attendanceData.overall : 0;
  const cgpaVal = resultsData ? ((resultsData.sem3?.gpa + resultsData.sem4?.gpa) / 2).toFixed(2) : 'N/A';
  const feeDue = feesData ? feesData.due : 0;
  const pendingAssignments = assignmentsData.filter(a => a.status === 'pending').length;

  // Timetable dashboard classes extractor
  const getTodayClasses = () => {
    if (!timetableData || timetableData.length === 0) return [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayName = days[new Date().getDay()];
    // Fallback to Monday if it is Sunday/Saturday
    const dayName = (todayName === 'Sun' || todayName === 'Sat') ? 'Mon' : todayName;
    const daySchedule = timetableData.find(d => d.day === dayName);
    if (!daySchedule) return [];
    
    const timeSlots = [
      "09:00 - 10:00 AM",
      "10:00 - 11:00 AM",
      "11:00 - 12:00 PM",
      "12:00 - 02:00 PM", // Lunch
      "02:00 - 03:00 PM",
      "03:00 - 04:00 PM",
      "04:00 - 05:00 PM"
    ];
    
    return daySchedule.slots.map((slot, i) => {
      if (slot === 'Lunch' || slot === '—') return null;
      return {
        time: timeSlots[i],
        subject: slot, // Directly showing what the DB provides
        instructor: "Assigned Faculty", // DB doesn't have instructor mapping currently
        room: "Assigned Room" // DB doesn't have room mapping currently
      };
    }).filter(Boolean);
  };

  // Issued Books list derived from DB
  const getIssuedBooks = () => {
    // There are no issued books recorded in DB for students right now.
    // Return empty array to represent reality
    return [];
  };

  // Curriculum courses from DB
  const getStudentSubjects = () => {
    if (!subjectsData || subjectsData.length === 0) return [];
    return subjectsData.filter(s => s.dept === studentDept && s.sem === studentSem);
  };

  // Syllabus generator helper
  const getSyllabusModules = (subName) => {
    // If DB provided syllabus, we would return it here. 
    // Currently, there's no syllabus field in the subjects DB schema.
    return [];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadFile({
        name: file.name,
        data: reader.result, // base64 string
        size: file.size,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit Assignment to Backend
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    try {
      // Complete Assignment to Backend
      const response = await submitAssignment(studentRoll, uploadId, uploadFile);
      if (response && response.success) {
        setAssignmentsData(prev => prev.map(a => {
          if (a.id === uploadId || a._id === uploadId) {
            return { ...a, status: 'submitted', submittedFile: uploadFile };
          }
          return a;
        }));
        setUploadId(null);
        setUploadFile('');
        alert('Assignment file uploaded successfully.');
      } else {
        alert('Failed to submit assignment.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading assignment.');
    }
  };

  // Calculate CGPA
  const handleCgpaSubmit = (e) => {
    e.preventDefault();
    const scores = [parseFloat(calcGrades.sem1), parseFloat(calcGrades.sem2), parseFloat(calcGrades.sem3), parseFloat(calcGrades.sem4)];
    const validScores = scores.filter(s => !isNaN(s) && s >= 0 && s <= 10);
    if (validScores.length === 0) {
      alert('Please enter valid numeric GPAs (0 to 10).');
      return;
    }
    const sum = validScores.reduce((acc, curr) => acc + curr, 0);
    setCalculatedCgpa((sum / validScores.length).toFixed(2));
  };

  // Online Fee Payment Backend Integration
  const handleFeePaymentSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive payment amount.');
      return;
    }

    try {
      const updatedFees = await payFeesOnline(studentRoll, amount, 'Online Tuition Payment');
      if (updatedFees) {
        setFeesData(updatedFees);
        setPayAmount('');
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 5000);
      } else {
        alert('Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const handleReserveBook = (title) => {
    if (reservedBooks.includes(title)) {
      alert('Book already reserved!');
      return;
    }
    setReservedBooks(prev => [...prev, title]);
    alert(`Reservation request for "${title}" confirmed. Pick up from library within 48 hours.`);
  };

  const handleApplyJob = (driveId) => {
    if (appliedJobs.includes(driveId)) {
      alert('Already applied for this drive!');
      return;
    }
    setAppliedJobs(prev => [...prev, driveId]);
    alert('Application submitted successfully to Corporate Placement Cell.');
  };

  // Leave Submit to Backend
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveFrom || !leaveTo || !leaveReason) {
      alert('Please fill out all leave details.');
      return;
    }
    const leaveData = {
      type: leaveType,
      from: leaveFrom,
      to: leaveTo,
      reason: leaveReason,
      name: studentName
    };
    try {
      const saved = await submitLeaveApplication(studentRoll, leaveData);
      if (saved) {
        const leaves = await getLeaveApplications(studentRoll);
        setLeavesHistory(leaves);
        setLeaveFrom('');
        setLeaveTo('');
        setLeaveReason('');
        alert('Leave application filed successfully.');
      } else {
        alert('Failed to apply for leave. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  // Document Request
  const handleRequestDoc = async (docName) => {
    if (docName === 'Hall Ticket' || docName === 'Exam Hall Ticket (IA 2)') {
      try {
        const ticketData = await getStudentHallTicket(studentRoll);
        if (ticketData && ticketData.success) {
          const printWindow = window.open('', '_blank');
          const isIA2 = docName === 'Exam Hall Ticket (IA 2)';
          const ticketTitle = isIA2 ? 'INTERNAL ASSESSMENT TEST 2 - HALL TICKET' : 'SEMESTER THEORY EXAMINATIONS - HALL TICKET';
          const ticketSub = isIA2 ? 'Internal Assessment Registry' : 'Office of the Controller of Examinations';
          
          let rowsHtml = '';
          const examSchedule = isIA2 
            ? ticketData.schedules.map((s) => ({
                ...s,
                examDate: new Date(new Date(s.examDate).getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                session: s.session.replace('9:30 AM', '10:00 AM').replace('12:30 PM', '12:00 PM').replace('1:30 PM', '2:00 PM').replace('4:30 PM', '4:00 PM'),
                hallNo: s.hallNo.replace('LH-', 'LH-IA-')
              }))
            : ticketData.schedules;

          examSchedule.forEach(s => {
            rowsHtml += `
              <tr>
                <td><strong>${s.subjectCode}</strong></td>
                <td>${s.subjectName}</td>
                <td>${s.examDate}</td>
                <td>${s.session}</td>
                <td>${s.hallNo}</td>
                <td style="color: #059669; font-weight: bold; text-align: center;">VERIFIED</td>
              </tr>
            `;
          });

          printWindow.document.write(`
            <html>
              <head>
                <title>Hall Ticket - ${studentRoll}</title>
                <style>
                  body { font-family: 'Segoe UI', sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
                  .header { display: flex; align-items: center; border-bottom: 3px double #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
                  .logo-container { width: 80px; height: 80px; background: #1e3a8a; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; margin-right: 20px; }
                  .title-container h1 { font-size: 22px; color: #1e3a8a; margin: 0 0 5px 0; font-weight: 800; text-transform: uppercase; }
                  .title-container h2 { font-size: 14px; color: #475569; margin: 0 0 5px 0; font-weight: 600; text-transform: uppercase; }
                  .title-container p { font-size: 12px; color: #64748b; margin: 0; }
                  .ticket-title { text-align: center; font-size: 16px; font-weight: bold; letter-spacing: 1px; color: white; background: #1e3a8a; padding: 8px; margin-bottom: 25px; border-radius: 4px; }
                  .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; }
                  .info-item { font-size: 13px; }
                  .info-item span { font-weight: bold; color: #475569; display: inline-block; width: 120px; }
                  table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                  th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 13px; }
                  th { background: #f1f5f9; color: #1e3a8a; font-weight: bold; }
                  .footer-signatures { display: flex; justify-content: space-between; margin-top: 60px; font-size: 13px; }
                  .sig-box { width: 200px; text-align: center; border-top: 1px solid #94a3b8; padding-top: 10px; }
                  .instructions { font-size: 11px; color: #64748b; background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 6px; }
                  .instructions h3 { margin: 0 0 8px 0; color: #b45309; font-size: 12px; }
                  .stamp { width: 90px; height: 90px; border: 3px double #b91c1c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #b91c1c; font-size: 10px; text-align: center; text-transform: uppercase; transform: rotate(-15deg); position: absolute; right: 80px; top: 120px; opacity: 0.85; }
                  @media print {
                    body { padding: 20px; }
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="logo-container">BEC</div>
                  <div class="title-container">
                    <h1>Best Engineering College</h1>
                    <h2>${ticketSub}</h2>
                    <p>NH-48, Pennalur Village, Kanchipuram - 602 117, Tamil Nadu, India</p>
                  </div>
                </div>

                <div class="stamp">BEC REGISTRY<br/>OFFICIAL<br/>SEAL</div>

                <div class="ticket-title">${ticketTitle}</div>

                <div class="student-info">
                  <div class="info-item"><span>Candidate Name:</span> ${ticketData.student.name}</div>
                  <div class="info-item"><span>Roll Number:</span> ${ticketData.student.roll}</div>
                  <div class="info-item"><span>Department:</span> ${ticketData.student.dept}</div>
                  <div class="info-item"><span>Semester:</span> Semester ${ticketData.student.sem}</div>
                  <div class="info-item"><span>Academic Year:</span> 2025 - 2026</div>
                  <div class="info-item"><span>Status:</span> REGISTERED & VERIFIED</div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Name</th>
                      <th>Exam Date</th>
                      <th>Session & Time</th>
                      <th>Exam Hall</th>
                      <th>Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rowsHtml}
                  </tbody>
                </table>

                <div class="instructions">
                  <h3>Candidate Instructions:</h3>
                  <ol>
                    <li>Candidates must bring this Hall Ticket along with their College Photo ID Card to the exam hall.</li>
                    <li>Candidates are advised to be present in the examination hall at least 30 minutes before the commencement of the exam.</li>
                    <li>Mobile phones, smartwatches, and other electronic gadgets are strictly prohibited inside the exam hall.</li>
                  </ol>
                </div>

                <div class="footer-signatures">
                  <div class="sig-box" style="margin-top: 40px;">Candidate Signature</div>
                  <div class="sig-box">
                    <div style="font-family: 'Courier New', monospace; font-size: 15px; font-weight: bold; color: #1e3a8a; margin-bottom: 5px;">R. Kumar</div>
                    <strong>Controller of Examinations</strong>
                  </div>
                </div>

                <script>
                  window.onload = function() {
                    window.print();
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        } else {
          alert('Failed to generate exam hall ticket.');
        }
      } catch (err) {
        console.error(err);
        alert('Error communicating with server.');
      }
    } else if (docName === 'Bonafide Certificate') {
      try {
        const student = studentData;
        const printWindow = window.open('', '_blank');
        const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        printWindow.document.write(`
          <html>
            <head>
              <title>Bonafide Certificate - ${studentRoll}</title>
              <style>
                body { font-family: 'Georgia', serif; color: #1e293b; padding: 50px; line-height: 1.8; text-align: justify; }
                .border-container { border: 5px double #1e3a8a; padding: 40px; border-radius: 8px; position: relative; }
                .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 40px; }
                .header h1 { font-family: sans-serif; font-size: 26px; color: #1e3a8a; margin: 0 0 5px 0; font-weight: 800; text-transform: uppercase; }
                .header p { font-family: sans-serif; font-size: 12px; color: #475569; margin: 0; }
                .date-ref { display: flex; justify-content: space-between; margin-bottom: 40px; font-family: sans-serif; font-size: 13px; }
                .cert-title { text-align: center; font-size: 22px; font-weight: bold; text-decoration: underline; color: #1e3a8a; margin-bottom: 40px; font-family: sans-serif; }
                .cert-body { font-size: 16px; margin-bottom: 60px; text-indent: 50px; }
                .footer-sig { display: flex; justify-content: flex-end; margin-top: 80px; }
                .sig-box { text-align: center; font-family: sans-serif; font-size: 14px; width: 220px; }
                .sig-box strong { display: block; margin-top: 40px; border-top: 1px solid #64748b; padding-top: 8px; }
                .seal { width: 100px; height: 100px; border: 2px solid #1e3a8a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 10px; font-weight: bold; color: #1e3a8a; position: absolute; left: 60px; bottom: 60px; transform: rotate(-10deg); opacity: 0.8; }
              </style>
            </head>
            <body>
              <div class="border-container">
                <div class="header">
                  <h1>Best Engineering College</h1>
                  <p>Accredited by NAAC with 'A+' Grade | Affiliated to Anna University</p>
                  <p style="font-size: 10px; color: #64748b;">NH-48, Pennalur Village, Sriperumbudur, Kanchipuram - 602117</p>
                </div>

                <div class="date-ref">
                  <div>Ref No: BEC/BON/2026/${Math.floor(1000 + Math.random() * 9000)}</div>
                  <div>Date: ${todayStr}</div>
                </div>

                <div class="cert-title">BONAFIDE CERTIFICATE</div>

                <div class="cert-body">
                  This is to certify that Mr./Ms. <strong>${student.name}</strong>, bearing Roll Number <strong>${student.roll}</strong>, is a bonafide student of this institution, currently pursuing the Bachelor of Engineering (B.E.) degree in <strong>${student.dept}</strong> during the academic year 2025 - 2026. He / She is currently studying in <strong>Semester ${student.sem}</strong>.
                </div>
                
                <div class="cert-body" style="text-indent: 0;">
                  This certificate is issued for the purpose of <strong>academic references and bank credit support validation</strong>.
                </div>

                <div class="seal">BEC COLLEGE<br/>OFFICIAL<br/>SEAL</div>

                <div class="footer-sig">
                  <div class="sig-box">
                    <div style="font-style: italic; font-size: 16px; font-family: sans-serif; color: #475569;">Dr. Rajesh Kumar</div>
                    <strong>Principal</strong>
                  </div>
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } catch (err) {
        console.error(err);
      }
    } else if (docName === 'Semester Grade Sheet (Sem 4)') {
      try {
        const student = studentData;
        const resData = resultsData;
        if (!resData || !resData.sem4) {
          alert('Grade Sheet data for Semester 4 is not available in the database.');
          return;
        }

        const printWindow = window.open('', '_blank');
        let subjectRows = '';
        resData.sem4.subjects.forEach(s => {
          subjectRows += `
            <tr>
              <td>${s.name}</td>
              <td style="text-align: center;">${s.credits}</td>
              <td style="text-align: center; font-weight: bold;">${s.grade}</td>
              <td style="text-align: center;">${s.points}</td>
            </tr>
          `;
        });

        printWindow.document.write(`
          <html>
            <head>
              <title>Semester 4 Grade Sheet - ${studentRoll}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                .border-box { border: 4px double #1e3a8a; padding: 30px; border-radius: 6px; }
                .logo-header { display: flex; align-items: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px; }
                .logo-placeholder { width: 70px; height: 70px; background: #1e3a8a; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; border-radius: 50%; margin-right: 15px; }
                .header-text h1 { font-size: 20px; color: #1e3a8a; margin: 0 0 5px; }
                .header-text p { font-size: 11px; margin: 0; color: #555; }
                .title { text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0; letter-spacing: 0.5px; }
                .meta-table { width: 100%; margin-bottom: 25px; }
                .meta-table td { border: none; padding: 6px; font-size: 13px; }
                .meta-table td span { font-weight: bold; }
                .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .grades-table th, .grades-table td { border: 1px solid #cbd5e1; padding: 10px; font-size: 13px; }
                .grades-table th { background: #f1f5f9; text-align: left; }
                .gpa-banner { font-size: 15px; font-weight: bold; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 40px; border-radius: 4px; display: flex; justify-content: space-between; }
                .footer-box { display: flex; justify-content: space-between; margin-top: 50px; font-size: 12px; }
                .sig-line { width: 180px; text-align: center; border-top: 1px solid #999; padding-top: 8px; }
                .seal-stamp { border: 2px solid #b91c1c; color: #b91c1c; font-size: 9px; padding: 5px; width: 80px; text-align: center; transform: rotate(-10deg); font-weight: bold; margin-left: 20px; }
              </style>
            </head>
            <body>
              <div class="border-box">
                <div class="logo-header">
                  <div class="logo-placeholder">BEC</div>
                  <div class="header-text">
                    <h1>BEST ENGINEERING COLLEGE</h1>
                    <p>Autonomous Institution under Anna University</p>
                    <p>OFFICE OF THE CONTROLLER OF EXAMINATIONS</p>
                  </div>
                </div>

                <div class="title">OFFICIAL GRADE REPORT</div>

                <table class="meta-table">
                  <tr>
                    <td><span>Candidate Name:</span> ${student.name}</td>
                    <td><span>Roll Number:</span> ${student.roll}</td>
                  </tr>
                  <tr>
                    <td><span>Department:</span> B.E. ${student.dept}</td>
                    <td><span>Semester of Exam:</span> Semester 4 (April/May 2025)</td>
                  </tr>
                </table>

                <table class="grades-table">
                  <thead>
                    <tr>
                      <th>Subject Name</th>
                      <th style="text-align: center; width: 100px;">Credits</th>
                      <th style="text-align: center; width: 100px;">Grade Secured</th>
                      <th style="text-align: center; width: 100px;">Grade Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${subjectRows}
                  </tbody>
                </table>

                <div class="gpa-banner">
                  <span>SEMESTER GPA: ${resData.sem4.gpa}</span>
                  <span>RESULT STATUS: ${resData.sem4.result}</span>
                  <span>ARREARS: ${resData.sem4.arrears || 0}</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div class="seal-stamp">BEC EXAMS<br/>OFFICIAL SECURED</div>
                  <div class="footer-box" style="flex: 1; justify-content: flex-end; gap: 40px; margin-top: 0;">
                    <div class="sig-line" style="margin-top: auto;">Prepared By</div>
                    <div class="sig-line">
                      <div style="font-family: 'Courier New', monospace; font-size: 13px; font-weight: bold; margin-bottom: 4px;">R. Kumar</div>
                      <strong>Controller of Examinations</strong>
                    </div>
                  </div>
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } catch (err) {
        console.error(err);
      }
    } else if (docName === 'College Smart ID Card Card' || docName === 'College Smart ID Card') {
      try {
        const student = studentData;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Student ID Card - ${studentRoll}</title>
              <style>
                body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f1f5f9; }
                .id-card { width: 338px; height: 212px; background: white; border-radius: 10px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #cbd5e1; overflow: hidden; display: flex; flex-direction: column; position: relative; }
                .card-header { background: #1e3a8a; color: white; padding: 10px; display: flex; align-items: center; border-bottom: 3px solid #f59e0b; }
                .logo-id { width: 30px; height: 30px; background: white; color: #1e3a8a; border-radius: 50%; font-weight: bold; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-right: 8px; }
                .header-title h1 { font-size: 11px; margin: 0; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
                .header-title p { font-size: 7px; margin: 2px 0 0; opacity: 0.9; }
                .card-body { display: flex; flex: 1; padding: 10px; }
                .photo-placeholder { width: 70px; height: 85px; background: #e2e8f0; border: 1px solid #cbd5e1; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; color: #64748b; margin-right: 12px; }
                .details { flex: 1; font-size: 10px; display: flex; flex-direction: column; justify-content: center; }
                .detail-row { margin-bottom: 4px; }
                .detail-row span { font-weight: bold; color: #475569; width: 60px; display: inline-block; }
                .card-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; height: 25px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; font-size: 8px; color: #64748b; }
                .barcode { font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="id-card">
                <div class="card-header">
                  <div class="logo-id">BEC</div>
                  <div class="header-title">
                    <h1>Best Engineering College</h1>
                    <p>NH-48, Sriperumbudur, Tamil Nadu</p>
                  </div>
                </div>

                <div class="card-body">
                  <div class="photo-placeholder">
                    <div style="font-size: 18px; margin-bottom: 4px;">👤</div>
                    PHOTO
                  </div>
                  <div class="details">
                    <div class="detail-row" style="font-size: 12px; font-weight: bold; color: #1e3a8a; margin-bottom: 6px;">${student.name}</div>
                    <div class="detail-row"><span>Roll No:</span> ${student.roll}</div>
                    <div class="detail-row"><span>Branch:</span> B.E. ${student.dept}</div>
                    <div class="detail-row"><span>Blood Group:</span> ${student.bloodGroup || ''}</div>
                    <div class="detail-row"><span>Validity:</span> 2023 - 2027</div>
                  </div>
                </div>

                <div class="card-footer">
                  <span class="barcode">||| *${student.roll}* |||</span>
                  <span>STUDENT IDENTITY CARD</span>
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } catch (err) {
        console.error(err);
      }
    } else if (docName === 'Course Completion Certificate') {
      try {
        const student = studentData;
        const printWindow = window.open('', '_blank');
        const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        printWindow.document.write(`
          <html>
            <head>
              <title>Course Completion Certificate - ${studentRoll}</title>
              <style>
                body { font-family: 'Georgia', serif; color: #1e293b; padding: 50px; line-height: 1.8; text-align: justify; }
                .border-container { border: 5px double #1e3a8a; padding: 40px; border-radius: 8px; position: relative; }
                .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 40px; }
                .header h1 { font-family: sans-serif; font-size: 26px; color: #1e3a8a; margin: 0 0 5px 0; font-weight: 800; text-transform: uppercase; }
                .header p { font-family: sans-serif; font-size: 12px; color: #475569; margin: 0; }
                .date-ref { display: flex; justify-content: space-between; margin-bottom: 40px; font-family: sans-serif; font-size: 13px; }
                .cert-title { text-align: center; font-size: 22px; font-weight: bold; text-decoration: underline; color: #1e3a8a; margin-bottom: 40px; font-family: sans-serif; }
                .cert-body { font-size: 16px; margin-bottom: 60px; text-indent: 50px; }
                .footer-sig { display: flex; justify-content: flex-end; margin-top: 80px; }
                .sig-box { text-align: center; font-family: sans-serif; font-size: 14px; width: 220px; }
                .sig-box strong { display: block; margin-top: 40px; border-top: 1px solid #64748b; padding-top: 8px; }
                .seal { width: 100px; height: 100px; border: 2px solid #1e3a8a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 10px; font-weight: bold; color: #1e3a8a; position: absolute; left: 60px; bottom: 60px; transform: rotate(-10deg); opacity: 0.8; }
              </style>
            </head>
            <body>
              <div class="border-container">
                <div class="header">
                  <h1>Best Engineering College</h1>
                  <p>Accredited by NAAC with 'A+' Grade | Affiliated to Anna University</p>
                  <p style="font-size: 10px; color: #64748b;">NH-48, Pennalur Village, Sriperumbudur, Kanchipuram - 602117</p>
                </div>

                <div class="date-ref">
                  <div>Ref No: BEC/CC/2026/${Math.floor(1000 + Math.random() * 9000)}</div>
                  <div>Date: ${todayStr}</div>
                </div>

                <div class="cert-title">COURSE COMPLETION CERTIFICATE</div>

                <div class="cert-body">
                  This is to certify that Mr./Ms. <strong>${student.name}</strong>, bearing Roll Number <strong>${student.roll}</strong>, has successfully completed the coursework for the Bachelor of Engineering (B.E.) degree in <strong>${student.dept}</strong> at this institution, covering all prescribed academic requirements of Anna University.
                </div>
                
                <div class="cert-body" style="text-indent: 0;">
                  His/Her conduct and character during the course of study have been consistently <strong>Good</strong>. We wish him/her success in all future endeavors.
                </div>

                <div class="seal">BEC COLLEGE<br/>OFFICIAL<br/>SEAL</div>

                <div class="footer-sig">
                  <div class="sig-box">
                    <div style="font-style: italic; font-size: 16px; font-family: sans-serif; color: #475569;">Dr. Rajesh Kumar</div>
                    <strong>Principal</strong>
                  </div>
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRequestCertificate = async (type) => {
    const certData = {
      studentName,
      rollNo: studentRoll,
      dept: studentDept,
      type: type === 'Bonafide Certificate' ? 'Bonafide' : 'Course Completion',
      purpose: 'Official verification and academic reference'
    };
    try {
      const saved = await createCertificateRequest(certData);
      if (saved) {
        const list = await getStudentCertificates(studentRoll);
        setCertificatesData(list);
        alert(`${type} request submitted successfully. It will be available for download once approved by the Admin.`);
      } else {
        alert('Failed to submit request.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting request.');
    }
  };

  // Support Ticket Submit
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketDesc) {
      alert('Please enter a description for your issue.');
      return;
    }
    const complaintData = {
      student: `${studentName} (${studentRoll})`,
      title: ticketDesc,
      category: ticketCat,
      priority: ticketPriority
    };
    try {
      const saved = await createStudentComplaint(complaintData);
      if (saved) {
        setSupportTickets(prev => [saved, ...prev]);
        setTicketDesc('');
        alert('Grievance ticket created successfully. Track status inside Support Center dashboard.');
      } else {
        alert('Failed to submit grievance. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  // Events & Clubs Register
  const handleJoinClub = (clubName) => {
    if (joinedClubs.includes(clubName)) {
      setJoinedClubs(prev => prev.filter(c => c !== clubName));
      alert(`Left ${clubName}.`);
      return;
    }
    setJoinedClubs(prev => [...prev, clubName]);
    alert(`Successfully registered for ${clubName}!`);
  };

  const handleRegisterEvent = (eventTitle) => {
    if (registeredEvents.includes(eventTitle)) {
      alert('Already registered for this event!');
      return;
    }
    setRegisteredEvents(prev => [...prev, eventTitle]);
    alert(`Registration confirmed for "${eventTitle}". Seat voucher sent to register email.`);
  };

  return (
    <div className="student-portal">
      {/* Header */}
      <header className="portal-header">
        <div className="header-left">
          <img src={clgLogo} alt="BEC Logo" className="header-logo" />
          <div className="header-title">
            <h2>Best Engineering College</h2>
            <p>Student Portal System</p>
          </div>
        </div>
        <div className="header-right">
          <div className="header-academic-year">
            <span className="year-label">Academic Year</span>
            <strong>2024-2025</strong>
          </div>
          
          {/* Notifications */}
          <div className="notification-icon" onClick={async () => {
            const willShow = !showNotifications;
            setShowNotifications(willShow);
            if (willShow && notificationsData.some(n => n.isNew)) {
              await markNotificationsRead(studentRoll);
              setNotificationsData(notificationsData.map(n => ({ ...n, isNew: false })));
            }
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="notification-badge">{notificationsData.filter(n => n.isNew).length > 0 ? notificationsData.filter(n => n.isNew).length : ''}</span>
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <button className="close-btn" onClick={(e) => { e.stopPropagation(); setShowNotifications(false); }}>x</button>
                </div>
                <div className="notification-list">
                  {notificationsData.length === 0 && <p style={{padding: '10px', fontSize: '14px', color: '#666'}}>No new notifications</p>}
                  {notificationsData.slice(0, 4).map((notif, idx) => (
                  <div key={idx} className={`notification-item ${notif.isNew ? 'new' : ''}`}>
                    <div className="notif-content">
                      <p>{notif.title}</p>
                      <small>{notif.time}</small>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>

          <button className="ap-btn danger sm" onClick={async () => { await logoutUser(); navigate('/student-login'); }} style={{ marginLeft: '20px', marginRight: '10px', height: '32px', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', padding: '0 12px', cursor: 'pointer', fontWeight: 600 }}>
            Sign Out
          </button>

          {/* Profile Menu */}
          <div className="profile-menu" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="profile-pic" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {studentData.profilePhoto ? (
                <img src={studentData.profilePhoto} alt={studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : initials}
            </div>
            <div className="profile-info">
              <strong>{studentName.split(' ')[0]}</strong>
              <span>{studentRoll}</span>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => { setActivePage('profile'); setShowProfileMenu(false); }}>
                  My Profile
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="portal-main">
        {/* Sidebar Navigation */}
        <aside className="portal-sidebar">
          <nav className="sidebar-nav">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'profile', label: 'My Profile' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'academics', label: 'Academics' },
              { id: 'timetable', label: 'Timetable' },
              { id: 'assignments', label: 'Assignments' },
              { id: 'exams', label: 'Exams & Results' },
              { id: 'fees', label: 'Fee Management' },
              { id: 'library', label: 'Library' },
              { id: 'notices', label: 'Notices & Board' },
              { id: 'placement', label: 'Placement Portal' },
              { id: 'leave', label: 'Leave Application' },
              { id: 'documents', label: 'Documents' },
              { id: 'events', label: 'Events & Clubs' },
              { id: 'transport', label: 'Transport & Hostel' },
              { id: 'support', label: 'Support Center' }
            ].map(item => (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Dynamic Sub-Page Content */}
        <main className="portal-content">
          
          {/* 1. Dashboard Sub-page */}
          {activePage === 'dashboard' && (
            <>
              <div className="welcome-section">
                <div className="welcome-content">
                  <h1>Welcome back, {studentName}</h1>
                  <div className="student-meta">
                    <span>Department of {studentDept === 'CSE' ? 'Computer Science' : studentDept} • Semester {studentSem} • {studentRoll}</span>
                  </div>
                </div>
                <div className="student-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {studentData.profilePhoto ? (
                    <img src={studentData.profilePhoto} alt={studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : initials}
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <h4>Attendance</h4>
                    <span className={`stat-badge ${overallAttendance >= 75 ? 'success' : 'danger'}`}>
                      {overallAttendance >= 75 ? 'Eligible' : 'Below 75%'}
                    </span>
                  </div>
                  <div className="stat-value">{overallAttendance}%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <h4>CGPA/GPA</h4>
                  </div>
                  <div className="stat-value">{cgpaVal}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <h4>Pending Fees</h4>
                    <span className={`stat-badge ${feeDue > 0 ? 'warning' : 'success'}`}>
                      {feeDue > 0 ? 'Due' : 'Paid'}
                    </span>
                  </div>
                  <div className="stat-value">₹{feeDue.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <h4>Pending Tasks</h4>
                    <span className={`stat-badge ${pendingAssignments > 0 ? 'warning' : 'success'}`}>
                      {pendingAssignments > 0 ? 'Action Required' : 'Done'}
                    </span>
                  </div>
                  <div className="stat-value">{pendingAssignments}</div>
                </div>
              </div>

              <div className="dashboard-grid" style={{ marginBottom: '20px' }}>
                <div className="dashboard-card" style={{ gridColumn: '1 / -1', height: '350px' }}>
                  <div className="card-header">
                    <h3>Academic Performance Trend</h3>
                  </div>
                  <div className="card-body" style={{ height: '280px' }}>
                    {chartsMounted && (
                    <ResponsiveContainer width="99%" height={250}>
                      <BarChart
                        data={[
                          { semester: 'Sem 1', gpa: 8.4 },
                          { semester: 'Sem 2', gpa: 8.8 },
                          { semester: 'Sem 3', gpa: resultsData?.sem3?.gpa || 0 },
                          { semester: 'Sem 4', gpa: resultsData?.sem4?.gpa || 0 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="semester" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Legend />
                        <Bar dataKey="gpa" fill="#2d4e7aff" name="GPA" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Today's Classes</h3>
                  </div>
                  <div className="card-body">
                    <div className="schedule-list">
                      {getTodayClasses().length > 0 ? (
                        getTodayClasses().map((cls, idx) => (
                          <div className="schedule-item" key={idx}>
                            <div className="schedule-time">{cls.time}</div>
                            <div className="schedule-details">
                              <h4>{cls.subject}</h4>
                              <p>{cls.instructor} • {cls.room}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="schedule-item">
                          <div className="schedule-details">
                            <h4>No Classes Today</h4>
                            <p>Enjoy your day off!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Pending Homework</h3>
                    <span className="card-count">{pendingAssignments}</span>
                  </div>
                  <div className="card-body">
                    <div className="assignment-list">
                      {assignmentsData.filter(a => a.status === 'pending').map((a, idx) => (
                        <div key={idx} className="assignment-item">
                          <div className="assignment-details">
                            <h4>{a.title}</h4>
                            <p>{a.subject}</p>
                            <span className="assignment-due">Due: {a.due}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Recent Announcements</h3>
                  </div>
                  <div className="card-body">
                    <div className="announcement-list">
                      {noticesData.length > 0 ? (
                        noticesData.slice(0, 3).map((notice, idx) => (
                          <div className="announcement-item" key={idx}>
                            <h4>{notice.title}</h4>
                            <p>{notice.content}</p>
                            <small>{notice.date} &bull; {notice.category}</small>
                          </div>
                        ))
                      ) : (
                        <p style={{ padding: '15px', color: '#64748b' }}>No recent announcements.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Upcoming Exams</h3>
                  </div>
                  <div className="card-body">
                    <div className="exam-list">
                      {examSchedules.length > 0 ? (
                        examSchedules.map((exam, idx) => {
                          const dateObj = new Date(exam.examDate);
                          const day = dateObj.getDate();
                          const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                          return (
                            <div className="exam-item" key={idx}>
                              <div className="exam-date">
                                <div className="exam-day">{day}</div>
                                <div className="exam-month">{month}</div>
                              </div>
                              <div className="exam-details">
                                <h4>{exam.subjectName} ({exam.subjectCode})</h4>
                                <p>{exam.session.split('(')[0].trim()} &bull; Hall: {exam.hallNo}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="exam-item">
                          <div className="exam-details">
                            <h4>No Upcoming Exams</h4>
                            <p>No schedules released for your semester yet.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. My Profile Sub-page */}
          {activePage === 'profile' && (
            <div className="page-content">
              <h2 className="page-title">Personal Profile</h2>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar-large" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {studentData.profilePhoto ? (
                      <img src={studentData.profilePhoto} alt={studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : initials}
                  </div>
                  <div className="profile-basic">
                    <h3>{studentName}</h3>
                    <p>{studentRoll}</p>
                    <span className="dept-badge">{studentDept} Dept • Semester {studentSem}</span>
                    <div style={{ marginTop: '12px' }}>
                      <label htmlFor="student-photo-upload" style={{
                        padding: '6px 12px',
                        background: '#1e3a5f',
                        color: '#fff',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        Change Profile Photo
                      </label>
                      <input 
                        id="student-photo-upload" 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const base64Photo = reader.result;
                            const res = await uploadStudentPhoto(studentRoll, base64Photo);
                            if (res && res.success) {
                              setStudentData(prev => ({ ...prev, profilePhoto: base64Photo }));
                              alert('Profile photo updated successfully!');
                            } else {
                              alert('Failed to update profile photo.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Academic &amp; Student Info</h3>
                <div className="info-grid" style={{ marginBottom: '30px' }}>
                  <div className="info-field"><label>Student ID</label><p>{studentRoll}</p></div>
                  <div className="info-field"><label>Department</label><p>{studentDept === 'CSE' ? 'Computer Science & Engineering' : studentDept}</p></div>
                  <div className="info-field"><label>Course Details</label><p>B.E. {studentDept}</p></div>
                  <div className="info-field"><label>Semester</label><p>Semester {studentSem}</p></div>
                  <div className="info-field"><label>Academic Advisor</label><p>{advisorName}</p></div>
                  <div className="info-field"><label>Official Email</label><p>{studentEmail}</p></div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Contact Information</h3>
                <div className="info-grid" style={{ marginBottom: '30px' }}>
                  <div className="info-field"><label>Personal Mobile</label><p>{studentData.phone || ''}</p></div>
                  <div className="info-field"><label>Emergency Contact</label><p>{studentData.parentPhone || ''}</p></div>
                  <div className="info-field"><label>Residential Address</label><p>{studentData.address || ''}</p></div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Parent/Guardian Details</h3>
                <div className="info-grid">
                  <div className="info-field"><label>Guardian Name</label><p>{studentData.parentName || ''}</p></div>
                  <div className="info-field"><label>Relation</label><p>Father</p></div>
                  <div className="info-field"><label>Guardian Contact</label><p>{studentData.parentPhone || ''}</p></div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Attendance Sub-page */}
          {activePage === 'attendance' && (
            <div className="page-content">
              <h2 className="page-title">Attendance &amp; Leave Metrics</h2>
              
              <div className="attendance-summary">
                <div className="summary-card">
                  <p>Overall Attendance Rate</p>
                  <h2>{overallAttendance}%</h2>
                </div>
                <div className="summary-card">
                  <p>Min. Mandate Percentage</p>
                  <h2 style={{ color: '#0f172a' }}>75%</h2>
                </div>
                <div className="summary-card">
                  <p>Leaves Availed</p>
                  <h2 style={{ color: '#854d0e' }}>3 Days</h2>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Subject-wise Details</h3>
              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Subject Title</div>
                  <div className="cell">Total Lectures</div>
                  <div className="cell">Lectures Present</div>
                  <div className="cell">Lectures Absent</div>
                  <div className="cell">Percentage</div>
                </div>
                {attendanceData && attendanceData.subjects ? (
                  attendanceData.subjects.map((subj, idx) => {
                    const pct = Math.round((subj.present / subj.total) * 100);
                    return (
                      <div className="table-row" key={idx}>
                        <div className="cell"><strong>{subj.name}</strong></div>
                        <div className="cell">{subj.total}</div>
                        <div className="cell text-success">{subj.present}</div>
                        <div className="cell text-danger">{subj.absent}</div>
                        <div className="cell"><strong className={pct >= 75 ? 'text-success' : 'text-danger'}>{pct}%</strong></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="table-row"><div className="cell">No subject metrics loaded.</div></div>
                )}
              </div>
            </div>
          )}

          {/* 4. Academics Sub-page */}
          {activePage === 'academics' && (
            <div className="page-content">
              <h2 className="page-title">Academics &amp; Study Resources</h2>
              
              <h3 style={{ fontSize: '16.5px', fontWeight: '700', marginBottom: '15px' }}>Enrolled Curriculum</h3>
              <div className="data-table" style={{ marginBottom: '30px' }}>
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Course Code</div>
                  <div className="cell">Course Name</div>
                  <div className="cell">Faculty Instructor</div>
                  <div className="cell">Syllabus Details</div>
                </div>
                {getStudentSubjects().length > 0 ? (
                  getStudentSubjects().map(course => (
                    <div className="table-row" key={course.code}>
                      <div className="cell"><strong>{course.code}</strong></div>
                      <div className="cell">{course.name}</div>
                      <div className="cell">{course.faculty || advisorName}</div>
                      <div className="cell">
                        <button className="material-link" style={{ padding: '6px 12px' }} onClick={() => setActiveSyllabus(course.name)}>
                          View Syllabus
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="table-row"><div className="cell">No curriculum subjects found in database for your semester.</div></div>
                )}
              </div>

              {/* Syllabus Modal */}
              {activeSyllabus && (
                <div className="company-modal-overlay" onClick={() => setActiveSyllabus(null)}>
                  <div className="company-modal-content" onClick={e => e.stopPropagation()}>
                    <button className="company-modal-close" onClick={() => setActiveSyllabus(null)}>×</button>
                    <div className="company-modal-header">
                      <h3>{activeSyllabus} Syllabus</h3>
                    </div>
                    <div className="company-modal-body">
                      <div className="academics-syllabus-list">
                        {getSyllabusModules(activeSyllabus).map((module, i) => (
                          <div className="syllabus-module" key={i}>
                            <h5>{module.split(' - ')[0]}</h5>
                            <p>{module.split(' - ')[1] || 'Detailed modules cover technical concepts, design, and practical exercises.'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '16.5px', fontWeight: '700', marginBottom: '15px' }}>Study Materials &amp; Lecture Notes</h3>
              <div className="data-table" style={{ marginBottom: '30px' }}>
                {getStudentSubjects().length > 0 ? (
                  getStudentSubjects().map((subj, idx) => (
                    <div className="table-row" key={idx}>
                      <div className="cell"><strong>{subj.name}</strong></div>
                      <div className="cell">{subj.name} Complete Lecture Notes.pdf</div>
                      <div className="cell">File Size: 2.8 MB</div>
                      <div className="cell">
                        <button className="material-link" onClick={() => alert(`Downloading ${subj.name} Study Materials...`)}>
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="table-row"><div className="cell">No materials loaded.</div></div>
                )}
              </div>

              <h3 style={{ fontSize: '16.5px', fontWeight: '700', marginBottom: '15px' }}>Academic Calendar</h3>
              <div className="info-field">
                <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '14px', lineHeight: '1.8' }}>
                  <li><strong>June 15, 2025</strong>: Commencement of Internal Assessment Test 2</li>
                  <li><strong>June 30, 2025</strong>: Last working day for theoretical modules</li>
                  <li><strong>July 02, 2025</strong>: Practical Lab Examinations commence</li>
                  <li><strong>July 15, 2025</strong>: End Semester Theory Exams commence</li>
                </ul>
              </div>
            </div>
          )}

          {/* 5. Timetable Sub-page */}
          {activePage === 'timetable' && (
            <div className="page-content">
              <h2 className="page-title">Weekly Lecture &amp; Lab Schedule</h2>
              <div className="timetable-container" style={{ marginBottom: '30px' }}>
                <div className="timetable-header">
                  <div className="time-cell">Day</div>
                  <div className="time-cell">09-10 AM</div>
                  <div className="time-cell">10-11 AM</div>
                  <div className="time-cell">11-12 PM</div>
                  <div className="time-cell">12-02 PM</div>
                  <div className="time-cell">02-03 PM</div>
                  <div className="time-cell">03-04 PM</div>
                  <div className="time-cell">04-05 PM</div>
                </div>
                {timetableData && timetableData.map((daySchedule, idx) => (
                  <div key={idx} className="timetable-row">
                    <div className="time-cell day-cell"><strong>{daySchedule.day}</strong></div>
                    {daySchedule.slots.map((slot, i) => (
                      <div key={i} className={`time-cell ${slot === 'Lunch' ? 'lunch-cell' : slot === '—' ? 'break-cell' : 'class-cell'}`}>
                        {slot}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Lab Schedules &amp; Instructors</h3>
              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Laboratory Title</div>
                  <div className="cell">Scheduled Hours</div>
                  <div className="cell">Lab Venue</div>
                  <div className="cell">Assigned Faculty</div>
                </div>
                {getStudentSubjects().filter(s => s.code.endsWith('L') || s.name.toLowerCase().includes('lab')).length > 0 ? (
                  getStudentSubjects().filter(s => s.code.endsWith('L') || s.name.toLowerCase().includes('lab')).map((lab, idx) => {
                    let dayTime = "Refer to timetable";
                    if (timetableData) {
                      const matchingDay = timetableData.find(d => d.slots.includes(lab.code) || d.slots.some(slot => slot.startsWith(lab.code)));
                      if (matchingDay) {
                        dayTime = `${matchingDay.day} Afternoon (02:00 - 05:00 PM)`;
                      }
                    }
                    return (
                      <div className="table-row" key={idx}>
                        <div className="cell"><strong>{lab.name}</strong></div>
                        <div className="cell">{dayTime}</div>
                        <div className="cell">{lab.name.toLowerCase().includes('network') ? 'Networks Lab I' : 'Systems Lab II'}</div>
                        <div className="cell">{lab.faculty || advisorName}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="table-row">
                    <div className="cell"><strong>No Laboratory Courses</strong></div>
                    <div className="cell">N/A</div>
                    <div className="cell">N/A</div>
                    <div className="cell">N/A</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. Assignments & Homework Sub-page */}
          {activePage === 'assignments' && (
            <div className="page-content">
              <h2 className="page-title">Assignments Board</h2>
              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Assignment Title</div>
                  <div className="cell">Subject</div>
                  <div className="cell">Assigned By</div>
                  <div className="cell">Due Date</div>
                  <div className="cell">Submission Status</div>
                  <div className="cell">Submit Action</div>
                </div>
                {assignmentsData.map((assignment, idx) => (
                  <div key={idx} className="table-row">
                    <div className="cell"><strong>{assignment.title}</strong></div>
                    <div className="cell">{assignment.subject}</div>
                    <div className="cell">{assignment.faculty}</div>
                    <div className="cell">{assignment.due}</div>
                    <div className="cell">
                      <span className={`status-badge ${assignment.status}`}>{assignment.status}</span>
                    </div>
                    <div className="cell">
                      {assignment.status === 'pending' ? (
                        <button className="material-link" onClick={() => setUploadId(assignment.id)}>
                          Upload
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: '700' }}>Completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Assignment Modal */}
              {uploadId && (
                <div className="company-modal-overlay" onClick={() => setUploadId(null)}>
                  <div className="company-modal-content" onClick={e => e.stopPropagation()}>
                    <button className="company-modal-close" onClick={() => setUploadId(null)}>×</button>
                    <div className="company-modal-header">
                      <h3>Upload Assignment Solution</h3>
                    </div>
                    <form className="company-modal-body" onSubmit={handleUploadSubmit}>
                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label>Select File (.pdf, .zip, .java)</label>
                        <input
                          type="file"
                          className="form-input"
                          required
                          onChange={handleFileChange}
                        />
                      </div>
                      <button type="submit" className="submit-btn">Submit Code</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. Exams & Results Sub-page */}
          {activePage === 'exams' && (
            <div className="page-content">
              <h2 className="page-title">Exams &amp; Performance Sheets</h2>
              
              <h3 style={{ fontSize: '16.5px', fontWeight: '700', marginBottom: '15px' }}>Terminal Semesters GPA Roster</h3>
              
              {resultsData && Object.keys(resultsData).length > 0 && (
                <div className="dashboard-card" style={{ marginBottom: '20px', padding: '20px' }}>
                  <h4 style={{ color: '#1e3a8a', fontSize: '15px', fontWeight: '700', marginBottom: '15px' }}>GPA Progression Analytics</h4>
                  <div style={{ height: '250px', width: '100%' }}>
                    {chartsMounted && (
                    <ResponsiveContainer width="99%" height={250}>
                      <BarChart data={Object.keys(resultsData).map(sem => ({
                        name: `Sem ${sem.replace('sem', '')}`,
                        gpa: parseFloat(resultsData[sem].gpa) || 0
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="gpa" fill="#1e3a8a" name="GPA" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    )}
                  </div>
                </div>
              )}
              {resultsData && Object.keys(resultsData).map((sem, idx) => (
                <div key={idx} className="result-section">
                  <h4 style={{ color: '#1e3a8a', fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>
                    Semester {sem.replace('sem', '')} Roster — GPA: {resultsData[sem].gpa} ({resultsData[sem].result})
                  </h4>
                  <div className="data-table" style={{ marginBottom: '20px' }}>
                    <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                      <div className="cell">Subject Title</div>
                      <div className="cell">Credits Allocation</div>
                      <div className="cell">Grade Secured</div>
                      <div className="cell">Grade Points</div>
                    </div>
                    {resultsData[sem].subjects.map((subj, i) => (
                      <div key={i} className="table-row">
                        <div className="cell"><strong>{subj.name}</strong></div>
                        <div className="cell">{subj.credits}</div>
                        <div className="cell"><strong>{subj.grade}</strong></div>
                        <div className="cell">{subj.points}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="form-grid">
                {/* CGPA Calculator */}
                <div className="place-section" style={{ margin: '0', flex: '1' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>CGPA Calculator</h3>
                  <form onSubmit={handleCgpaSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Semester 1 GPA</label>
                        <input type="number" step="0.01" min="0" max="10" className="form-input" value={calcGrades.sem1} onChange={e => setCalcGrades({...calcGrades, sem1: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Semester 2 GPA</label>
                        <input type="number" step="0.01" min="0" max="10" className="form-input" value={calcGrades.sem2} onChange={e => setCalcGrades({...calcGrades, sem2: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Semester 3 GPA</label>
                        <input type="number" step="0.01" min="0" max="10" className="form-input" value={calcGrades.sem3} onChange={e => setCalcGrades({...calcGrades, sem3: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Semester 4 GPA</label>
                        <input type="number" step="0.01" min="0" max="10" className="form-input" value={calcGrades.sem4} onChange={e => setCalcGrades({...calcGrades, sem4: e.target.value})} required />
                      </div>
                    </div>
                    <button type="submit" className="calc-btn" style={{ marginTop: '10px' }}>Calculate Average</button>
                  </form>
                  {calculatedCgpa && (
                    <div style={{ marginTop: '20px', fontSize: '16px', fontWeight: '700', color: '#1e3a8a' }}>
                      Resulting CGPA: {calculatedCgpa}
                    </div>
                  )}
                </div>

                {/* Exam Registration & Hall Tickets */}
                <div className="place-section" style={{ margin: '0', flex: '1' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Exam Resources</h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.6' }}>
                    Semester theory exams schedules have been released. Registered candidates can download their hall tickets verified by academic offices.
                  </p>
                  <button className="submit-btn" style={{ background: '#1e3a8a', width: '100%', marginTop: '10px' }} onClick={() => handleRequestDoc('Hall Ticket')}>
                    Download Hall Ticket (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 8. Fee Management Sub-page */}
          {activePage === 'fees' && (
            <div className="page-content">
              <h2 className="page-title">Fee Management &amp; Invoices</h2>
              
              <div className="fee-overview">
                <div className="summary-card">
                  <p>Semester Fee Total</p>
                  <h2>₹{feesData ? feesData.total.toLocaleString() : '57,500'}</h2>
                </div>
                <div className="summary-card">
                  <p>Paid Amount</p>
                  <h2 className="text-success">₹{feesData ? feesData.paid.toLocaleString() : '45,000'}</h2>
                </div>
                <div className="summary-card">
                  <p>Current Balance Due</p>
                  <h2 className="text-danger">₹{feesData ? feesData.due.toLocaleString() : '12,500'}</h2>
                </div>
              </div>

              {feesData && feesData.due > 0 && (
                <div className="place-section" style={{ margin: '0 0 30px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#991b1b' }}>Online Tuition Fee Payment</h3>
                  <form className="form-grid" style={{ alignItems: 'flex-end' }} onSubmit={handleFeePaymentSubmit}>
                    <div className="form-group">
                      <label>Enter Payment Amount (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        max={feesData.due}
                        min="1"
                        required
                        value={payAmount}
                        onChange={e => setPayAmount(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="submit-btn">Pay Balance</button>
                  </form>
                  {paymentSuccess && (
                    <div style={{ color: '#0f5132', background: '#d1e7dd', padding: '12px 20px', borderRadius: '8px', fontSize: '13.5px', marginTop: '15px', fontWeight: '600' }}>
                      Payment successful! Tuition balance due has been updated.
                    </div>
                  )}
                </div>
              )}

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Transaction Logs &amp; Receipts</h3>
              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Invoice Receipt ID</div>
                  <div className="cell">Description</div>
                  <div className="cell">Transaction Value</div>
                  <div className="cell">Payment Date</div>
                  <div className="cell">Verification Status</div>
                  <div className="cell">Action</div>
                </div>
                {feesData && feesData.history ? (
                  feesData.history.map((pay, idx) => (
                    <div className="table-row" key={idx}>
                      <div className="cell"><strong>{pay.receipt}</strong></div>
                      <div className="cell">{pay.description}</div>
                      <div className="cell">₹{pay.amount.toLocaleString()}</div>
                      <div className="cell">{pay.date}</div>
                      <div className="cell">
                        <span className={`status-badge ${pay.status.toLowerCase()}`}>{pay.status}</span>
                      </div>
                      <div className="cell">
                        <button className="material-link" style={{ padding: '6px 12px' }} onClick={() => alert(`Initiating receipt download for ${pay.receipt}...`)}>
                          Receipt
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="table-row"><div className="cell">No billing logs found.</div></div>
                )}
              </div>
            </div>
          )}

          {/* 9. Library Sub-page */}
          {activePage === 'library' && (
            <div className="page-content">
              <h2 className="page-title">Library Information System</h2>
              
              <div className="fee-overview" style={{ marginBottom: '30px' }}>
                <div className="summary-card">
                  <p>Books Currently Issued</p>
                  <h2>{getIssuedBooks().length} Books</h2>
                </div>
                <div className="summary-card">
                  <p>Pending Library Fines</p>
                  <h2 className="text-danger">₹{libraryFines}</h2>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Issued Book Details</h3>
              <div className="issued-books-list" style={{ marginBottom: '40px' }}>
                {getIssuedBooks().map((book, idx) => (
                  <div className="library-book-card" key={idx}>
                    <div className="book-details">
                      <h5>{book.title}</h5>
                      <p>Author: {book.author} • Call No: {book.bookId}</p>
                    </div>
                    <div className="book-dates">
                      <span style={{ color: '#0d6efd' }}>Issued: {book.issued}</span>
                      <span style={{ color: '#dc3545' }}>Due: {book.due}</span>
                    </div>
                  </div>
                ))}
                {getIssuedBooks().length === 0 && (
                  <p style={{ color: '#64748b' }}>No books currently issued.</p>
                )}
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Book Catalog Search</h3>
              <div className="place-directory-controls" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  className="place-search-input"
                  placeholder="Enter book title or author name to search..."
                  value={searchBook}
                  onChange={e => setSearchBook(e.target.value)}
                />
              </div>

              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Book Title</div>
                  <div className="cell">Author Name</div>
                  <div className="cell">Available Copies</div>
                  <div className="cell">Action</div>
                </div>
                {booksData.filter(b => b.title.toLowerCase().includes(searchBook.toLowerCase())).map((book, idx) => (
                  <div className="table-row" key={idx}>
                    <div className="cell"><strong>{book.title}</strong></div>
                    <div className="cell">{book.author}</div>
                    <div className="cell">{book.copies} Copies</div>
                    <div className="cell">
                      <button className="book-reserve-btn" onClick={() => handleReserveBook(book.title)}>
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. Notices & Announcements Sub-page */}
          {activePage === 'notices' && (
            <div className="page-content">
              <h2 className="page-title">Notices &amp; Announcements Board</h2>
              <div className="announcement-list">
                {noticesData.length > 0 ? (
                  noticesData.map((notice, idx) => (
                    <div className="announcement-item" style={{ padding: '20px 0' }} key={idx}>
                      <span className={`stat-badge ${notice.category === 'Exam' ? 'success' : notice.category === 'Holiday' ? 'warning' : 'danger'}`} style={{ marginBottom: '8px' }}>
                        {notice.category}
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{notice.title}</h4>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '6px' }}>
                        {notice.content}
                      </p>
                      <small>Posted on {notice.date}</small>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: '15px', color: '#64748b' }}>No recent announcements.</p>
                )}
              </div>
            </div>
          )}

          {/* 11. Placement Portal Sub-page */}
          {activePage === 'placement' && (
            <div className="page-content">
              <h2 className="page-title">Placement Portal (Student Section)</h2>
              
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Active Campus Placement Drives</h3>
              <div style={{ marginBottom: '40px' }}>
                {placementDrives.map(drive => (
                  <div className="placement-job-card" key={drive.id}>
                    <div>
                      <h4>{drive.company}</h4>
                      <div className="comp-meta">Role: {drive.role} • Average Salary: {drive.package}</div>
                      <div className="comp-meta" style={{ marginTop: '4px', color: '#1e3a8a' }}>Drive Date: {drive.date}</div>
                    </div>
                    <div>
                      <button
                        className="submit-btn"
                        style={{ background: appliedJobs.includes(drive.id) ? '#64748b' : '#1e3a8a' }}
                        disabled={appliedJobs.includes(drive.id)}
                        onClick={() => handleApplyJob(drive.id)}
                      >
                        {appliedJobs.includes(drive.id) ? 'Applied' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Application Status Tracking</h3>
              {appliedJobs.length > 0 ? (
                <div className="place-section" style={{ margin: '0' }}>
                  {appliedJobs.map(driveId => {
                    const drive = placementDrives.find(d => d.id === driveId);
                    return (
                      <div key={driveId} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700' }}>{drive?.company} — {drive?.role}</h4>
                        <div className="track-status-line">
                          <span className="completed">Registration</span>
                          <span className="active">Aptitude Test</span>
                          <span>Interview Panel</span>
                          <span>HR Round</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="info-field"><p>No job applications submitted yet.</p></div>
              )}
            </div>
          )}

          {/* 12. Leave Application Sub-page */}
          {activePage === 'leave' && (
            <div className="page-content">
              <h2 className="page-title">Leave Request Portal</h2>
              
              <div className="place-section" style={{ margin: '0 0 30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>New Leave Request</h3>
                <form className="form-grid" onSubmit={handleLeaveSubmit}>
                  <div className="form-group">
                    <label>Leave Category</label>
                    <select className="form-select" value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                      <option>Medical Leave</option>
                      <option>Personal Leave</option>
                      <option>On-Duty (OD) Leave</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date From</label>
                    <input type="date" className="form-input" required value={leaveFrom} onChange={e => setLeaveFrom(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Date To</label>
                    <input type="date" className="form-input" required value={leaveTo} onChange={e => setLeaveTo(e.target.value)} />
                  </div>
                  <div className="form-group full-width">
                    <label>Reason / Explanation</label>
                    <textarea className="form-textarea" rows="3" required value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="State the reason for requesting leave..."></textarea>
                  </div>
                  <button type="submit" className="submit-btn">File Request</button>
                </form>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Leave Application History</h3>
              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Leave ID</div>
                  <div className="cell">Leave Category</div>
                  <div className="cell">Duration</div>
                  <div className="cell">Reason</div>
                  <div className="cell">Verification Status</div>
                </div>
                {leavesHistory.map((leave, idx) => (
                  <div className="table-row" key={idx}>
                    <div className="cell"><strong>LEAVE-{leave.id || leave._id?.slice(-4)}</strong></div>
                    <div className="cell">{leave.type}</div>
                    <div className="cell">{leave.from} to {leave.to}</div>
                    <div className="cell">{leave.reason}</div>
                    <div className="cell">
                      <span className={`status-badge ${leave.status.toLowerCase()}`}>{leave.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 13. Documents Center Sub-page */}
          {activePage === 'documents' && (
            <div className="page-content">
              <h2 className="page-title">Student Documents Center</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Request and download verified academic certificates, hall tickets, mark sheets, and student credentials.
              </p>

              <div className="tc-bonafide-grid">
                {[
                  { name: 'Bonafide Certificate', type: 'Bonafide', desc: 'Required for bank loans, passport applications, and address proof verification.' },
                  { name: 'Course Completion Certificate', type: 'Course Completion', desc: 'Official certificate confirming course completion and duration.' },
                  { name: 'Semester Grade Sheet (Sem 4)', type: 'GradeSheet', desc: 'Official transcript representing academic marks secured in Semester 4.' },
                  { name: 'Exam Hall Ticket (IA 2)', type: 'HallTicket', desc: 'Admission voucher verified for the upcoming Internal Assessment Test 2.' },
                  { name: 'College Smart ID Card', type: 'IDCard', desc: 'Digital copy of candidate identification card verified by registry offices.' }
                ].map((doc, idx) => {
                  const req = certificatesData.find(c => c.type === doc.type);
                  let buttonText = 'Generate Certificate';
                  let buttonAction = () => handleRequestDoc(doc.name);
                  let isDisabled = false;

                  if (doc.type === 'Bonafide' || doc.type === 'Course Completion') {
                    if (!req) {
                      buttonText = 'Request Certificate';
                      buttonAction = () => handleRequestCertificate(doc.name);
                    } else if (req.status === 'Pending') {
                      buttonText = 'Pending Admin Approval';
                      isDisabled = true;
                    } else if (req.status === 'Approved') {
                      buttonText = 'Print Approved Copy';
                      buttonAction = () => handleRequestDoc(doc.name);
                    } else if (req.status === 'Rejected') {
                      buttonText = 'Rejected - Request Again';
                      buttonAction = () => handleRequestCertificate(doc.name);
                    }
                  } else {
                    // Grade Sheet / Hall Ticket / ID Card can be printed directly
                    buttonText = 'Download Verified Copy';
                  }

                  return (
                    <div className="doc-card" key={idx}>
                      <h4>{doc.name}</h4>
                      <p>{doc.desc}</p>
                      <button 
                        className="submit-btn" 
                        style={{ width: '100%', background: isDisabled ? '#64748b' : '#1e3a8a' }} 
                        onClick={buttonAction}
                        disabled={isDisabled}
                      >
                        {buttonText}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 14. Events & Clubs Sub-page */}
          {activePage === 'events' && (
            <div className="page-content">
              <h2 className="page-title">Clubs &amp; Technical Events</h2>
              
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Institutional Technical Clubs</h3>
              <div className="club-card-grid" style={{ marginBottom: '40px' }}>
                {[
                  { name: 'BEC Coding Club', desc: 'Promotes competitive coding practices, DSA seminars, and mock hackathon events.' },
                  { name: 'Web Development Cell', desc: 'Focuses on frontend engineering, backend integrations, and modern JS framework classes.' },
                  { name: 'Robotics & Automation Hub', desc: 'Hands-on training in microcontrollers, IoT devices, and sensor integrations.' }
                ].map(club => (
                  <div className="club-card" key={club.name}>
                    <h4>{club.name}</h4>
                    <p>{club.desc}</p>
                    <button
                      className="submit-btn"
                      style={{ background: joinedClubs.includes(club.name) ? '#dc2626' : '#1e3a8a', width: '100%' }}
                      onClick={() => handleJoinClub(club.name)}
                    >
                      {joinedClubs.includes(club.name) ? 'Leave Club' : 'Register Member'}
                    </button>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Upcoming Seminars &amp; Workshops</h3>
              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Workshop Title</div>
                  <div className="cell">Department Partner</div>
                  <div className="cell">Scheduled Date</div>
                  <div className="cell">Registration Action</div>
                </div>
                {[
                  { title: 'Generative AI Workshop', dept: 'CSE & AI-DS', date: 'June 18, 2025' },
                  { title: 'PCB Design Hands-on', dept: 'ECE / EEE', date: 'June 22, 2025' }
                ].map(event => (
                  <div className="table-row" key={event.title}>
                    <div className="cell"><strong>{event.title}</strong></div>
                    <div className="cell">{event.dept}</div>
                    <div className="cell">{event.date}</div>
                    <div className="cell">
                      <button
                        className="material-link"
                        style={{ padding: '6px 12px', background: registeredEvents.includes(event.title) ? '#64748b' : '#1e3a8a' }}
                        disabled={registeredEvents.includes(event.title)}
                        onClick={() => handleRegisterEvent(event.title)}
                      >
                        {registeredEvents.includes(event.title) ? 'Registered' : 'Book Seat'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 15. Transport & Hostel Sub-page */}
          {activePage === 'transport' && (
            <div className="page-content">
              <h2 className="page-title">Transport &amp; Hostel Facilities</h2>
              
              <div className="transport-grid" style={{ marginBottom: '40px' }}>
                <div className="place-section" style={{ margin: '0', flex: '1' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>College Bus Routes</h3>
                  {transportRoutes.length > 0 ? (
                    transportRoutes.map((route, idx) => (
                      <div className="transport-card" style={{ marginBottom: '15px' }} key={idx}>
                        <h4>Bus No: {route.busNo} &mdash; {route.route}</h4>
                        <p><strong>Route Area:</strong> {route.area}</p>
                        <p><strong>Intermediate stops count:</strong> {route.stops} Stops</p>
                        <p><strong>Driver:</strong> {route.driver} ({route.contact}) &bull; Status: {route.status}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#64748b' }}>No bus routes found in the database.</p>
                  )}
                </div>

                <div className="place-section" style={{ margin: '0', flex: '1' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Hostel Accommodations</h3>
                  {hostelAllocation ? (
                    <>
                      <div className="info-field" style={{ marginBottom: '15px' }}>
                        <label>Block Allocation</label>
                        <p>{hostelAllocation.block}</p>
                      </div>
                      <div className="info-field" style={{ marginBottom: '15px' }}>
                        <label>Room Number</label>
                        <p>Room {hostelAllocation.room}</p>
                      </div>
                      <div className="info-field">
                        <label>Hostel Fee Status</label>
                        <p style={{ color: '#0f5132', fontWeight: '700' }}>Paid (Allocated on {hostelAllocation.date})</p>
                      </div>
                    </>
                  ) : (
                    <div className="info-field">
                      <label>Allocation Status</label>
                      <p style={{ color: '#991b1b', fontWeight: '700' }}>Not Allocated / Dayscholar</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 16. Support Center Sub-page */}
          {activePage === 'support' && (
            <div className="page-content">
              <h2 className="page-title">Support &amp; Grievance Portal</h2>
              
              <div className="place-section" style={{ margin: '0 0 30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Submit Grievance / Tech Ticket</h3>
                <form className="form-grid" onSubmit={handleTicketSubmit}>
                  <div className="form-group">
                    <label>Grievance Category</label>
                    <select className="form-select" value={ticketCat} onChange={e => setTicketCat(e.target.value)}>
                      <option>Academic Issues</option>
                      <option>Hostel Facilities</option>
                      <option>Transport System</option>
                      <option>Technical Portal Issues</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Severity Priority</label>
                    <select className="form-select" value={ticketPriority} onChange={e => setTicketPriority(e.target.value)}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Describe the Grievance</label>
                    <textarea className="form-textarea" rows="3" required value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} placeholder="Provide detailed explanation of your issue..."></textarea>
                  </div>
                  <button type="submit" className="submit-btn">File Ticket</button>
                </form>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Ticket Status Roster</h3>
              <div className="data-table">
                <div className="table-row" style={{ background: '#f8fafc', fontWeight: '700', borderBottom: '2px solid #cbd5e1' }}>
                  <div className="cell">Ticket ID</div>
                  <div className="cell">Category</div>
                  <div className="cell">Issue Description</div>
                  <div className="cell">Priority</div>
                  <div className="cell">Status</div>
                </div>
                {supportTickets.map((t, idx) => (
                  <div className="table-row" key={idx}>
                    <div className="cell"><strong>{t.ticketId || t.id}</strong></div>
                    <div className="cell">{t.category}</div>
                    <div className="cell">{t.title || t.desc}</div>
                    <div className="cell">{t.priority}</div>
                    <div className="cell">
                      <span className={`status-badge ${t.status === 'Open' ? 'warning' : 'success'}`}>{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default StudentPortalPage;
