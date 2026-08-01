// This is mock fixed interest-rate for load as mock standard
const ANNUAL_INTEREST_RATE = 0.12;

export function calculateMonthlyEmi(principal, tenureMonths, annualInterestRate = ANNUAL_INTEREST_RATE) {
    const monthlyRate = annualInterestRate / 12;

    if (monthlyRate === 0) {
        return principal / tenureMonths;
    }

    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Number(emi.toFixed(2));
}

export function getAssumedAnnualInterestRate() {
    return ANNUAL_INTEREST_RATE;
}