import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  User,
  Shield
} from 'lucide-react';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/leaves/stats?userId=${user?.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('ems_token')}`
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching leave stats:", err);
      }
    };

    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto py-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-xl shadow hover:bg-slate-100 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* PROFILE HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 rounded-3xl shadow-xl p-8 text-white mb-8">

        <div className="flex flex-col md:flex-row items-center gap-6">

          <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-indigo-700 text-5xl font-bold shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() ||
              user?.email?.charAt(0)?.toUpperCase() ||
              'U'}
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              {user?.name || 'Employee'}
            </h1>

            <p className="text-indigo-100 mt-2">
              {user?.email}
            </p>

            <span className="inline-block mt-4 bg-white/20 px-4 py-2 rounded-full text-sm uppercase">
              {user?.role}
            </span>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Personal Information
          </h2>

          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <User className="text-indigo-600" />

              <div>
                <p className="text-slate-500 text-sm">
                  Full Name
                </p>

                <p className="font-semibold text-lg">
                  {user?.name || 'Employee'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-indigo-600" />

              <div>
                <p className="text-slate-500 text-sm">
                  Email Address
                </p>

                <p className="font-semibold text-lg">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Shield className="text-indigo-600" />

              <div>
                <p className="text-slate-500 text-sm">
                  Role
                </p>

                <p className="font-semibold text-lg uppercase">
                  {user?.role}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* QUICK STATS */}
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Quick Stats
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-indigo-100 rounded-2xl p-6">
              <h3 className="text-slate-600">
                Total Leaves
              </h3>

              <p className="text-4xl font-bold text-indigo-700">
                {stats.total}
              </p>
            </div>

            <div className="bg-green-100 rounded-2xl p-6">
              <h3 className="text-slate-600">
                Approved
              </h3>

              <p className="text-4xl font-bold text-green-700">
                {stats.approved}
              </p>
            </div>

            <div className="bg-yellow-100 rounded-2xl p-6">
              <h3 className="text-slate-600">
                Pending
              </h3>

              <p className="text-4xl font-bold text-yellow-700">
                {stats.pending}
              </p>
            </div>

            <div className="bg-red-100 rounded-2xl p-6">
              <h3 className="text-slate-600">
                Rejected
              </h3>

              <p className="text-4xl font-bold text-red-700">
                {stats.rejected}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;