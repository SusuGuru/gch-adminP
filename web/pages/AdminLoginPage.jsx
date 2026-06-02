import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Lock } from 'lucide-react';

function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(password);
      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.error || 'Invalid password.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>GoldCoastHair-Admin</title>
        <meta name="description" content="Secure admin login for Gold Coast Hair" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-secondary/5 px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-secondary/10 -skew-y-6 transform origin-top-left -z-10"></div>
        
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="space-y-6 pb-8 pt-10 flex flex-col items-center border-b border-border/50 bg-secondary/5 rounded-t-xl focus:outline-none" tabIndex={-1}>
            <img 
              src="https://horizons-cdn.hostinger.com/68ad174c-ec9e-41a5-9b8d-37309a8f51bb/c3a5a2eb1b70786d09765ef87cfd07ab.png" 
              alt="Gold Coast Hair" 
              className="h-16 object-contain focus:outline-none"
            />
            <div className="text-center space-y-1 focus:outline-none">
              <h1 className="text-2xl font-heading font-bold text-foreground">Admin Portal</h1>
              <p className="text-sm text-muted-foreground">Enter master password to continue</p>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-10 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-foreground font-medium">Master Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 text-foreground border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Access Portal'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AdminLoginPage;