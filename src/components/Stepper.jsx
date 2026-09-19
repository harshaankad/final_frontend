"use client";

const STEPS = [
  { n: 1, label: "Basic Information" },
  { n: 2, label: "Upload Photos" },
  { n: 3, label: "Choose Region" },
  { n: 4, label: "Payment" },
];

/**
 * Progress indicator for the add-patient flow.
 * Desktop shows all four steps; smaller screens show only the current one.
 */
export default function Stepper({ current }) {
  const active = STEPS.find((s) => s.n === current) || STEPS[0];

  const Step = ({ step, state }) => {
    const isActive = state === "active";
    const isDone = state === "done";
    return (
      <div
        className={`flex items-center gap-2.5 pb-2 border-b-2 transition-colors ${
          isActive ? "border-[#5F8D4E] text-[#5F8D4E]" : "border-transparent text-gray-400"
        }`}
        aria-current={isActive ? "step" : undefined}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
            isActive
              ? "bg-[#5F8D4E] text-white"
              : isDone
                ? "bg-[#5F8D4E]/15 text-[#5F8D4E]"
                : "bg-gray-100 text-gray-400"
          }`}
        >
          {step.n}
        </span>
        <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>{step.label}</span>
      </div>
    );
  };

  return (
    <nav className="flex justify-center mt-8 sm:mt-12 px-4" aria-label="Progress">
      {/* Desktop */}
      <ol className="hidden lg:flex items-center gap-12">
        {STEPS.map((step) => (
          <li key={step.n}>
            <Step
              step={step}
              state={step.n === current ? "active" : step.n < current ? "done" : "todo"}
            />
          </li>
        ))}
      </ol>

      {/* Tablet & mobile */}
      <div className="lg:hidden">
        <Step step={active} state="active" />
      </div>
    </nav>
  );
}
