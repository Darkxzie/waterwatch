import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { useAdminResolutionTime, useAdminSummary, useAdminTrends } from '../hooks/useComplaints.js';

const chartColors = ['#36bffa', '#7dd3fc', '#43AA8B', '#F9C74F', '#F77F00', '#EF233C'];

export default function Analytics() {
  const { data: summary, error: summaryError } = useAdminSummary();
  const { data: trends = [] } = useAdminTrends();
  const { data: resolution = [] } = useAdminResolutionTime();

  const byType = (summary?.byType || []).map((item) => ({ name: item.issueType, total: item._count._all }));
  const bySeverity = (summary?.bySeverity || []).map((item) => ({ name: item.aiSeverity || 'UNKNOWN', value: item._count._all }));
  const trendData = Object.values(
    trends.reduce((accumulator, complaint) => {
      const day = new Date(complaint.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      accumulator[day] ??= { day, count: 0 };
      accumulator[day].count += 1;
      return accumulator;
    }, {})
  );
  const resolutionByType = Object.values(
    resolution.reduce((accumulator, item) => {
      const durationHours = (new Date(item.resolvedAt) - new Date(item.createdAt)) / (1000 * 60 * 60);
      accumulator[item.issueType] ??= { issueType: item.issueType, totalHours: 0, count: 0 };
      accumulator[item.issueType].totalHours += durationHours;
      accumulator[item.issueType].count += 1;
      return accumulator;
    }, {})
  ).map((item) => ({
    issueType: item.issueType,
    avgHours: Number((item.totalHours / item.count).toFixed(1))
  }));

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky">Authority intelligence</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">Analytics</h1>
          <p className="mt-2 text-sm leading-7 text-mist">A darker, more legible operations surface for trend monitoring and response analysis.</p>
        </div>
      </div>
      {summaryError ? <div className="glass-panel rounded-[2rem] p-6 text-critical">Login as the seeded admin to view analytics.</div> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="mb-4 font-heading text-xl font-semibold text-white">Complaints by Type</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType}>
                <CartesianGrid stroke="rgba(142, 167, 194, 0.16)" strokeDasharray="3 3" />
                <XAxis dataKey="name" hide stroke="#8ea7c2" />
                <YAxis stroke="#8ea7c2" />
                <Tooltip contentStyle={{ background: '#08111f', border: '1px solid #1f3350', color: '#e6f1ff' }} />
                <Bar dataKey="total" fill="#36bffa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="mb-4 font-heading text-xl font-semibold text-white">30 Day Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="rgba(142, 167, 194, 0.16)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#8ea7c2" />
                <YAxis stroke="#8ea7c2" />
                <Tooltip contentStyle={{ background: '#08111f', border: '1px solid #1f3350', color: '#e6f1ff' }} />
                <Line type="monotone" dataKey="count" stroke="#7dd3fc" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="mb-4 font-heading text-xl font-semibold text-white">Severity Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySeverity} dataKey="value" nameKey="name" outerRadius={100} label>
                  {bySeverity.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#08111f', border: '1px solid #1f3350', color: '#e6f1ff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="mb-4 font-heading text-xl font-semibold text-white">Average Resolution Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionByType} layout="vertical">
                <CartesianGrid stroke="rgba(142, 167, 194, 0.16)" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#8ea7c2" />
                <YAxis type="category" dataKey="issueType" width={110} stroke="#8ea7c2" />
                <Tooltip contentStyle={{ background: '#08111f', border: '1px solid #1f3350', color: '#e6f1ff' }} />
                <Bar dataKey="avgHours" fill="#43AA8B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
