import { Routes, Route } from "react-router-dom";
import { DesktopLayout } from "./components/Layout";
import IndexPage from "@/pages/Index";

const DesktopIndex = () => {
  return (
    <DesktopLayout>
      <Routes>
        <Route path="/" element={<IndexPage />} />
      </Routes>
    </DesktopLayout>
  );
};

export default DesktopIndex;