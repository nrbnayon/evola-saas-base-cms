import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  MessageCircleMore,
  User,
  Menu,
  X,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const notifications = [
    {
      id: 1,
      type: "Wedding Photography",
      location: "Overland Park, KS",
      fullLocation: "Overland Park, KS",
      time: "5m",
      avatar: "WP",
      isOnline: true,
    },
    {
      id: 2,
      type: "Wedding Photography",
      location: "Overland Park, KS",
      fullLocation: "Overland Park, KS",
      time: "5m",
      avatar: "WP",
      isOnline: true,
    },
    {
      id: 3,
      type: "Wedding Photography",
      location: "Overland Park, KS",
      fullLocation: "Overland Park, KS",
      time: "5m",
      avatar: "WP",
      isOnline: true,
    },
    {
      id: 4,
      type: "Wedding Photography",
      location: "Overland Park, KS",
      fullLocation: "Overland Park, KS",
      time: "5m",
      avatar: "WP",
      isOnline: true,
    },
    {
      id: 5,
      type: "Wedding Photography",
      location: "Overland Park, KS",
      fullLocation: "Overland Park, KS",
      time: "5m",
      avatar: "WP",
      isOnline: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setIsNotificationOpen(false);
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      )
        setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setIsUserDropdownOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="h-8 w-32">
            {userRole === "seller" ? (
              <Link to="/seller-overview">
                <img src={logo} alt="Logo" />
              </Link>
            ) : (
              <Link to="/">
                <img src={logo} alt="Logo" />
              </Link>
            )}
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for any services or categories..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8C1F5] focus:border-transparent"
              />
              <div className="absolute right-3 top-2">
                <Search className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {userRole ? (
              <>
                {(userRole === "buyer" || userRole === "seller") && (
                  <>
                    <div className="relative" ref={notificationRef}>
                      <button
                        onClick={() =>
                          setIsNotificationOpen(!isNotificationOpen)
                        }
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notifications.length}
                          </span>
                        )}
                      </button>
                      {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900">
                              Notification ({notifications.length})
                            </h3>
                          </div>
                          <div className="py-2">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      {notification.avatar}
                                    </div>
                                    {notification.isOnline && (
                                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                      {notification.type}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {notification.fullLocation}
                                    </p>
                                    <span className="text-xs text-gray-400 mt-1 inline-block">
                                      {notification.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 border-t border-gray-100 text-center">
                            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              View All Notifications
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <Link
                      to="/conversation"
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <MessageCircleMore className="w-5 h-5" />
                    </Link>
                  </>
                )}
                {userRole === "buyer" && (
                  <>
                    <Link
                      to="/saved"
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </Link>
                  </>
                )}
                <Link
                  to="/order"
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Link>
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                      <Link
                        to={
                          userRole === "buyer"
                            ? "/buyer-profile"
                            : userRole === "seller"
                            ? "/seller-profile"
                            : "/"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Account Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/signin"
                className="p-2 bg-[#C8C1F5] hover:bg-[#b6acf7] text-black rounded-full px-4"
              >
                Log In
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for any services or categories..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {userRole ? (
                <>
                  {(userRole === "buyer" || userRole === "seller") && (
                    <>
                      <Link
                        to="/notification"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5" />
                          <span>Notifications</span>
                        </div>
                        {notifications.length > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notifications.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/conversation"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <MessageCircleMore className="w-5 h-5" />
                        <span>Messages</span>
                      </Link>
                    </>
                  )}
                  {userRole === "buyer" && (
                    <>
                      <Link
                        to="/saved"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                        <span>Favorites</span>
                      </Link>
                    </>
                  )}
                  <Link
                    to="/order"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </Link>
                  <Link
                    to={
                      userRole === "buyer"
                        ? "/buyer-profile"
                        : userRole === "seller"
                        ? "/seller-profile"
                        : "/"
                    }
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <span>Log In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
