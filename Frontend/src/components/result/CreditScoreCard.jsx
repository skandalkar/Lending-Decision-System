/* This function converts a credit score into a simple risk-quality label:
    750 or above → Excellent
    650-749 → Good
    550-649 → Fair
    Below 550 → Low
 */

function getScoreLabel(score) {
    if (score >= 750) {
        return "Excellent";
    }

    if (score >= 650) {
        return "Good";
    }

    if (score >= 550) {
        return "Fair";
    }

    return "Low";
}

function CreditScore({ score }) {
    const numericScore = Number(score);

    if (!Number.isFinite(numericScore)) {
        return null;
    }

    const label = getScoreLabel(numericScore);

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-500">Credit Score</p>

            <div className="mt-2 text-5xl font-bold tracking-tight text-slate-900">
                {numericScore}
            </div>

            <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>

            <div className="mx-auto mt-5 h-2 max-w-xs overflow-hidden rounded-full bg-slate-200">
                <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{
                        width: `${Math.min(Math.max((numericScore / 900) * 100, 0), 100)}%`,
                    }}
                />
            </div>

            <div className="mx-auto mt-2 flex max-w-xs justify-between text-[11px] text-slate-400">
                <span>0</span>
                <span>900</span>
            </div>
        </div>
    );
}

export default CreditScore;