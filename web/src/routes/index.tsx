import { Route, Routes, Navigate } from 'react-router-dom';

import { KioskReviewPage } from '../pages/KioskReviewPage';
import { ManagerTabsPage } from '../pages/ManagerTabsPage';
import { ManagerDashboardPage } from '../pages/ManagerDashboardPage';

export default function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
                <Route path="/kiosk" element={<KioskReviewPage />} />
                <Route path="/manager" element={<ManagerTabsPage />} />
                <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
        </Routes>
    )
}    