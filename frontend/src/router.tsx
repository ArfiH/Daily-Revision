import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { PdfsPage } from './pages/PdfsPage';
import { ScheduleOverviewPage } from './pages/ScheduleOverviewPage';
import { AppLayout } from './components/Layout/AppLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
              <AppLayout>
                <Navigate to="/dashboard" replace />
              </AppLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
          }
        />
        <Route
          path="/pdfs"
          element={
              <AppLayout>
                <PdfsPage />
              </AppLayout>
          }
        />
        <Route
          path="/schedule"
          element={
              <AppLayout>
                <ScheduleOverviewPage />
              </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
