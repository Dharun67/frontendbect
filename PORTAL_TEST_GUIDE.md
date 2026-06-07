# Portal Functions Test Guide

## How to Test All Portal Functions

### 1. Portal Selection Page (/portal)
**URL**: http://localhost:3000/portal

**What to Check:**
- ✅ Page loads with 3 portal cards
- ✅ Student Portal card has icon and description
- ✅ Faculty Portal card displays correctly
- ✅ Admin Portal card shows
- ✅ Click "Login to Portal" buttons work
- ✅ Footer displays at bottom

**Expected Behavior:**
- Cards have hover effect (lift up and change border color)
- Clicking any "Login to Portal" button navigates to respective login page

---

### 2. Student Login (/student-login)
**URL**: http://localhost:3000/student-login

**Test Credentials:**
- Demo: `student` / `student123`
- Real User: `21CS001` / `student123`

**What to Check:**
- ✅ Form displays with Student ID and Password fields
- ✅ Demo credentials shown at bottom
- ✅ Empty form shows validation errors
- ✅ Wrong credentials show error message
- ✅ Correct credentials redirect to /student-portal
- ✅ "Remember me" checkbox works
- ✅ "Back to Portal" link navigates back

**Steps to Test:**
1. Try submitting empty form → Should show "required" errors
2. Enter wrong credentials → Should show error message
3. Enter `student` / `student123` → Should redirect to student portal
4. Check if logged in (should see dashboard)

---

### 3. Student Portal (/student-portal)

**URL**: http://localhost:3000/student-portal (requires login)

#### Dashboard
**What to Check:**
- ✅ Welcome message shows student name
- ✅ 4 stat cards display (Attendance 82%, Marks, Assignments, Fee)
- ✅ Today's classes section shows 4 classes
- ✅ Recent notifications section shows 4 items

#### Profile Page
**What to Check:**
- ✅ Click "👤 Profile" in sidebar
- ✅ Avatar with initials displays
- ✅ Student name, roll number shown
- ✅ 12 profile fields display (DOB, Email, Phone, etc.)

#### Attendance
**What to Check:**
- ✅ Click "📋 Attendance"
- ✅ Circular progress shows 82%
- ✅ Overall attendance summary displays
- ✅ Subject-wise table shows 6 subjects
- ✅ Status badges (Good/Average/Low) display correctly

#### Internal Marks
**What to Check:**
- ✅ Click "📊 Internal Marks"
- ✅ Table shows 5 subjects
- ✅ IA1, IA2, Assignment columns filled
- ✅ Total and Grade columns calculated
- ✅ Grade badges colored correctly (A = green, B = yellow)

#### Semester Results
**What to Check:**
- ✅ Click "🎓 Results"
- ✅ Two tabs show: "Sem 3" and "Sem 4"
- ✅ Click "Sem 3" → GPA 8.2 displays with subjects
- ✅ Click "Sem 4" → GPA 8.5 displays with subjects
- ✅ Credits, Grade, Points columns show correctly

#### Timetable
**What to Check:**
- ✅ Click "🕐 Timetable"
- ✅ Weekly schedule table displays
- ✅ Monday-Friday rows show
- ✅ Time slots 9-5 PM shown
- ✅ Color-coded badges (Theory/Lab/Break) display
- ✅ Legend at bottom shows

#### Assignments
**What to Check:**
- ✅ Click "📝 Assignments"
- ✅ 4 assignment cards display
- ✅ 2 pending assignments show "Pending" badge
- ✅ 2 submitted assignments show "Submitted" badge
- ✅ "View" and "Submit" buttons present
- ✅ Due dates displayed

#### Fee Payment
**What to Check:**
- ✅ Click "💳 Fee Payment"
- ✅ 3 summary cards show (Due: ₹12,500, Paid: ₹45,000, Total: ₹57,500)
- ✅ Payment history table shows 3 records
- ✅ "Pay Now" form displays with amount and mode
- ✅ Click "Proceed to Pay" → Alert shows (dummy gateway)

#### Leave Application
**What to Check:**
- ✅ Click "📩 Leave Application"
- ✅ Form shows with Leave Type dropdown
- ✅ From Date and To Date pickers work
- ✅ Reason textarea accepts text
- ✅ Fill form completely and click "Submit Application"
- ✅ Success alert appears
- ✅ New leave appears in Leave History section
- ✅ Status shows "Pending"
- ✅ Previously submitted leaves show with status

**Test Steps:**
1. Select "Medical Leave"
2. Choose From: 2025-06-15
3. Choose To: 2025-06-17
4. Enter Reason: "Fever and doctor consultation"
5. Click Submit
6. Check Leave History → New entry should appear

#### Notifications
**What to Check:**
- ✅ Click "🔔 Notifications"
- ✅ 5 notification cards display
- ✅ First 2 marked as "New" (yellow border)
- ✅ Icons show for each notification
- ✅ Timestamp displays

