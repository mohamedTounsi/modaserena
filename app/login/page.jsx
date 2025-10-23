"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center text-zinc-800">
          Admin Login
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border rounded-md text-zinc-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-md text-zinc-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
