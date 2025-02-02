import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";

const MakerSpace = lazy(() => import("@/pages/content/maker-space"));
const Builds = lazy(() => import("@/pages/content/maker-space/builds"));
const BuildDetails = lazy(() => import("@/pages/content/maker-space/builds/[buildId]"));
const Guides = lazy(() => import("@/pages/content/maker-space/guides"));
const GuideDetails = lazy(() => import("@/pages/content/maker-space/guides/[guideId]"));
const Parts = lazy(() => import("@/pages/content/maker-space/parts"));
const PartDetails = lazy(() => import("@/pages/content/maker-space/parts/[partId]"));

export const makerSpaceRoutes: RouteObject[] = [
  {
    path: "/maker-space",
    element: (
      <AuthGuard>
        <MakerSpace />
      </AuthGuard>
    ),
    children: [
      {
        path: "builds",
        element: <Builds />,
      },
      {
        path: "builds/:buildId",
        element: <BuildDetails />,
      },
      {
        path: "guides",
        element: <Guides />,
      },
      {
        path: "guides/:guideId",
        element: <GuideDetails />,
      },
      {
        path: "parts",
        element: <Parts />,
      },
      {
        path: "parts/:partId",
        element: <PartDetails />,
      }
    ]
  }
];