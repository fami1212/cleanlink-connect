import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  allow: UserRole[];
  children: ReactNode;
}

const RoleGuard = ({ allow, children }: RoleGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: rolesLoading } = useUserRole();

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/app/auth" replace />;

  const allowed = roles.some((r) => allow.includes(r));
  if (!allowed) return <Navigate to="/app" replace />;

  return <>{children}</>;
};

export default RoleGuard;
