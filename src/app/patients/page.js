"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { User, Stethoscope, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Example from "@/components/navbar";
import { API_BASE } from "@/lib/config";

// Skeleton Loading Component
const PatientSkeleton = ({ isAdmin }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
    <div className={`grid ${isAdmin ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-7' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'} gap-4 items-center`}>
      <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
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
  const [showModal, setShowModal] = useState(false);
  const observerRef = useRef();
  const router = useRouter();

  const BASE_URL = API_BASE;

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
    setShowModal(true);
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
      <div className="flex gap-2 sm:gap-3 mb-6 px-4 sm:px-8 lg:px-20 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-10 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F8D4E]/40 ${
              activeTab === tab.id
                ? "bg-[#F4FFF3] text-[#5F8D4E]"
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
    <div className="hidden lg:block bg-gray-50 rounded-lg px-4 py-3 mb-3">
      <div className={`grid ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} gap-4`}>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 pl-16">Name</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Age</div>
        {isAdmin && (
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 pl-9">Posted By</div>
        )}
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Gender</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Duration</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date added</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</div>
      </div>
    </div>
  );

  const TabletHeader = () => (
    <div className="hidden sm:block lg:hidden bg-gray-50 rounded-lg px-4 py-3 mb-3">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 pl-[60px]">Name</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Age</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">Status</div>
      </div>
    </div>
  );

  // On phones the rows read as cards, so a column header adds noise; it is hidden there.
  const MobileHeader = () => null;

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
    <>
    <Card className="flex flex-col w-full bg-white overflow-hidden mx-auto min-h-screen">
      <div className="w-full mb-6 sm:mb-8 lg:mb-10">
        <Example />
      </div>

      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between mb-4 sm:mb-6 px-4 sm:px-8 lg:px-20 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
            List of Patients
          </h1>
          <p className="text-sm text-gray-500 leading-tight">
            {filteredPatients.length} recorded {filteredPatients.length === 1 ? "patient" : "patients"}
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {!isAdmin && (
          <button
            onClick={handleAddPatient}
            className="btn-primary w-full sm:w-auto h-11 sm:h-11 text-base sm:text-base sm:min-w-[170px]"
          >
            <User className="w-5 h-5" />
            Add Patient
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
            className="field-input h-11 sm:h-11 pl-10 text-sm sm:text-sm"
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
                  <p className="text-lg font-medium mb-1">
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
                      className="link-brand text-sm"
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
                    className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 cursor-pointer transition-colors duration-200 hover:bg-[#F4FFF3]/50 hover:border-[#5F8D4E]/40 animate-fadeInUp"
                    onClick={() => handleRowClick(patient)}
                    style={{
                      animationDelay: `${Math.min(index, 8) * 30}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Mobile Layout (2 columns) */}
                    <div className="block sm:hidden">
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#f3f6f9] rounded-lg flex items-center justify-center flex-shrink-0">
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
                            <div className="font-medium text-xs text-gray-500 capitalize">
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
                          <div className="w-12 h-12 bg-[#f3f6f9] rounded-lg flex items-center justify-center flex-shrink-0">
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
                            <div className="font-medium text-xs text-gray-500 capitalize">
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
                          <div className="w-12 h-12 bg-[#f3f6f9] rounded-lg flex items-center justify-center">
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

                        <div className="font-semibold text-sm text-[#464e5f] capitalize">
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
                          <div className="font-medium text-xs text-gray-500">
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
                            className={`inline-flex justify-center min-w-[96px] px-4 py-1 font-medium text-xs ${
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
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.25s ease-out;
        }
      `}</style>
    </Card>

    {showModal && createPortal(
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", maxWidth: "520px", width: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#212121", margin: 0 }}>
              Submission Guidelines
            </h2>
            <button
              onClick={() => setShowModal(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "50%" }}
            >
              <X style={{ width: "20px", height: "20px", color: "#6b7280" }} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>
              <li style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#5F8D4E", fontSize: "16px", lineHeight: "1.3", flexShrink: 0 }}>&#x2022;</span>
                <span>Upload <strong>non-polarized</strong>, <strong>polarized</strong>, and <strong>ultraviolet-induced fluorescence</strong> (optional) images.</span>
              </li>
              <li style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#5F8D4E", fontSize: "16px", lineHeight: "1.3", flexShrink: 0 }}>&#x2022;</span>
                <span>Upload <strong>multiple dermoscopic images</strong> from different areas of the lesion for better analysis.</span>
              </li>
              <li style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#5F8D4E", fontSize: "16px", lineHeight: "1.3", flexShrink: 0 }}>&#x2022;</span>
                <span>Avoid uploading <strong>duplicate or repetitive</strong> dermoscopic images.</span>
              </li>
              <li style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#5F8D4E", fontSize: "16px", lineHeight: "1.3", flexShrink: 0 }}>&#x2022;</span>
                <span>Ensure all images are of <strong>high quality</strong> — this is essential for accurate pattern analysis.</span>
              </li>
              <li style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#5F8D4E", fontSize: "16px", lineHeight: "1.3", flexShrink: 0 }}>&#x2022;</span>
                <span>Provide <strong>complete clinical details</strong>, including history, morphology, and duration of the lesion.</span>
              </li>
              <li style={{ display: "flex", gap: "10px", marginBottom: "0", alignItems: "flex-start" }}>
                <span style={{ color: "#5F8D4E", fontSize: "16px", lineHeight: "1.3", flexShrink: 0 }}>&#x2022;</span>
                <span>Reports will be delivered within <strong>24–72 hours</strong> from the time of submission.</span>
              </li>
            </ul>

            <div style={{ backgroundColor: "#FFF8E1", border: "1px solid #FFE082", borderRadius: "10px", padding: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>&#x26A0;&#xFE0F;</span>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#B8860B", marginBottom: "6px", margin: "0 0 6px 0" }}>
                  Disclaimer
                </h4>
                <p style={{ fontSize: "12.5px", color: "#6D4C00", lineHeight: "1.65", margin: 0 }}>
                  Dermoscopy is an evolving field and diagnostic criteria are not yet well established for many dermatoses. Dermoscopy-based reporting may not always provide a definitive diagnosis. For therapeutic management—especially prior to initiating biological therapy or immunosuppressive treatment—<strong>histopathological examination</strong> and relevant <strong>immunohistochemical studies</strong> are strongly recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: "12px", padding: "20px", borderTop: "1px solid #e5e7eb" }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ flex: 1, height: "44px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#374151", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={() => router.push("/step1")}
              style={{ flex: 1, height: "44px", borderRadius: "8px", border: "none", backgroundColor: "#5F8D4E", color: "#ffffff", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
            >
              Agree and Continue
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
