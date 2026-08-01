function ReasonCodes({ reasons = [], status }) {
    const normalizedReasons = Array.isArray(reasons) ? reasons : [reasons].filter(Boolean);

    if (normalizedReasons.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                    No reason codes were returned by the decision engine.
                </p>
            </div>
        );
    }

    const approved = status === "APPROVED";

    return (
        <div>
            <h3 className="text-sm font-semibold text-slate-900">Reason Codes</h3>
            <div className="mt-3 space-y-3">
                {normalizedReasons.map((reason, index) => (
                    <div
                        key={`${reason}-${index}`}
                        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                    >
                        <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${approved
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {approved ? "✓" : "!"}
                        </span>
                        <p className="text-sm leading-6 text-slate-700">{reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReasonCodes;