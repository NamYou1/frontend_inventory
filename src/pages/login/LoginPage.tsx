import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/api/axios";
import { setAccessToken, setRefreshToken, setUser } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CommandIcon, EyeIcon, EyeOffIcon, LockIcon, UserIcon, ShieldAlertIcon } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve redirect path from router state if available
  const from = (location.state as any)?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("auth/login", {
        usernameOrEmail: username,
        password,
      });

      if (response.data && response.data.payload) {
        const payload = response.data.payload;
        
        // Save auth data
        setAccessToken(payload.accessToken);
        setRefreshToken(payload.refreshToken);
        setUser({
          userId: payload.userId,
          username: payload.username,
          email: payload.email,
          roles: payload.roles,
          permissions: payload.permissions,
          storeId: payload.storeId,
        });

        toast.success(response.data.message || "Logged in successfully!");

        // Determine correct redirect path based on user roles
        if (payload.roles.includes("ROLE_ADMIN")) {
          navigate("/store", { replace: true });
        } else {
          // Super Admin or other roles go to dashboard / (or original target)
          navigate(from === "/login" ? "/" : from, { replace: true });
        }
        
        // Force refresh sidebar and header states
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error: any) {
      // Axios interceptor will automatically toast error message
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 font-sans text-slate-800 antialiased">
      {/* Dual Column Layout: Left Column (Form Panel) */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <CommandIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Acme Inc.</span>
              <p className="text-xs text-muted-foreground">Inventory Hub</p>
            </div>
          </div>

          <Card className="border-slate-200 bg-white/80 backdrop-blur-md shadow-xl shadow-slate-200/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-slate-900">Welcome back</CardTitle>
              <CardDescription className="text-slate-500">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700">Username</Label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-slate-200 bg-white pl-10 text-slate-800 placeholder:text-slate-400 focus-visible:ring-primary focus-visible:ring-offset-0"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <LockIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-200 bg-white px-10 text-slate-800 placeholder:text-slate-400 focus-visible:ring-primary focus-visible:ring-offset-0"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 font-medium"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 py-4">
              {/* Credentials Helper Panel */}
              <div className="flex w-full items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-slate-600">
                <ShieldAlertIcon className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-primary">Demo Accounts</p>
                  <p>
                    <span className="font-semibold text-slate-700">Super Admin:</span> admin / Admin@123
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Super Admin sees all metrics, categories, & stores. Admin is redirected strictly to Store management.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Dual Column Layout: Right Column (Graphic Branding Panel) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        {/* Modern gradient backdrop - light version */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-blue-50 to-violet-100/60" />
        
        {/* Dynamic mesh line overlay for professional depth */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative flex h-full flex-col justify-between p-16">
          <div className="flex items-center gap-2.5">
            <CommandIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-wider uppercase text-slate-700">System Dashboard</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 xl:text-5xl">
              Precision Logistics, <br />
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                Simplified Control.
              </span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Ensure flawless business continuity. Seamlessly track categories, optimize products, manage store hubs, and audit operational logistics in real-time.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="rounded-lg border border-slate-200 bg-white/70 backdrop-blur-sm px-4 py-2.5 shadow-sm">
                <p className="text-2xl font-bold text-slate-800">99.9%</p>
                <p className="text-xs text-slate-500 font-medium">Uptime Guarantee</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white/70 backdrop-blur-sm px-4 py-2.5 shadow-sm">
                <p className="text-2xl font-bold text-slate-800">Real-time</p>
                <p className="text-xs text-slate-500 font-medium">Synchronization</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 Acme Inc. All rights reserved. Built with Vite + Shadcn UI.
          </p>
        </div>
      </div>
    </div>
  );
}
