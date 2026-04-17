"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await user.reload();

      alert("Account created successfully!");
      router.push("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="animate-fade-in">
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-3xl shadow-2xl w-96 border border-gray-100 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 animate-slide-up">
              Create Account 🚀
            </h2>
            <p className="text-gray-600 font-medium">
              Join TaskMatrix and get started
            </p>
          </div>

          <div className="space-y-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <input
                type="text"
                placeholder="Full name"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg mt-6 animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            Create Account
          </button>

          <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                className="text-secondary-600 hover:text-secondary-700 cursor-pointer font-semibold transition-colors duration-300"
                onClick={() => router.push("/login")}
              >
                Sign in
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}