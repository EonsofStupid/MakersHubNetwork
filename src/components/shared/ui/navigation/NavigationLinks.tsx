import { Link } from "react-router-dom";
import { useAuthStore } from '@/lib/store/auth-store';
import { memo } from "react";

export const NavigationLinks = memo(() => {
  const { session, user } = useAuthStore();

  console.log('NavigationLinks render - Session:', {
    isAuthenticated: !!session,
    userId: session?.user?.id,
    role: user?.role
  });

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link 
        to="/maker-space"
        className="text-white hover:text-[#41f0db] transition-all duration-300 relative group cursor-pointer"
      >
        <span className="relative z-10 text-white font-medium">Maker Space</span>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#41f0db]/10 to-[#8000ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10" />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#41f0db] to-[#8000ff] transition-all duration-300 group-hover:w-full" />
      </Link>
      
      <Link 
        to="/blog"
        className="text-white hover:text-[#41f0db] transition-all duration-300 relative group cursor-pointer"
      >
        <span className="relative z-10 text-white font-medium">Blog</span>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#41f0db]/10 to-[#8000ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10" />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#41f0db] to-[#8000ff] transition-all duration-300 group-hover:w-full" />
      </Link>

      {user?.role === 'admin' && (
        <Link 
          to="/admin/dashboard"
          className="text-white hover:text-[#41f0db] transition-all duration-300 relative group cursor-pointer"
        >
          <span className="relative z-10 text-white font-medium">Admin</span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#41f0db]/10 to-[#8000ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10" />
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#41f0db] to-[#8000ff] transition-all duration-300 group-hover:w-full" />
        </Link>
      )}
    </div>
  );
});

NavigationLinks.displayName = 'NavigationLinks';