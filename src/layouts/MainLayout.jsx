import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { useAuth } from "@/contexts/AuthProvider";

const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    console.log("no user");
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
