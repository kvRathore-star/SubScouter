import { Download, FileText, Calendar, DollarSign, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/actions/sheets';
import { useInvoice } from '@/hooks/useInvoice';
import InvoiceTemplate from '@/components/features/InvoiceTemplate';

interface StatisticsViewProps {
  chartData: { name: string; value: number }[];
  transactions: Transaction[];
  userName: string;
  userEmail: string;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ chartData, transactions, userName, userEmail }) => {
  const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
  const { downloadInvoice } = useInvoice();

  const trendData = [
    { month: 'Jan', spend: 85 },
    { month: 'Feb', spend: 92 },
    { month: 'Mar', spend: 88 },
    { month: 'Apr', spend: 95 },
    { month: 'May', spend: 102 },
    { month: 'Jun', spend: 98 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div style={{ marginBottom: 48 }}>
        <h2 className="font-heading text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">Intelligence Insights</h2>
        <p className="text-xl text-muted-foreground/60 font-medium italic tracking-tight">Advanced heuristic analysis of global spending trajectories and commitment nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ... Allocation Matrix ... */}
        <div className="card-glass" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--brand-glow)', border: '1px solid var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px var(--brand-glow)' }}>
              <PieChartIcon style={{ width: 22, height: 22, color: 'white' }} />
            </div>
            <div>
              <h3 className="font-heading uppercase italic" style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.04em' }}>Allocation Matrix</h3>
              <p className="text-[9px] font-black uppercase text-brand tracking-[0.2em]">Resource Distribution Analysis</p>
            </div>
          </div>
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={4}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 14, border: '1px solid var(--border)', backgroundColor: 'var(--card)', fontSize: 13, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 14 }}>
                Insufficient data for distribution modeling.
              </div>
            )}
          </div>
          {/* ... Legends ... */}
          {chartData.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 32, justifyContent: 'center' }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary-foreground)' }}>{d.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ... Commitment Trajectory ... */}
        <div className="card-glass" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{ padding: 10, borderRadius: 10, background: 'var(--secondary)' }}>
              <TrendingUp style={{ width: 18, height: 18, color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>Commitment Trajectory</h3>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 14, border: '1px solid var(--border)', backgroundColor: 'var(--card)', fontSize: 13, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="spend" stroke="var(--primary)" strokeWidth={3} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ═══ TRANSACTION HISTORICAL AUDIT ═══ */}
      <div className="card-glass p-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-secondary border border-border/50">
              <Calendar className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight uppercase italic leading-none mb-2">Historical Audit Trail</h3>
              <p className="text-[10px] font-black uppercase text-brand tracking-[0.2em]">Transaction Ledger & Document Export</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Audited Volume</span>
              <span className="text-xl font-black tabular-nums">${transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-[32px] border border-dashed border-border/50">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">No financial footprints detected in the ledger.</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-[24px] bg-muted/10 border border-border/50 hover:bg-muted/20 hover:border-brand/30 transition-all duration-500">
                <div className="flex items-center gap-6 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black tracking-tight truncate uppercase italic">{tx.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-muted-foreground opacity-60">{new Date(tx.date).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">{tx.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto">
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-black tabular-nums">${tx.amount.toFixed(2)}</span>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{tx.currency}</span>
                  </div>

                  <button
                    onClick={() => downloadInvoice(tx)}
                    className="p-4 rounded-2xl bg-brand text-white shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Vault PDF</span>
                  </button>

                  <InvoiceTemplate
                    transaction={tx}
                    userName={userName}
                    userEmail={userEmail}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
