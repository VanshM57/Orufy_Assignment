import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import bgPattern from "../../public/bgimage.png";
import productCard from "/uplistimage.jpg"


export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);
      await api.post("/auth/send-otp", { email });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white p-3">
      {/* Left Panel - Hero Section with rounded corners */}
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

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-1.5 justify-center mb-8">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center relative">
              <span className="text-white font-bold text-[10px]">●</span>
              <div className="absolute -right-0.5 -bottom-0.5 w-2 h-2 bg-orange-500 rounded-full" />
            </div>
            <span className="text-[#1e2a5c] font-bold text-base">Productr</span>
          </div>

          {/* Login Header */}
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-[#1e2a5c]">
              Login to your Productr Account
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={submitHandler} className="space-y-3">
            <div className="space-y-1.5">
              <label 
                htmlFor="email" 
                className="block text-xs font-medium text-[#1e2a5c]"
              >
                Email or Phone number
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white text-[#1e2a5c] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e2a5c] focus:border-transparent transition-all"
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-10 bg-[#1e2a5c] text-white rounded-lg font-medium text-sm hover:bg-[#2a3a7c] transition-colors"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-70 p-4 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-500 text-sm mb-0.5">
              Don't have a Productr Account
            </p>
            <a 
              href="#" 
              className="text-[#1e2a5c] font-medium text-sm hover:underline"
            >
              SignUp Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
