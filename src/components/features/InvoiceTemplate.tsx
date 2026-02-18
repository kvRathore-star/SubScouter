"use client";
import React from 'react';
import { Transaction } from '@/actions/sheets';
import { CURRENCIES } from '@/types/index';

interface InvoiceTemplateProps {
    transaction: Transaction;
    userName: string;
    userEmail: string;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ transaction, userName, userEmail }) => {
    const currency = CURRENCIES.find(c => c.code === transaction.currency) || CURRENCIES[0];
    const date = new Date(transaction.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div
            id={`invoice-${transaction.id}`}
            className="w-[800px] bg-white p-12 text-slate-900 font-sans"
            style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-xl italic">S</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">SubScout Intelligence</h1>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-loose">
                        Autonomous Subscription Management<br />
                        Secure Node: Grid-Alpha-9
                    </p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-200 mb-2">Invoice</h2>
                    <p className="text-sm font-bold text-slate-400">#{transaction.id.substring(0, 8).toUpperCase()}</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-12 mb-16">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Billed To</h3>
                    <p className="text-lg font-black tracking-tight">{userName}</p>
                    <p className="text-sm font-medium text-slate-500">{userEmail}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Meta Data</h3>
                    <p className="text-sm font-bold text-slate-700">Date: <span className="font-medium text-slate-500">{date}</span></p>
                    <p className="text-sm font-bold text-slate-700">Status: <span className="font-medium text-emerald-500 uppercase">{transaction.status}</span></p>
                </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-16">
                <thead>
                    <tr className="border-b-2 border-slate-100">
                        <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                        <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                        <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-slate-50">
                        <td className="py-6">
                            <p className="font-black tracking-tight text-lg">{transaction.name} Subscription</p>
                            <p className="text-xs text-slate-400 font-medium">Monthly Intelligence Node Synchronisation</p>
                        </td>
                        <td className="text-right py-6 font-medium text-slate-600">1</td>
                        <td className="text-right py-6 font-black text-lg">{currency.symbol}{transaction.amount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-24">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                        <span className="font-bold text-slate-700">{currency.symbol}{transaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tax (0%)</span>
                        <span className="font-bold text-slate-700">{currency.symbol}0.00</span>
                    </div>
                    <div className="pt-3 border-t-2 border-slate-100 flex justify-between items-center">
                        <span className="font-black text-slate-900 uppercase tracking-tighter text-sm">Total Paid</span>
                        <span className="text-3xl font-black tracking-tighter text-indigo-600">{currency.symbol}{transaction.amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-12 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    Generated via SubScout AI · Personal Financial Sovereignty Protocol
                </p>
            </div>
        </div>
    );
};

export default InvoiceTemplate;
