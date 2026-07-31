const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const REQUIRED_FIELDS = [
  "ownerName",
  "businessName",
  "pan",
  "businessType",
  "yearsInBusiness",
  "monthlyRevenue",
  "annualRevenue",
  "existingDebt",
  "requestedLoanAmount",
  "loanPurpose",
  "loanTenure",
  "collateral",
];

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

export function validateApplication(form) {
  const errors = {};

  // Required fields
  REQUIRED_FIELDS.forEach((field) => {
    if (isBlank(form[field])) {
      errors[field] = "This field is required.";
    }
  });

  // Stop value validation when required values are missing.
  // Individual checks below still safely handle invalid values.
  if (!isBlank(form.ownerName) && form.ownerName.trim().length < 2) {
    errors.ownerName = "Enter a valid owner name.";
  }

  if (!isBlank(form.businessName) && form.businessName.trim().length < 2) {
    errors.businessName = "Enter a valid business name.";
  }

  // PAN validation
  if (!isBlank(form.pan)) {
    const pan = form.pan.trim().toUpperCase();

    if (!PAN_REGEX.test(pan)) {
      errors.pan = "Enter a valid PAN, e.g. ABCDE1234F.";
    }
  }

  // Numeric fields
  const years = toNumber(form.yearsInBusiness);
  const monthlyRevenue = toNumber(form.monthlyRevenue);
  const annualRevenue = toNumber(form.annualRevenue);
  const existingDebt = toNumber(form.existingDebt);
  const requestedLoanAmount = toNumber(form.requestedLoanAmount);

  if (!isBlank(form.yearsInBusiness)) {
    if (!Number.isFinite(years) || years < 0 || years > 100) {
      errors.yearsInBusiness = "Years in business must be between 0 and 100.";
    }
  }

  if (!isBlank(form.monthlyRevenue)) {
    if (!Number.isFinite(monthlyRevenue) || monthlyRevenue < 0) {
      errors.monthlyRevenue = "Monthly revenue cannot be negative.";
    }
  }

  if (!isBlank(form.annualRevenue)) {
    if (!Number.isFinite(annualRevenue) || annualRevenue < 0) {
      errors.annualRevenue = "Annual revenue cannot be negative.";
    }
  }

  if (!isBlank(form.existingDebt)) {
    if (!Number.isFinite(existingDebt) || existingDebt < 0) {
      errors.existingDebt = "Existing debt cannot be negative.";
    }
  }

  if (!isBlank(form.requestedLoanAmount)) {
    if (!Number.isFinite(requestedLoanAmount) || requestedLoanAmount <= 0) {
      errors.requestedLoanAmount = "Loan amount must be greater than zero.";
    }
  }

  // Monthly and annual revenue consistency
  if (
    Number.isFinite(monthlyRevenue) &&
    Number.isFinite(annualRevenue) &&
    monthlyRevenue >= 0 &&
    annualRevenue >= 0
  ) {
    const expectedMinimumAnnualRevenue = monthlyRevenue * 12;

    if (annualRevenue < expectedMinimumAnnualRevenue) {
      errors.annualRevenue =
        "Annual revenue cannot be lower than 12 × monthly revenue.";
    }
  }

  // Debt consistency
  if (
    Number.isFinite(existingDebt) &&
    Number.isFinite(annualRevenue) &&
    existingDebt > annualRevenue &&
    annualRevenue > 0
  ) {
    errors.existingDebt =
      "Outstanding debt is unusually high compared with annual revenue.";
  }

  // Requested loan amount vs annual revenue
  if (
    Number.isFinite(requestedLoanAmount) &&
    Number.isFinite(annualRevenue) &&
    annualRevenue > 0 &&
    requestedLoanAmount > annualRevenue * 5
  ) {
    errors.requestedLoanAmount =
      "Requested loan is unusually high compared with annual revenue.";
  }

  return errors;
}

export function normalizeApplication(form) {
  return {
    ownerName: form.ownerName.trim(),
    businessName: form.businessName.trim(),
    pan: form.pan.trim().toUpperCase(),
    businessType: form.businessType,
    yearsInBusiness: Number(form.yearsInBusiness),
    monthlyRevenue: Number(form.monthlyRevenue),
    annualRevenue: Number(form.annualRevenue),
    existingDebt: Number(form.existingDebt),
    requestedLoanAmount: Number(form.requestedLoanAmount),
    loanPurpose: form.loanPurpose,
    loanTenure: Number(form.loanTenure),
    collateral: form.collateral === "YES",
  };
}