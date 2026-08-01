import CreditScore from "../result/CreditScoreCard";
import ReasonCodes from "../result/ReasonCodes";

function formatLabel(value) {
  const acronyms = new Set(["EMI"]);

  return String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\b\w+\b/g, (word) =>
      acronyms.has(word.toUpperCase()) ? word.toUpperCase() : word
    );
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatSignalThreshold(signal) {
  if (signal?.preferredRange) {
    const { minimumMonths, maximumMonths } = signal.preferredRange;
    return `${minimumMonths} - ${maximumMonths} months`;
  }

  if (signal?.threshold !== undefined && signal?.threshold !== null) {
    return signal.threshold;
  }

  return "Not available";
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900">
        {value || "Not available"}
      </p>
    </div>
  );
}

function SignalResults({ signals = [] }) {
  const normalizedSignals = Array.isArray(signals) ? signals : [];

  if (normalizedSignals.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          No signal results were returned by the decision engine.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Signal Results</h3>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
        <div className="hidden grid-cols-[1.4fr_0.7fr_0.9fr_0.7fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
          <span>Signal</span>
          <span>Value</span>
          <span>Required</span>
          <span>Result</span>
        </div>

        <div className="divide-y divide-slate-200">
          {normalizedSignals.map((signal, index) => {
            const passed = Boolean(signal.passed);

            return (
              <div
                key={`${signal.name || "signal"}-${index}`}
                className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-[1.4fr_0.7fr_0.9fr_0.7fr] sm:items-center sm:gap-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {formatLabel(signal.name)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 sm:hidden">
                    Value: {signal.value ?? "Not available"} | Required:{" "}
                    {formatSignalThreshold(signal)}
                  </p>
                </div>

                <p className="hidden text-slate-700 sm:block">
                  {signal.value ?? "Not available"}
                </p>

                <p className="hidden text-slate-700 sm:block">
                  {formatSignalThreshold(signal)}
                </p>

                <span
                  className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${passed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                    }`}
                >
                  {passed ? "Passed" : "Failed"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DecisionResult({ decision }) {
  if (!decision) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
          ₹
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          No decision yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Complete the application form and evaluate the loan to see the credit
          decision and reasoning here.
        </p>
      </section>
    );
  }

  const decisionPayload = decision?.data?.decision || decision?.decision || decision;
  const applicationStatus = decision?.data?.status || decision?.status;
  const applicationId = decision?.data?.applicationId || decision?.applicationId;

  if (!decisionPayload) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <p className="text-sm font-medium text-slate-500">Decision Result</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Lending Decision
          </h2>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Decision is not available yet.
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Application status: {applicationStatus || "UNKNOWN"}
            </p>
          </div>

          <DetailItem label="Application ID" value={applicationId} />
        </div>
      </section>
    );
  }

  const status = String(decisionPayload.status || "").toUpperCase();

  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const statusLabel = isApproved ? "Approved" : isRejected ? "Rejected" : status || "Unknown";

  const statusStyles = isApproved
    ? {
      container: "border-emerald-200 bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-700",
      text: "text-emerald-700",
    }
    : {
      container: "border-red-200 bg-red-50",
      icon: "bg-red-100 text-red-700",
      text: "text-red-700",
    };

  const reasons = decisionPayload.reasonCodes || decisionPayload.reasons || decisionPayload.reasoning || [];
  const signals = decisionPayload.signalResults || [];
  const decidedAt = decisionPayload.decidedAt;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Decision Result
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Lending Decision
            </h2>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusStyles.container} ${statusStyles.text}`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${statusStyles.icon}`}
            >
              {isApproved ? "✓" : "!"}
            </span>
            {statusLabel}
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <DetailItem label="Application ID" value={applicationId} />
          <DetailItem label="Application Status" value={formatLabel(applicationStatus)} />
          <DetailItem label="Decided At" value={formatDate(decidedAt)} />
        </div>

        <CreditScore score={decisionPayload.creditScore} />
        <SignalResults signals={signals} />
        <ReasonCodes reasons={reasons} status={status} />
      </div>
    </section>
  );
}

export default DecisionResult;