"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Example from "@/components/navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const BASE_URL = "http://localhost:5000/api";

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
      return localStorage.getItem("authToken");
    }
    return null;
  };

  const checkAdminStatus = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        localStorage.removeItem("authToken");
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
        }));

        setPatients(normalizedPatients);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (err) {
      setError(err.message);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      fetchPatients();
    }
  }, [activeTab, isAdmin]);

  const handleRowClick = (patientId) => {
    router.push(`/patient-details/${patientId}`);
  };

  const handleAddPatient = () => {
    router.push("/step1");
  };

  const Tabs = () => {
    const tabs = [
      { id: "all", label: "All Patients" },
      { id: "pending", label: "Pending" },
      { id: "completed", label: "Completed" },
    ];

    return (
      <div className="flex gap-[30px] mb-6 px-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-11 px-4 rounded-xl font-semibold text-sm font-['Poppins-SemiBold',Helvetica] transition-colors duration-200 ${
              activeTab === tab.id
                ? "bg-[#F4FFF3] text-[#5F8D4E] shadow-none"
                : "bg-transparent text-gray-500 hover:text-[#5F8D4E]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="flex flex-col w-full bg-white overflow-hidden mx-auto">
      <div className="w-full mb-10">
        <Example />
      </div>

      <div className="flex w-full items-center justify-between mb-4 px-20">
        <div className="flex flex-col gap-1">
          <h1 className="font-lg text-2xl text-[#212121] leading-tight font-['Poppins-Medium',Helvetica]">
            List of Patients
          </h1>
          <p className="font-medium text-md text-[#b5b5c3] leading-tight font-['Poppins-Medium',Helvetica]">
            {patients.length} recorded patients
          </p>
          {error && (
            <p>
              
            </p>
          )}
        </div>

        {/* Hide add button for admin */}
        {!isAdmin && (
          <button
            onClick={handleAddPatient}
            className="bg-[#5F8D4E] text-[#ffffff] font-bold rounded-xl text-center text-base py-2 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out mt-4 w-48 flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            Add Patient
          </button>
        )}
      </div>

      <Tabs />

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading patients...</div>
      ) : (
        <div className="flex flex-col gap-[30px] mt-[10px] px-20">
          <Table>
            <TableHeader>
              <TableRow className="bg-grey-lite rounded-md border-b border-gray-300">
                <TableHead className="font-semibold text-xs pl-20 text-[#b5b5c3] tracking-[0.36px]">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-xs text-[#b5b5c3] tracking-[0.36px]">
                  Age
                </TableHead>
                <TableHead className="font-semibold text-xs text-[#b5b5c3] tracking-[0.36px]">
                  Gender
                </TableHead>
                <TableHead className="font-semibold text-xs text-[#b5b5c3] tracking-[0.36px]">
                  Duration
                </TableHead>
                <TableHead className="font-semibold text-xs text-[#b5b5c3] tracking-[0.36px]">
                  Date added
                </TableHead>
                <TableHead className="font-semibold text-xs text-[#b5b5c3] tracking-[0.36px] pl-10">
                  STATUS
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="pt-4">
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow
                    key={patient._id}
                    className="h-[50px] px-4 rounded-md cursor-pointer bg-white hover:bg-green-50 hover:shadow-sm hover:scale-[1.01] transform transition-all duration-200 ease-in-out"
                    onClick={() => handleRowClick(patient._id)}
                  >
                    <TableCell className="py-0">
                      <div className="flex items-center gap-[15px]">
                        <div className="w-[50px] h-[50px] bg-[#f3f6f9] rounded-md flex items-center justify-center">
                          <Avatar className="w-10 h-10">
                            <img
                              src="/home_doctor.png"
                              alt={`${patient.firstname} avatar`}
                            />
                          </Avatar>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-semibold text-sm text-[#464e5f]">
                            {patient.firstname}
                          </div>
                          <div className="font-medium text-[13px] text-[#b5b5c3]">
                            {patient.gender}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-sm text-[#464e5f]">
                      {patient.age}
                    </TableCell>
                    <TableCell className="font-semibold text-sm text-[#464e5f]">
                      {patient.gender}
                    </TableCell>
                    <TableCell className="font-semibold text-sm text-[#464e5f]">
                      {patient.duration || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-semibold text-sm text-[#464e5f]">
                          {patient.createdAt
                            ? new Date(patient.createdAt).toLocaleDateString()
                            : "-"}
                        </div>
                        <div className="font-medium text-[13px] text-[#b5b5c3]">
                          {patient.createdAt
                            ? new Date(patient.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`w-[100px] px-4 py-1 font-medium text-[11px] ${
                          patient.status === "Completed"
                            ? "bg-[#F4FFF3] text-[#5F8D4E]"
                            : "bg-[#ffe2e5] text-[#f64e60]"
                        }`}
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
