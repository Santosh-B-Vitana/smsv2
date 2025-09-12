
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchool } from '../contexts/SchoolContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const { schoolInfo } = useSchool();
  const navigate = useNavigate();

  // Redirect if already authenticated
  const { user } = useAuth();
  useEffect(() => {
    if (isAuthenticated && user) {
      let dashboardRoute = '/dashboard';
      switch (user.role) {
        case 'staff':
          dashboardRoute = '/staff-dashboard';
          break;
        case 'admin':
          dashboardRoute = '/admin-dashboard';
          break;
        case 'parent':
          dashboardRoute = '/parent-dashboard';
          break;
        case 'super_admin':
          dashboardRoute = '/super-admin-dashboard';
          break;
        default:
          dashboardRoute = '/dashboard';
      }
      navigate(dashboardRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login: Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const demoUsers = [
  { email: 'admin@vitanaSchools.edu', role: 'Admin', password: 'password', name: 'Dr. Rajesh Sharma' },
  { email: 'anil.kumar@vitanaSchools.edu', role: 'Staff', password: 'password', name: 'Anil Kumar' },
  { email: 'suresh.gupta@email.com', role: 'Parent', password: 'password', name: 'Suresh Gupta' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    
    setEmail(email);
    setPassword(password);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          {/* School Branding */}
          <div className="text-center">
            {schoolInfo?.logoUrl && (
              <img 
                src={schoolInfo.logoUrl} 
                alt={`${schoolInfo.name} Logo`}
                className="w-16 h-16 object-contain mx-auto mb-4 rounded-lg shadow-sm border border-slate-200"
              />
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {schoolInfo?.name || 'School Management System'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Sign in to access your dashboard
            </p>
          </div>

          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-lg sm:text-xl">Sign In</CardTitle>
              <CardDescription className="text-sm">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@school.edu"
                    required
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="border-slate-200 focus:border-blue-500 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Demo Credentials (Click to use)</CardTitle>
              <CardDescription className="text-xs">All demo accounts use password: "password"</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                {demoUsers.map((user, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-slate-50">
                    <span className="font-medium text-slate-700">{user.role}:</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fillDemoCredentials(user.email, user.password)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-1 text-xs"
                    >
                      {user.email}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Super Admin Link */}
          <div className="text-center">
            <Link 
              to="/super-admin-login" 
              className="text-sm text-slate-600 hover:text-slate-900 underline"
            >
              Super Admin Access →
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
