import { Routes, Route } from "react-router-dom";
import { MobileLayout } from "./components/Layout";
import IndexPage from "@/pages/Index";

const MobileIndex = () => {
  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<IndexPage />} />
      </Routes>
    </MobileLayout>
  );
};

export default MobileIndex;