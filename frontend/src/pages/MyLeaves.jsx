import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function MyLeaves() {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/v1/leaves/my-leaves?userId=${user?.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLeaves(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === 'Approved'
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === 'Pending'
  ).length;

  const rejectedLeaves = leaves.filter(
    (leave) => leave.status === 'Rejected'
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';

      case 'Rejected':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Leaves...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">

        <h1 className="text-4xl font-bold">
          My Leaves
        </h1>

        <p className="mt-2 text-indigo-100">
          Track all your leave requests
        </p>

      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-slate-500">
            Approved Leaves
          </p>

          <h2 className="text-4xl font-bold text-emerald-600 mt-2">
            {approvedLeaves}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-slate-500">
            Pending Leaves
          </p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-2">
            {pendingLeaves}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-slate-500">
            Rejected Leaves
          </p>

          <h2 className="text-4xl font-bold text-red-500 mt-2">
            {rejectedLeaves}
          </h2>
        </div>

      </div>

      {/* LEAVE TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">
            Leave History
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="p-4 text-left">
                  Leave Type
                </th>

                <th className="p-4 text-left">
                  From
                </th>

                <th className="p-4 text-left">
                  To
                </th>

                <th className="p-4 text-left">
                  Days
                </th>

                <th className="p-4 text-left">
                  Status
                </th>
              </tr>

            </thead>

            <tbody>

              {leaves.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center text-slate-500"
                  >
                    No leave applications found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">
                      {leave.leaveType?.leave_name}
                    </td>

                    <td className="p-4">
                      {new Date(
                        leave.from_date
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {new Date(
                        leave.to_date
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {leave.total_days}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>

                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default MyLeaves;