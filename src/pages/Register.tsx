import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ChevronLeft } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div
      className="ios-app flex flex-col bg-background"
      style={{ height: "100dvh" }}
    >
      {/* Status bar */}
      <div className="ios-status-bar" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto ios-scroll flex flex-col px-6 pt-4 pb-10">

        {/* Back button */}
        <Link
          to="/login"
          className="flex items-center gap-1 text-accent font-medium text-[15px] mb-6 w-fit"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
          Sign In
        </Link>

        {/* Brand */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div
            className="w-16 h-16 rounded-2xl gradient-rose flex items-center justify-center mb-4"
            style={{ boxShadow: "0 8px 32px -8px hsl(7 52% 68% / 0.5)" }}
          >
            <Sparkles size={28} className="text-accent-foreground" />
          </div>
          <h1 className="ios-large-title text-center">Create account</h1>
          <p className="text-muted-foreground text-[15px] mt-1 text-center">
            Start building your digital wardrobe
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-muted-foreground tracking-wide uppercase">
              Full Name
            </label>
            <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5 border border-border focus-within:border-accent transition-colors duration-200">
              <User size={17} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-muted-foreground tracking-wide uppercase">
              Email
            </label>
            <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5 border border-border focus-within:border-accent transition-colors duration-200">
              <Mail size={17} className="text-muted-foreground shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-muted-foreground tracking-wide uppercase">
              Password
            </label>
            <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5 border border-border focus-within:border-accent transition-colors duration-200">
              <Lock size={17} className="text-muted-foreground shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Password strength dots */}
            {password.length > 0 && (
              <div className="flex gap-1.5 px-1 mt-1">
                {[1, 2, 3, 4].map((i) => {
                  const strength = Math.min(Math.floor(password.length / 3), 4);
                  return (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        background:
                          i <= strength
                            ? strength <= 1
                              ? "hsl(0 62% 55%)"
                              : strength <= 2
                              ? "hsl(40 90% 55%)"
                              : "hsl(140 60% 50%)"
                            : "hsl(var(--border))",
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-muted-foreground tracking-wide uppercase">
              Confirm Password
            </label>
            <div
              className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5 border transition-colors duration-200"
              style={{
                borderColor:
                  confirm.length > 0 && confirm !== password
                    ? "hsl(0 62% 55%)"
                    : confirm.length > 0 && confirm === password
                    ? "hsl(140 60% 50%)"
                    : "hsl(var(--border))",
              }}
            >
              <Lock size={17} className="text-muted-foreground shrink-0" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-muted-foreground"
                aria-label="Toggle confirm visibility"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {confirm.length > 0 && confirm !== password && (
              <p className="text-[12px] text-destructive px-1">Passwords don't match</p>
            )}
          </div>

          {/* Terms */}
          <p className="text-[12px] text-muted-foreground text-center leading-relaxed mt-1">
            By creating an account you agree to our{" "}
            <span className="text-accent">Terms of Service</span> and{" "}
            <span className="text-accent">Privacy Policy</span>.
          </p>

          {/* CTA */}
          <button
            className="ios-primary-btn justify-center mt-1 w-full"
            style={{ boxShadow: "0 6px 24px -6px hsl(7 52% 68% / 0.45)" }}
            disabled={
              !name || !email || !password || password !== confirm
            }
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 flex justify-center">
          <p className="text-[14px] text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
