import { useMemo, useState } from "react";

export default function SignUpPage({ onSignUpSuccess, onGoToSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 8;
  const isConfirmValid = confirm.length > 0 && confirm === password;
  const canSubmit = isEmailValid && isPasswordValid && isConfirmValid && agree;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log("sign up success", { email });

    if (onSignUpSuccess) onSignUpSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 60% at 80% 20%, rgba(123,94,234,0.12) 0%, rgba(123,94,234,0.08) 30%, rgba(123,94,234,0.04) 55%, rgba(123,94,234,0) 80%)",
        }}
      />
      <div className="relative mx-auto max-w-screen-xl px-6 sm:px-8 md:px-10">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-[0_4px_24px_rgba(16,24,40,0.06)]">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="text-[#7B5EEA]">MBG</span>
                <span className="ml-2 text-gray-900">Nutrition Data</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-500">
                Create your account to start using the dashboard.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="lavly.rantissa@example.com"
                  className={[
                    "w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition",
                    isEmailValid
                      ? "border-gray-200 focus:ring-2 focus:ring-[#7B5EEA]"
                      : "border-red-300 focus:ring-2 focus:ring-red-400",
                  ].join(" ")}
                  aria-invalid={!isEmailValid}
                />
              </label>

              {/* Password */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    className={[
                      "w-full rounded-xl border bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition",
                      isPasswordValid
                        ? "border-gray-200 focus:ring-2 focus:ring-[#7B5EEA]"
                        : "border-red-300 focus:ring-2 focus:ring-red-400",
                    ].join(" ")}
                    aria-invalid={!isPasswordValid}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className={
                      "absolute inset-y-0 right-2 my-auto grid h-9 w-9 place-items-center rounded-full transition " +
                      (showPassword
                        ? "border-2 border-gray-300 bg-white text-gray-600"
                        : "text-gray-400 hover:text-gray-600")
                    }
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42" />
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters.</p>
              </label>

              {/* Confirm Password */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm Password
                </span>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="Re-enter your password"
                    className={[
                      "w-full rounded-xl border bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition",
                      isConfirmValid
                        ? "border-gray-200 focus:ring-2 focus:ring-[#7B5EEA]"
                        : confirm.length === 0
                        ? "border-gray-200 focus:ring-2 focus:ring-[#7B5EEA]"
                        : "border-red-300 focus:ring-2 focus:ring-red-400",
                    ].join(" ")}
                    aria-invalid={!isConfirmValid}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className={
                      "absolute inset-y-0 right-2 my-auto grid h-9 w-9 place-items-center rounded-full transition " +
                      (showConfirm
                        ? "border-2 border-gray-300 bg-white text-gray-600"
                        : "text-gray-400 hover:text-gray-600")
                    }
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42" />
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {confirm.length > 0 && !isConfirmValid && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords do not match.
                  </p>
                )}
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={
                  "mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-4 " +
                  (canSubmit
                    ? "bg-[#7B5EEA] hover:bg-[#6a4fea] focus:ring-[#7B5EEA]/40"
                    : "bg-gray-300 cursor-not-allowed")
                }
              >
                Create account
              </button>

              <p className="pt-1 text-sm text-gray-600 text-center">
                <span className="font-normal">Already have an account?</span>{" "}
                <button
                  type="button"
                  onClick={onGoToSignIn}
                  className="text-[#7B5EEA] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
