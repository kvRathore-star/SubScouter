"use client";
import React, { useState, useEffect } from 'react';

interface BurnRateOdometerProps {
    value: number;
}

const BurnRateOdometer: React.FC<BurnRateOdometerProps> = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(current);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(displayValue);

    return (
        <span className="currency font-heading" style={{
            display: 'inline-block',
            transition: 'all 0.1s ease-out',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 900,
            letterSpacing: '-0.05em',
        }}>
            {formatted}
        </span>
    );
};

export default BurnRateOdometer;
