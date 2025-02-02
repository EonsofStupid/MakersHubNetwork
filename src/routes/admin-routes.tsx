import { lazy } from "react";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { AdminSidebar } from "@/components/admin/dashboard/sidebar/AdminSidebar";
import { StatsCards } from "@/components/admin/dashboard/stats/StatsCards";
import { cn } from "@/lib/utils";

const Posts = lazy(() => import("@/pages/admin/posts"));
const Users = lazy(() => import("@/pages/admin/users"));
const Settings = lazy(() => import("@/pages/admin/settings"));
const ContentManagement = lazy(() => import("@/pages/admin/content-management"));
const Categories = lazy(() => import("@/pages/admin/content-management/categories"));
const ForumAdminPage = lazy(() => import("@/pages/admin/forum"));
const WorkflowTemplates = lazy(() => import("@/pages/admin/workflows/templates"));
const NewWorkflowTemplate = lazy(() => import("@/pages/admin/workflows/templates/new"));
const WorkflowTemplateEditor = lazy(() => import("@/pages/admin/workflows/templates/[id]"));
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));

export const adminRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />
  },
  {
    path: "posts",
    element: <Posts />
  },
  {
    path: "users",
    element: <Users />
  },
  {
    path: "settings",
    element: <Settings />
  },
  {
    path: "content-management",
    element: <ContentManagement />
  },
  {
    path: "content-management/categories",
    element: <Categories />
  },
  {
    path: "forum",
    element: <ForumAdminPage />
  },
  {
    path: "workflows/templates",
    element: <WorkflowTemplates />
  },
  {
    path: "workflows/templates/new",
    element: <NewWorkflowTemplate />
  },
  {
    path: "workflows/templates/:id",
    element: <WorkflowTemplateEditor />
  }
];