#### Logout
**What to Check:**
- ✅ Click "🚪 Logout" at bottom of sidebar
- ✅ Redirects to /portal
- ✅ Cannot access /student-portal without login (redirects back)

---

### 4. Faculty Login (/faculty-login)
**URL**: http://localhost:3000/faculty-login

**Test Credentials:**
- Demo: `faculty` / `faculty123`
- Real User: `FAC-CSE-001` / `faculty123`

**What to Check:**
- ✅ Form displays correctly
- ✅ Validation works
- ✅ Login redirects to /faculty-portal

---

### 5. Faculty Portal (/faculty-portal)

#### Dashboard
**What to Check:**
- ✅ Welcome message with faculty name
- ✅ 4 stat cards (120 Students, 3 Courses, etc.)
- ✅ Today's schedule shows 4 items
- ✅ Quick action buttons (4 buttons)

#### Attendance Management
**What to Check:**
- ✅ Click "📋 Attendance Mgmt"
- ✅ Course dropdown works
- ✅ Date picker shows
- ✅ Student table displays 6 students
- ✅ Present/Absent radio buttons work
- ✅ Click "Save Attendance" → Success alert

**Test Steps:**
1. Select course: "Data Structures — 21CS-A"
2. Pick today's date
3. Mark students present/absent
4. Click "💾 Save Attendance"
5. Alert should confirm success

#### Marks Entry
**What to Check:**
- ✅ Click "📊 Marks Entry"
- ✅ Course and Assessment dropdowns work
- ✅ Max Marks field editable
- ✅ Student table shows 6 students
- ✅ Marks input fields accept numbers
- ✅ Grade auto-calculates based on marks entered
- ✅ Change marks → Grade updates live
- ✅ Click "Save Marks" → Confirmation alert

**Test Steps:**
1. Change marks for first student from 22 to 25
2. Watch grade change from B+ to A
3. Click "💾 Save Marks"
4. Alert confirms

#### Student List
**What to Check:**
- ✅ Click "👥 Student List"
- ✅ Search box accepts input
- ✅ Type "Arjun" → Table filters to show only Arjun
- ✅ Clear search → All students show
- ✅ Class filter dropdown works
- ✅ Select "21CS-A" → Shows only that class
- ✅ Status badges display (Active/Low Att./At Risk)

#### Assignment Upload
**What to Check:**
- ✅ Click "📝 Assignment Upload"
- ✅ Form displays (Title, Course, Description, Due Date, Max Marks)
- ✅ Fill all fields
- ✅ Click "Upload Assignment"
- ✅ New assignment appears in list below
- ✅ Shows as "Active" status
- ✅ Previous assignments list shows 3 items

**Test Steps:**
1. Title: "Array Programming Problems"
2. Course: "Data Structures — 21CS-A"
3. Description: "Solve 10 array problems"
4. Due Date: 2025-06-20
5. Max Marks: 10
6. Click "📤 Upload Assignment"
7. Check it appears in list

#### My Courses
**What to Check:**
- ✅ Click "📚 My Courses"
- ✅ 3 course cards display
- ✅ Each shows: Icon, Name, Class, Students, Credits, Classes
- ✅ Progress bar shows completion percentage
- ✅ Different percentages (75%, 68%, 90%)

#### Communication
**What to Check:**
- ✅ Click "💬 Communication"
- ✅ "To" dropdown works
- ✅ Subject field accepts text
- ✅ Message textarea works
- ✅ Fill form and click "Send Message"
- ✅ Success alert shows
- ✅ Sent messages list shows 3 previous messages

**Test Steps:**
1. To: "All Students — 21CS-A"
2. Subject: "Assignment Reminder"
3. Message: "Please submit Assignment 3 by tomorrow"
4. Click "📨 Send Message"
5. Alert confirms

#### Logout
- ✅ Click logout → Redirects to /portal

---

### 6. Admin Login (/admin-login)
**URL**: http://localhost:3000/admin-login

**Test Credentials:**
- Demo: `admin` / `admin123`

**What to Check:**
- ✅ Form displays
- ✅ Login works
- ✅ Redirects to /admin-portal

---

### 7. Admin Portal (/admin-portal)

#### Dashboard
**What to Check:**
- ✅ 6 stat cards display
- ✅ Recent admissions table shows 4 entries
- ✅ Fee collection bars show 5 departments with percentages

#### Student Management
**What to Check:**
- ✅ Click "🎓 Student Management"
- ✅ Student table shows 6 students
- ✅ Search box works
- ✅ Click "Add Student" → Modal opens
- ✅ Fill form (Name, Roll, Dept, Sem, Email, Password)
- ✅ Click "Add Student" in modal
- ✅ Alert confirms success
- ✅ New student appears in table
- ✅ Click "Delete" on a student → Confirmation dialog
- ✅ Confirm → Student removed from table
- ✅ Data persists (refresh page, student still there)

