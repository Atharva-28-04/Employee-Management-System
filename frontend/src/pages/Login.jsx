import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const { login } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();


setError('');
setLoading(true);

try {
  const response = await fetch(
    'http://localhost:5000/api/auth/login',
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
  setLoading(false);
}


};

return ( <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"> <div className="sm:mx-auto sm:w-full sm:max-w-md">


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
