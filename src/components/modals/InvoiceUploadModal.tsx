'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Check, Loader2, X, AlertCircle } from 'lucide-react';
import { parseStatementAction } from '@/actions/parse-document';

interface InvoiceUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (subscriptions: any[]) => void;
}

export function InvoiceUploadModal({ isOpen, onClose, onImport }: InvoiceUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle');
    const [detectedSubs, setDetectedSubs] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus('idle');
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);

        try {
            setStatus('analyzing');
            const result = await parseStatementAction(formData);

            if (result.success && result.data) {
                setDetectedSubs(result.data);
                setStatus('complete');
            } else {
                throw new Error(result.error || 'Failed to analyze document');
            }
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Something went wrong');
            setStatus('error');
        }
    };

    const handleImport = () => {
        onImport(detectedSubs);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded border border-indigo-500/20 font-bold">NEW</span>
                            <h2 className="text-xl font-bold text-white">Import subscriptions</h2>
                        </div>
                        <p className="text-sm text-gray-400">Upload your bank statement and let AI find your subscriptions.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {status === 'idle' || status === 'error' ? (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${isDragActive
                                    ? 'border-indigo-500 bg-indigo-500/5'
                                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                } ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        >
                            <input {...getInputProps()} />

                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                                {file ? (
                                    <FileText className="text-indigo-400" size={32} />
                                ) : (
                                    <Upload className="text-gray-400" size={32} />
                                )}
                            </div>

                            {file ? (
                                <div>
                                    <p className="text-white font-medium text-lg mb-1">{file.name}</p>
                                    <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpload();
                                        }}
                                        className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
                                    >
                                        Analyze Statement
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-white font-medium text-lg mb-2">Drop PDF here or click to browse</p>
                                    <p className="text-gray-500 text-sm">Supports PDF, JPG, PNG from all major banks.</p>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    ) : status === 'uploading' || status === 'analyzing' ? (
                        <div className="text-center py-12">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="text-indigo-500 animate-pulse" size={32} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {status === 'uploading' ? 'Uploading document...' : 'AI is analyzing your statement...'}
                            </h3>
                            <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                This usually takes about 10-15 seconds. We're looking for recurring patterns and merchant names.
                            </p>
                        </div>
                    ) : (
                        // Complete / Review State
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Check className="text-emerald-500" size={18} />
                                    Found {detectedSubs.length} subscriptions
                                </h3>
                                <button onClick={() => setStatus('idle')} className="text-xs text-gray-500 hover:text-white">Start Over</button>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                                {detectedSubs.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        No obvious subscriptions found in this document.
                                    </div>
                                ) : (
                                    detectedSubs.map((sub, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
                                                    {sub.name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{sub.name}</div>
                                                    <div className="text-xs text-gray-500">{sub.frequency || 'Monthly'} • {sub.date || 'Unknown date'}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-bold">${sub.amount}</div>
                                                <div className="text-[10px] text-gray-500 bg-white/10 px-1.5 py-0.5 rounded inline-block mt-1">CONFIDENCE: HIGH</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={onClose} className="px-5 py-2.5 rounded-full text-gray-300 hover:bg-white/10 font-medium text-sm transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImport}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]"
                                >
                                    Import {detectedSubs.length} Subscriptions
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
