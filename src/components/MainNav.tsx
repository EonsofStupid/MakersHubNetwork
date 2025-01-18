@@ -13,7 +13,6 @@ import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./auth/UserMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Login from "@/pages/Login";

export function MainNav() {


@@ -174,28 +173,21 @@ export function MainNav() {
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Sheet open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <SheetTrigger asChild>
                  <Button className="mad-scientist-hover">
                    Login
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[400px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 95% 15%, 100% 30%, 95% 85%, 100% 100%, 0 100%)",
                    transform: "translateX(0) skew(-5deg)",
                    transformOrigin: "100% 50%",
                  }}
                >
                  <Login onSuccess={() => setIsLoginOpen(false)} />
                </SheetContent>
              </Sheet>
              <Button 
                className="mad-scientist-hover"
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
      <Login 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen} 
        onSuccess={() => setIsLoginOpen(false)} 
      />
    </header>
  );
}
}
