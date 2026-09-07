import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiLockClosed, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export function AdminLoginModal() {
  const { adminLoginOpen, closeAdminLogin, login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("admin@almawaservices.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (adminLoginOpen) setErr("");
  }, [adminLoginOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      closeAdminLogin();
      router.push("/admin");
    } else {
      setErr("Invalid credentials.");
    }
  };

  return (
    <AnimatePresence>
      {adminLoginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-navy/70 backdrop-blur-sm grid place-items-center p-4"
          onClick={closeAdminLogin}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-background shadow-elegant overflow-hidden relative"
          >
            <button
              onClick={closeAdminLogin}
              className="absolute right-3 top-3 h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"
              aria-label="Close"
            >
              <HiX className="h-5 w-5" />
            </button>
            <div className="p-8">
              <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary grid place-items-center shadow-elegant mb-4">
                <HiLockClosed className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold text-center">Admin Login</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center">
                Sign in to manage Almawa Services.
              </p>
              <form onSubmit={submit} className="mt-6 grid gap-3">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input mt-1.5"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input mt-1.5"
                    required
                  />
                </label>
                {err && <p className="text-sm text-destructive">{err}</p>}
                <button
                  type="submit"
                  className="mt-1 rounded-full gradient-primary text-primary-foreground px-4 py-3 text-sm font-bold shadow-elegant"
                >
                  Sign In
                </button>
              </form>
              <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-accent/40 p-3 text-xs">
                <div className="font-bold text-primary mb-1">Demo Credentials</div>
                <div>Email: <span className="font-mono">admin@almawaservices.com</span></div>
                <div>Password: <span className="font-mono">admin123</span></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
