import { LoginButton } from "@/components/auth/LoginButton";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <LoginButton />
      </div>
    </div>
  );
}