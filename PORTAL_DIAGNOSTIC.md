# PORTAL DIAGNOSTIC - Quick Test

## ✅ IMMEDIATE CHECKS (Do These Now)

### 1. Open Portal Selection Page
**URL**: http://localhost:3000/portal

**What You Should See:**
- Page with "College Portals" title
- 3 large cards with icons:
  - 🎓 Student Portal
  - 👨🏫 Faculty Portal
  - 🛡️ Admin Portal
- Each card has "Login to Portal" button
- 4 feature badges at bottom (Secure, Mobile, 24/7, Support)

**If NOT working:**
- Check browser console (F12) for errors
- Verify URL is exactly: http://localhost:3000/portal
- Refresh page (Ctrl + R)

---

### 2. Test Student Login
**URL**: http://localhost:3000/student-login

**Steps:**
1. Click "Login to Portal" under Student Portal card
2. You should see login form with college logo
3. Enter credentials:
   - ID: `student`
   - Password: `student123`
4. Click "Login to Student Portal"

**Expected Result:**
- Redirects to: http://localhost:3000/student-portal
- Shows dashboard with welcome message
- Sidebar visible on left with menu items

**If NOT working:**
- Open Console (F12) and check for errors
- Try typing in console: `localStorage.clear()` then retry
- Make sure npm start is running

---

### 3. Test Portal Functions

#### Student Portal
**URL**: http://localhost:3000/student-portal (after login)

**Quick Tests:**
1. Click "📋 Attendance" → Should show 82% circular progress
2. Click "📝 Assignments" → Should show 4 assignment cards
3. Click "📩 Leave Application" → Fill form and submit
4. Check if leave appears in history below form

**All Working?**
- ✅ YES → Portal is fully functional
- ❌ NO → Note which section fails, check console

---

## 🔍 TROUBLESHOOTING

### Problem: Portal page shows blank
**Solution:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Common fix: Clear cache (Ctrl + Shift + Del)

### Problem: Login doesn't redirect
**Solution:**
1. Check credentials are exactly: `student` / `student123`
2. Open Console, type: `localStorage.clear()`
3. Refresh page and try again

### Problem: Portal sections don't load
**Solution:**
1. Check Console for errors
2. Verify you're logged in: Check if URL has /student-portal
3. Try logout and login again

### Problem: Forms don't submit
**Solution:**
1. Check all required fields are filled
2. Look for red error messages under fields
3. Open Console to see validation errors

---

## 📊 DATA VERIFICATION

### Check If Data Is Stored
Open Console (F12) and run:

```javascript
// Check if student is logged in
console.log('Logged in as:', localStorage.getItem('bec_student_logged'));

// Check all students data
console.log('All students:', localStorage.getItem('bec_students'));

// Check attendance data
console.log('Attendance:', localStorage.getItem('bec_attendance'));
```

**Should show:** JSON data with student information

**If shows null:** Data not initialized. Refresh page to trigger initialization.

---

## 🚀 QUICK FIX COMMANDS

If portal is not working, open Console (F12) and run these:

```javascript
// Clear all data and reload
localStorage.clear();
window.location.reload();

// Force initialize data (run in console)
fetch('/').then(() => window.location.reload());
```

---

## ✅ WORKING FEATURES CHECKLIST

### Portal Selection (/portal)
- [ ] Page loads without errors
- [ ] 3 portal cards visible
- [ ] Buttons clickable
- [ ] Hover effects work

### Student Login (/student-login)
- [ ] Form displays
- [ ] Can type in fields
- [ ] Submit button works
- [ ] Redirects after login

### Student Portal (/student-portal)
- [ ] Dashboard loads
- [ ] Sidebar shows 10 menu items
- [ ] Can navigate between sections
- [ ] Data displays in tables
- [ ] Forms submit successfully
- [ ] Logout works

### Faculty Portal (/faculty-portal)
- [ ] Login works (faculty/faculty123)
- [ ] Dashboard displays
- [ ] 8 sections accessible
- [ ] Forms functional

### Admin Portal (/admin-portal)
- [ ] Login works (admin/admin123)
- [ ] Dashboard loads
- [ ] 9 modules accessible
- [ ] Add/Delete operations work

---

## 🎯 EXPECTED BEHAVIOR

### ✅ When Everything Works:
1. Portal page loads instantly
2. Login takes you to dashboard
3. All sidebar links navigate smoothly
4. Forms validate and submit
5. Data appears in tables
6. Leave application saves
7. Logout redirects to portal

### ❌ If Something's Wrong:
- Red errors in Console
- Blank pages
- Forms don't submit
- No data in tables
- Navigation doesn't work

---

## 📞 STILL NOT WORKING?

### Check These:
1. **Is npm start running?** 
   - Terminal should show "webpack compiled successfully"
   - URL should be localhost:3000

2. **Is port 3000 free?**
   - Try: http://localhost:3001 or 3002

3. **Browser cache?**
   - Hard refresh: Ctrl + Shift + R
   - Or clear cache completely

4. **Node modules installed?**
   - Run: `npm install` in terminal

---

## 🎉 SUCCESS INDICATORS

You'll know portal is working when:
- ✅ Can navigate to /portal and see 3 cards
- ✅ Can login with student/student123
- ✅ Student portal dashboard shows stats
- ✅ Can click through all 10 sections
- ✅ Leave form submits and appears in history
- ✅ Logout returns to portal page
- ✅ No errors in browser console

---

## CURRENT STATUS CHECK

Run this now to verify setup:

1. Open http://localhost:3000
2. Click "Portal" in navbar
3. See if portal page loads
4. If YES → ✅ Portal is working
5. If NO → Check console for errors

**Report back:** Which step fails? I'll help fix it.
