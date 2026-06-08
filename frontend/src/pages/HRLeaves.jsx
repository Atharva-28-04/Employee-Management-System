import { useEffect, useState } from 'react';

function HRLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/leaves/pending'
      );

      const data = await response.json();

      setLeaves(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const loadData = async () => {
    await fetchLeaves();
  };

  loadData();
}, []);

  const approveLeave = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/leaves/${id}/hr-approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            approvedBy: 1
          })
        }
      );

      fetchLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectLeave = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/leaves/${id}/hr-reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            approvedBy: 1
          })
        }
      );

      fetchLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Leave Requests...
      </div>
    );
  }

  const pendingCount = leaves.filter(
    (leave) => leave.status === 'Pending'
  ).length;

  const managerApprovedCount = leaves.filter(
    (leave) => leave.status === 'Manager Approved'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl mb-8">

        <h1 className="text-4xl font-bold">
          HR Leave Approvals
        </h1>

        <p className="mt-2 text-indigo-100">
          Review and manage employee leave requests
        </p>

      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-slate-500">
            Total Requests
          </p>

          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {leaves.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-slate-500">
            Pending
          </p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-2">
            {pendingCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-slate-500">
            Manager Approved
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {managerApprovedCount}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Leave Requests
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="p-4 text-left">
                  Employee
                </th>

                <th className="p-4 text-left">
                  Reason
                </th>

                <th className="p-4 text-left">
                  Days
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
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
                    No Leave Requests Found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">
                      {leave.employee?.user?.email}
                    </td>

                    <td className="p-4">
                      {leave.reason}
                    </td>

                    <td className="p-4">
                      {leave.total_days}
                    </td>

                    <td className="p-4">

                      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                        {leave.status}
                      </span>

                    </td>

                    <td className="p-4">

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            approveLeave(leave.id)
                          }
                          className="
                            px-4
                            py-2
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            rounded-lg
                            font-medium
                            transition
                          "
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectLeave(leave.id)
                          }
                          className="
                            px-4
                            py-2
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            rounded-lg
                            font-medium
                            transition
                          "
                        >
                          Reject
                        </button>

                      </div>

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

export default HRLeaves;