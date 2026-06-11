import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Search,
  Briefcase,
  Wrench,
  UserCircle,
  Clock,
} from 'lucide-react';
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  
const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);


useEffect(() => {
  const loadNotifications = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/v1/notifications'
      );

      const data = await response.json();

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);
    }
  };

  loadNotifications();
}, []);

  const handleLogout = () => {
    localStorage.clear();

    if (typeof logout === 'function') {
      logout();
    }

    navigate('/login');
  };

  const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },

  {
    name: 'My Profile',
    href: '/profile',
    icon: UserCircle
  },

  {
    name: 'Attendance',
    href: '/attendance',
    icon: Clock
  },

  ...(user?.role === 'hr'
    ? [

          {
  name: 'Employee List',
  href: '/employees',
  icon: Users
},


        {
          name: 'Employee Registry',
          href: '/register',
          icon: Users
        },
        {
          name: 'Department Master',
          href: '/departments',
          icon: Briefcase
        },
        {
          name: 'Skills Master',
          href: '/skills',
          icon: Wrench
        },
        {
          name: 'Asset Management',
           href: '/assets',
            icon: Briefcase
          },
{
  name: 'Audit Logs',
  href: '/audit-logs',
  icon: Briefcase
},

{
  name: 'Reports',
  href: '/reports',
  icon: Briefcase
},

        {
          name: 'HR Approvals',
          href: '/hr-leaves',
          icon: Briefcase
        }
      ]
    : []),

  {
    name: 'Apply Leave',
    href: '/leave-application',
    icon: Briefcase
  },

  {
    name: 'My Leaves',
    href: '/my-leaves',
    icon: Briefcase
  }
];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="relative w-64 h-full bg-slate-900 p-4">

            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>

            <div className="mt-12 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive(item.href)
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-72 bg-slate-900 text-white flex-col">

        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">
            EnterpriseMS
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive(item.href)
                  ? 'bg-indigo-600'
                  : 'hover:bg-slate-800'
              }`}
            >
              <item.icon size={18} />

              <span className="flex-1">
                {item.name}
              </span>

              {isActive(item.href) && (
                <ChevronRight size={16} />
              )}
            </Link>
          ))}

        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl"
          >
            <LogOut size={18} />
            End Session
          </button>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-white border-b h-16 flex items-center justify-between px-6">

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <div className="hidden md:flex items-center gap-2 border rounded-lg px-3 py-2">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none"
            />
          </div>

          <div className="flex items-center gap-4">

           <div className="relative">

  <button
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
    className="relative"
  >
    <Bell size={20} />

    {notifications.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
        {notifications.length}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border z-50">

      <div className="p-4 border-b">
        <h3 className="font-bold">
          Notifications
        </h3>
      </div>

      <div className="max-h-80 overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="p-4 text-gray-500">
            No Notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b hover:bg-gray-50"
            >
              <h4 className="font-semibold">
                {notification.title}
              </h4>

              <p className="text-sm text-gray-600">
                {notification.message}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
  )}

</div>

            <div className="text-right">
              <p className="font-semibold text-sm">
                {user?.email}
              </p>

              <span className="text-xs uppercase">
                {user?.role}
              </span>
            </div>

          </div>

        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}


      

export default Layout;