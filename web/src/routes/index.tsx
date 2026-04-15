import { Route, Routes, Navigate} from 'react-router-dom';

import { KioskReviewPage } from '../pages/KioskReviewPage';
import { ManagerTabsPage } from '../pages/ManagerTabsPage';
import { ManagerDashboardPage } from '../pages/ManagerDashboardPage';

import { LoginPage } from '../pages/LoginPage';
import { CadastroPage } from '../pages/CadastroPage';
import { ProtectedRoute } from '../auth/ProtectedRoute';


export default function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/cadastro"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CadastroPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/kiosk"
                    element={
                        <ProtectedRoute>
                            <KioskReviewPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute>
                            <ManagerTabsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/dashboard"
                    element={
                        <ProtectedRoute>
                            <ManagerDashboardPage />
                        </ProtectedRoute>
                    }
                />
        </Routes>
    )
}    