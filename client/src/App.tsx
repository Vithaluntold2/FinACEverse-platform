import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "./hooks/use-auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Sidebar from "./components/Sidebar";

export default function App() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent mx-auto" />
          <p className="text-[hsl(var(--muted-foreground))]">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPath={location} user={user!} />
      <main className="flex-1 overflow-y-auto p-6">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/modules" component={Modules} />
          <Route>
            <div className="flex h-full items-center justify-center">
              <p className="text-[hsl(var(--muted-foreground))]">Page not found</p>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
