import { REASON_CODES } from "./reason-codes.js";
import { evaluateRevenueToEmi } from "./signals/revenue-emi.signal.js";
import { evaluateLoanToRevenue } from "./signals/loan-revenue.signal.js";
import { evaluateTenure } from "./signals/tenure.signal.js";

export function evaluateApplication(application) {
    const revenueEmi = evaluateRevenueToEmi(application);
    const loanRevenue = evaluateLoanToRevenue(application);
    const tenure = evaluateTenure(application);
    const signals = [revenueEmi, loanRevenue, tenure];
    const passedSignals = signals.filter((signal) => signal.passed).length;

    /* Main decision rule:
     * If 2 out of 3 positive signals = APPROVED
     * If 0 or 1 positive signal = REJECTED
     */
    const decision = (passedSignals >= 2) ? "APPROVED" : "REJECTED";

    /* Internal 300-900 score.
     * 0/3 => 350
     * 1/3 => 500
     * 2/3 => 700
     * 3/3 => 850
     */
    const creditScoreByPassedSignals = {
        0: 350,
        1: 500,
        2: 700,
        3: 850
    };

    const creditScore = creditScoreByPassedSignals[passedSignals];

    const reasonCodes = [];

    if (revenueEmi.passed) {
        reasonCodes.push(
            REASON_CODES.REVENUE_EMI_PASS
        );
    } else {
        reasonCodes.push(
            REASON_CODES.REVENUE_EMI_FAIL
        );
    }

    if (loanRevenue.passed) {
        reasonCodes.push(
            REASON_CODES.LOAN_REVENUE_PASS
        );
    } else {
        reasonCodes.push(
            REASON_CODES.LOAN_REVENUE_FAIL
        );
    }

    if (tenure.passed) {
        reasonCodes.push(
            REASON_CODES.TENURE_PASS
        );
    } else {
        reasonCodes.push(
            REASON_CODES.TENURE_FAIL
        );
    }

    return {
        decision,
        creditScore,
        passedSignals,
        totalSignals: signals.length,
        signalResults: signals,
        reasonCodes
    };
}