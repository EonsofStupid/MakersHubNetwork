
import React from "react";
import { AdminTopNav } from "./navigation/AdminTopNav";

export const AdminHeader: React.FC<{ title?: string }> = ({ title = "Admin Dashboard" }) => {
  return (
    <header className="sticky top-0 z-30 w-full">
      <AdminTopNav title={title} />
    </header>
  );
};
