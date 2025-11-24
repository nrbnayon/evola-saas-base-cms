import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import useAnalytics from '../../../dashboardHook/useAnalytics';

// Theme colors to match CategoryProducts and AdminLogin
const COLORS = {
  PRIMARY: '#8B5CF6', // This Year, Total Earning
  SECONDARY: '#C4B5FD', // Last Year
  PENDING: '#FDE047', // Total Pending
  CANCELLED: '#374151', // Total Cancelled
  SPINNER: '#C8C1F5', // Loading spinner
  TEXT_PRIMARY: '#8B5CF6',
  TEXT_SECONDARY: '#374151',
  TEXT_AXIS: '#6B7280',
};

// Chart configurations
const BAR_CHART_CONFIG = {
  HEIGHT: 320,
  MARGIN: { top: 20, right: 30, left: 20, bottom: 5 },
  TICK_STYLE: { fontSize: 12, fill: COLORS.TEXT_AXIS },
  BAR_RADIUS: [8, 8, 0, 0],
};

const PIE_CHART_CONFIG = {
  SIZE: 160,
  INNER_RADIUS: 50,
  OUTER_RADIUS: 80,
  PADDING_ANGLE: 2,
  START_ANGLE: 90,
  END_ANGLE: 450,
};

// Format Y-axis values as thousands (e.g., 6000 -> 6K)
const formatYAxis = (value) => `${value / 1000}K`;

// Custom tooltip for bar chart
const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className={`text-sm font-semibold ${COLORS.TEXT_PRIMARY}`}>{`Month: ${label}`}</p>
        <p className={`text-sm ${COLORS.TEXT_SECONDARY}`}>{`Last Year: $${payload[0].value.toLocaleString()}`}</p>
        <p className={`text-sm ${COLORS.TEXT_SECONDARY}`}>{`This Year: $${payload[1].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart
const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className={`text-sm font-semibold pb-2 ${COLORS.TEXT_PRIMARY}`}>{`${payload[0].name}`}</p>
        <p className={`text-sm ${COLORS.TEXT_SECONDARY}`}>{`Value: ${payload[0].value.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const RevenueCharts = () => {
  const { analytics, loading } = useAnalytics();

  // Map last_twelve_month_earning to bar chart format
  const monthlyData = analytics?.last_twelve_month_earning?.map((item) => ({
    month: item.month,
    primary: item['This Year'],
    secondary: item['Last Year'],
  })) || [];

  // Calculate max Y-axis value for bar chart
  const maxEarning = monthlyData.length > 0
    ? Math.max(...monthlyData.map(d => Math.max(d.primary, d.secondary)), 1000)
    : 1000;
  const yAxisTicks = Array.from(
    { length: Math.ceil(maxEarning / 1000) + 1 },
    (_, i) => i * 1000
  );

  // Convert earning_activity to percentages for pie chart
  const total = (analytics?.earning_activity?.total_earning || 0) +
                (analytics?.earning_activity?.total_pending || 0) +
                (analytics?.earning_activity?.total_cancelled || 0);
  const pieData = total > 0 ? [
    { name: 'Total Earning', value: ((analytics?.earning_activity?.total_earning || 0) / total) * 100, color: COLORS.PRIMARY },
    { name: 'Total Pending', value: ((analytics?.earning_activity?.total_pending || 0) / total) * 100, color: COLORS.PENDING },
    { name: 'Total Cancelled', value: ((analytics?.earning_activity?.total_cancelled || 0) / total) * 100, color: COLORS.CANCELLED },
  ] : [
    { name: 'Total Earning', value: 33.33, color: COLORS.PRIMARY },
    { name: 'Total Pending', value: 33.33, color: COLORS.PENDING },
    { name: 'Total Cancelled', value: 33.33, color: COLORS.CANCELLED },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className={`w-10 h-10 border-4 border-[${COLORS.SPINNER}] border-t-transparent rounded-full animate-spin`}></div>
      </div>
    );
  }

  // Error state for no data
  if (!analytics || !analytics.last_twelve_month_earning || !analytics.earning_activity) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className={`text-sm ${COLORS.TEXT_SECONDARY}`}>No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-7">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Monthly Revenue */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className={`text-xl font-semibold ${COLORS.TEXT_PRIMARY} mb-1`}>Monthly Revenue</h2>
            <p className={`text-sm ${COLORS.TEXT_SECONDARY}`}>Earnings over the last year</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={BAR_CHART_CONFIG.MARGIN}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={BAR_CHART_CONFIG.TICK_STYLE}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={BAR_CHART_CONFIG.TICK_STYLE}
                  tickFormatter={formatYAxis}
                  domain={[0, maxEarning]}
                  ticks={yAxisTicks}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="secondary" fill={COLORS.SECONDARY} radius={BAR_CHART_CONFIG.BAR_RADIUS} />
                <Bar dataKey="primary" fill={COLORS.PRIMARY} radius={BAR_CHART_CONFIG.BAR_RADIUS} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Earning Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className={`text-xl font-semibold ${COLORS.TEXT_PRIMARY} mb-1`}>Earning Activity</h2>
            <p className={`text-sm ${COLORS.TEXT_SECONDARY}`}>Last month earning activity</p>
          </div>
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<PieTooltip />} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={PIE_CHART_CONFIG.INNER_RADIUS}
                    outerRadius={PIE_CHART_CONFIG.OUTER_RADIUS}
                    paddingAngle={PIE_CHART_CONFIG.PADDING_ANGLE}
                    dataKey="value"
                    startAngle={PIE_CHART_CONFIG.START_ANGLE}
                    endAngle={PIE_CHART_CONFIG.END_ANGLE}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6] mr-3"></div>
              <span className={`text-sm ${COLORS.TEXT_SECONDARY}`}>Total Earning</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FDE047] mr-3"></div>
              <span className={`text-sm ${COLORS.TEXT_SECONDARY}`}>Total Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#374151] mr-3"></div>
              <span className={`text-sm ${COLORS.TEXT_SECONDARY}`}>Total Cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCharts;