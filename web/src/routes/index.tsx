import { Route, Routes, Navigate } from 'react-router-dom';
import { KioskReviewPage } from '../pages/KioskReviewPage';
import { ManagerTabsPage } from '../pages/ManagerTabsPage';
import { ManagerDashboardPage } from '../pages/ManagerDashboardPage';
import { LoginComponent } from '../components/login';
import { ManagerAreaComponent } from '../components/maganerArea';

export default function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/manager" replace />} />
            <Route path="/kiosk" element={<KioskReviewPage />} />
            <Route path="/review" element={<KioskReviewPage />} />

            <Route path="/manager/login" element={<LoginComponent />} />
            <Route path="/manager" element={<ManagerTabsPage />} />
            <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
            <Route path="/manager/legacy" element={<ManagerAreaComponent />} />
        </Routes>
    )
}    