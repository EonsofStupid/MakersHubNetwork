import { RouteObject } from "react-router-dom";
import MakerSpace from "@/pages/content/maker-space";

export const ProtectedRoutes = (): RouteObject[] => [
  {
    path: "/maker-space",
    element: <MakerSpace />
  }
];