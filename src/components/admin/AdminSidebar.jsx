import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ListBulletIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { auth } from "../../firebase"; 
import { signOut } from "firebase/auth"; 

const sidebarItems = [
  { icon: UserIcon, text: "Profile", path: "/admin-profile" },
  { icon: ListBulletIcon, text: "Items", path: "/items" },
  { icon: QuestionMarkCircleIcon, text: "Help & Support", path: "/admin-help" },
  { icon: UsersIcon, text: "Manage Admins", path: "/manage-admins" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarDocked, setIsSidebarDocked] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate("/"); 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarDocked(!isSidebarDocked);
  };

  return (
    <div className={`${
      isSidebarDocked ? "w-56" : "w-20"
    } bg-white text-gray-400 flex flex-col transition-all duration-300 shadow-2xl shadow-gray-400 p-4 relative z-10`}>
      <div className="flex items-center justify-between mb-6 font-bold text-amber-500">
        {isSidebarDocked && <span className="whitespace-nowrap ml-2">WELCOME!</span>}
        <button
          onClick={toggleSidebar}
          className="text-amber-500 p-1 rounded-md flex justify-center items-center"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-5 py-3 rounded-md text-sm transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-amber-100 text-stone-900 border-l-4 border-amber-600"
                : "hover:bg-amber-400/40 hover:text-black"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isSidebarDocked && <span>{item.text}</span>}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setShowLogoutModal(true)}
        className="flex items-center gap-3 px-5 py-3 mt-6 rounded-md text-sm transition-all duration-200 hover:bg-gray-400 hover:text-black"
      >
        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        {isSidebarDocked && <span>Log Out</span>}
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold text-black">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
