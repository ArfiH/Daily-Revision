import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PdfsPage } from './pages/PdfsPage';
import { ScheduleOverviewPage } from './pages/ScheduleOverviewPage';
import { AppLayout } from './components/Layout/AppLayout';
import { AuthGate } from './components/auth/AuthGate';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthGate>
              <AppLayout>
                <Navigate to="/dashboard" replace />
              </AppLayout>
            </AuthGate>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthGate>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </AuthGate>
          }
        />
        <Route
          path="/pdfs"
          element={
            <AuthGate>
              <AppLayout>
                <PdfsPage />
              </AppLayout>
            </AuthGate>
          }
        />
        <Route
          path="/schedule"
          element={
            <AuthGate>
              <AppLayout>
                <ScheduleOverviewPage />
              </AppLayout>
            </AuthGate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
