import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserIcon,
  DocumentMagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  FlagIcon,
  Bars3Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { auth } from "../../firebase"; 
import { signOut } from "firebase/auth"; 

const sidebarItems = [
  { icon: UserIcon, text: "Profile", path: "/student-profile" },
  { icon: ListBulletIcon, text: "My Items", path: "/student-items" },
  { icon: FlagIcon, text: "Report Item", path: "/report-lost" },
  { icon: DocumentMagnifyingGlassIcon, text: "Search Item", path: "/student-search" },
  { icon: QuestionMarkCircleIcon, text: "Help & Support", path: "/student-help" },
];

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarDocked, setIsSidebarDocked] = useState(true);

  // Firebase logout
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
    <div
      className={`${
        isSidebarDocked ? "w-56" : "w-20"
      } bg-white text-gray-400 flex flex-col transition-all duration-300 shadow-2xl shadow-gray-400 p-4`}
    >
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
        onClick={handleLogout}
        className="flex items-center gap-3 px-5 py-3 mt-6 rounded-md text-sm transition-all duration-200 hover:bg-gray-400 hover:text-black"
      >
        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        {isSidebarDocked && <span>Log Out</span>}
      </button>
    </div>
  );
};

export default StudentSidebar;