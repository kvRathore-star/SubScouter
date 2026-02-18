"use client";
import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Upload, Trash2, AlertTriangle } from "lucide-react";
import { Subscription } from "@/types/index";

interface DataManagementProps {
    subscriptions: Subscription[];
    onImport: (subs: Subscription[]) => void;
    onClearAll: () => void;
}

function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

const DataManagement: React.FC<DataManagementProps> = ({ subscriptions, onImport, onClearAll }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const exportJSON = () => {
        downloadFile(JSON.stringify(subscriptions, null, 2), 'subscout-data.json', 'application/json');
    };

    const exportCSV = () => {
        const headers = ['Name', 'Amount', 'Currency', 'Billing Cycle', 'Category', 'Next Billing Date', 'Status', 'Start Date', 'Canceled Date'];
        const rows = subscriptions.map(s => [
            `"${s.name}"`, s.amount, s.currency, s.billingCycle, `"${s.category}"`,
            s.nextBillingDate, s.status, s.startDate || '', s.canceledDate || ''
        ].join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        downloadFile(csv, 'subscout-data.csv', 'text/csv');
    };

    const exportPDF = () => {
        let html = `<html><head><title>SubScout — Subscription Report</title>
<style>body{font-family:system-ui;padding:40px;max-width:800px;margin:auto;color:#1e293b}
h1{font-size:22px;margin-bottom:4px}p.sub{color:#64748b;font-size:13px;margin-bottom:24px}
table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;padding:10px 12px;border-bottom:2px solid #e2e8f0;color:#64748b;font-weight:600}
td{padding:10px 12px;border-bottom:1px solid #f1f5f9}.status{padding:2px 10px;border-radius:999px;font-size:11px;font-weight:500}
.active{background:#dcfce7;color:#166534}.canceled{background:#fee2e2;color:#991b1b}.paused{background:#e0e7ff;color:#3730a3}
.trial{background:#fef3c7;color:#92400e}
.total{margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;font-size:14px}
.total strong{font-size:20px}
</style></head><body>`;
        html += `<h1>SubScout AI — Subscription Report</h1>`;
        html += `<p class="sub">Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>`;
        html += `<table><thead><tr><th>Name</th><th>Amount</th><th>Cycle</th><th>Category</th><th>Status</th></tr></thead><tbody>`;

        subscriptions.forEach(s => {
            const statusClass = s.isTrial ? 'trial' : s.status;
            html += `<tr><td><strong>${s.name}</strong></td><td>$${s.amount.toFixed(2)} ${s.currency}</td><td>${s.billingCycle}</td><td>${s.category}</td><td><span class="status ${statusClass}">${s.isTrial ? 'Trial' : s.status}</span></td></tr>`;
        });
        html += `</tbody></table>`;

        const active = subscriptions.filter(s => s.status === 'active');
        const monthly = active.reduce((a, s) => a + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
        html += `<div class="total">Monthly Total: <strong>$${monthly.toFixed(2)}</strong>  ·  Yearly: $${(monthly * 12).toFixed(2)}  ·  ${active.length} active subscriptions</div>`;
        html += `</body></html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
            setTimeout(() => win.print(), 500);
        }
    };

    const importJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (Array.isArray(data)) onImport(data);
            } catch {
                alert('Invalid JSON file. Please check the format and try again.');
            }
        };
        input.click();
    };

    return (
        <div className="card-glass p-5 sm:p-6">
            <h3 className="text-sm font-semibold mb-5">Data Management</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <button onClick={exportJSON} className="btn-ghost flex flex-col items-center gap-2 py-4 text-xs">
                    <Download className="w-4 h-4 text-primary" />
                    JSON
                </button>
                <button onClick={exportCSV} className="btn-ghost flex flex-col items-center gap-2 py-4 text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    CSV
                </button>
                <button onClick={exportPDF} className="btn-ghost flex flex-col items-center gap-2 py-4 text-xs">
                    <FileText className="w-4 h-4 text-amber-500" />
                    PDF
                </button>
                <button onClick={importJSON} className="btn-ghost flex flex-col items-center gap-2 py-4 text-xs">
                    <Upload className="w-4 h-4 text-blue-500" />
                    Import
                </button>
            </div>

            <div className="border-t border-border pt-4">
                {!showConfirm ? (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear all data
                    </button>
                ) : (
                    <div className="flex items-center gap-3 animate-in fade-in duration-200">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                        <span className="text-xs text-destructive font-medium">This can't be undone.</span>
                        <button onClick={onClearAll} className="btn-ghost text-xs text-destructive border-destructive/30 py-1.5 px-3">Delete All</button>
                        <button onClick={() => setShowConfirm(false)} className="btn-ghost text-xs py-1.5 px-3">Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataManagement;
