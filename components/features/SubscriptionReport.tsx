"use client";

import { generate } from "@pdfme/generator";
import { text } from "@pdfme/schemas";
import { Subscription } from "@/types";

/**
 * THE AUDIT GENERATOR
 * Generates high-fidelity PDF reports using the client's CPU.
 * Zero server cost for reporting.
 */
export const generateAuditReport = async (subscriptions: Subscription[]) => {
    const template = {
        basePdf: { width: 210, height: 297 },
        schemas: [
            {
                title: {
                    type: "text",
                    position: { x: 20, y: 20 },
                    width: 170,
                    height: 10,
                    fontSize: 20,
                    fontColor: "#333",
                },
                content: {
                    type: "text",
                    position: { x: 20, y: 40 },
                    width: 170,
                    height: 200,
                    fontSize: 12,
                }
            }
        ],
    };

    const inputs = [
        {
            title: "SubScouter: Subscription Audit Report",
            content: subscriptions.map(s => `${s.name}: ${s.currency} ${s.amount} (${s.billingCycle})`).join("\n")
        }
    ];

    const pdf = await generate({ template: (template as any), inputs, plugins: { text } });

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SubScouter_Audit_${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
};

export const SubscriptionReportButton = ({ subscriptions }: { subscriptions: Subscription[] }) => {
    return (
        <button
            onClick={() => generateAuditReport(subscriptions)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
        >
            Generate Audit Report (PDF)
        </button>
    );
};
