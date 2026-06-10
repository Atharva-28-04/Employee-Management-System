const EmployeeDirectoryCards = ({ employees }) => {
    // This component now receives 'employees' as a prop from EmployeeList.jsx
    
    if (!employees || employees.length === 0) {
        return <div className="text-slate-400 p-4">No matching employees found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp) => (
                <div key={emp.id || emp.userId} className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg">
                            {emp.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">{emp.name}</h3>
                            <p className="text-blue-400 text-xs uppercase tracking-wider">{emp.designation || 'Staff'}</p>
                        </div>
                    </div>
                    <div className="text-sm text-slate-300 space-y-1">
                        <p>📧 {emp.user?.email || 'N/A'}</p>
                        <p>📱 {emp.phone || 'N/A'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeDirectoryCards;