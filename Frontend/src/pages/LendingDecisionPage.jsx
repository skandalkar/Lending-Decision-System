import { useState } from "react";
import ApplicationForm from "../components/form/ApplicationForm";
import DecisionResult from "../components/result/DecisionCard";
import { evaluateLoanApplication } from "../services/lendingApi";

function LendingDecisionPage() {
    const [decision, setDecision] = useState(null);
    const [apiError, setApiError] = useState("");

    async function handleDecision(application) {
        setApiError("");

        const result = await evaluateLoanApplication(application);

        setDecision(result);
    }

    function handleError(message) {
        setApiError(message);
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            {/* The header loads Layout.jsx */}
            {/* Page Content */}
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mx-auto max-w-3xl">
                    {/* Intro */}
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-blue-600">
                            LOAN EVALUATION
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Evaluate an MSME loan application
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            Enter the business and loan details below. The lending decision
                            engine will evaluate the application and return an approval decision, credit score, and reason codes.
                        </p>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                        >
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                                !
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-red-800">
                                    Unable to evaluate application
                                </p>

                                <p className="mt-1 text-sm leading-6 text-red-700">
                                    {apiError}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <ApplicationForm
                        onDecision={handleDecision}
                        onError={handleError}
                    />

                    {/* Decision */}
                    <div className="mt-8">
                        <DecisionResult decision={decision} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default LendingDecisionPage;