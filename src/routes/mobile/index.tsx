import { Routes, Route } from "react-router-dom";
import { MobileHomeView } from "@/features/home/MobileHomeView";

const MobileIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileHomeView />} />
      {/* Add other mobile-specific routes here */}
    </Routes>
  );
};

export default MobileIndex;