
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Always succeed
    console.log('Login success');
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/30 rounded-lg border border-primary/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold cyber-text">Sign In</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your account
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-3 w-full bg-black/60 border border-primary/30 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-3 w-full bg-black/60 border border-primary/30 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Password"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-primary hover:text-primary/80">
                Forgot password?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 flex justify-center rounded-md bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary/90 transition-colors cyber-glow"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:text-primary/80">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
