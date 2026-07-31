import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import SectionCard from "../common/Card";

const BUSINESS_TYPES = [
  { value: "PROPRIETORSHIP", label: "Proprietorship" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "LLP", label: "LLP" },
  { value: "PRIVATE_LIMITED", label: "Private Limited" },
  { value: "PUBLIC_LIMITED", label: "Public Limited" },
];

function BusinessProfileSection({
  form,
  errors,
  onChange,
  onBlur,
  disabled,
}) {
  return (
    <SectionCard
      title="Business & Owner Profile"
      description="Provide the business and owner information used for credit evaluation."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InputField
          label="Owner Name"
          name="ownerName"
          value={form.ownerName}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Enter owner's full name"
          error={errors.ownerName}
          required
          disabled={disabled}
        />

        <InputField
          label="Business Name"
          name="businessName"
          value={form.businessName}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Enter business name"
          error={errors.businessName}
          required
          disabled={disabled}
        />

        <InputField
          label="PAN"
          name="pan"
          value={form.pan}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="ABCDE1234F"
          error={errors.pan}
          required
          disabled={disabled}
        />

        <SelectField
          label="Business Type"
          name="businessType"
          value={form.businessType}
          onChange={onChange}
          onBlur={onBlur}
          options={BUSINESS_TYPES}
          error={errors.businessType}
          required
          disabled={disabled}
        />

        <InputField
          label="Years in Business"
          name="yearsInBusiness"
          value={form.yearsInBusiness}
          onChange={onChange}
          onBlur={onBlur}
          type="number"
          placeholder="e.g. 5"
          min="0"
          max="100"
          step="0.1"
          error={errors.yearsInBusiness}
          required
          disabled={disabled}
        />

        <InputField
          label="Monthly Revenue (₹)"
          name="monthlyRevenue"
          value={form.monthlyRevenue}
          onChange={onChange}
          onBlur={onBlur}
          type="number"
          placeholder="e.g. 500000"
          min="0"
          step="1"
          error={errors.monthlyRevenue}
          required
          disabled={disabled}
        />

        <InputField
          label="Annual Revenue (₹)"
          name="annualRevenue"
          value={form.annualRevenue}
          onChange={onChange}
          onBlur={onBlur}
          type="number"
          placeholder="e.g. 6000000"
          min="0"
          step="1"
          error={errors.annualRevenue}
          required
          disabled={disabled}
        />

        <InputField
          label="Existing / Outstanding Debt (₹)"
          name="existingDebt"
          value={form.existingDebt}
          onChange={onChange}
          onBlur={onBlur}
          type="number"
          placeholder="e.g. 1000000"
          min="0"
          step="1"
          error={errors.existingDebt}
          required
          disabled={disabled}
        />
      </div>
    </SectionCard>
  );
}

export default BusinessProfileSection;