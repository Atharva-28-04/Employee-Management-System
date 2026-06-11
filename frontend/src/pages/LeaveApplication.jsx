import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiCalendar,
  FiFileText
} from 'react-icons/fi';

function LeaveApplication() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    leaveTypeId: '',
    fromDate: '',
    toDate: '',
    totalDays: '',
    reason: ''
  });

  const [balances, setBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [typesRes, balancesRes, myLeavesRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/leaves/types'),
        fetch(`http://localhost:5000/api/v1/leaves/balances?userId=${user?.id}`),
        fetch(`http://localhost:5000/api/v1/leaves/my-leaves?userId=${user?.id}`)
      ]);

      if (typesRes.ok) {
        const typesData = await typesRes.json();
        setLeaveTypes(typesData);
      }
      if (balancesRes.ok) {
        const balancesData = await balancesRes.json();
        setBalances(balancesData);
      }
      if (myLeavesRes.ok) {
        const myLeavesData = await myLeavesRes.json();
        const pending = myLeavesData.filter(l => l.status === 'Pending' || l.status === 'Manager Approved').length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error("Error loading leave resources:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'http://localhost:5000/api/v1/leaves/apply',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            ...formData
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Leave applied successfully');

        setFormData({
          leaveTypeId: '',
          fromDate: '',
          toDate: '',
          totalDays: '',
          reason: ''
        });
        loadData();
      } else {
        alert(data.message || 'Failed');
      }
    } catch (error) {
      console.error(error);
      alert('Server Error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-[0_20px_50px_rgba(99,102,241,0.35)] mb-8">

        <h1 className="text-4xl font-bold mb-2">
          Apply Leave
        </h1>

        <p className="text-indigo-100">
          Submit your leave request for approval
        </p>

      </div>

      {/* INFO CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        {/* Dynamic Leave Balances */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Available Leave Balances</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {balances.length === 0 ? (
              <div className="col-span-full text-slate-400 text-sm">No leave balances initialized yet.</div>
            ) : (
              balances.map(b => (
                <div key={b.id} className="bg-slate-50 border rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-slate-600 text-xs font-semibold truncate" title={b.leaveType?.leave_name}>
                    {b.leaveType?.leave_name}
                  </span>
                  <span className="text-2xl font-black text-slate-800 mt-2">
                    {b.available_days}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Days left</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Pending Status */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-indigo-100">Pending Approvals</p>
            <h2 className="text-5xl font-black mt-4">
              {pendingCount}
            </h2>
          </div>
          <p className="text-xs text-indigo-200 mt-4 font-medium">
            {pendingCount > 0 ? "Awaiting manager or HR sign-off" : "No pending leave applications"}
          </p>
        </div>

      </div>

      {/* FORM CARD */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800">

        <h2 className="text-white text-2xl font-bold mb-6">
          Leave Request Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* LEAVE TYPE */}
          <div>

            <label className="block text-slate-300 mb-2">
              Leave Type
            </label>

            <select
              name="leaveTypeId"
              value={formData.leaveTypeId}
              onChange={handleChange}
              required
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                rounded-xl
                p-4
                focus:border-indigo-500
                outline-none
              "
            >
              <option value="">
                Select Leave Type
              </option>
              {leaveTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.leave_name} (Max {type.total_days} Days)
                </option>
              ))}
            </select>

          </div>

          {/* DATES */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block text-slate-300 mb-2">
                From Date
              </label>

              <div className="relative">

                <FiCalendar
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
                />

                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    text-white
                    rounded-xl
                    p-4
                    pl-12
                    focus:border-indigo-500
                    outline-none
                  "
                />

              </div>

            </div>

            <div>

              <label className="block text-slate-300 mb-2">
                To Date
              </label>

              <div className="relative">

                <FiCalendar
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
                />

                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    text-white
                    rounded-xl
                    p-4
                    pl-12
                    focus:border-indigo-500
                    outline-none
                  "
                />

              </div>

            </div>

          </div>

          {/* TOTAL DAYS */}
          <div>

            <label className="block text-slate-300 mb-2">
              Total Days
            </label>

            <input
              type="number"
              name="totalDays"
              value={formData.totalDays}
              onChange={handleChange}
              placeholder="Enter total leave days"
              required
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                placeholder:text-slate-400
                rounded-xl
                p-4
                focus:border-indigo-500
                outline-none
              "
            />

          </div>

          {/* REASON */}
          <div>

            <label className="block text-slate-300 mb-2">
              Reason
            </label>

            <div className="relative">

              <FiFileText
                className="
                absolute
                left-4
                top-4
                text-slate-400
              "
              />

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Explain the reason for leave..."
                className="
                  w-full
                  bg-slate-800
                  border
                  border-slate-700
                  text-white
                  placeholder:text-slate-400
                  rounded-xl
                  p-4
                  pl-12
                  resize-none
                  focus:border-indigo-500
                  outline-none
                "
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              py-4
              rounded-xl
              text-white
              font-bold
              text-lg
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              hover:scale-[1.02]
              hover:shadow-xl
              transition-all
              duration-300
            "
          >
            Submit Leave Request
          </button>

        </form>

      </div>

    </div>
  );
}

export default LeaveApplication;