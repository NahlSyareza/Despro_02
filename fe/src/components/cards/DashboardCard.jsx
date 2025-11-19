export function DashboardCard({ title, description, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_28px_rgba(16,24,40,0.06)] border border-gray-100 h-full">
      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-[13px] text-[#928E95] leading-relaxed md:pr-4">
          {description}
        </p>
      )}
      <div className="mt-6 md:mt-8">{children}</div>
    </div>
  );
}
