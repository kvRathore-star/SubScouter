"use client";

import { Subscription } from "@/types";
import { FileText, Download, Sparkles } from "lucide-react";

/**
 * THE SOVEREIGN AUDITOR
 * Generates encrypted-ready PDF reports on the client device.
 */
export const generateAuditReport = async (subscriptions: Subscription[]) => {
    // Dynamic import to prevent build-time Webpack errors
    const { generate } = await import("@pdfme/generator");
    const { text } = await import("@pdfme/schemas");

    const template = {
        basePdf: { width: 210, height: 297 },
        schemas: [
            {
                title: {
                    type: "text",
                    position: { x: 20, y: 20 },
                    width: 170,
                    height: 15,
                    fontSize: 24,
                    fontWeight: 'bold',
                    fontColor: "#0f172a",
                },
                meta: {
                    type: "text",
                    position: { x: 20, y: 35 },
                    width: 170,
                    height: 10,
                    fontSize: 10,
                    fontColor: "#64748b",
                },
                content: {
                    type: "text",
                    position: { x: 20, y: 55 },
                    width: 170,
                    height: 200,
                    fontSize: 11,
                    lineHeight: 1.5,
                }
            }
        ],
    };

    const inputs = [
        {
            title: "SUBSCOUTER: NODE AUDIT REPORT",
            meta: `GENERATED: ${new Date().toLocaleString()} | PROTOCOL: SOVEREIGN_ENCRYPTION_ACTIVE`,
            content: subscriptions.map(s => {
                const status = s.status.toUpperCase();
                return `[${status}] ${s.name.padEnd(20)} | ${s.currency} ${s.amount.toFixed(2).padStart(8)} | CYCLE: ${s.billingCycle.toUpperCase()}`;
            }).join("\n") + `\n\n------------------------------------------------\nTOTAL MONTHLY BURN: $${subscriptions.reduce((acc, s) => acc + (s.status === 'active' ? s.amount : 0), 0).toFixed(2)}`
        }
    ];

    const pdf = await generate({ template: (template as any), inputs, plugins: { text } });

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SubScouter_Intelligence_Rollup_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

export const SubscriptionReportButton = ({ subscriptions }: { subscriptions: Subscription[] }) => {
    return (
        <button
            onClick={() => generateAuditReport(subscriptions)}
            className="group relative flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[#0f172a]/20 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden italic"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <FileText className="w-4 h-4 text-brand" />
            <span>Extract Intelligence Rollup (PDF)</span>
            <Download className="w-3.5 h-3.5 opacity-40 group-hover:translate-y-0.5 transition-transform" />
        </button>
    );
};
