import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import AuthProvider from "./contexts/AuthProvider";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PostsProvider from "./contexts/PostsContext";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PostsProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </PostsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
