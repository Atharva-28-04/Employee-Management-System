import { useState, useEffect } from 'react';
import EmployeeList from './EmployeeList';
import { useAuth } from '../context/AuthContext.jsx';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444'
];

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0,
    images: 0
  });

  const [departmentData, setDepartmentData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
const [assetStats, setAssetStats] = useState({
  totalAssets: 0,
  allocatedAssets: 0,
  availableAssets: 0
});

const [notificationCount, setNotificationCount] = useState(0);
  const loadDashboard = async () => {
    try {
      const [
  statsRes,
  departmentRes,
  leaveRes,
  recentRes,
  assetRes,
  notificationRes
] = await Promise.all([
        fetch('http://localhost:5000/api/v1/dashboard/stats'),
        fetch('http://localhost:5000/api/v1/dashboard/department-chart'),
        fetch('http://localhost:5000/api/v1/dashboard/leave-chart'),
        fetch('http://localhost:5000/api/v1/dashboard/recent-leaves'),
        fetch('http://localhost:5000/api/v1/dashboard/asset-stats'),
        fetch('http://localhost:5000/api/v1/dashboard/notification-count')

      ]);

      const statsData = await statsRes.json();
      const departmentChartData = await departmentRes.json();
      const leaveChartData = await leaveRes.json();
      const recentLeaveData = await recentRes.json();
      const assetData = await assetRes.json();
      const notificationData = await notificationRes.json();



      setStats(statsData);
      setDepartmentData(Array.isArray(departmentChartData) ? departmentChartData : []);
      setLeaveData(Array.isArray(leaveChartData) ? leaveChartData : []);
      setRecentLeaves(Array.isArray(recentLeaveData) ? recentLeaveData : []);
      setAssetStats(assetData);
      setNotificationCount(notificationData.unread || 0);



    } catch (error) {
      console.error('Dashboard Error:', error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const init = async () => {
    await loadDashboard();
  };

  init();
}, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">

      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-indigo-100 text-lg">
          Hello {user?.name || user?.email}
        </p>

        <div className="grid grid-cols-3 gap-8 mt-6">

          <div>
            <p className="text-indigo-200 text-sm">
              Employees
            </p>

            <h2 className="text-3xl font-bold">
              {stats.employees}
            </h2>
          </div>

          <div>
            <p className="text-indigo-200 text-sm">
              Departments
            </p>

            <h2 className="text-3xl font-bold">
              {stats.departments}
            </h2>
          </div>

          <div>
            <p className="text-indigo-200 text-sm">
              Skills
            </p>

            <h2 className="text-3xl font-bold">
              {stats.skills}
            </h2>
          </div>

        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
          <div className="text-3xl mb-3">👥</div>
          <h3>Total Employees</h3>
          <p className="text-4xl font-bold mt-3">
            {stats.employees}
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
          <div className="text-3xl mb-3">🏢</div>
          <h3>Departments</h3>
          <p className="text-4xl font-bold mt-3">
            {stats.departments}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
          <div className="text-3xl mb-3">🛠️</div>
          <h3>Skills</h3>
          <p className="text-4xl font-bold mt-3">
            {stats.skills}
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
          <div className="text-3xl mb-3">📁</div>
          <h3>Documents</h3>
          <p className="text-4xl font-bold mt-3">
            {stats.images}
          </p>
        </div>

      </div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl shadow-lg">
    <div className="text-3xl mb-3">💻</div>
    <h3>Total Assets</h3>
    <p className="text-4xl font-bold mt-3">
      {assetStats.totalAssets}
    </p>
  </div>

  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
    <div className="text-3xl mb-3">📦</div>
    <h3>Allocated Assets</h3>
    <p className="text-4xl font-bold mt-3">
      {assetStats.allocatedAssets}
    </p>
  </div>

  <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 rounded-2xl shadow-lg">
    <div className="text-3xl mb-3">✅</div>
    <h3>Available Assets</h3>
    <p className="text-4xl font-bold mt-3">
      {assetStats.availableAssets}
    </p>
  </div>

  <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
    <div className="text-3xl mb-3">🔔</div>
    <h3>Unread Notifications</h3>
    <p className="text-4xl font-bold mt-3">
      {notificationCount}
    </p>
  </div>

</div>
      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-xl transition cursor-pointer">
          <div className="text-3xl mb-2">➕</div>
          <h3 className="font-bold">Add Employee</h3>
          <p className="text-sm text-slate-500">
            Register new employee
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-xl transition cursor-pointer">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-bold">Apply Leave</h3>
          <p className="text-sm text-slate-500">
            Create leave request
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-xl transition cursor-pointer">
          <div className="text-3xl mb-2">🏢</div>
          <h3 className="font-bold">Departments</h3>
          <p className="text-sm text-slate-500">
            Manage departments
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-xl transition cursor-pointer">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-bold">Skills</h3>
          <p className="text-sm text-slate-500">
            Manage employee skills
          </p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">
            Employees By Department
          </h2>

          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="employees"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">
            Leave Status Distribution
          </h2>

          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {leaveData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RECENT LEAVES */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">

        <h2 className="text-xl font-bold mb-4">
          Recent Leave Requests
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Employee</th>
              <th className="text-left py-3">Reason</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>

            {recentLeaves.map((leave) => (
              <tr
                key={leave.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="py-3">
                  {leave.employee?.first_name || 'Employee'}
                </td>

                <td className="py-3">
                  {leave.reason}
                </td>

                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      leave.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : leave.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      

    </div>
  );
}

export default Dashboard;