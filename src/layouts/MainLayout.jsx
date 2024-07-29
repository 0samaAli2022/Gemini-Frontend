import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { useAuth } from "@/contexts/AuthProvider";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default MainLayout;
