import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/store';
import { MainNav } from '@/components/MainNav';
import { Shell } from '@/components/Shell';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/hooks/useAdminAccess';

const Home = lazy(() => import('@/pages/Home'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Logout = lazy(() => import('@/pages/Logout'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Builds = lazy(() => import('@/pages/Builds'));
const BuildDetail = lazy(() => import('@/pages/BuildDetail'));
const Search = lazy(() => import('@/pages/Search'));
const Admin = lazy(() => import('@/pages/Admin'));

function AuthRequired({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, status } = useAuthStore();
  const location = useLocation();
  const { toast } = useToast();

  if (status === 'loading') {
    return (
      <Shell>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Shell>
    );
  }

  if (!isLoggedIn) {
    toast({
      title: 'Authentication Required',
      description: 'You must be logged in to access this page.',
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AdminRequired({ children }: { children: React.ReactNode }) {
  const { hasAdminAccess } = useAdminAccess();
  const location = useLocation();
  const { toast } = useToast();

  if (!hasAdminAccess) {
    toast({
      title: 'Admin Access Required',
      description: 'You do not have permission to access this page.',
      variant: 'destructive',
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Home />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/pricing"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <PricingPage />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/about"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <About />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/contact"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Contact />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/terms"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Terms />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/privacy"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Privacy />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/login"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Login />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/register"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Register />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/logout"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Logout />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRequired>
              <Shell>
                <Suspense fallback={<>Loading...</>}>
                  <Profile />
                </Suspense>
              </Shell>
            </AuthRequired>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthRequired>
              <Shell>
                <Suspense fallback={<>Loading...</>}>
                  <Settings />
                </Suspense>
              </Shell>
            </AuthRequired>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <ForgotPassword />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <ResetPassword />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/builds"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Builds />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/builds/:id"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <BuildDetail />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/search"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <Search />
              </Suspense>
            </Shell>
          }
        />
        {/* Admin Routes - Requires Admin Access */}
        <Route
          path="/admin"
          element={
            <AdminRequired>
              <Suspense fallback={<>Loading...</>}>
                <Admin />
              </Suspense>
            </AdminRequired>
          }
        />
        {
          path: "/admin/builds",
          element:
            <AdminRequired>
              <Suspense fallback={<>Loading...</>}>
                <Admin />
              </Suspense>
            </AdminRequired>
        },
        {
          path: "/admin/builds/:id",
          element:
            <AdminRequired>
              <Suspense fallback={<>Loading...</>}>
                <Admin />
              </Suspense>
            </AdminRequired>
        },
        <Route
          path="*"
          element={
            <Shell>
              <Suspense fallback={<>Loading...</>}>
                <NotFound />
              </Suspense>
            </Shell>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
