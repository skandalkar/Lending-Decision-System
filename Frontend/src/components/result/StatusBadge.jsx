import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const STATUS_CONFIG = {
    APPROVED: {
        label: "Approved",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        icon: CheckCircle2,
    },

    REJECTED: {
        label: "Rejected",
        className: "bg-red-50 text-red-700 ring-red-200",
        icon: XCircle,
    },

    REVIEW: {
        label: "Review Required",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
        icon: Clock3,
    },
};

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW;
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${config.className}`}>
            <Icon size={14} />
            {config.label}
        </span>
    );
}

export default StatusBadge;