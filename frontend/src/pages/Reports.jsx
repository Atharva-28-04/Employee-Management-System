function Reports() {
  const convertToCSV = (data) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);

    const escapeCSVValue = (val) => {
      if (val === null || val === undefined) return '';
      let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      // Escape double quotes by doubling them
      str = str.replace(/"/g, '""');
      // Wrap in double quotes if it contains commas, double quotes, or newlines
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        str = `"${str}"`;
      }
      return str;
    };

    const rows = data.map((row) =>
      headers
        .map((header) => escapeCSVValue(row[header]))
        .join(',')
    );

    return [
      headers.join(','),
      ...rows
    ].join('\n');
  };

  const downloadCSV = async (type) => {
    try {
      let endpoint = '';

      if (type === 'Employee') {
        endpoint =
          'http://localhost:5000/api/v1/reports/employees';
      }

      if (type === 'Leave') {
        endpoint =
          'http://localhost:5000/api/v1/reports/leaves';
      }

      if (type === 'Asset') {
        endpoint =
          'http://localhost:5000/api/v1/reports/assets';
      }

      if (type === 'Attendance') {
        endpoint =
          'http://localhost:5000/api/v1/reports/attendance';
      }

      const response = await fetch(endpoint);

      const data = await response.json();

      const csv = convertToCSV(data);

      const blob = new Blob(
        [csv],
        {
          type: 'text/csv'
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        `${type}_Report.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);

      alert(
        'Failed to export report'
      );
    }
  };

  return (
    <div className="space-y-8">

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold">
          Reports Center
        </h1>

        <p className="mt-2 text-indigo-100">
          Generate and export enterprise reports
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Employee Report
          </h2>

          <p className="text-gray-500 mb-4">
            Export all employee data.
          </p>

          <button
            onClick={() =>
              downloadCSV('Employee')
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Leave Report
          </h2>

          <p className="text-gray-500 mb-4">
            Export leave applications.
          </p>

          <button
            onClick={() =>
              downloadCSV('Leave')
            }
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Asset Report
          </h2>

          <p className="text-gray-500 mb-4">
            Export company assets.
          </p>

          <button
            onClick={() =>
              downloadCSV('Asset')
            }
            className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Attendance Report
          </h2>

          <p className="text-gray-500 mb-4">
            Export team attendance logs.
          </p>

          <button
            onClick={() =>
              downloadCSV('Attendance')
            }
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
          >
            Export CSV
          </button>
        </div>

      </div>

    </div>
  );
}

export default Reports;