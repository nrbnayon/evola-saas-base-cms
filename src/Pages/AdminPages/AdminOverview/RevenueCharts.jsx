import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const RevenueCharts = () => {
  const monthlyData = [
    { month: 'Jan', primary: 44000, secondary: 50000 },
    { month: 'Feb', primary: 25000, secondary: 43000 },
    { month: 'Mar', primary: 32000, secondary: 47000 },
    { month: 'Apr', primary: 25000, secondary: 42000 },
    { month: 'May', primary: 35000, secondary: 43000 },
    { month: 'Jun', primary: 25000, secondary: 44000 },
    { month: 'Jul', primary: 25000, secondary: 33000 },
    { month: 'Aug', primary: 38000, secondary: 44000 },
    { month: 'Sep', primary: 25000, secondary: 43000 },
    { month: 'Oct', primary: 32000, secondary: 44000 },
    { month: 'Nov', primary: 38000, secondary: 43000 },
    { month: 'Dec', primary: 25000, secondary: 42000 }
  ];

  const pieData = [
    { name: 'Total Earning', value: 70, color: '#8B5CF6' },
    { name: 'Total Pending', value: 20, color: '#FDE047' },
    { name: 'Total Cancel', value: 10, color: '#374151' }
  ];

  const CustomBar = (props) => {
    const { fill, ...rest } = props;
    return <Bar {...rest} fill="#8B5CF6" radius={[2, 2, 0, 0]} />;
  };

  const formatYAxis = (value) => {
    return `${value / 1000}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="text-sm text-gray-900">{`Month: ${label}`}</p>
          <p className="text-sm text-gray-600">{`Primary: $${payload[0].value.toLocaleString()}`}</p>
          <p className="text-sm text-gray-600">{`Secondary: $${payload[1].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="text-sm text-gray-900">{`Category: ${payload[0].name}`}</p>
          <p className="text-sm text-gray-600">{`Value: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen mt-7">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Monthly Revenue</h2>
            <p className="text-sm text-gray-500">Earning over last year</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatYAxis} domain={[0, 60000]} ticks={[0, 10000, 20000, 30000, 40000, 50000]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="secondary" fill="#C4B5FD" radius={[8, 8, 0, 0]} />
                <Bar dataKey="primary" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Earning Activity</h2>
            <p className="text-sm text-gray-500">last month earning activity</p>
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
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
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
              <div className="w-3 h-3 rounded-full bg-violet-500 mr-3"></div>
              <span className="text-sm text-gray-600">Total Earning</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-300 mr-3"></div>
              <span className="text-sm text-gray-600">Total Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-700 mr-3"></div>
              <span className="text-sm text-gray-600">Total Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCharts;