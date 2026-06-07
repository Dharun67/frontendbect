import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import DepartmentsPage from '../pages/DepartmentsPage';
import AdmissionsPage from '../pages/AdmissionsPage';
import PlacementsPage from '../pages/PlacementsPage';
import FacilitiesPage from '../pages/FacilitiesPage';
import ContactPage from '../pages/ContactPage';
import PortalPage from '../pages/PortalPage';
import LoginPage from '../pages/LoginPage';
import StudentLoginPage from '../pages/StudentLoginPage';
import FacultyLoginPage from '../pages/FacultyLoginPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import StudentPortalPage from '../pages/StudentPortalPage';
import FacultyPortalPage from '../pages/FacultyPortalPage';
import AdminPortalPage from '../pages/AdminPortalPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/portal" element={<PortalPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/student-login" element={<StudentLoginPage />} />
            <Route path="/faculty-login" element={<FacultyLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/student-portal" element={<StudentPortalPage />} />
            <Route path="/faculty-portal" element={<FacultyPortalPage />} />
            <Route path="/admin-portal" element={<AdminPortalPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
        </Routes>
    );
}   

export default AppRoutes ;
