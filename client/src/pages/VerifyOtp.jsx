import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import bgPattern from "../../public/bgimage.png";
import productCard from "/uplistimage.jpg"
import { useAuth } from "../context/AuthContext";


export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { setAuthenticated } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyHandler = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
      });
      setAuthenticated(true);
      navigate("/home");
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    await api.post("/auth/send-otp", { email });
    setTimer(20);
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  return (
    <div className="min-h-screen flex p-3 bg-[var(--color-bg-light)]">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden rounded-2xl m-1">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgPattern})` }}
              />
              
              {/* Gradient Overlay - lavender top to pink bottom */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{ 
                  background: `
                    linear-gradient(
                      180deg, 
                      #010860, 
                      #002283,
                      #734AA3,
                      #E7959C,
                      #EA4182,
                      #BF3613
                    )
                  `
                } }
              />
              
              {/* Logo */}
              <div className="absolute top-5 left-5 z-10">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center relative">
                    <span className="text-white font-bold text-[10px]">●</span>
                    <div className="absolute -right-0.5 -bottom-0.5 w-2 h-2 bg-orange-500 rounded-full" />
                  </div>
                  <span className="text-[#1e2a5c] font-bold text-base">Productr</span>
                </div>
              </div>
      
              {/* Feature Card with subtle glow effect */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div 
                  className="relative w-65 h-[330px] rounded-[24px] overflow-hidden"
                  style={{ 
                    boxShadow: `0 0 50px 10px hsla(30, 80%, 55%, 0.2)`,
                  }}
                >
                  {/* Runner Image */}
                  <img 
                    src={productCard} 
                    alt="Runner silhouette against orange sunset"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Card Text */}
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-white text-sm font-medium leading-tight drop-shadow-lg">
                      Uplist your<br />product to market
                    </p>
                  </div>
                </div>
              </div>
            </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md rounded-[18px] px-10 py-12">

          <h2 className="text-2xl text-[#1e2a5c] font-semibold mb-6">
            Login to your Productr Account
          </h2>

          <p className=" text-[#1e2a5c] mb-4">Enter OTP</p>

          <div className="flex justify-between mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-[48px] h-[40px] outline-none text-center m-1 text-lg rounded-lg border-2
                  ${error ? "border-red-400" : "border-[#1e2a5c]"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              Please enter a valid OTP
            </p>
          )}

          <button
            onClick={verifyHandler}
            disabled={loading}
            className="w-full bg-[#1e2a5c] text-white py-3 rounded-lg font-medium mt-4"
          >
            {loading ? "Verifying..." : "Enter your OTP"}
          </button>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Didn’t receive OTP?{" "}
            {timer > 0 ? (
              <span className="text-[#1e2a5c]">Resend in {timer}s</span>
            ) : (
              <button
                onClick={resendOtp}
                className="text-[#1e2a5c] font-medium hover: cursor-pointer"
              >
                Resend
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
