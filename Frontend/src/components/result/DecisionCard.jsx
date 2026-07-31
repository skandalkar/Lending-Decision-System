import CreditScore from "../result/CreditScoreCard";
import ReasonCodes from "../result/ReasonCodes";

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

  const status = String(decision.status || "").toUpperCase();

  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";

  const statusLabel = isApproved ? "Approved" : isRejected ? "Rejected" : status;

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

  const reasons =
    decision.reasonCodes ||
    decision.reasons ||
    decision.reasoning ||
    [];

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
        <CreditScore score={decision.creditScore} />

        <ReasonCodes reasons={reasons} status={status} />
      </div>
    </section>
  );
}

export default DecisionResult;