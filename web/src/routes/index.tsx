import { Route, Routes, Navigate} from 'react-router-dom';

import { KioskReviewPage } from '../pages/KioskReviewPage';
import { ManagerTabsPage } from '../pages/ManagerTabsPage';
import { ManagerDashboardPage } from '../pages/ManagerDashboardPage';

import { LoginPage } from '../pages/LoginPage';
import { CadastroPage } from '../pages/CadastroPage';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { UnauthorizedPage } from '../pages/unauthorized';
import { UserRoute } from '../auth/userRoute';
import { AdminRoute } from '../auth/adminRoute';

export default function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                <Route
                    path="/cadastro"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminRoute>
                                <CadastroPage />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/:idLoja/kiosk"
                    element={
                        <ProtectedRoute>
                            <UserRoute>
                                <KioskReviewPage />
                            </UserRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/:idLoja/manager"
                    element={
                        <ProtectedRoute>
                            <UserRoute>
                                <ManagerTabsPage />
                            </UserRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/:idLoja/manager/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserRoute>
                                <ManagerDashboardPage />
                            </UserRoute>
                        </ProtectedRoute>
                    }
                />
        </Routes>
    )
}    