import { Routes, Route } from "react-router-dom";
import IndexPage from "@/pages/Index";

const MobileIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      {/* Add other mobile-specific routes here */}
    </Routes>
  );
};

export default MobileIndex;