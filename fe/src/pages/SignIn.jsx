import { useState } from "react";

export default function SignInPage({ onSignInSuccess, onGoToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("login success", { email, remember });

    if (onSignInSuccess) onSignInSuccess();
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
                Please fill your detail to access your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </span>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="lavly.rantissa@example.com"
                    className="peer w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#7B5EEA]"
                    aria-label="Email"
                  />
                </div>
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
                    placeholder="••••••••"
                    className="peer w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#7B5EEA]"
                    aria-label="Password"
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
              </label>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#7B5EEA] focus:ring-[#7B5EEA]"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span> Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-[#7B5EEA] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#7B5EEA] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#6a4fea] focus:outline-none focus:ring-4 focus:ring-[#7B5EEA]/40"
              >
                Sign in
              </button>

              {/* Sign Up */}
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={onGoToSignUp}
                  className="text-[#7B5EEA] font-medium hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
