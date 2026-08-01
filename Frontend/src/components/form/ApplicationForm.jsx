import { useState } from "react";
import BusinessProfileSection from "./BusinessProfileForm";
import LoanApplicationSection from "./LoanApplicationSection";
import Button from "../common/Button";
import { normalizeApplication, validateApplication } from "../../utils/validation";

const INITIAL_FORM = {
    ownerName: "",
    businessName: "",
    pan: "",
    businessType: "",
    yearsInBusiness: "",
    monthlyRevenue: "",
    annualRevenue: "",
    existingDebt: "",
    requestedLoanAmount: "",
    loanPurpose: "",
    loanTenure: "",
    collateral: "",
};

function ApplicationForm({ onDecision, onError }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: name === "pan" ? value.toUpperCase() : value,
        }));

        setErrors((current) => {
            if (!current[name]) {
                return current;
            }

            const updated = { ...current };
            delete updated[name];

            return updated;
        });
    }

    function handleBlur(event) {
        const fieldName = event.target.name;

        const nextErrors = validateApplication(form);

        if (nextErrors[fieldName]) {
            setErrors((current) => ({
                ...current,
                [fieldName]: nextErrors[fieldName],
            }));
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        onError("");
        const validationErrors = validateApplication(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            const firstErrorField = Object.keys(validationErrors)[0];
            document.getElementById(firstErrorField)?.focus();
            return;
        }

        try {
            setSubmitting(true);
            const payload = normalizeApplication(form);
            await onDecision(payload);
        } catch (error) {
            onError(error?.message || "Unable to evaluate the application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <BusinessProfileSection
                form={form}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
            />

            <LoanApplicationSection
                form={form}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <Button type="submit" loading={submitting}>
                    Evaluate Loan Application
                </Button>

                <p className="mt-3 text-center text-xs text-slate-500">
                    All required information is validated before submission.
                </p>
            </div>
        </form>
    );
}

export default ApplicationForm;