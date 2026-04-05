"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Stethoscope, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Example from "@/components/navbar";

// Skeleton Loading Component
const PatientSkeleton = ({ isAdmin }) => (
  <div className="bg-white rounded-md p-4 border border-gray-100 animate-pulse">
    <div className={`grid ${isAdmin ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-7' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'} gap-4 items-center`}>
      <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-md flex-shrink-0"></div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-12 sm:w-16 sm:hidden"></div>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </div>
      {isAdmin && (
        <div className="hidden lg:block">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      )}
      <div className="hidden lg:block">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="hidden lg:block">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="hidden lg:block">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex justify-end sm:justify-start">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  </div>
);

const SkeletonLoader = ({ isAdmin }) => (
  <div className="space-y-3">
    {Array.from({ length: 8 }).map((_, index) => (
      <PatientSkeleton key={index} isAdmin={isAdmin} />
    ))}
  </div>
);

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [patients, setPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const observerRef = useRef();
  const router = useRouter();

  const BASE_URL = "https://dermatology-backend-8xqf.onrender.com/api";

  const regularEndpoints = {
    all: "/all-patients",
    pending: "/pending-patients",
    completed: "/done-patients",
  };

  const adminEndpoints = {
    all: "/admin-all",
    pending: "/admin-pending",
    completed: "/admin-done",
  };

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || localStorage.getItem("token");
    }
    return null;
  };

  const removeAuthTokens = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
    }
  };

  const checkAuthentication = () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return false;
    } else {
      setLoadingAuth(false);
      return true;
    }
  };

  const checkAdminStatus = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        removeAuthTokens();
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (res.ok && data?.user?.role === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Failed to verify admin status:", err);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError("No authentication token found. Please log in again.");
      removeAuthTokens();
      router.push("/login");
      return;
    }

    try {
      const endpoint = isAdmin
        ? adminEndpoints[activeTab]
        : regularEndpoints[activeTab];

      const res = await fetch(BASE_URL + endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (res.status === 401) {
        removeAuthTokens();
        setError("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        const normalizedPatients = data.data.map((p) => ({
          ...p,
          status:
            p.status.toLowerCase() === "done"
              ? "Completed"
              : p.status.charAt(0).toUpperCase() + p.status.slice(1),
          doctorName: p.doctor && p.doctor.firstname
            ? `Dr. ${p.doctor.firstname.trim()}`
            : "N/A",
        }));

        setPatients(normalizedPatients);
        setVisibleCount(10);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients by search query
  const filteredPatients = patients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${p.firstname || ""} ${p.lastname || ""}`.toLowerCase();
    return fullName.includes(query);
  });

  useEffect(() => {
    setDisplayedPatients(filteredPatients.slice(0, visibleCount));
  }, [patients, visibleCount, searchQuery]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery]);

  const lastPatientElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPatients.length) {
          setVisibleCount((prevCount) => Math.min(prevCount + 10, filteredPatients.length));
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, visibleCount, filteredPatients.length]
  );

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      return;
    }
  }, []);

  useEffect(() => {
    if (!loadingAuth) {
      checkAdminStatus();
    }
  }, [loadingAuth]);

  useEffect(() => {
    if (!loadingAuth) {
      fetchPatients();
    }
  }, [activeTab, isAdmin, loadingAuth]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token && !loadingAuth) {
      router.push("/login");
    }
  }, [loadingAuth, router]);

  const handleRowClick = (patient) => {
    let targetUrl = isAdmin
      ? patient.status.toLowerCase() === "pending" || patient.status === "Pending"
        ? `/generate-report/${patient._id}`
        : `/report/${patient._id}`
      : `/report/${patient._id}`;

    router.push(targetUrl);
  };

  const handleAddPatient = () => {
    router.push("/step1");
  };

  const fullName = (patient) => {
    const first = patient.firstname || "";
    const last = patient.lastname || "";
    return `${first} ${last}`.trim() || "Unknown";
  };

  const Tabs = () => {
    const tabs = [
      { id: "all", label: "All Patients" },
      { id: "pending", label: "Pending" },
      { id: "completed", label: "Completed" },
    ];

    return (
      <div className="flex gap-4 sm:gap-6 lg:gap-8 mb-6 px-4 sm:px-8 lg:px-20 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-10 sm:h-11 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm font-['Poppins-SemiBold',Helvetica] transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-[#F4FFF3] text-[#5F8D4E] shadow-sm scale-105"
                : "bg-transparent text-gray-500 hover:text-[#5F8D4E] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  const DesktopHeader = () => (
    <div className="hidden lg:block bg-gray-50 rounded-md border-b border-gray-300 p-4 mb-4">
      <div className={`grid ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} gap-4`}>
        <div className="font-semibold text-xs text-[#b5b5c3] pl-16">Name</div>
        <div className="font-semibold text-xs text-[#b5b5c3]">Age</div>
        {isAdmin && (
          <div className="font-semibold text-xs text-[#b5b5c3] ml-6">Posted By</div>
        )}
        <div className="font-semibold text-xs text-[#b5b5c3]">Gender</div>
        <div className="font-semibold text-xs text-[#b5b5c3]">Duration</div>
        <div className="font-semibold text-xs text-[#b5b5c3]">Date added</div>
        <div className="font-semibold text-xs text-[#b5b5c3] pl-10">Status</div>
      </div>
    </div>
  );

  const TabletHeader = () => (
    <div className="hidden sm:block lg:hidden bg-gray-50 rounded-md border-b border-gray-300 p-4 mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="font-semibold text-xs text-[#b5b5c3] pl-12">Name</div>
        <div className="font-semibold text-xs text-[#b5b5c3]">Age</div>
        <div className="font-semibold text-xs text-[#b5b5c3] text-right">Status</div>
      </div>
    </div>
  );

  const MobileHeader = () => (
    <div className="block sm:hidden bg-gray-50 rounded-md border-b border-gray-300 p-4 mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="font-semibold text-xs text-[#b5b5c3] pl-12">Name</div>
        <div className="font-semibold text-xs text-[#b5b5c3] text-right">Status</div>
      </div>
    </div>
  );

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5F8D4E] mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const token = getAuthToken();
  if (!token) {
    return null;
  }

  return (
    <Card className="flex flex-col w-full bg-white overflow-hidden mx-auto min-h-screen">
      <div className="w-full mb-6 sm:mb-8 lg:mb-10">
        <Example />
      </div>

      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between mb-4 sm:mb-6 px-4 sm:px-8 lg:px-20 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-lg text-xl sm:text-2xl text-[#212121] leading-tight font-['Poppins-Medium',Helvetica]">
            List of Patients
          </h1>
          <p className="font-medium text-sm sm:text-md text-[#b5b5c3] leading-tight font-['Poppins-Medium',Helvetica]">
            {filteredPatients.length} recorded patients
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {!isAdmin && (
          <button
            onClick={handleAddPatient}
            className={`w-full sm:w-auto font-bold text-sm sm:text-base h-[40px] sm:h-[45px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] sm:min-w-[180px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group text-[#ffffff] flex items-center justify-center gap-2`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Patient
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-8 lg:px-20 mb-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <Tabs />

      <div className="flex flex-col gap-6 lg:gap-8 mt-2 sm:mt-4 px-4 sm:px-8 lg:px-20 pb-8">
        <div className="w-full">
          <DesktopHeader />
          <TabletHeader />
          <MobileHeader />

          {loading ? (
            <SkeletonLoader isAdmin={isAdmin} />
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {displayedPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <User className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium font-poppins mb-1">
                    {searchQuery ? "No matching patients found" : "No patients found"}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    {searchQuery
                      ? "Try a different search term"
                      : isAdmin
                        ? "No patients in this category yet"
                        : "Get started by adding your first patient"}
                  </p>
                  {!isAdmin && !searchQuery && (
                    <button
                      onClick={handleAddPatient}
                      className="text-sm font-semibold text-[#5F8D4E] hover:underline font-poppins"
                    >
                      + Add Patient
                    </button>
                  )}
                </div>
              ) : (
                displayedPatients.map((patient, index) => (
                  <div
                    key={patient._id}
                    ref={
                      index === displayedPatients.length - 1
                        ? lastPatientElementRef
                        : null
                    }
                    className="bg-white hover:bg-green-50 hover:shadow-lg hover:scale-[1.02] transform transition-all duration-300 ease-in-out cursor-pointer rounded-md p-3 sm:p-4 border border-gray-100 animate-fadeInUp"
                    onClick={() => handleRowClick(patient)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Mobile Layout (2 columns) */}
                    <div className="block sm:hidden">
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#f3f6f9] rounded-md flex items-center justify-center flex-shrink-0">
                            <Avatar className="w-8 h-8">
                              <img
                                src="/patient.png"
                                alt={`${patient.firstname} avatar`}
                              />
                            </Avatar>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="font-semibold text-sm text-[#464e5f] truncate">
                              {fullName(patient)}
                            </div>
                            <div className="font-medium text-xs text-[#b5b5c3]">
                              {patient.age} &bull; {patient.gender}
                            </div>
                            {isAdmin && (
                              <div className="flex items-center gap-1 mt-1">
                                <Stethoscope className="w-3 h-3 text-[#5F8D4E]" />
                                <span className="font-medium text-[10px] text-[#5F8D4E] truncate">
                                  {patient.doctorName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Badge
                            className={`px-3 py-1 font-medium text-xs rounded-full ${
                              patient.status === "Completed"
                                ? "bg-[#F4FFF3] text-[#5F8D4E]"
                                : "bg-[#ffe2e5] text-[#f64e60]"
                            }`}
                          >
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Tablet Layout (3 columns) */}
                    <div className="hidden sm:block lg:hidden">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#f3f6f9] rounded-md flex items-center justify-center flex-shrink-0">
                            <Avatar className="w-10 h-10">
                              <img
                                src="/patient.png"
                                alt={`${patient.firstname} avatar`}
                              />
                            </Avatar>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="font-semibold text-sm text-[#464e5f] truncate">
                              {fullName(patient)}
                            </div>
                            <div className="font-medium text-xs text-[#b5b5c3]">
                              {patient.gender}
                            </div>
                            {isAdmin && (
                              <div className="flex items-center gap-1 mt-1">
                                <Stethoscope className="w-3 h-3 text-[#5F8D4E]" />
                                <span className="font-medium text-[10px] text-[#5F8D4E] truncate">
                                  {patient.doctorName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="font-semibold text-sm text-[#464e5f]">
                          {patient.age}
                        </div>
                        <div className="flex justify-end">
                          <Badge
                            className={`px-4 py-1 font-medium text-xs rounded-full ${
                              patient.status === "Completed"
                                ? "bg-[#F4FFF3] text-[#5F8D4E]"
                                : "bg-[#ffe2e5] text-[#f64e60]"
                            }`}
                          >
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:block">
                      <div className={`grid ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} gap-4 items-center`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#f3f6f9] rounded-md flex items-center justify-center">
                            <Avatar className="w-10 h-10">
                              <img
                                src="/patient.png"
                                alt={`${patient.firstname} avatar`}
                              />
                            </Avatar>
                          </div>
                          <div className="flex flex-col">
                            <div className="font-semibold text-sm text-[#464e5f]">
                              {fullName(patient)}
                            </div>
                          </div>
                        </div>

                        <div className="font-semibold text-sm text-[#464e5f]">
                          {patient.age}
                        </div>

                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#F4FFF3] rounded-full flex items-center justify-center flex-shrink-0">
                              <Stethoscope className="w-3.5 h-3.5 text-[#5F8D4E]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="font-medium text-xs text-[#5F8D4E] truncate">
                                {patient.doctorName}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="font-semibold text-sm text-[#464e5f]">
                          {patient.gender}
                        </div>

                        <div className="font-semibold text-sm text-[#464e5f]">
                          {patient.duration || "-"}
                        </div>

                        <div className="flex flex-col">
                          <div className="font-semibold text-sm text-[#464e5f]">
                            {patient.createdAt
                              ? new Date(patient.createdAt).toLocaleDateString()
                              : "-"}
                          </div>
                          <div className="font-medium text-xs text-[#b5b5c3]">
                            {patient.createdAt
                              ? new Date(patient.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </div>
                        </div>

                        <div>
                          <Badge
                            className={`w-[100px] px-4 py-1 font-medium text-xs ${
                              patient.status === "Completed"
                                ? "bg-[#F4FFF3] text-[#5F8D4E]"
                                : "bg-[#ffe2e5] text-[#f64e60]"
                            }`}
                          >
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {visibleCount < filteredPatients.length && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5F8D4E]"></div>
                    Loading more patients...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </Card>
  );
}
