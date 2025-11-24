import logo from "../assets/logo/logo.png";
import Logout from "../assets/icons/logout.png";
import HomeIconSvg from "../assets/icons/Home.svg"; 
import UserIconSvg from "../assets/icons/Users.svg"; 
import ShoppingIconSvg from "../assets/icons/shopping.svg"; 
import LaborIconSvg from "../assets/icons/labor.svg"; 
import ContentIconSvg from "../assets/icons/content.svg"; 
import PrivacyIconSvg from "../assets/icons/privacy.svg"; 
import ServicesIconSvg from "../assets/icons/power-service.svg"; 
import AdvertisementIcon from "../assets/icons/advertisement.svg"; 
import SubscribersIcon from "../assets/icons/subscribers.svg"; 

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useMe from "../hooks/useMe";
import { removeAuthTokens } from "../lib/cookie-utils";

const Dashboard = () => {
  const { user } = useMe();
  // console.log(user);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout logic
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "No, Cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAuthTokens()
        navigate("/admin-auth");
      }
    });
  };

  // Menu configuration
  const menus = [
    { title: "Dashboard", path: "/admin/dashboard", icon: HomeIconSvg },
    { title: "User", path: "/admin/user", icon: UserIconSvg },
    { title: "Order", path: "/admin/order", icon: ShoppingIconSvg },
    { title: "Services", path: "/admin/service", icon: ServicesIconSvg },
    { title: "service request", path: "/admin/request", icon: LaborIconSvg },
    { title: "Subscriber List", path: "/admin/subscribers", icon: SubscribersIcon },
    { title: "Advertisement", path: "/admin/advertisement", icon: AdvertisementIcon },
    { title: "Category", path: "/admin/categories", icon: ShoppingIconSvg },
    { title: "Content", path: "/admin/content", icon: ContentIconSvg },
    { title: "Boosting", path: "/admin/boosting", icon: ContentIconSvg },
    { title: "Privacy", path: "/admin/add-privacy", icon: PrivacyIconSvg },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 shadow-lg border-r border-gray-200 fixed left-0 top-0 bottom-0 z-50 pt-8 bg-white transition-all duration-500">
        {/* Logo Section */}
        <div className="p-2 flex flex-col items-center justify-center">
          <img src={logo} alt="Logo" className="cursor-pointer w-3/4 mb-1" />
        </div>

        {/* Navigation Menu */}
        <nav className="mt-10 p-5 space-y-3">
          {menus.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className={`flex items-center py-2 px-7 text-sm rounded-lg cursor-pointer transition-colors ${
                location.pathname === menu.path
                  ? "bg-[#EFEEF9] text-[#9C6ED9]"
                  : "text-gray-600 hover:bg-[#EFEEF9]"
              }`}
            >
              <img src={menu.icon} className={`w-6 h-6`} />
              <span className="ml-3">{menu.title}</span>
            </Link>
          ))}
        </nav>

        {/* Profile and Logout */}
        <footer className="bottom-0 p-2 absolute w-full bg-white">
          <div className="flex items-center justify-center gap-x-3">
            <Link to='/admin/dashboard' className="flex items-center gap-x-3 p-2 text-sm">
              <div className="rounded-full w-12 h-12 bg-purple-50 overflow-hidden flex items-center justify-center">
                <img
                  src={user?.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>
                <p className="font-bold">{user?.full_name}</p>
                <p className="text-xs">{user?.role}</p>
              </span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
              }}
              className="text-2xl cursor-pointer"
            >
              <img src={Logout} alt="Logout" className="w-10" />
            </button>
          </div>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-64 overflow-y-auto bg-gray-50 transition-all duration-500">
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
