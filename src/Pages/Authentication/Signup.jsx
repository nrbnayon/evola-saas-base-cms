import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import signinImage from "../../assets/images/signin.png";
import apiClient from "../../lib/api-client";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");
  const isPasswordMatching = password && confirmPassword && password === confirmPassword;

  const onSubmit = async (data) => {
    try {
      const payload = {
        full_name: data.username,
        email_address: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        role: data.accountType,
      };

      const response = await apiClient.post("/auth/sign-up", payload);

      if (response.status === 200 || response.status === 201) {
        const { user_id } = response.data;
        navigate("/otp", { state: { user_id } });
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
      console.error("Signup failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 lg:grid lg:grid-cols-2">
      {/* Background Image for Large Screens */}
      <div className="hidden lg:flex lg:col-span-1 bg-blue-500">
        <img
          src={signinImage}
          className="w-full h-full object-cover"
          alt="Signup background"
        />
      </div>

      {/* Popup Layout for Small Devices */}
      <div className="relative flex items-center justify-center p-4 sm:p-6 min-h-screen lg:min-h-0 lg:col-span-1 lg:bg-transparent">
        {/* Background Image and Overlay for Small Devices */}
        <div className="lg:hidden absolute inset-0">
          <img
            src={signinImage}
            className="w-full h-full object-cover"
            alt="Signup background"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Form Container */}
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-white lg:bg-base-200 rounded-2xl lg:rounded-none shadow-xl lg:shadow-none p-4 sm:p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-4">
            Create an Account
          </h2>
          <p className="text-center text-xs sm:text-sm md:text-base mb-4 sm:mb-6 text-gray-600 lg:text-[#747086]">
            Join now to streamline your experience from day one.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 lg:text-gray-800">
                Account Type
              </label>
              <div className="relative">
                <select
                  {...register("accountType", {
                    required: "Please select an account type",
                  })}
                  className="w-full border border-gray-300 bg-gray-50 lg:bg-base-200 rounded-full px-3 py-2 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#C8C1F5]"
                >
                  <option value="">Select account type</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                </select>
              </div>
              {errors.accountType && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.accountType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 lg:text-gray-800">
                Full Name/Business Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("username", {
                    required: "Name is required",
                  })}
                  placeholder="Enter your Name"
                  className="w-full border border-gray-300 bg-gray-50 lg:bg-base-200 rounded-full px-3 py-2 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#C8C1F5]"
                />
                <FaUser className="absolute inset-y-2 sm:inset-y-3 right-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 lg:text-gray-800">
                Email
              </label>
              <div className="relative">
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
                  className="w-full border border-gray-300 bg-gray-50 lg:bg-base-200 rounded-full px-3 py-2 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#C8C1F5]"
                />
                <FaUser className="absolute inset-y-2 sm:inset-y-3 right-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 lg:text-gray-800">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="********"
                  className="w-full border border-gray-300 bg-gray-50 lg:bg-base-200 rounded-full px-3 py-2 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#C8C1F5]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 lg:text-gray-800">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="********"
                  className="w-full border border-gray-300 bg-gray-50 lg:bg-base-200 rounded-full px-3 py-2 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#C8C1F5]"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
              {!errors.confirm_password && confirmPassword && (
                <p className={`text-xs sm:text-sm mt-1 ${isPasswordMatching ? "text-green-500" : "text-red-500"}`}>
                  {isPasswordMatching ? "Passwords match!" : "Passwords do not match"}
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="text-red-500 text-xs sm:text-sm text-center">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={!isPasswordMatching}
              className={`w-full py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors ${
                isPasswordMatching
                  ? "bg-[#C8C1F5] hover:bg-[#b6acf7] text-black"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </form>

          <div className="divider text-xs sm:text-sm my-4 sm:my-6">
            Or Signup with
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="flex-1 flex items-center justify-center border border-gray-300 rounded-md py-2 sm:py-3 text-xs sm:text-sm hover:bg-gray-100 hover:shadow-lg transition-all">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center border border-gray-300 rounded-md py-2 sm:py-3 text-xs sm:text-sm hover:bg-gray-100 hover:shadow-lg transition-all">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              />
              Apple
            </button>
          </div>
          <p className="text-center text-xs sm:text-sm mt-4 sm:mt-6 text-gray-600 lg:text-[#747086]">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#b6acf7] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;