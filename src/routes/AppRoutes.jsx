import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Home = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const DepartmentsPage = lazy(() => import('../pages/DepartmentsPage'));
const AdmissionsPage = lazy(() => import('../pages/AdmissionsPage'));
const PlacementsPage = lazy(() => import('../pages/PlacementsPage'));
const FacilitiesPage = lazy(() => import('../pages/FacilitiesPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const PortalPage = lazy(() => import('../pages/PortalPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const StudentLoginPage = lazy(() => import('../pages/StudentLoginPage'));
const FacultyLoginPage = lazy(() => import('../pages/FacultyLoginPage'));
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'));
const StudentPortalPage = lazy(() => import('../pages/StudentPortalPage'));
const FacultyPortalPage = lazy(() => import('../pages/FacultyPortalPage'));
const AdminPortalPage = lazy(() => import('../pages/AdminPortalPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const Error404Page = lazy(() => import('../pages/Error404Page'));

function AppRoutes() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
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
                <Route path="*" element={<Error404Page />} />
            </Routes>
        </Suspense>
    );
}   

export default AppRoutes ;
