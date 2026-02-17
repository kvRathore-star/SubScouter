"use client";
import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Transaction } from '@/actions/sheets';

export const useInvoice = () => {
    const downloadInvoice = useCallback(async (transaction: Transaction) => {
        const element = document.getElementById(`invoice-${transaction.id}`);
        if (!element) {
            console.error(`Invoice element for ${transaction.id} not found.`);
            return;
        }

        try {
            // Temporarily reveal to capture
            const originalStyle = element.style.cssText;
            element.style.position = 'absolute';
            element.style.left = '0';
            element.style.top = '0';
            element.style.visibility = 'visible';
            element.style.display = 'block';

            const canvas = await html2canvas(element, {
                scale: 2, // Higher resolution
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            // Restore style
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`SubScout_Invoice_${transaction.name.replace(/\s+/g, '_')}_${transaction.date}.pdf`);
        } catch (error) {
            console.error('Invoice generation failed:', error);
        }
    }, []);

    return { downloadInvoice };
};
