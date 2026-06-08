import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle
} from 'lucide-react';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    designation: '',
    role: 'employee'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          'Registration failed'
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
          <span className="text-white font-black text-xl">
            E
          </span>
        </div>

        <h2 className="mt-6 text-center text-3xl font-black text-slate-900">
          Create Account
        </h2>

        <p className="mt-2 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border">

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center gap-2">
              <CheckCircle size={18} />
              Account created successfully
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-semibold">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg p-3"
                />
              </div>

            </div>

            <div>
              <label className="block text-sm font-semibold">
                Email
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Department
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3"
              >
                <option value="">
                  Select Department
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="Finance">
                  Finance
                </option>

                <option value="Marketing">
                  Marketing
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Designation
              </label>

              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3"
              >
                <option value="">
                  Select Designation
                </option>

                <option value="Employee">
                  Employee
                </option>

                <option value="HR Executive">
                  HR Executive
                </option>

                <option value="HR Manager">
                  HR Manager
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3"
              >
                <option value="employee">
                  Employee
                </option>

                <option value="hr">
                  HR
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Signup;