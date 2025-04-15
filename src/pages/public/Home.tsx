
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";

export const PublicHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to the Parts Database</h1>
        <p className="text-xl text-muted-foreground">
          Explore our database of parts and community builds
        </p>
        {!isAuthenticated && (
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/auth")}>Login</Button>
            <Button onClick={() => navigate("/register")} variant="outline">
              Register
            </Button>
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Parts Database</h2>
          <p className="text-muted-foreground">
            Browse our comprehensive database of parts
          </p>
          <Button onClick={() => navigate("/parts")}>Explore Parts</Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Community Builds</h2>
          <p className="text-muted-foreground">
            See what others are building
          </p>
          <Button onClick={() => navigate("/builds")} variant="outline">
            View Builds
          </Button>
        </div>
      </section>
    </div>
  );
};
