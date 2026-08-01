import { calculateMonthlyEmi } from "../../utils/emi.js";

export function evaluateRevenueToEmi(application) {
    const monthlyRevenue = application.monthly_revenue;
    const requestedLoanAmount = application.requested_loan_amount;
    const tenureMonths = application.loan_tenure_months;

    if (!monthlyRevenue || monthlyRevenue <= 0) {
        return {
            name: "REVENUE_TO_EMI",
            passed: false,
            value: 0,
            threshold: 0.35
        };
    }

    const emi = calculateMonthlyEmi(
        requestedLoanAmount,
        tenureMonths
    );

    const ratio = emi / monthlyRevenue;
    const passed = ratio <= 0.35;

    return {
        name: "REVENUE_TO_EMI",
        passed,
        value: Number(ratio.toFixed(2)),
        threshold: 0.35
    };
}