import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Lazy load route pages for performance & smaller initial chunk sizes
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const EmployeeList = lazy(() => import('./pages/EmployeeList.jsx'));
const EmployeeRegistry = lazy(() => import('./pages/EmployeeRegistry.jsx'));
const DepartmentMaster = lazy(() => import('./pages/DepartmentMaster.jsx'));
const SkillsMaster = lazy(() => import('./pages/SkillsMaster.jsx'));
const AssetManagement = lazy(() => import('./pages/AssetManagement'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));
const Reports = lazy(() => import('./pages/Reports'));
const LeaveApplication = lazy(() => import('./pages/LeaveApplication.jsx'));
const MyLeaves = lazy(() => import('./pages/MyLeaves.jsx'));
const HRLeaves = lazy(() => import('./pages/HRLeaves.jsx'));
const Attendance = lazy(() => import('./pages/Attendance.jsx'));

// Page loader component during chunk fetch
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh] w-full">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* EMPLOYEE + HR */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>

              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/leave-application"
                element={<LeaveApplication />}
              />

              <Route
                path="/my-leaves"
                element={<MyLeaves />}
              />
              <Route
                path="/attendance"
                element={<Attendance />}
              />
              <Route
                path="/profile"
                element={<Profile />}
              />
            </Route>
          </Route>
          {/* HR ONLY */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={['hr']}
              />
            }
          >
            <Route element={<Layout />}>

              <Route
                path="/employees"
                element={<EmployeeList />}
              />

              <Route
                path="/register"
                element={<EmployeeRegistry />}
              />

              <Route
                path="/edit-employee/:id"
                element={<EmployeeRegistry />}
              />

              <Route
                path="/departments"
                element={<DepartmentMaster />}
              />

              <Route
                path="/skills"
                element={<SkillsMaster />}
              />

              <Route
                path="/hr-leaves"
                element={<HRLeaves />}
              />
              <Route
                path="/reports"
                element={<Reports />}
              />
              <Route
                path="/assets"
                element={<AssetManagement />}
              />
              <Route
                path="/audit-logs"
                element={<AuditLogs />}
              />
            </Route>
          </Route>

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

