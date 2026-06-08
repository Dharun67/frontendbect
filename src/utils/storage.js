// Live API utility for BEC Portal System — MongoDB Session-based Auth
// All authentication is handled via server-side sessions stored in MongoDB.
// No localStorage is used. The browser sends the session cookie automatically
// on every request via `credentials: 'include'`.

const isProduction = process.env.NODE_ENV === "production";
const backendUrl = process.env.REACT_APP_API_URL || (isProduction ? "https://backendbect.onrender.com" : "http://localhost:5000");

const API_BASE = `${backendUrl}/api/portal`;

// ==========================================
// AUTHENTICATED FETCH HELPER
// ==========================================
// credentials: 'include' tells the browser to send the session cookie
// automatically with every request. This replaces the old JWT Authorization header.
const authenticatedFetch = async (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",  // Send session cookie automatically
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

// ==========================================
// AUTHENTICATION — SESSION BASED
// ==========================================

/**
 * Login: sends credentials to the backend which creates a MongoDB session.
 * On success, the browser receives a session cookie (no localStorage needed).
 */
export const verifyLogin = async (type, id, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",  // Required to receive the session cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, password }),
    });
    return await res.json();
  } catch (error) {
    console.error("Login request failed", error);
    return { success: false, message: "Server connection failed" };
  }
};

/**
 * Get current session user from MongoDB.
 * Call this on app load to check if the user is still logged in.
 * Returns { success: true, type, user } if session is active, or { success: false } if not.
 */
export const getSessionUser = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/auth/me`);
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

/**
 * Logout: destroys the session in MongoDB and clears the browser cookie.
 */
export const logoutUser = async () => {
  try {
    await authenticatedFetch(`${API_BASE}/auth/logout`, { method: "POST" });
  } catch (error) {
    console.error("Logout failed", error);
  }
};

/**
 * Store user session info in sessionStorage for quick access
 * The actual session is managed server-side via cookies
 */
export const setLoggedInUser = (type, user) => {
  if (user) {
    sessionStorage.setItem('userType', type);
    sessionStorage.setItem('userData', JSON.stringify(user));
  }
};

export const getLoggedInUser = () => {
  const type = sessionStorage.getItem('userType');
  const userData = sessionStorage.getItem('userData');
  if (type && userData) {
    return { type, user: JSON.parse(userData) };
  }
  return null;
};

export const logout = async () => {
  await logoutUser();
  sessionStorage.clear();
};

/**
 * Wake up the backend server on app load.
 */
export const initializeDefaultData = async () => {
  try {
    const healthUrl = `${backendUrl}/health`;
    await authenticatedFetch(healthUrl, { credentials: "include" });
  } catch (error) {
    console.warn("Backend server not reachable. Ensure server.js is running.");
  }
};

// ==========================================
// STUDENT SERVICES
// ==========================================
export const getAttendance = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/attendance/${rollNo}`);
    return await res.json();
  } catch (error) {
    return { rollNo, overall: 0, subjects: [] };
  }
};

export const getMarks = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/marks/${rollNo}`);
    return await res.json();
  } catch (error) {
    return { rollNo, subjects: [] };
  }
};

export const getFees = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/fees/${rollNo}`);
    return await res.json();
  } catch (error) {
    return { rollNo, total: 0, paid: 0, due: 0, history: [] };
  }
};

export const payFeesOnline = async (rollNo, amount, description) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/fees/${rollNo}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount, description }),
    });
    return await res.json();
  } catch (error) {
    console.error("Fee payment failed", error);
    return null;
  }
};

export const getTimetable = async (dept, sem) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/timetable?dept=${dept}&sem=${sem}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAssignments = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/assignments/${rollNo}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const submitAssignment = async (rollNo, assignmentId, submittedFile) => {
  try {
    const res = await authenticatedFetch(
      `${API_BASE}/student/assignments/${rollNo}/${assignmentId}/submit`,
      { method: "POST", body: JSON.stringify({ submittedFile }) }
    );
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const getStudentHallTicket = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/hall-ticket/${rollNo}`);
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAssignmentSubmissions = async (assignmentId) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/assignments/${assignmentId}/submissions`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getLeaveApplications = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/leaves/${rollNo}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const submitLeaveApplication = async (rollNo, leaveData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/leaves/${rollNo}`, {
      method: "POST",
      body: JSON.stringify(leaveData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getNotifications = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/notifications/${rollNo}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const markNotificationsRead = async (rollNo) => {
  try {
    const res = await authenticatedFetch(
      `${API_BASE}/student/notifications/${rollNo}/read`,
      { method: "POST" }
    );
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const getResults = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/results/${rollNo}`);
    return await res.json();
  } catch (error) {
    return null;
  }
};

