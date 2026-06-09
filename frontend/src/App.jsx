import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Profile from './pages/Profile';
// Core Pages
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EmployeeList from './pages/EmployeeList.jsx';
import EmployeeRegistry from './pages/EmployeeRegistry.jsx';
import DepartmentMaster from './pages/DepartmentMaster.jsx';
import SkillsMaster from './pages/SkillsMaster.jsx';
import AssetManagement from './pages/AssetManagement';
import AuditLogs from './pages/AuditLogs';
import Reports from './pages/Reports';


// Leave Management
import LeaveApplication from './pages/LeaveApplication.jsx';
import MyLeaves from './pages/MyLeaves.jsx';
import HRLeaves from './pages/HRLeaves.jsx';

function App() {
return ( <Router> <Routes>

```
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
  path="/assets"
  element={<AssetManagement />}
/>
     <Route
  path="/audit-logs"
  element={<AuditLogs />}
/>
     
     
     
     
      </Route>
    </Route>
<Route
  path="/profile"
  element={<Profile />}
/>
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
      </Route>
    </Route>

    {/* FALLBACK */}
    <Route
      path="*"
      element={<Navigate to="/login" replace />}
    />

  </Routes>
</Router>


);
}

export default App;
