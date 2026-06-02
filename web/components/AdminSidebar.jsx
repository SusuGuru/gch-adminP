import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, Settings, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Button } from '@/components/ui/button';

function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/promotions', label: 'Promotions', icon: Tag },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex flex-col z-50">
      <div className="p-6 border-b border-[hsl(var(--sidebar-border))] flex justify-center">
        <img 
          src="https://horizons-cdn.hostinger.com/68ad174c-ec9e-41a5-9b8d-37309a8f51bb/c3a5a2eb1b70786d09765ef87cfd07ab.png" 
          alt="Gold Coast Hair" 
          className="h-12 object-contain brightness-0 invert"
        />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default AdminSidebar;