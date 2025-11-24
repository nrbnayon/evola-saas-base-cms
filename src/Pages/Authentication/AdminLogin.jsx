import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import signinImage from "../../assets/images/signin.png";
import apiClient from "../../lib/api-client";
import { setAuthTokens } from "../../lib/cookie-utils";

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        email_address: data.email,
        password: data.password,
      };

      const response = await apiClient.post("/auth/sign-in", payload);

      if (response.status === 200 || response.status === 201) {
        const { access_token, refresh_token } = response.data;

        const accessTokenMaxAge = data.remember
          ? 30 * 24 * 60 * 60
          : 1 * 60 * 60;

        setAuthTokens(access_token, refresh_token, {
          maxAge: accessTokenMaxAge,
        });
        if (response?.data?.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      console.error("Sign-in failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Left Section: Background Image for Large Screens */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${signinImage})` }}
      >
        <div className="flex items-center justify-center w-full bg-[#C8C1F5]/50">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-lg opacity-80">
              Securely manage your platform with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="relative flex items-center justify-center p-6 min-h-screen lg:w-1/2 lg:min-h-0">
        {/* Background Image and Overlay for Small Devices */}
        <div className="lg:hidden absolute inset-0">
          <img
            src={signinImage}
            className="w-full h-full object-cover"
            alt="Sign-in background"
          />
          <div className="absolute inset-0 bg-[#C8C1F5]/40"></div>
        </div>

        {/* Form Card */}
        <div className="relative w-full max-w-md bg-white/90 lg:bg-white rounded-lg shadow-lg p-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Admin Login
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Sign in to access the admin dashboard
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 bg-gray-50 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8C1F5]"
                />
                <FaUser className="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="py-5">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 bg-gray-50 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8C1F5]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-end items-center text-sm">
                <Link
                  to="/forgot-password"
                  className="text-[#1E40AF] hover:text-[#1E3A8A] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#C8C1F5] to-[#b6acf7] text-gray-800 py-3 rounded-md text-sm font-medium hover:from-[#b6acf7] hover:to-[#a19bf5] transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-gray-800"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0l4 4-4 4z"
                  ></path>
                </svg>
              ) : null}
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
