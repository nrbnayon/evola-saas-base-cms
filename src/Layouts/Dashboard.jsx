import logo from "../assets/logo/logo.png";
import user from "../assets/icons/user.png";
import Logout from "../assets/icons/logout.png";
import HomeIconSvg from "../assets/icons/Home.svg"; // Import as string (to be replaced with component via @svgr/webpack)
import UserIconSvg from "../assets/icons/Users.svg"; // Import as string (to be replaced with component via @svgr/webpack)
import ShoppingIconSvg from "../assets/icons/shopping.svg"; // Import as string (to be replaced with component via @svgr/webpack)
import LaborIconSvg from "../assets/icons/labor.svg"; // Import as string (to be replaced with component via @svgr/webpack)
import ContentIconSvg from "../assets/icons/content.svg"; // Import as string (to be replaced with component via @svgr/webpack)
import PrivacyIconSvg from "../assets/icons/privacy.svg"; // Import as string (to be replaced with component via @svgr/webpack)
import ServicesIconSvg from "../assets/icons/power-service.svg"; // Import as string (to be replaced with component via @svgr/webpack)
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Dashboard = () => {
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
        localStorage.removeItem("userRole");
        navigate("/signin");
      }
    });
  };

  // Menu configuration
  const menus = [
    { title: "Dashboard", path: "/admin/dashboard", icon: HomeIconSvg },
    { title: "User", path: "/admin/user", icon: UserIconSvg },
    { title: "Order", path: "/admin/order", icon: ShoppingIconSvg },
    { title: "Services", path: "/admin/service", icon: ServicesIconSvg },
    { title: "Seller request", path: "/admin/request", icon: LaborIconSvg },
    { title: "Content", path: "/admin/content", icon: ContentIconSvg },
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
        <footer className="mt-28 p-2 absolute bottom-2 w-full">
          <div className="flex items-center justify-center gap-x-3">
            <Link className="flex items-center gap-x-3 p-2 text-sm">
              <div className="rounded-full p-3 bg-purple-50">
                <img src={user} alt="Profile" className="w-5" />
              </div>
              <span>
                <p className="font-bold">John Cena</p>
                <p className="text-xs">Super Admin</p>
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
