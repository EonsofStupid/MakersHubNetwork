
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/logging/hooks/use-logger';
import { AuthStatus, AUTH_STATUS, LogCategory } from '@/shared/types';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const logger = useLogger('LoginPage', LogCategory.AUTH);
  
  const { 
    login, 
    signup, 
    isAuthenticated, 
    status 
  } = useAuthStore();
  
  useEffect(() => {
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      logger.info('User already authenticated, redirecting to home');
      navigate('/');
    }
  }, [isAuthenticated, navigate, logger]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isSignUp) {
        logger.info('Attempting to sign up');
        await signup(email, password);
        logger.info('Sign up successful');
      } else {
        logger.info('Attempting to log in');
        await login(email, password);
        logger.info('Login successful');
      }
      
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      logger.error('Authentication error', { details: { error: errorMessage } });
      setError(errorMessage);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          {isSignUp ? 'Create an Account' : 'Sign In'}
        </h2>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={status === AUTH_STATUS.LOADING}
              className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {status === AUTH_STATUS.LOADING ? (
                <span>Loading...</span>
              ) : isSignUp ? (
                'Sign Up'
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
