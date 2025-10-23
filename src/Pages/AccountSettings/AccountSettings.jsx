import { useState } from 'react';
import { DollarSign, Edit2, Eye, LogOut, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Account Settings');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [fullName, setFullName] = useState('Daniel Smith');
  const [phone, setPhone] = useState('+1 25556 5585 99');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [notifications, setNotifications] = useState({
    popup: true,
    chat: true,
    updates: false,
  });

  const userRole = localStorage.getItem("userRole");

  let menuItems = [
  'Account Settings',
  'Notifications',
  'Privacy & Policy',
  'Log Out',
];

if (userRole === "buyer") {
  menuItems.splice(3, 0, 'Payment History'); 
} else if (userRole === "seller") {
  menuItems.splice(3, 0, 'Payment & Withdraw');
}

  const handleMenuClick = (item) => {
    if (item === 'Log Out') {
      setShowLogoutModal(true);
    } else {
      setActiveSection(item);
    }
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'new' || name === 'confirm') {
      setPasswordError('');
    }
  };

  const handlePasswordSave = () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New password and confirm password must match');
      return;
    }
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError('All password fields are required');
      return;
    }
    // Placeholder for password update logic (e.g., API call)
    console.log('Password updated:', { current: passwords.current, new: passwords.new });
    setEditingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
    setPasswordError('');
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/signin");
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Account Settings':
        return (
          <div className="space-y-8">
            {/* Your name section */}
            {editingName ? (
              <div >
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your name</h3>
                <p className="text-gray-600 text-sm mb-4">Make sure this matches the name on your gov. ID</p>
                <div className="space-y-4 shadow-xl p-4 rounded-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Daniel Pagla"
                      maxLength={32}
                    />
                    <p className="text-right text-sm text-gray-500 mt-1">Text limit {fullName.length}/32</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setEditingName(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        console.log('Name updated:', fullName);
                        setEditingName(false);
                      }}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Your name</h3>
                  <p className="text-gray-600">{fullName}</p>
                </div>
                <button
                  onClick={() => setEditingName(true)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            )}

            {/* Phone number section */}
            {editingPhone ? (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Phone number</h3>
                <p className="text-gray-600 text-sm mb-4">Enter a valid phone number</p>
                <div className="space-y-4 shadow-xl p-4 rounded-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+1 123 456 7890"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setEditingPhone(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        console.log('Phone updated:', phone);
                        setEditingPhone(false);
                      }}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Phone number</h3>
                  <p className="text-gray-600">{phone}</p>
                </div>
                <button
                  onClick={() => setEditingPhone(true)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            )}

            {/* Email section (view-only) */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Email</h3>
                <p className="text-gray-600">danialpagla556@gmail.com</p>
              </div>
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </div>

            {/* Password section */}
            {editingPassword ? (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Change password</h3>
                <p className="text-gray-600 text-sm mb-4">Enter your current and new password</p>
                <div className="space-y-4 shadow-xl p-4 rounded-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                    <input
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                    <input
                      type="password"
                      name="new"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="New password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
                    <input
                      type="password"
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setEditingPassword(false);
                        setPasswords({ current: '', new: '', confirm: '' });
                        setPasswordError('');
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordSave}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Password</h3>
                  <p className="text-gray-600">•••••••••••••</p>
                </div>
                <button
                  onClick={() => setEditingPassword(true)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Change</span>
                </button>
              </div>
            )}
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-6 bg-gray-50 p-4 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Pop up notification on desktop</h3>
              </div>
              <div className="relative w-12 h-6 cursor-pointer" onClick={() => handleToggle('popup')}>
                <input
                  type="checkbox"
                  checked={notifications.popup}
                  onChange={() => handleToggle('popup')}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
                    notifications.popup ? 'bg-purple-500' : 'bg-gray-300'
                  } hover:bg-opacity-90`}
                ></div>
                <div
                  className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${
                    notifications.popup ? 'translate-x-6' : 'translate-x-0'
                  } hover:scale-110`}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Turn on all chat notification</h3>
              </div>
              <div className="relative w-12 h-6 cursor-pointer" onClick={() => handleToggle('chat')}>
                <input
                  type="checkbox"
                  checked={notifications.chat}
                  onChange={() => handleToggle('chat')}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
                    notifications.chat ? 'bg-purple-500' : 'bg-gray-300'
                  } hover:bg-opacity-90`}
                ></div>
                <div
                  className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${
                    notifications.chat ? 'translate-x-6' : 'translate-x-0'
                  } hover:scale-110`}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Turn on new update notification</h3>
              </div>
              <div className="relative w-12 h-6 cursor-pointer" onClick={() => handleToggle('updates')}>
                <input
                  type="checkbox"
                  checked={notifications.updates}
                  onChange={() => handleToggle('updates')}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
                    notifications.updates ? 'bg-purple-500' : 'bg-gray-300'
                  } hover:bg-opacity-90`}
                ></div>
                <div
                  className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${
                    notifications.updates ? 'translate-x-6' : 'translate-x-0'
                  } hover:scale-110`}
                ></div>
              </div>
            </div>
          </div>
        );

      case 'Privacy & Policy':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Information We Collect</h3>
              <p className="text-gray-600 mb-4">We may collect the following information:</p>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Personal information: Name, email address, phone number, billing/shipping address.</li>
                <li>• Account Details: Username, password, vendor profile details.</li>
                <li>• Transaction Information: Orders, payments, refunds.</li>
                <li>• Usage Data: IP address, browser type, device information, and site activity.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">2. How We Use Your Information</h3>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Process orders and payments.</li>
                <li>• Manage vendor and customer accounts.</li>
                <li>• Provide customer support.</li>
                <li>• Improve platform features and security.</li>
                <li>• Send updates, promotions, and important notifications.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">3. Information Sharing</h3>
              <p className="text-gray-600 mb-4">We may share information with:</p>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Vendors, to fulfill your orders.</li>
                <li>• Payment processors, for secure transactions.</li>
                <li>• Service providers (e.g., shipping companies, IT services).</li>
                <li>• Law enforcement, if required by law.</li>
              </ul>
              <p className="text-gray-600 mt-4">We do <strong>not</strong> sell your personal data to third parties.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">4. Data Security</h3>
              <p className="text-gray-600">We implement industry-standard security measures to protect your data. However, no online transmission is 100% secure.</p>
            </div>
          </div>
        );

      case 'Payment History':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Wedding Photography</h3>
                  <p className="text-gray-600 text-sm">Order #12345 • March 15, 2025</p>
                </div>
                <span className="text-green-600 font-semibold">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-800">Stripe</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold text-gray-800">$2,450</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Wedding Venue Booking</h3>
                  <p className="text-gray-600 text-sm">Order #12346 • March 10, 2025</p>
                </div>
                <span className="text-orange-600 font-semibold">Pending</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-800">PayPal</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold text-gray-800">$6,785</span>
              </div>
            </div>
          </div>
        );
      
      case 'Payment & Withdraw':
        return (
          <div className="">
            <div className="bg-white rounded-lg shadow-xl p-4 w-96">
              <div className="mb-4 p-3 rounded-lg bg-gray-100">
                <div className="flex items-center mb-2 gap-2">
                  <Wallet/>
                  <h2 className="text-lg font-semibold">Available Balance</h2>
                </div>
                <p className="text-2xl font-bold">$2,788 USD</p>
              </div>
              <div className="mb-6 p-3 rounded-lg bg-gray-100">
                <div className="flex items-center mb-2 gap-2">
                  <DollarSign/>
                  <h2 className="text-lg font-semibold">Total Income (This Month)</h2>
                </div>
                <p className="text-2xl font-bold">$2,788 USD</p>
              </div>
              <button className="w-full bg-[#171135] text-white py-3 rounded-lg font-semibold hover:bg-[#121135] cursor-pointer">
                Withdraw
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen container mx-auto mt-30 md:mt-15">
      <div className="px-4 py-8  ">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
              alt="John D."
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">John D.</h1>
            <p className="text-gray-600">Update your username and manage your account</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition duration-300 ease-in-out flex items-center space-x-3 ${
                    activeSection === item
                      ? 'bg-gray-200 text-gray-900 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  {item === 'Log Out' && <LogOut className="w-5 h-5" />}
                  <span>{item}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-8">{activeSection}</h2>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Log Out</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
              
                onClick={() => {handleLogout();
                  setShowLogoutModal(false);
                  // Handle logout logic here
                }}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}