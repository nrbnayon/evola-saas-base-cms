import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import signinImage from "../../assets/images/signin.png";
import apiClient from "../../lib/api-client";
import { setAuthTokens } from "../../lib/cookie-utils";

const OtpVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get user_id from location state
  const { user_id } = location.state || {};

  useEffect(() => {
    if (!user_id) {
      // Redirect back to signup if user_id is not available
      navigate("/signup");
    }

    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer, user_id, navigate]);

  const handleResendOtp = async () => {
    if (resendEnabled) {
      try {
        // Assuming you need to call the sign-up API again to resend OTP
        await apiClient.post("/auth/sign-up", { user_id }); // Adjust payload as needed
        setTimer(60);
        setResendEnabled(false);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to resend OTP. Please try again.");
        console.error("Resend OTP failed:", error.response?.data || error.message);
      }
    }
  };

  const onSubmit = async (data) => {
    const otp = Object.values(data).join("");
    try {
      const payload = {
        user_id,
        verification_code: otp,
      };

      const response = await apiClient.post("/auth/verify-email", payload);

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        const { access_token, refresh_token } = response.data; // Assuming API returns tokens
        setAuthTokens(access_token, refresh_token); // Store tokens in cookies
        if (response.data.role === "Seller") {
          navigate("/seller/onboarding");
        } else {
          navigate("/"); // Redirect to home
        }
      }
    } catch (error) {
      setErrorMessage("Invalid OTP. Please try again.");
      console.error("OTP verification failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="grid grid-cols-2 min-h-screen bg-base-200">
      <div className="col-span-1 bg-blue-500 flex items-center">
        <img src={signinImage} className="object-cover h-full w-full" alt="OTP Verification" />
      </div>

      <div className="col-span-1 flex items-center justify-center">
        <div className="max-w-xl w-full p-10">
          <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">
            Verify Your Email
          </h2>
          <p className="text-center text-sm mb-6 text-[#747086]">
            We have sent a 6-digit verification code to your email.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex space-x-2 justify-center">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <input
                  key={index}
                  {...register(`otp${index}`, {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]$/,
                      message: "Enter a single digit",
                    },
                  })}
                  type="text"
                  maxLength={1}
                  className={`w-12 h-12 text-center border border-base-300 bg-base-200 rounded-full text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors[`otp${index}`] ? "border-red-500" : ""
                  }`}
                  onChange={(e) => {
                    if (e.target.value.length === 1 && index < 5) {
                      document.getElementsByName(`otp${index + 1}`)[0].focus();
                    }
                  }}
                />
              ))}
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-sm text-center">
                {errors[Object.keys(errors)[0]]?.message || "Please fill all OTP fields correctly"}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">
                {errorMessage}
              </p>
            )}

            <p className="text-center text-sm mt-6">
              {resendEnabled ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-300"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500">
                  Resend OTP in {timer}s
                </span>
              )}
            </p>

            <button
              type="submit"
              className="w-full bg-[#C8C1F5] hover:bg-[#b6acf7] text-black font-semibold py-2 rounded-full transition-colors duration-300"
            >
              Verify OTP
            </button>
          </form>

          <div className="flex items-center justify-center text-blue-500 mt-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 hover:text-blue-600 hover:underline transition-colors duration-300"
            >
              <FaLeftLong />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;