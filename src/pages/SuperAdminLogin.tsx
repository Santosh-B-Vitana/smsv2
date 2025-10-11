
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Eye, EyeOff, Sun, Moon, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { useTheme } from '@/contexts/ThemeContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Redirect if already authenticated
  // Removed automatic redirect to dashboard after authentication

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.includes('superadmin')) {
      setError('This login is for Super Administrators only');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      console.error('SuperAdminLogin: Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const fillSuperAdminCredentials = () => {
    
    setEmail('superadmin@schoolsystem.com');
    setPassword('password');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
              {theme === 'light' && <Sun className="h-4 w-4" />}
              {theme === 'dark' && <Moon className="h-4 w-4" />}
              {theme === 'system' && <Monitor className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          {/* Super Admin Branding */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Super Admin Portal
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Super admin access and permissions management
            </p>
          </div>

          <Card className="border-border shadow-lg bg-card">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-lg sm:text-xl">System Access</CardTitle>
              <CardDescription className="text-sm">
                Enter your super admin credentials to continue
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
                    placeholder="superadmin@schoolsystem.com"
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
                  Access System
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Demo Credentials (Click to use)</CardTitle>
              <CardDescription className="text-xs">Super Admin demo account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50">
                  <span className="font-medium text-slate-700">Super Admin:</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={fillSuperAdminCredentials}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-1 text-xs"
                  >
                    superadmin@schoolsystem.com
                  </Button>
                </div>
                <div className="text-center text-slate-500">
                  Password: "password"
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-sm text-slate-600 hover:text-slate-900 underline"
            >
              ← Back to School Login
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
