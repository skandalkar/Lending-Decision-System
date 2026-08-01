import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import SectionCard from "../common/Card";

const LOAN_PURPOSES = [
  { value: "WORKING_CAPITAL", label: "Working Capital" },
  { value: "BUSINESS_EXPANSION", label: "Business Expansion" },
  { value: "EQUIPMENT", label: "Equipment / Machinery" },
  { value: "INVENTORY", label: "Inventory" },
  { value: "DEBT_REFINANCING", label: "Debt Refinancing" },
  { value: "OTHER", label: "Other" },
];

const TENURES = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" },
  { value: "48", label: "48 months" },
  { value: "60", label: "60 months" },
];

const COLLATERAL_OPTIONS = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
];

function LoanApplicationSection({ form, errors, onChange, onBlur, disabled, }) {
  return (
    <SectionCard
      title="Loan Application"
      description="Enter the requested loan details."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InputField
          label="Requested Loan Amount (₹)"
          name="requestedLoanAmount"
          value={form.requestedLoanAmount}
          onChange={onChange}
          onBlur={onBlur}
          type="number"
          placeholder="e.g. 2500000"
          min="1"
          step="1"
          error={errors.requestedLoanAmount}
          required
          disabled={disabled}
        />

        <SelectField
          label="Loan Purpose"
          name="loanPurpose"
          value={form.loanPurpose}
          onChange={onChange}
          onBlur={onBlur}
          options={LOAN_PURPOSES}
          error={errors.loanPurpose}
          required
          disabled={disabled}
        />

        <SelectField
          label="Loan Tenure"
          name="loanTenure"
          value={form.loanTenure}
          onChange={onChange}
          onBlur={onBlur}
          options={TENURES}
          error={errors.loanTenure}
          required
          disabled={disabled}
        />

        <SelectField
          label="Collateral Available"
          name="collateral"
          value={form.collateral}
          onChange={onChange}
          onBlur={onBlur}
          options={COLLATERAL_OPTIONS}
          error={errors.collateral}
          required
          disabled={disabled}
        />
      </div>
    </SectionCard>
  );
}

export default LoanApplicationSection;