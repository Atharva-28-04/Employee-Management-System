import { useState } from 'react';
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
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">
            Available Leaves
          </p>

          <h2 className="text-4xl font-bold mt-2">
            18
          </h2>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">
            Leave Status
          </p>

          <h2 className="text-xl font-bold mt-3">
            No Pending Requests
          </h2>
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

              <option value="1">
                Casual Leave
              </option>

              <option value="2">
                Sick Leave
              </option>

              <option value="3">
                Paid Leave
              </option>
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