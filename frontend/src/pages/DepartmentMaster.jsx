import { useState, useEffect } from 'react';

const DepartmentMaster = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch live departments from our brand new master API
  const fetchDepartments = () => {
    fetch('http://localhost:5000/api/v1/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error('Error fetching departments:', err));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;

    setStatus('loading');
    try {
      const response = await fetch('http://localhost:5000/api/v1/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department_name: newDepartmentName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add department.');

      setStatus('success');
      setNewDepartmentName('');
      fetchDepartments(); // Instantly reload list to see your new database row!
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-4xl mt-10 p-8 bg-slate-900 rounded-2xl shadow-xl text-slate-100 border border-slate-800 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Left Column: Create Form */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Department Master</h2>
        <p className="text-slate-400 mb-6 text-sm">Add custom company core departments to your organization directory setup.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Department Name</label>
            <input 
              type="text" 
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="e.g., Quality Assurance" 
              required 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            {status === 'error' && <span className="text-sm text-red-400">{errorMessage}</span>}
            {status === 'success' && <span className="text-sm text-green-400">Department added to database successfully!</span>}
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {status === 'loading' ? 'Creating...' : 'Add New Department'}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Live Data Display Grid */}
      <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-300">Registered Corporate Departments</h3>
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Department Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-blue-400">#{dept.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{dept.department_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DepartmentMaster;