
import { lazy } from "react";
import { Route } from "react-router-dom";
import { AuthCallback } from "@/auth/components/AuthCallback";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const LinkAccount = lazy(() => import("@/pages/LinkAccount"));

export const authRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/link-account" element={<LinkAccount />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
  </>
);
