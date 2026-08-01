export function evaluateLoanToRevenue(application) {
    const ratio =
        application.requested_loan_amount /
        application.monthly_revenue;

    const passed = ratio <= 5;

    return {
        name: "LOAN_TO_MONTHLY_REVENUE",
        passed,
        value: Number(ratio.toFixed(2)),
        threshold: 5
    };
}