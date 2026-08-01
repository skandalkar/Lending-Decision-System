import { z } from "zod";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const applicationSchema = z
    .object({
        ownerName: z
            .string()
            .trim()
            .min(2, "Owner name must contain at least 2 characters")
            .max(150),

        businessName: z
            .string()
            .trim()
            .min(2, "Business name must contain at least 2 characters")
            .max(200),

        pan: z
            .string()
            .trim()
            .toUpperCase()
            .regex(PAN_REGEX, "Invalid PAN format"),

        businessType: z.enum([
            "PROPRIETORSHIP",
            "PARTNERSHIP",
            "LLP",
            "PRIVATE_LIMITED",
            "PUBLIC_LIMITED"
        ]),

        yearsInBusiness: z
            .number()
            .min(0)
            .max(100),

        monthlyRevenue: z
            .number()
            .nonnegative(),

        annualRevenue: z
            .number()
            .nonnegative(),

        existingDebt: z
            .number()
            .nonnegative(),

        requestedLoanAmount: z
            .number()
            .positive(),

        loanPurpose: z.enum([
            "WORKING_CAPITAL",
            "BUSINESS_EXPANSION",
            "EQUIPMENT",
            "INVENTORY",
            "DEBT_REFINANCING",
            "OTHER"
        ]),

        loanTenure: z
            .number()
            .int()
            .min(6)
            .max(60),

        collateral: z.boolean()
    })
    .superRefine((data, ctx) => {
        if (data.annualRevenue < data.monthlyRevenue * 12) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["annualRevenue"],
                message:
                    "Annual revenue cannot be lower than 12 times monthly revenue."
            });
        }

        if (
            data.annualRevenue > 0 &&
            data.existingDebt > data.annualRevenue
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["existingDebt"],
                message:
                    "Existing debt cannot exceed annual revenue in this prototype."
            });
        }

        if (
            data.annualRevenue > 0 &&
            data.requestedLoanAmount > data.annualRevenue * 10
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["requestedLoanAmount"],
                message:
                    "Requested loan is disproportionately high compared with annual revenue."
            });
        }
    });