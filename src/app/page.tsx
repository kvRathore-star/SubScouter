"use client";
export const runtime = 'edge';

import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
      <h1 className="text-4xl font-bold">SUPER MINIMAL DEBUG TARGET</h1>
      <p className="mt-4">If you see this, the crash was caused by an import in page.tsx</p>
    </div>
  );
}