// ==========================================
// FACULTY SERVICES
// ==========================================
export const getFacultyProfile = async (empId) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/profile/${empId}`);
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const updateFacultyProfile = async (empId, data) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/profile/${empId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getStudents = async (dept) => {
  try {
    const url = dept
      ? `${API_BASE}/faculty/students?dept=${dept}`
      : `${API_BASE}/admin/students`;
    const res = await authenticatedFetch(url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const saveClassAttendance = async (attCourse, attDate, attData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/attendance`, {
      method: "POST",
      body: JSON.stringify({ attCourse, attDate, attData }),
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const saveStudentMarks = async (marksCourse, marksData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/marks`, {
      method: "POST",
      body: JSON.stringify({ marksCourse, marksData }),
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const getFacultyAssignments = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/assignments`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const uploadFacultyAssignment = async (assignmentData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/assignments`, {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const deleteFacultyAssignment = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/assignments/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const getFacultyLeaveRequests = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/leaves`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const actionLeaveRequest = async (id, action) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/leaves/${id}/action`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const sendFacultyNotification = async (notifData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/message`, {
      method: "POST",
      body: JSON.stringify(notifData),
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

// ==========================================
// ADMIN SERVICES & GENERAL DATA
// ==========================================
export const getAdminStudents = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/students`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const addAdminStudent = async (studentData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/students`, {
      method: "POST",
      body: JSON.stringify(studentData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const updateAdminStudent = async (id, studentData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const deleteAdminStudent = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/students/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const getAdminFaculty = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/faculty`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const addAdminFaculty = async (facultyData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/faculty`, {
      method: "POST",
      body: JSON.stringify(facultyData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const updateAdminFaculty = async (id, facultyData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/faculty/${id}`, {
      method: "PUT",
      body: JSON.stringify(facultyData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const deleteAdminFaculty = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/faculty/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const getNotices = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/notices`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const addAdminNotice = async (noticeData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/notices`, {
      method: "POST",
      body: JSON.stringify(noticeData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};
export const saveNotices = addAdminNotice;

export const deleteNotice = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/notices/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};
export const deleteAdminNotice = deleteNotice;

export const getEvents = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/events`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const addAdminEvent = async (eventData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/events`, {
      method: "POST",
      body: JSON.stringify(eventData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};
export const saveEvents = addAdminEvent;

export const deleteEvent = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/events/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};
export const deleteAdminEvent = deleteEvent;

export const getPlacements = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/placements`);
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const savePlacements = async (placements) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/placements`, {
      method: "POST",
      body: JSON.stringify({ placements }),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getWebsiteSettings = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/settings`);
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const saveWebsiteSettings = async (settings) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/settings`, {
      method: "POST",
      body: JSON.stringify(settings),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getAdminActivityLogs = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/activity-logs`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAdmissionsEnquiries = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/enquiries`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const submitAdmissionsEnquiry = async (enquiryData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/public/enquiry`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiryData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const updateAdmissionStatus = async (id, status, reviewNotes = "", reviewedBy = "Admin") => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/admissions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reviewNotes, reviewedBy }),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const uploadStudentPhoto = async (rollNo, profilePhoto) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/photo/${rollNo}`, {
      method: "PUT",
      body: JSON.stringify({ profilePhoto }),
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const uploadFacultyPhoto = async (empId, profilePhoto) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/faculty/photo/${empId}`, {
      method: "PUT",
      body: JSON.stringify({ profilePhoto }),
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

export const getFaculty = getAdminFaculty;

export const saveFaculty = async () => {
  // No-op: database handles CRUD via dedicated endpoints
};

export const getDownloads = async () => {
  const settings = await getWebsiteSettings();
  return settings?.homepage?.downloads || [];
};

export const getHomepageContent = async () => {
  const settings = await getWebsiteSettings();
  return settings?.homepage || null;
};

export const getNews = async () => {
  const notices = await getNotices();
  return notices.filter(
    (n) => n.category === "News" || n.category === "General" || n.status === "Published"
  );
};

export const getContacts = async () => {
  return await getAdmissionsEnquiries();
};

export const getAdminUsers = async () => {
  try {
    const faculty = await getAdminFaculty();
    return faculty.map((f, i) => ({
      id: i,
      username: f.email,
      role: f.designation,
      email: f.email,
      status: f.status,
    }));
  } catch (e) {
    return [];
  }
};

export const saveStudents = async () => {
  // No-op: database has individual CRUD endpoints
};

export const getAdminDepartments = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/departments`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAdminCourses = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/courses`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAdminSubjects = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/subjects`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAdminBooks = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/library/books`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAdminHostelAllocations = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/hostel/allocations`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAdminTransportRoutes = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/transport/routes`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getAdminCertificateRequests = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/certificates`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const approveCertificateRequest = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/certificates/${id}/action`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Approved" }),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const rejectCertificateRequest = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/certificates/${id}/action`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Rejected" }),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getAdminComplaints = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/complaints`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const resolveComplaintTicket = async (id) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/complaints/${id}/resolve`, {
      method: "PATCH",
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getAdminAllFees = async () => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/admin/fees/all`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const createStudentComplaint = async (complaintData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/complaints`, {
      method: "POST",
      body: JSON.stringify(complaintData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getStudentComplaints = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/complaints/${rollNo}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const createCertificateRequest = async (certData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/certificates`, {
      method: "POST",
      body: JSON.stringify(certData),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getStudentCertificates = async (rollNo) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/certificates/${rollNo}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const updateStudentProfile = async (rollNo, profileData) => {
  try {
    const res = await authenticatedFetch(`${API_BASE}/student/profile/${rollNo}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    return await res.json();
  } catch (error) {
    return { success: false };
  }
};

