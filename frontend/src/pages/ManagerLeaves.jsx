import { useEffect, useState } from 'react';

function ManagerLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/leaves/pending')
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-6">
        Manager Leave Approvals
      </h1>

      <table className="w-full border">

        <thead>
          <tr>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td className="border p-2">
                {leave.employee?.user?.name}
              </td>

              <td className="border p-2">
                {leave.reason}
              </td>

              <td className="border p-2">
                {leave.status}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default ManagerLeaves;