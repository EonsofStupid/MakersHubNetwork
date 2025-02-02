import { lazy } from "react";
const LandingPage = lazy(() => import("@/pages/site/landing"));
const SchedulePage = lazy(() => import("@/pages/content/schedule"));
const QueuePage = lazy(() => import("@/pages/content/queue"));

export const publicRoutes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/content/schedule",
    element: <SchedulePage />,
  },
  {
    path: "/content/queue",
    element: <QueuePage />,
  },
];
