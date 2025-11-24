import { useState, useEffect } from 'react';
import { DollarSign, Edit2, Eye, LogOut, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { removeAuthTokens } from '../../lib/cookie-utils';
import useMe from '../../hooks/useMe';
import apiClient from '../../lib/api-client';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function AccountSettings() {
  const { user, loading, refetch } = useMe();
  console.log(user, 'user from useMe');
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Account Settings');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  // const [notifications, setNotifications] = useState({
  //   popup: true,
  //   chat: true,
  //   updates: false,
  // });

  // Update fullName, phone, and image preview states when user data changes
  useEffect(() => {
    setFullName(user?.full_name || '');
    setPhone(user?.phone_number || '');
    setImagePreview(user?.photo || '');
  }, [user]);

  const userRole = user?.role?.toLowerCase() || localStorage.getItem("userRole");

  let menuItems = ['Account Settings', 'Privacy & Policy', 'Log Out'];
  if (userRole === "buyer") {
    menuItems.splice(2, 0, 'Payment History');
  } else if (userRole === "seller") {
    menuItems.splice(2, 0, 'Payment & Withdraw');
  }

  const handleMenuClick = (item) => {
    if (item === 'Log Out') {
      setShowLogoutModal(true);
    } else {
      setActiveSection(item);
    }
  };

  // const handleToggle = (key) => {
  //   setNotifications((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (only allow images)
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file', { position: 'top-end', autoClose: 3000 });
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB', { position: 'top-end', autoClose: 3000 });
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSave = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to upload', { position: 'top-end', autoClose: 3000 });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('photo', selectedImage);
      await apiClient.put('/user/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile image updated successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      setEditingImage(false);
      setSelectedImage(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update image', {
        position: 'top-end',
        autoClose: 3000,
      });
    }
  };

  const handleNameSave = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required', { position: 'top-end', autoClose: 3000 });
      return;
    }
    try {
      await apiClient.put('/user/update', { full_name: fullName });
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Name updated successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      setEditingName(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name', {
        position: 'top-end',
        autoClose: 3000,
      });
    }
  };

  const handlePhoneSave = async () => {
    if (!phone.trim()) {
      toast.error('Phone number is required', { position: 'top-end', autoClose: 3000 });
      return;
    }
    if (!/^\+?\d{10,}$/.test(phone)) {
      toast.error('Please enter a valid phone number', { position: 'top-end', autoClose: 3000 });
      return;
    }
    try {
      await apiClient.put('/user/update', { phone_number: phone });
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Phone number updated successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      setEditingPhone(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update phone number', {
        position: 'top-end',
        autoClose: 3000,
      });
    }
  };

  const handlePasswordSave = async () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New password and confirm password must match');
      return;
    }
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError('All password fields are required');
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    try {
      await apiClient.put('/user/update', {
        current_password: passwords.current,
        new_password: passwords.new,
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Password updated successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      setEditingPassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordError('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    removeAuthTokens();
    localStorage.removeItem("userRole");
    navigate("/signin");
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Account Settings':
        return (
          <div className="space-y-8">
            {/* Profile image section */}
            {editingImage ? (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Profile Image</h3>
                <p className="text-gray-600 text-sm mb-4">Upload a new profile image</p>
                <div className="space-y-4 shadow-xl p-4 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={imagePreview || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setEditingImage(false);
                        setSelectedImage(null);
                        setImagePreview(user?.photo || '');
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImageSave}
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
                  <h3 className="text-lg font-medium text-gray-800">Profile Image</h3>
                  <div className="w-16 h-16 rounded-full overflow-hidden mt-2">
                    <img
                      src={user?.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s"}
                      alt={user?.full_name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                  <button
                    onClick={() => setEditingImage(true)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
              </div>
            )}

            {/* Your name section */}
            {editingName ? (
              <div>
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
                      placeholder="Enter your full name"
                      maxLength={32}
                    />
                    <p className="text-right text-sm text-gray-500 mt-1">Text limit {fullName.length}/32</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setFullName(user?.full_name || '');
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNameSave}
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
                  <p className="text-gray-600">{user?.full_name || 'Not set'}</p>
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
                      onClick={() => {
                        setEditingPhone(false);
                        setPhone(user?.phone_number || '');
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePhoneSave}
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
                  <p className="text-gray-600">{user?.phone_number || 'Not set'}</p>
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
                <p className="text-gray-600">{user?.email_address || 'Not set'}</p>
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
                  <Wallet />
                  <h2 className="text-lg font-semibold">Available Balance</h2>
                </div>
                <p className="text-2xl font-bold">$2,788 USD</p>
              </div>
              <div className="mb-6 p-3 rounded-lg bg-gray-100">
                <div className="flex items-center mb-2 gap-2">
                  <DollarSign />
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto">
      <div className="px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={user?.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:tbnpng&s"}
              alt={user?.full_name || "User Avatar"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.full_name || 'User'}</h1>
            <p className="text-gray-600">{user?.role || 'Unknown Role'}</p>
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
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
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