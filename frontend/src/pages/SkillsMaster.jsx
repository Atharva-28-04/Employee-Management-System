import { useState, useEffect } from 'react';

const SkillsMaster = () => {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch live technical skills from our backend master API
  const fetchSkills = () => {
    fetch('http://localhost:5000/api/v1/skills')
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error('Error fetching skills:', err));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setStatus('loading');
    try {
      const response = await fetch('http://localhost:5000/api/v1/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_name: newSkillName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add skill.');

      setStatus('success');
      setNewSkillName('');
      fetchSkills(); // Automatically re-fetch to display the newly created database row!
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-4xl mt-10 p-8 bg-slate-900 rounded-2xl shadow-xl text-slate-100 border border-slate-800 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Left Column: Form Input */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Skills Master</h2>
        <p className="text-slate-400 mb-6 text-sm">Register new technical skill sets and frameworks to make them available for employee matching.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
            <input 
              type="text" 
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g., TypeScript, Docker" 
              required 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            {status === 'error' && <span className="text-sm text-red-400">{errorMessage}</span>}
            {status === 'success' && <span className="text-sm text-green-400">Skill added to database successfully!</span>}
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {status === 'loading' ? 'Saving...' : 'Add New Skill'}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Live Table view */}
      <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-300">Registered Tech Stack Keywords</h3>
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner max-h-[350px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-800 z-10">
              <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Skill Keyword</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-purple-400">#{skill.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{skill.skill_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SkillsMaster;