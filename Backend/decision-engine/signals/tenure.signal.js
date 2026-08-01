export function evaluateTenure(application) {
    const tenure = application.loan_tenure_months;
    const passed = tenure >= 24 && tenure <= 48;

    return {
        name: "TENURE_RISK",
        passed,
        value: tenure,
        preferredRange: {
            minimumMonths: 24,
            maximumMonths: 48
        }
    };
}