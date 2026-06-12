import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeDirectoryCards from './EmployeeDirectoryCards';


const EmployeeList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [sortOrder, setSortOrder] = useState('asc');

const employeesPerPage = 5;





  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/employees')

        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }

        const data = await response.json();
        console.log(data);
        console.log('Employees API:', data);

       // Change this line:
setEmployees(Array.isArray(data) ? data : (data.employees || []));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (userId, employeeName) => {
    if (!window.confirm(`Are you sure you want to delete ${employeeName}? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/employees/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // ✅ parseInt ensures number vs string mismatch is fixed
      setEmployees((prev) => prev.filter((emp) => emp.id !== parseInt(userId)));

    } catch (err) {
      alert(err.message);
    }
};
     
const getEmployeeName = (emp) => {
  if (emp?.first_name || emp?.last_name) {
    return `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
  }
  return emp?.user?.name || 'Unknown User';
};

const filteredEmployees = employees
  .filter((employee) =>
    getEmployeeName(employee)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const nameA = getEmployeeName(a);
    const nameB = getEmployeeName(b);

    return sortOrder === 'asc'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

const indexOfLastEmployee =
  currentPage * employeesPerPage;

const indexOfFirstEmployee =
  indexOfLastEmployee - employeesPerPage;

const currentEmployees =
  filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

const totalPages = Math.max(
  1,
  Math.ceil(filteredEmployees.length / employeesPerPage)
);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        Loading Employees...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-600 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl text-slate-100 border border-slate-800">
      <div className="p-8 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Company Directory
        </h2>
<div className="flex gap-4 mt-4">

  <input
    type="text"
    placeholder="Search Employee..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl"
  />

  <select
    value={sortOrder}
    onChange={(e) =>
      setSortOrder(e.target.value)
    }
    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl"
  >
    <option value="asc">
      Name A-Z
    </option>

    <option value="desc">
      Name Z-A
    </option>
  </select>

</div>
        <span className="bg-blue-600/20 text-blue-400 py-1 px-4 rounded-full text-sm">
          {employees.length} Total Staff
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Department</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  No employees found
                </td>
              </tr>
            ) : (
             currentEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
  {employee.images?.length > 0 ? (
    <img
      src={employee.images[0].image_url.startsWith('http') ? employee.images[0].image_url.replace('http://localhost:5000', window.API_BASE_URL || 'http://localhost:5000') : `${window.API_BASE_URL || 'http://localhost:5000'}${employee.images[0].image_url}`}
      alt={getEmployeeName(employee)}
      className="w-full h-full object-cover"
    />
  ) : (
    <span>
      {getEmployeeName(employee).charAt(0).toUpperCase()}
    </span>
  )}
</div>

                      <div>
  {getEmployeeName(employee)}
</div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div>
                      {employee?.user?.email ||
                        'No email linked'}
                    </div>

                    <div>
                      {employee?.phone ||
                        'No phone provided'}
                    </div>
                  </td>

                  <td className="p-4">
                    {employee?.department?.department_name ||
                      'Unassigned'}
                  </td>

                  <td className="p-4">
                    {employee?.user?.role || 'USER'}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/edit-employee/${employee.id}`
                          )
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      >
                        Edit
                      </button>

                     <button
 onClick={() =>
  handleDelete(
    employee.id,
    employee?.user?.name || 'Unknown User'
  )
}
  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
>
  Delete
</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
<div className="flex justify-between items-center p-6">

  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
    className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
    className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
  >
    Next
  </button>

</div>

{/* Your existing tables or text are up here... */}
    
  {/* Pass the filtered data into the component as a 'prop' */}
<div className="mt-8 mx-6 pb-8">
    <EmployeeDirectoryCards employees={filteredEmployees} />
</div>

    {/* The rest of your page closes out... */}

      </div>
    </div>

    
  );
};

export default EmployeeList;