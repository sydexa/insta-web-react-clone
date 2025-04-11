
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import RouteGuard from "./components/RouteGuard";

// Pages
import Newsfeed from "./pages/Newsfeed";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <RouteGuard>
                        <Newsfeed />
                      </RouteGuard>
                    }
                  />
                  <Route
                    path="/profile/:username"
                    element={
                      <RouteGuard>
                        <Profile />
                      </RouteGuard>
                    }
                  />
                  <Route
                    path="/edit-profile"
                    element={
                      <RouteGuard>
                        <EditProfile />
                      </RouteGuard>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <RouteGuard>
                        <Search />
                      </RouteGuard>
                    }
                  />
                  <Route
                    path="/create"
                    element={
                      <RouteGuard>
                        <Create />
                      </RouteGuard>
                    }
                  />

                  {/* Public routes */}
                  <Route
                    path="/login"
                    element={
                      <RouteGuard requireAuth={false}>
                        <Login />
                      </RouteGuard>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <RouteGuard requireAuth={false}>
                        <Signup />
                      </RouteGuard>
                    }
                  />

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
