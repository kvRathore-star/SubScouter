"use client";
import React, { useState } from "react";
import { Check, Star, Sparkles, CreditCard } from "lucide-react";
import { createCheckoutSession } from "@/actions/stripe";

interface PricingViewProps {
    currentTier: 'free' | 'pro';
    onUpgrade?: () => void;
}

const PricingView: React.FC<PricingViewProps> = ({ currentTier, onUpgrade }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            const priceId = billingCycle === 'monthly'
                ? process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
                : process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID;

            if (!priceId && process.env.NODE_ENV === 'production') {
                throw new Error("Missing Price ID");
            }

            const { url } = await createCheckoutSession(priceId || 'price_mock');
            if (url) window.location.href = url;
        } catch (e) {
            console.error("[SubScout] Checkout failed:", e);
            alert("Provisioning failed. Please check your connection or contact support.");
        } finally {
            setIsUpgrading(false);
        }
    };

    const plans = [
        {
            id: 'free' as const,
            name: 'Free Agent',
            price: { monthly: 0, yearly: 0 },
            description: 'Essential localized scouts for individuals.',
            features: [
                'Up to 5 active nodes',
                'Manual extraction logs',
                'Local data vaulting',
                'Basic spending heuristics',
            ],
            highlight: false,
        },
        {
            id: 'pro' as const,
            name: 'Elite Operative',
            price: { monthly: 4.99, yearly: 49.99 },
            description: 'Advanced AI intelligence for power users.',
            features: [
                'Unlimited active nodes',
                'AI-powered IMAP scouting',
                'One-click cancel assistance',
                'PDF audit reports',
                'High-fidelity analytics',
                'Priority R2 sync frequency',
            ],
            highlight: true,
            badge: 'Elite Protocol',
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
                <h2 className="text-[32px] font-black tracking-tight text-[#0f172a] mb-2">Billing & Plans</h2>
                <p className="text-[#64748b] font-medium tracking-tight">Manage your subscription tier and payment methods.</p>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="flex justify-center mb-16">
                <div className="bg-[#f1f5f9] p-1.5 rounded-[20px] flex gap-1 shadow-inner border border-[#e2e8f0]">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white text-[#0f172a] shadow-lg' : 'text-[#64748b]'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-[#0f172a] text-white shadow-lg' : 'text-[#64748b]'}`}
                    >
                        Yearly <span className="ml-2 text-brand">-20%</span>
                    </button>
                </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`bg-white rounded-[40px] p-10 border transition-all duration-300 relative overflow-hidden flex flex-col ${plan.highlight
                            ? 'border-brand/40 shadow-2xl shadow-brand/10'
                            : 'border-[#e2e8f0] shadow-sm hover:shadow-xl'
                            }`}
                    >
                        {plan.badge && (
                            <div className="absolute top-0 right-0 py-2 px-10 bg-brand text-white text-[10px] font-black uppercase tracking-widest translate-x-10 translate-y-6 rotate-45 shadow-lg">
                                {plan.badge}
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-black text-[#0f172a] mb-1 tracking-tight">{plan.name}</h3>
                            <p className="text-[#64748b] text-sm font-medium">{plan.description}</p>
                        </div>

                        <div className="mb-10 flex items-baseline gap-1">
                            <span className="text-5xl font-black text-[#0f172a] tracking-tighter tabular-nums">
                                ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
                            </span>
                            <span className="text-[#64748b] font-bold text-sm">/mo</span>
                            {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                                <span className="ml-3 text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 px-2 py-1 rounded-md">Billed Yearly</span>
                            )}
                        </div>

                        <div className="space-y-4 mb-12 flex-1">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-brand/10 text-brand' : 'bg-[#f1f5f9] text-[#94a3b8]'}`}>
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-bold text-[#475569] tracking-tight">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={plan.id === 'pro' ? handleUpgrade : undefined}
                            disabled={isUpgrading || (currentTier === plan.id)}
                            className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${currentTier === plan.id
                                ? 'bg-[#f8fafc] text-[#94a3b8] cursor-default'
                                : plan.highlight
                                    ? 'bg-brand text-white shadow-xl shadow-brand/20 hover:scale-[1.02]'
                                    : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
                                }`}
                        >
                            {currentTier === plan.id ? (
                                <span className="flex items-center justify-center gap-2 italic">
                                    <Sparkles className="w-4 h-4" /> ACTIVE PROTOCOL
                                </span>
                            ) : (
                                isUpgrading ? 'Provisioning...' : `Select ${plan.name}`
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Comparison Logic */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[40px] p-10">
                <h3 className="text-xl font-black text-[#0f172a] mb-10 text-center tracking-tight">Detailed Capabilities</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#e2e8f0]">
                                <th className="pb-6 text-[10px] font-black text-[#64748b] uppercase tracking-widest">Protocol Component</th>
                                <th className="pb-6 text-center text-[10px] font-black text-[#64748b] uppercase tracking-widest w-32">Free Agent</th>
                                <th className="pb-6 text-center text-[10px] font-black text-brand uppercase tracking-widest w-32">Elite</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {[
                                { name: 'Active extraction nodes', free: '5', pro: 'Unlimited' },
                                { name: 'AI Email Intelligence', free: 'Manual only', pro: 'Full Auto' },
                                { name: 'Localized data encryption', free: '✓', pro: '✓' },
                                { name: 'PDF Audit Reports', free: '-', pro: '✓' },
                                { name: 'Cancel Assistance AI', free: '-', pro: '✓' },
                                { name: 'Sync Persistence (R2)', free: '24h', pro: 'On-Demand' },
                            ].map((row, i) => (
                                <tr key={i} className="group">
                                    <td className="py-5 text-sm font-bold text-[#0f172a] tracking-tight">{row.name}</td>
                                    <td className="py-5 text-center text-sm font-medium text-[#64748b]">{row.free}</td>
                                    <td className="py-5 text-center text-sm font-black text-brand">{row.pro}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PricingView;
