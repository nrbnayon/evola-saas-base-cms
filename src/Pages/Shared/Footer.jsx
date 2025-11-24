// src/components/Footer.jsx
import { useState } from "react";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import apiClient from "../../lib/api-client";
import Swal from "sweetalert2";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email || !email.trim() || !email.includes("@") || !email.includes(".")) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Fix: Send `email_address` instead of `email`
      const response = await apiClient.post("/site/subscribe", {
        email_address: email.trim(), // Backend expects this
      });

      console.log("Subscribed:", response.data);

      Swal.fire({
        icon: "success",
        title: "Subscribed Successfully!",
        text: `Welcome ${response.data.email_address}!`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);

      // Safe error extraction
      const errorData = err.response?.data;
      let errorMsg = "Subscription failed. Please try again.";

      if (errorData) {
        if (typeof errorData === "string") {
          errorMsg = errorData;
        } else if (errorData.email_address) {
          errorMsg = errorData.email_address;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        } else if (errorData.error) {
          errorMsg = errorData.error;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: errorMsg,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white md:py-16 py-7 container mx-auto">
      <div className="px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <div className="h-8 w-32">
              <Link to="/">
                <img src={logo} alt="Evola" className="h-full w-full object-contain" />
              </Link>
            </div>
            <p className="text-gray-600 max-w-xs">
              Trusted local services at your fingertips.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-center justify-center w-full lg:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="md:w-[300px] w-full h-12 px-4 border-2 border-gray-200 rounded-l-full text-gray-700 placeholder-gray-500 focus:outline-none focus:border-[#8272ED] transition-colors"
              placeholder="Enter your email"
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`h-12 px-6 font-semibold text-white rounded-r-full transition-all duration-300 flex items-center justify-center min-w-[120px] ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#8272ED] hover:bg-[#6c5ce7] shadow-md"
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        </div>

        {/* Rest of footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {["Company", "Legal", "Providers", "Follow Us"].map((section) => (
            <div key={section}>
              <h3 className="text-gray-900 font-semibold mb-4">{section}</h3>
              <ul className="space-y-3">
                {section === "Company" && (
                  <>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">About Us</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Contact Us</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Blog</a></li>
                  </>
                )}
                {section === "Legal" && (
                  <>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Terms</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Privacy</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Help Center</a></li>
                  </>
                )}
                {section === "Providers" && (
                  <>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Join Now</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Dashboard</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Payments</a></li>
                  </>
                )}
                {section === "Follow Us" && (
                  <>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Facebook</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">Linkedin</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#8272ED]">YouTube</a></li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-7">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal" className="h-6" />
              <span className="text-gray-600 font-semibold text-sm">Klarna</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 <span className="text-[#8272ED] font-medium">Evola</span>. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;