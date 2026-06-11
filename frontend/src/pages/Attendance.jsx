import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Clock, 
  Calendar, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Coffee, 
  FileText, 
  X, 
  Plus, 
  Search,
  Download
} from 'lucide-react';

function Attendance() {
  const { user } = useAuth();
  const isHR = user?.role === 'hr';

  // State variables
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' or 'hr'
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Employee View State
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    halfDayCount: 0,
    avgHours: 0
  });
  const [remarks, setRemarks] = useState('');
  const [loadingEmployee, setLoadingEmployee] = useState(true);

  // HR View State
  const [hrDate, setHrDate] = useState(new Date().toISOString().split('T')[0]);
  const [hrRecords, setHrRecords] = useState([]);
  const [loadingHR, setLoadingHR] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Manual Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    clockIn: '',
    clockOut: '',
    status: 'Present',
    remarks: ''
  });

  // Clock ticking effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employee attendance data
  const loadEmployeeData = async () => {
    try {
      setLoadingEmployee(true);
      const [todayRes, historyRes, statsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/v1/attendance/today?userId=${user?.id}`),
        fetch(`http://localhost:5000/api/v1/attendance/my-attendance?userId=${user?.id}`),
        fetch(`http://localhost:5000/api/v1/attendance/stats?userId=${user?.id}`)
      ]);

      const todayData = await todayRes.json();
      const historyData = await historyRes.json();
      const statsData = await statsRes.json();

      setTodayRecord(todayData.error || !todayData.id ? null : todayData);
      setHistory(Array.isArray(historyData) ? historyData : []);
      if (!statsData.error) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading employee attendance data:", error);
    } finally {
      setLoadingEmployee(false);
    }
  };

  // Fetch HR attendance data
  const loadHRData = async () => {
    try {
      setLoadingHR(true);
      const res = await fetch(`http://localhost:5000/api/v1/attendance/all?date=${hrDate}`);
      const data = await res.json();
      setHrRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading HR attendance data:", error);
    } finally {
      setLoadingHR(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadEmployeeData();
    }
  }, [user]);

  useEffect(() => {
    if (isHR && activeTab === 'hr') {
      loadHRData();
    }
  }, [activeTab, hrDate]);

  // Clock In Action
  const handleClockIn = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, remarks })
      });
      const data = await res.json();

      if (res.ok) {
        alert("Clocked in successfully! 🚀");
        setRemarks('');
        loadEmployeeData();
      } else {
        alert(data.message || "Failed to clock in");
      }
    } catch (error) {
      console.error(error);
      alert("Error checking in");
    }
  };

  // Clock Out Action
  const handleClockOut = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();

      if (res.ok) {
        alert("Clocked out successfully! 🏁");
        loadEmployeeData();
      } else {
        alert(data.message || "Failed to clock out");
      }
    } catch (error) {
      console.error(error);
      alert("Error checking out");
    }
  };

  // Manual Attendance Submit (HR)
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format clockIn/clockOut dates with the selected date
      let formattedClockIn = null;
      let formattedClockOut = null;

      if (modalData.clockIn) {
        formattedClockIn = new Date(`${modalData.date}T${modalData.clockIn}`).toISOString();
      }
      if (modalData.clockOut) {
        formattedClockOut = new Date(`${modalData.date}T${modalData.clockOut}`).toISOString();
      }

      const res = await fetch('http://localhost:5000/api/v1/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: modalData.employeeId,
          date: modalData.date,
          clockIn: formattedClockIn,
          clockOut: formattedClockOut,
          status: modalData.status,
          remarks: modalData.remarks
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Attendance record recorded successfully!");
        setIsModalOpen(false);
        setModalData({
          employeeId: '',
          date: new Date().toISOString().split('T')[0],
          clockIn: '',
          clockOut: '',
          status: 'Present',
          remarks: ''
        });
        loadHRData();
        // Also refresh employee view if they checked self
        loadEmployeeData();
      } else {
        alert(data.message || "Failed to record manual log");
      }
    } catch (error) {
      console.error(error);
      alert("Error logging manual attendance");
    }
  };

  // HR Stats calculations
  const hrStats = (() => {
    const total = hrRecords.length;
    const present = hrRecords.filter(r => r.attendance?.[0]?.status === 'Present').length;
    const late = hrRecords.filter(r => r.attendance?.[0]?.status === 'Late').length;
    const absent = hrRecords.filter(r => r.attendance?.[0]?.status === 'Absent').length;
    const halfDay = hrRecords.filter(r => r.attendance?.[0]?.status === 'Half Day').length;
    const onLeave = hrRecords.filter(r => r.attendance?.[0]?.status === 'On Leave').length;
    const checkedIn = present + late + halfDay;
    const notCheckedIn = total - checkedIn - absent - onLeave;

    return { total, checkedIn, absent, onLeave, late, notCheckedIn };
  })();

  const filteredHRRecords = hrRecords.filter(emp => {
    const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
    const email = emp.user?.email?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Late': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Absent': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Half Day': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Leave': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Clock size={220} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Attendance Center</h1>
          <p className="mt-2 text-indigo-100">Log your daily hours, review histories, and manage team schedules.</p>
          
          {/* TAB SWAP (IF HR) */}
          {isHR && (
            <div className="mt-6 inline-flex p-1 bg-white/10 backdrop-blur-md rounded-xl">
              <button
                onClick={() => setActiveTab('employee')}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'employee' 
                    ? 'bg-white text-indigo-900 shadow-md' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Personal Console
              </button>
              <button
                onClick={() => setActiveTab('hr')}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'hr' 
                    ? 'bg-white text-indigo-900 shadow-md' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                HR Administrator Panel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* -------------------- EMPLOYEE VIEW -------------------- */}
      {activeTab === 'employee' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* REAL-TIME CLOCK & CHECK-IN CONTROLS */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Live Console</span>
                <h2 className="text-5xl font-black text-slate-800 mt-4 font-mono">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h2>
                <p className="text-slate-500 font-medium mt-1">
                  {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Status Badge */}
              <div className="my-6 w-full">
                {loadingEmployee ? (
                  <div className="h-14 bg-slate-100 animate-pulse rounded-2xl"></div>
                ) : todayRecord ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-slate-500 text-xs uppercase font-bold">Today's Log</p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(todayRecord.status)}`}>
                        {todayRecord.status}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <p>Clocked In: <span className="font-semibold">{new Date(todayRecord.clock_in).toLocaleTimeString()}</span></p>
                      {todayRecord.clock_out && (
                        <p>Clocked Out: <span className="font-semibold">{new Date(todayRecord.clock_out).toLocaleTimeString()}</span></p>
                      )}
                      {todayRecord.total_hours && (
                        <p>Duration: <span className="font-semibold">{todayRecord.total_hours} Hours</span></p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-rose-700">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                      <AlertCircle size={16} /> Not Clocked In Today
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive buttons */}
              <div className="w-full space-y-3">
                {!todayRecord ? (
                  <>
                    <textarea
                      placeholder="Note / remarks (optional)..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-200 resize-none h-20"
                    />
                    <button
                      onClick={handleClockIn}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition shadow-md hover:shadow-lg active:scale-[0.98] duration-200"
                    >
                      Clock In
                    </button>
                  </>
                ) : !todayRecord.clock_out ? (
                  <button
                    onClick={handleClockOut}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold transition shadow-md hover:shadow-lg active:scale-[0.98] duration-200"
                  >
                    Clock Out
                  </button>
                ) : (
                  <div className="py-4 text-slate-500 font-bold bg-slate-100 rounded-2xl flex items-center justify-center gap-2">
                    <CheckCircle size={18} className="text-emerald-500" /> Completed Checklist For Today
                  </div>
                )}
              </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-emerald-50 rounded-2xl inline-block text-emerald-600 mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="text-slate-500 font-semibold text-sm">Present Days</h4>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 mt-2">{stats.presentCount}</h2>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-amber-50 rounded-2xl inline-block text-amber-600 mb-4">
                    <Clock size={24} />
                  </div>
                  <h4 className="text-slate-500 font-semibold text-sm">Late Clock Ins</h4>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 mt-2">{stats.lateCount}</h2>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-rose-50 rounded-2xl inline-block text-rose-600 mb-4">
                    <AlertCircle size={24} />
                  </div>
                  <h4 className="text-slate-500 font-semibold text-sm">Absences</h4>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 mt-2">{stats.absentCount}</h2>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-indigo-50 rounded-2xl inline-block text-indigo-600 mb-4">
                    <Coffee size={24} />
                  </div>
                  <h4 className="text-slate-500 font-semibold text-sm">Average Work Hours</h4>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 mt-2">{stats.avgHours} hrs</h2>
              </div>
            </div>
          </div>

          {/* HISTORICAL WORK RECORD */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">My Attendance History</h3>
              <span className="text-sm text-slate-500 font-medium">Logged {stats.totalDays} Total Days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-5">Date</th>
                    <th className="p-5">Clock In</th>
                    <th className="p-5">Clock Out</th>
                    <th className="p-5">Working Hours</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {loadingEmployee ? (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-slate-400">Loading history logs...</td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-slate-400">No attendance records found. Click Clock In to log today's time!</td>
                    </tr>
                  ) : (
                    history.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-5 font-bold text-slate-800">
                          {new Date(record.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="p-5 text-slate-600 font-mono">
                          {record.clock_in ? new Date(record.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </td>
                        <td className="p-5 text-slate-600 font-mono">
                          {record.clock_out ? new Date(record.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </td>
                        <td className="p-5 text-slate-700 font-semibold font-mono">
                          {record.total_hours !== null ? `${record.total_hours} hrs` : '--'}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="p-5 text-slate-500 text-xs italic max-w-xs truncate" title={record.remarks}>
                          {record.remarks || '--'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- HR VIEW -------------------- */}
      {activeTab === 'hr' && isHR && (
        <div className="space-y-8">
          
          {/* DAILY KPI OVERVIEW */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h5 className="text-slate-400 text-xs font-bold uppercase">Total Team Size</h5>
              <h2 className="text-3xl font-extrabold mt-2 text-slate-800">{hrStats.total}</h2>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h5 className="text-slate-400 text-xs font-bold uppercase">Present Today</h5>
              <h2 className="text-3xl font-extrabold mt-2 text-emerald-600">{hrStats.checkedIn}</h2>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h5 className="text-slate-400 text-xs font-bold uppercase">Late Check-ins</h5>
              <h2 className="text-3xl font-extrabold mt-2 text-amber-600">{hrStats.late}</h2>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h5 className="text-slate-400 text-xs font-bold uppercase">Absent Today</h5>
              <h2 className="text-3xl font-extrabold mt-2 text-rose-600">{hrStats.absent + hrStats.notCheckedIn}</h2>
            </div>
          </div>

          {/* ACTION BAR & FILTER */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              {/* Date Filter */}
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-slate-50 border-slate-200">
                <Calendar size={18} className="text-slate-500" />
                <input
                  type="date"
                  value={hrDate}
                  onChange={(e) => setHrDate(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 outline-none font-semibold cursor-pointer"
                />
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-slate-50 border-slate-200 flex-1 md:flex-initial min-w-[240px]">
                <Search size={18} className="text-slate-500" />
                <input
                  type="text"
                  placeholder="Search employee or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 outline-none w-full"
                />
              </div>
            </div>

            {/* Manual Override Action */}
            <button
              onClick={() => {
                setModalData(prev => ({ ...prev, date: hrDate }));
                setIsModalOpen(true);
              }}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
            >
              <Plus size={16} /> Mark Manual Attendance
            </button>
          </div>

          {/* EMPLOYEE LOG SHEET */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Employee Logs: {new Date(hrDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-5">Employee</th>
                    <th className="p-5">Department</th>
                    <th className="p-5">Clock In</th>
                    <th className="p-5">Clock Out</th>
                    <th className="p-5">Hours</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Remarks</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {loadingHR ? (
                    <tr>
                      <td colSpan="8" className="p-10 text-center text-slate-400">Loading attendance reports...</td>
                    </tr>
                  ) : filteredHRRecords.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-10 text-center text-slate-400">No employee records match the description or filters.</td>
                    </tr>
                  ) : (
                    filteredHRRecords.map((emp) => {
                      const log = emp.attendance?.[0];
                      const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.user?.email || 'N/A';
                      const initialStatus = log ? log.status : 'Not Clocked In';

                      return (
                        <tr key={emp.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm uppercase">
                                {fullName.slice(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">{fullName}</h4>
                                <span className="text-xs text-slate-500">{emp.user?.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-slate-600 font-medium">
                            {emp.department?.department_name || 'N/A'}
                          </td>
                          <td className="p-5 text-slate-600 font-mono">
                            {log?.clock_in ? new Date(log.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                          </td>
                          <td className="p-5 text-slate-600 font-mono">
                            {log?.clock_out ? new Date(log.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                          </td>
                          <td className="p-5 text-slate-700 font-semibold font-mono">
                            {log?.total_hours !== null && log?.total_hours !== undefined ? `${log.total_hours} hrs` : '--'}
                          </td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(initialStatus)}`}>
                              {initialStatus}
                            </span>
                          </td>
                          <td className="p-5 text-slate-500 text-xs italic max-w-xs truncate" title={log?.remarks}>
                            {log?.remarks || '--'}
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => {
                                // Load details into modal for editing
                                setModalData({
                                  employeeId: emp.id.toString(),
                                  date: hrDate,
                                  clockIn: log?.clock_in ? new Date(log.clock_in).toTimeString().slice(0, 5) : '',
                                  clockOut: log?.clock_out ? new Date(log.clock_out).toTimeString().slice(0, 5) : '',
                                  status: log?.status || 'Present',
                                  remarks: log?.remarks || ''
                                });
                                setIsModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg border text-indigo-600 hover:bg-indigo-50 border-indigo-200 text-xs font-semibold shadow-sm transition"
                            >
                              Adjust
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MANUAL OVERRIDE MODAL -------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/40">
              <h3 className="font-extrabold text-slate-800 text-lg">Mark Attendance Manually</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-xl transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Select Employee</label>
                <select
                  required
                  value={modalData.employeeId}
                  onChange={(e) => setModalData(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 border-slate-200"
                >
                  <option value="" disabled>-- Select Employee --</option>
                  {hrRecords.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {`${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.user?.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={modalData.date}
                    onChange={(e) => setModalData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                  <select
                    required
                    value={modalData.status}
                    onChange={(e) => setModalData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 border-slate-200"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Absent">Absent</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Clock In Time</label>
                  <input
                    type="time"
                    value={modalData.clockIn}
                    onChange={(e) => setModalData(prev => ({ ...prev, clockIn: e.target.value }))}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Clock Out Time</label>
                  <input
                    type="time"
                    value={modalData.clockOut}
                    onChange={(e) => setModalData(prev => ({ ...prev, clockOut: e.target.value }))}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Remarks / Reason</label>
                <textarea
                  placeholder="e.g. Forgot to clock in, medical appointment..."
                  value={modalData.remarks}
                  onChange={(e) => setModalData(prev => ({ ...prev, remarks: e.target.value }))}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 border-slate-200 resize-none h-20"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition active:scale-[0.98]"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
