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
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Essential tools for personal tracking.',
            features: [
                'Up to 5 active subscriptions',
                'Manual entries',
                'Local data storage',
                'Basic spending insights',
            ],
            highlight: false,
        },
        {
            id: 'pro' as const,
            name: 'Pro',
            price: { monthly: 4.99, yearly: 49.99 },
            description: 'Advanced AI features for power users.',
            features: [
                'Unlimited active subscriptions',
                'AI-powered email scanning',
                'One-click cancel assistance',
                'PDF audit reports',
                'Advanced analytics',
                'Cloud backup & sync',
            ],
            highlight: true,
            badge: 'Popular',
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1000px] mx-auto px-4 md:px-8">
            <div className="mb-12 text-center">
                <h2 className="text-[36px] font-black tracking-tighter text-foreground mb-3">Sovereign Billing</h2>
                <p className="text-[#94a3b8] font-medium tracking-wide">Manage your subscription tier and payment architecture.</p>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="flex justify-center mb-16">
                <div className="bg-[#020617] p-1.5 rounded-[20px] flex gap-1 shadow-inner border border-[#1e293b]">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-[#1e293b] text-white shadow-lg border border-[#334155]' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
                    >
                        Yearly <span className={`px-2 py-0.5 rounded text-[9px] ${billingCycle === 'yearly' ? 'bg-emerald-500/20 text-emerald-700' : 'bg-[#22d3ee]/10 text-[#22d3ee]'}`}>-20%</span>
                    </button>
                </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`card-glass p-10 flex flex-col relative overflow-hidden transition-all duration-500 ${plan.highlight
                            ? 'border-t-4 border-t-[#22d3ee] shadow-[0_10px_40px_-10px_rgba(34,211,238,0.15)] bg-[#020617]/80'
                            : 'border border-white/5 hover:border-white/10 bg-[#020617]/50'
                            }`}
                    >
                        {plan.highlight && (
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22d3ee]/5 blur-[80px] rounded-full pointer-events-none" />
                        )}
                        {plan.badge && (
                            <div className="absolute top-6 right-6 px-3 py-1 bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                {plan.badge}
                            </div>
                        )}

                        <div className="mb-8 border-b border-white/5 pb-8">
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">{plan.name}</h3>
                            <p className="text-[#64748b] text-sm font-medium">{plan.description}</p>
                        </div>

                        <div className="mb-10 flex items-baseline gap-1">
                            <span className="text-6xl font-black text-white tracking-tighter tabular-nums">
                                ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
                            </span>
                            <span className="text-[#64748b] font-bold text-sm">/mo</span>
                            {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                                <span className="ml-3 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md">Billed Annually</span>
                            )}
                        </div>

                        <div className="space-y-5 mb-12 flex-1 relative z-10">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${plan.highlight ? 'bg-[#22d3ee]/10 border-[#22d3ee]/20 text-[#22d3ee]' : 'bg-white/5 border-white/10 text-[#94a3b8]'}`}>
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    <span className={`text-[14px] font-medium tracking-tight ${plan.highlight ? 'text-white/90' : 'text-[#94a3b8]'}`}>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto relative z-10">
                            <button
                                onClick={plan.id === 'pro' ? handleUpgrade : undefined}
                                disabled={isUpgrading || (currentTier === plan.id)}
                                className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${currentTier === plan.id
                                    ? 'bg-[#1e293b]/50 text-[#64748b] cursor-default border border-[#334155]'
                                    : plan.highlight
                                        ? 'bg-[#22d3ee] text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-[1.02]'
                                        : 'bg-white text-black hover:bg-white/90'
                                    }`}
                            >
                                {currentTier === plan.id ? (
                                    <>
                                        <Sparkles className="w-4 h-4" /> Active Plan
                                    </>
                                ) : (
                                    isUpgrading ? 'Provisioning...' : `Select ${plan.name}`
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Logic */}
            <div className="card-glass border border-white/5 rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/5 text-center bg-[#020617]/50">
                    <h3 className="text-xl font-black text-white tracking-tighter">Feature Matrix</h3>
                </div>
                <div className="overflow-x-auto p-4 md:p-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="pb-6 text-[11px] font-black text-[#64748b] uppercase tracking-[0.2em] pl-4">Capabilities</th>
                                <th className="pb-6 text-center text-[11px] font-black text-[#64748b] uppercase tracking-[0.2em] w-32">Free</th>
                                <th className="pb-6 text-center text-[11px] font-black text-[#22d3ee] uppercase tracking-[0.2em] w-32">Pro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]/50">
                            {[
                                { name: 'Active Subscriptions', free: '5', pro: 'Unlimited' },
                                { name: 'AI Email Scanning', free: 'Manual', pro: 'Automated' },
                                { name: 'Smart Categorization', free: 'Basic', pro: 'Advanced AI' },
                                { name: 'Cancellation Assassin', free: '-', pro: 'Available' },
                                { name: 'Cloud Sync & Backup', free: '-', pro: 'Real-time' },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-[#1e293b]/30 transition-colors">
                                    <td className="py-5 pl-4 text-[14px] font-medium text-[#94a3b8] tracking-tight border-l-2 border-transparent group-hover:border-[#22d3ee]/50">{row.name}</td>
                                    <td className="py-5 text-center text-[13px] font-bold text-[#64748b]">{row.free}</td>
                                    <td className="py-5 text-center text-[13px] font-black text-white">
                                        {row.pro === 'Automated' || row.pro === 'Available' || row.pro === 'Real-time' || row.pro === 'Advanced AI' ? (
                                            <span className="text-[#22d3ee]">{row.pro}</span>
                                        ) : row.pro}
                                    </td>
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
