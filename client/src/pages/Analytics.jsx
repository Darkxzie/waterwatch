import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { useAdminResolutionTime, useAdminSummary, useAdminTrends } from '../hooks/useComplaints.js';

const chartColors = ['#0077B6', '#00B4D8', '#43AA8B', '#F9C74F', '#F77F00', '#EF233C'];

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
      <div>
        <h1 className="font-heading text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-slate-600">Live complaint distribution, trend, and resolution metrics for authority users.</p>
      </div>
      {summaryError ? <div className="rounded-3xl bg-white p-6 text-critical shadow-soft">Login as the seeded admin to view analytics.</div> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-heading text-xl font-semibold">Complaints by Type</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0077B6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-heading text-xl font-semibold">30 Day Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#00B4D8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-heading text-xl font-semibold">Severity Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySeverity} dataKey="value" nameKey="name" outerRadius={100} label>
                  {bySeverity.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-heading text-xl font-semibold">Average Resolution Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="issueType" width={110} />
                <Tooltip />
                <Bar dataKey="avgHours" fill="#43AA8B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
