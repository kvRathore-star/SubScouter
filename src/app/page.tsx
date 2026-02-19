"use client";
export const runtime = 'edge';

import React from 'react';
import { DashboardSkeleton } from '@/components/layout/Skeleton';

export default function Dashboard() {
  // TEST: Render DashboardSkeleton
  return (
    <div className="bg-slate-950 min-h-screen p-10">
      <h1 className="text-white text-2xl mb-4">SKELETON RENDER TEST</h1>
      <DashboardSkeleton />
    </div>
  );
}