**Test Steps:**
1. Click "+ Add Student"
2. Name: "Test Student"
3. Roll: "21CS007"
4. Dept: CSE
5. Semester: 5
6. Email: "test@bec.edu.in"
7. Password: "test123"
8. Click "Add Student"
9. Check table → New student appears
10. Click "View" → Shows details in alert
11. Refresh page → Student still there (localStorage)

#### Faculty Management
**What to Check:**
- ✅ Click "👨🏫 Faculty Management"
- ✅ Faculty table shows 5 members
- ✅ Click "+ Add Faculty" → Modal opens
- ✅ Fill form and submit
- ✅ New faculty appears in table
- ✅ View and Delete buttons work

#### Admission Management
**What to Check:**
- ✅ Click "📋 Admission Management"
- ✅ 4 stat cards show (Total, Approved, Pending, Rejected)
- ✅ Applications table shows 5 entries
- ✅ Status badges colored correctly
- ✅ Review/View buttons present

#### Department Management
**What to Check:**
- ✅ Click "🏫 Department Management"
- ✅ 6 department cards display
- ✅ Each shows: Icon, Name, HOD, Faculty count, Student count, Courses
- ✅ "Manage" button on each card

#### Course Management
**What to Check:**
- ✅ Click "📚 Course Management"
- ✅ Course table shows 6 courses
- ✅ Columns: Code, Name, Dept, Credits, Semester, Faculty
- ✅ "Edit" button on each row

#### Fee Management
**What to Check:**
- ✅ Click "💳 Fee Management"
- ✅ 4 stat cards (Total Collected, Pending, Expected, Defaulters)
- ✅ Filter dropdowns work
- ✅ Fee records table shows 5 students
- ✅ Status badges (Paid/Partial/Pending) display correctly

#### Reports
**What to Check:**
- ✅ Click "📊 Reports"
- ✅ 6 report cards display
- ✅ Each has icon, title, description
- ✅ Click "Generate" button → Alert shows
- ✅ Alert says "Report generated successfully"

#### Settings
**What to Check:**
- ✅ Click "⚙️ Settings"
- ✅ 4 settings boxes display
- ✅ College Information form has 5 fields
- ✅ Academic Settings has 5 fields
- ✅ Password change has 3 fields
- ✅ System Preferences has 5 toggle switches
- ✅ Toggle switches work (click to on/off)
- ✅ Click "Save" buttons → Success alerts

**Test Steps:**
1. Change "College Name" to "Best Engineering College - Updated"
2. Click "💾 Save Changes"
3. Alert confirms
4. Toggle "Email Notifications" switch
5. Click "💾 Save Preferences"
6. Alert confirms

#### Logout
- ✅ Click logout → Redirects to /portal

---

## Common Issues & Fixes

### Issue: Portal page not loading
**Fix**: Check console for errors, ensure PortalPage.jsx exists

### Issue: Login not working
**Fix**: 
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify credentials: `student/student123`
4. Clear localStorage: `localStorage.clear()` in console

### Issue: Portal shows blank after login
**Fix**:
1. Check if redirecting to correct URL
2. Verify localStorage has user data
3. Check console for errors

### Issue: Forms not submitting
**Fix**:
1. Check console for validation errors
2. Ensure all required fields filled
3. Check network tab for API calls (if using backend)

### Issue: Data not persisting
**Fix**:
1. Check localStorage in DevTools → Application → Local Storage
2. Verify functions are calling `localStorage.setItem()`
3. Check if data is being stringified: `JSON.stringify()`

---

## Quick Test Checklist

### ✅ All Pages Load
- [ ] Home page loads
- [ ] Portal selection page loads
- [ ] All 3 login pages load
- [ ] All 3 portal dashboards load

### ✅ Authentication Works
- [ ] Student login with demo credentials
- [ ] Faculty login works
- [ ] Admin login works
- [ ] Invalid credentials show errors
- [ ] Logout redirects properly

### ✅ Student Portal Functions
- [ ] All 10 sections accessible
- [ ] Leave application submits and saves
- [ ] Data displays correctly
- [ ] Tables render properly
- [ ] Forms validate

### ✅ Faculty Portal Functions
- [ ] All 8 sections work
- [ ] Marks entry updates live
- [ ] Assignment upload adds to list
- [ ] Search/filter works

### ✅ Admin Portal Functions
- [ ] All 9 sections functional
- [ ] Add student modal works
- [ ] Delete operations confirm
- [ ] Data persists after refresh
- [ ] Settings save

---

## Performance Test

1. **Page Load Speed**: All pages should load < 1 second
2. **Form Response**: Submit should respond < 500ms
3. **Navigation**: Page transitions < 300ms
4. **No Console Errors**: Check DevTools console is clean

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest)
- [ ] Mobile browser (responsive)

---

## Final Verification

Run this command in browser console after logging in:
```javascript
console.log('Student Data:', localStorage.getItem('bec_student_logged'));
console.log('All Students:', localStorage.getItem('bec_students'));
```

Should show stored data confirming everything works.
