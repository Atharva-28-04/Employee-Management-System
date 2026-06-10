import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Static Configuration definitions moved outside the component scope
// to completely eliminate the ESLint 'exhaustive-deps' dependency warning.
const DESIGNATION_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "HR Manager",
  "Financial Analyst",
  "Marketing Specialist"
];

const EmployeeRegistry = () => {
  const { id } = useParams(); // URL parameter identifier for update routing [cite: 34, 55]
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [departments, setDepartments] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '', 
    designation: DESIGNATION_OPTIONS[0],
    salary: '',
    skills: [],
    address: '' // Added target schema mapping input state [cite: 14]
  });

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch Structural Master Data and Load Profile Details if in Edit Mode [cite: 30, 32, 34]
  useEffect(() => {
    // Fetch live Departments Master list [cite: 30]
    fetch('http://localhost:5000/api/v1/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        if (data.length > 0 && !isEditMode) {
          setFormData(prev => ({ ...prev, departmentId: data[0].id }));
        }
      })
      .catch(err => console.error("Error fetching departments:", err));
      
    // Fetch live Technical Skills Master list [cite: 32]
    fetch('http://localhost:5000/api/v1/skills')
      .then(res => res.json())
      .then(data => setAvailableSkills(data))
      .catch(err => console.error("Error fetching skills:", err));

    // Atomic fetch for targeted single profile details if editing [cite: 34, 55]
    if (isEditMode) {
      fetch(`http://localhost:5000/api/v1/employees/${id}`)
        .then(res => res.json())
        .then(data => {
          const nameParts = data.name ? data.name.split(' ') : ['', ''];
          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: data.user?.email || '',
            phone: data.phone || '',
            departmentId: data.department?.id || '',
            designation: data.designation || DESIGNATION_OPTIONS[0],
            salary: data.salary || '',
            address: data.address || '',
            skills: data.skills ? data.skills.map(s => s.id) : []
          });
        })
        .catch(err => console.error("Error loading profile details:", err));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skillId) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId];
      return { ...prev, skills };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      alert("Maximum 5 images allowed."); // Enforces multi-upload requirements constraints [cite: 44, 45]
      e.target.value = ""; 
      setFiles([]);
      return;
    }
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus('loading');

  const payload = {
    ...formData,
    name: `${formData.firstName} ${formData.lastName}`.trim()
  };

  console.log(payload);

    // Dynamically adjust API parameters depending on runtime Mode configuration [cite: 34]
    const targetUrl = isEditMode 
      ? `http://localhost:5000/api/v1/employees/${id}`
      : 'http://localhost:5000/api/v1/employees';

    const targetMethod = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(targetUrl, {
        method: targetMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error processing structural database data.');

      // Process supplemental document storage actions if additional files are picked [cite: 41, 63]
      if (files.length > 0) {
        const fileFormData = new FormData();
        fileFormData.append('employeeId', id || data.employeeId);
        for (let i = 0; i < files.length; i++) {
          fileFormData.append('documents', files[i]);
        }

        await fetch('http://localhost:5000/api/v1/employees/upload', {
          method: 'POST',
          body: fileFormData,
        });
      }

      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard'); // Route straight back to primary analytics hub dashboard [cite: 5, 54]
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-2xl mt-10 p-8 bg-slate-900 rounded-2xl shadow-xl text-slate-100 border border-slate-800 mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-3xl font-bold">{isEditMode ? '⚙️ Edit Profile Data' : 'Register New Employee'}</h2>
      </div>
      <p className="text-slate-400 mb-8">
        {isEditMode ? 'Modify specific operational entries and save updates directly to PostgreSQL.' : 'Assign corporate departments, select tech-stack keywords, and attach documents.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Attributes */}
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-slate-300 mb-2">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
        </div>

        {/* Access Coordinates row */}
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isEditMode} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-40" /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-2">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
        </div>

        {/* Master Mapping Dropdowns Section [cite: 63] */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
            <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.department_name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Designation</label>
            <select name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              {DESIGNATION_OPTIONS.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div><label className="block text-sm font-medium text-slate-300 mb-2">Salary</label><input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
        </div>

        {/* Full Address Mapping input textarea block [cite: 14] */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Residential Address</label>
          <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" placeholder="Enter complete home address lines..."></textarea>
        </div>

        {/* Multi-Selection Skills Node Checkboxes [cite: 63] */}
        <div className="pt-4 border-t border-slate-800">
          <label className="block text-sm font-medium text-slate-300 mb-3">🛠️ Technical Skills Selection</label>
          <div className="flex flex-wrap gap-3">
            {availableSkills.map(skill => (
              <label key={skill.id} className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-colors select-none ${formData.skills.includes(skill.id) ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                <input type="checkbox" className="hidden" checked={formData.skills.includes(skill.id)} onChange={() => handleSkillToggle(skill.id)} />
                {skill.skill_name}
              </label>
            ))}
          </div>
        </div>

        {/* Document multi-file array selector module [cite: 43, 63] */}
        <div className="pt-4 border-t border-slate-800">
           <label className="block text-sm font-medium text-slate-300 mb-2">📎 Attach Verified Images (Max 5)</label>
           <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400" />
        </div>

        {/* Form Execution state actions footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <div className="flex-1">
            {status === 'error' && <span className="text-sm text-red-400">{errorMessage}</span>}
            {status === 'success' && <span className="text-sm text-green-400">Profile record configured and synced seamlessly!</span>}
          </div>
          <button type="submit" disabled={status === 'loading'} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            {status === 'loading' ? 'Saving...' : isEditMode ? 'Update Record' : 'Save Employee Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRegistry;