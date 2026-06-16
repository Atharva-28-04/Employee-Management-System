import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showColdStartWarning, setShowColdStartWarning] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);
    setShowColdStartWarning(false);

    // If the request takes more than 3 seconds, show the cold start alert
    const timer = setTimeout(() => {
      setShowColdStartWarning(true);
    }, 3000);

    try {
      const response = await fetch(
        'http://localhost:5000/api/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Invalid email or password.'
        );
      }

      login(
        data.user,
        data.accessToken,
        data.refreshToken
      );

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setShowColdStartWarning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white font-black text-xl tracking-wider">
            E
          </span>
        </div>

        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
          Welcome Back
        </h2>

        <p className="mt-2 text-center text-sm text-slate-500">
          Or{' '}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500 inline-flex items-center gap-1"
          >
            create an account
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {showColdStartWarning && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm flex items-start gap-3 animate-pulse">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Server is waking up...</p>
                <p className="text-xs mt-1 leading-relaxed text-amber-700">
                  Our API is hosted on Render's free tier. After a period of inactivity, the server spins down and can take up to 50 seconds to boot. Thank you for your patience!
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold">
                Email Address
              </label>

              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Password
              </label>

              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
