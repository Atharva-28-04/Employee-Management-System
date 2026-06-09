import { useEffect, useState } from 'react';

function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
   

  const fetchLogs = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/audit-logs'
      );

      const data = await response.json();

      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }; fetchLogs();
  }, []);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold">
          Audit Logs
        </h1>

        <p className="mt-2 text-slate-200">
          Track every change made in the system
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Activity History
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Action</th>
              <th className="text-left py-3">Table</th>
              <th className="text-left py-3">Record ID</th>
              <th className="text-left py-3">Performed By</th>
              <th className="text-left py-3">Date</th>
            </tr>
          </thead>

          <tbody>

            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="py-3">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                    {log.action_type}
                  </span>
                </td>

                <td className="py-3">
                  {log.table_name}
                </td>

                <td className="py-3">
                  #{log.record_id}
                </td>

                <td className="py-3">
                  {log.performed_by}
                </td>

                <td className="py-3">
                  {new Date(
                    log.created_at
                  ).toLocaleString()}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AuditLogs;