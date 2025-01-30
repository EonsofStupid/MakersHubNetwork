import { Routes, Route } from "react-router-dom";
import { DesktopHomeView } from "@/features/home/DesktopHomeView";

const DesktopIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<DesktopHomeView />} />
      {/* Add other desktop-specific routes here */}
    </Routes>
  );
};

export default DesktopIndex;