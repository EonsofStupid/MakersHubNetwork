import { useAuthStore } from "@/stores/auth/store";

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  );
}