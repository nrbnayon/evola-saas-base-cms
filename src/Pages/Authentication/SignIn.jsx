import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import signinImage from "../../assets/images/signin.png";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("buyer"); // Default role is user
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const fillDummyCredentials = () => {
    if (role === "admin") {
      setValue("username", "admin@example.com");
      setValue("password", "Admin@1234");
    } else if (role === "seller") {
      setValue("username", "seller@example.com");
      setValue("password", "seller@1234");
    } else {
      setValue("username", "buyer@example.com");
      setValue("password", "buyer@1234");
    }
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Store role in localStorage
    localStorage.setItem("userRole", role);
    // Simulate successful login and redirect based on role
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "seller") {
      navigate("/seller-overview");
    } else {
      navigate("/");
    }
  };


  return (
    <div className="grid grid-cols-2 min-h-screen bg-base-200">
      <div className="col-span-1 bg-blue-500 flex items-center">
        <img src={signinImage} className="object-cover h-full" alt="" />
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <div className="max-w-xl w-full p-10">
          <h2 className="text-3xl font-semibold text-center mb-4">
            Welcome Back!{" "}
          </h2>
          <p className="text-center text-sm mb-6 text-[#747086]">
            Enter your email and password to access your account.
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-base-300 bg-base-200 rounded-full p-2 outline-none"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                User name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  placeholder="Enter your user name"
                  className="w-full border border-base-300 bg-base-200 rounded-full p-2 outline-none"
                />
                <FaUser className="absolute inset-y-3 right-3 flex items-center text-gray-500" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="********"
                  className="w-full border border-base-300 bg-base-200 rounded-full p-2 outline-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              <div className="flex justify-between items-center mt-2 text-sm">
                <div className="flex items-center opacity-75">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="mr-2"
                  />
                  Remember for 30 Days
                </div>
                <a href="#" className="text-[#b6acf7] hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDummyCredentials}
              className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-full mb-4"
            >
              Fill Dummy Credentials
            </button>

            <button
              type="submit"
              className="w-full bg-[#C8C1F5] hover:bg-[#b6acf7] text-black py-2 rounded-full"
            >
              Login
            </button>
          </form>

          <div className="divider">Or Login with</div>
          <div className="flex space-x-4">
            <button className="flex-1 flex items-center justify-center border border-base-300 rounded-md py-2 hover:bg-gray-100 hover:shadow-lg">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center border border-base-300 rounded-md py-2 hover:bg-gray-100 hover:shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
                className="w-5 mr-2"
              />
              Apple
            </button>
          </div>
          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#b6acf7] hover:underline">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;