"use client";
import React, { useState } from "react";
import { Check, Star, Sparkles } from "lucide-react";
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
            // In production, these IDs would come from environment variables or a config file
            const priceId = billingCycle === 'monthly' ? 'price_monthly_placeholder' : 'price_yearly_placeholder';
            const { url } = await createCheckoutSession(priceId);
            if (url) window.location.href = url;
        } catch (e) {
            console.error("[Sub Scouter] Checkout failed:", e);
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
            description: 'Perfect for getting started',
            features: [
                'Up to 5 subscriptions',
                'Manual entry',
                'Basic spending insights',
                'Local data storage',
                'Light & dark mode',
            ],
            highlight: false,
        },
        {
            id: 'pro' as const,
            name: 'Pro',
            price: { monthly: 4.99, yearly: 49.99 },
            description: 'For power users who want it all',
            features: [
                'Unlimited subscriptions',
                'AI-powered email scanning',
                'Smart renewal alerts',
                'CSV & PDF export',
                'Multi-currency support',
                'Cancel assistance AI',
                'Subscription advice AI',
                'Priority support',
            ],
            highlight: true,
            badge: 'Most Popular',
        },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Plans & Pricing</h2>
                <p className="text-sm text-muted-foreground max-w-md">Simple pricing. No hidden fees. Start free and upgrade when you need more.</p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                <button
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-primary' : 'bg-accent'}`}
                >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Yearly
                    <span className="ml-1.5 text-[10px] text-primary font-semibold">Save 17%</span>
                </span>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`card-glass p-5 sm:p-7 relative transition-all ${plan.highlight ? 'border-primary/40 ring-1 ring-primary/20' : ''} ${currentTier === plan.id ? 'ring-2 ring-primary' : ''}`}
                    >
                        {plan.badge && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center gap-1.5">
                                <Star className="w-3 h-3" /> {plan.badge}
                            </div>
                        )}

                        {currentTier === plan.id && (
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
                                Current
                            </div>
                        )}

                        <h3 className="text-lg font-bold mb-0.5">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground mb-5">{plan.description}</p>

                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl sm:text-4xl font-bold currency">
                                ${billingCycle === 'monthly' ? plan.price.monthly.toFixed(2) : plan.price.yearly.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {plan.price.monthly === 0 ? 'forever' : `/${billingCycle === 'monthly' ? 'mo' : 'yr'}`}
                            </span>
                        </div>

                        <div className="space-y-3 mb-7">
                            {plan.features.map((f, j) => (
                                <div key={j} className="flex items-center gap-2.5">
                                    <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="text-sm">{f}</span>
                                </div>
                            ))}
                        </div>

                        {currentTier !== plan.id ? (
                            <button
                                onClick={plan.id === 'pro' ? handleUpgrade : undefined}
                                disabled={isUpgrading}
                                className={`w-full py-3 font-medium rounded-lg transition-all ${plan.highlight ? 'btn-primary' : 'btn-ghost'} ${isUpgrading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isUpgrading ? 'Preparing...' : plan.id === 'pro' ? 'Upgrade to Pro' : 'Current Plan'}
                            </button>
                        ) : (
                            <div className="w-full py-3 text-center text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" /> You're on this plan
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Feature Comparison */}
            <div className="mt-10 sm:mt-14 max-w-3xl mx-auto">
                <h3 className="text-sm font-semibold text-center mb-6">Feature Comparison</h3>
                <div className="card-glass overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left font-medium text-muted-foreground p-3 sm:p-4">Feature</th>
                                <th className="text-center font-medium text-muted-foreground p-3 sm:p-4 w-24">Free</th>
                                <th className="text-center font-medium text-primary p-3 sm:p-4 w-24">Pro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['Subscriptions', '5', 'Unlimited'],
                                ['Email AI Scanning', '—', '✓'],
                                ['Manual Entry', '✓', '✓'],
                                ['Spending Insights', 'Basic', 'Advanced'],
                                ['Renewal Alerts', '—', '✓'],
                                ['Export (CSV/PDF)', '—', '✓'],
                                ['Multi-Currency', '—', '✓'],
                                ['Cancel Help AI', '—', '✓'],
                                ['Theme Modes', '✓', '✓'],
                                ['PWA Install', '✓', '✓'],
                            ].map(([feat, free, pro], i) => (
                                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                                    <td className="p-3 sm:p-4 text-xs sm:text-sm">{feat}</td>
                                    <td className="p-3 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground">{free}</td>
                                    <td className="p-3 sm:p-4 text-center text-xs sm:text-sm">{pro}</td>
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
