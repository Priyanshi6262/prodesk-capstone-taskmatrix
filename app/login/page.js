"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { useDispatch } from "react-redux";
import { setUser } from "@/lib/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      dispatch(
        setUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        })
      );

      router.push("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="animate-fade-in">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-3xl shadow-2xl w-96 border border-gray-100 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 animate-slide-up">
              Welcome Back!
            </h2>
            <p className="text-gray-600 font-medium">
              Sign in to your TaskMatrix account
            </p>
          </div>

          <div className="space-y-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg mt-6 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            Sign In
          </button>

          <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <span
                className="text-primary-600 hover:text-primary-700 cursor-pointer font-semibold transition-colors duration-300"
                onClick={() => router.push("/register")}
              >
                Create one
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}