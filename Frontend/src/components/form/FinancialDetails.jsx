import { Wallet } from "lucide-react";
import Card from "../common/Card";
import InputField from "../common/InputField";

function FinancialDetails({ formData, errors, onChange }) {
    return (
        <Card className="p-5 sm:p-6">
            <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Wallet size={20} />
                </div>

                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Financial Details
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Current financial position of the business.
                    </p>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                    label="Monthly Revenue"
                    name="monthlyRevenue"
                    type="number"
                    value={formData.monthlyRevenue}
                    onChange={onChange}
                    placeholder="e.g. 2500000"
                    min="0"
                    step="1000"
                    error={errors.monthlyRevenue}
                    required
                />

                <InputField
                    label="Existing Debt"
                    name="existingDebt"
                    type="number"
                    value={formData.existingDebt}
                    onChange={onChange}
                    placeholder="e.g. 500000"
                    min="0"
                    step="1000"
                    error={errors.existingDebt}
                    required
                />
            </div>
        </Card>
    );
}

export default FinancialDetails;