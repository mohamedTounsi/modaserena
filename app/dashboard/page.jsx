"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-pink-500 animate-pulse text-lg font-medium">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          Welcome to the Dashboard
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full"></div>
      </div>
      <p className="text-gray-600 text-lg">
        This area is protected and only visible to logged-in admins.
      </p>
    </div>
  );
};

export default DashboardPage;
