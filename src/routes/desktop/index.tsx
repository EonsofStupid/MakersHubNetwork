import { Routes, Route } from "react-router-dom";
import IndexPage from "@/pages/Index";

const DesktopIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      {/* Add other desktop-specific routes here */}
    </Routes>
  );
};

export default DesktopIndex;