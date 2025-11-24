import PropTypes from "prop-types";
import { TrendingUp, TrendingDown } from "lucide-react";
import useAnalytics from "../../../dashboardHook/useAnalytics";

const MetricCard = ({
  title,
  value,
  trend,
  trendValue,
  trendColor,
  sparklinePoints,
}) => {
  const generateSparklinePath = (points) => {
    if (!points || points.length === 0) return "";

    const width = 120;
    const height = 45;
    const maxValue = Math.max(...points);
    const minValue = Math.min(...points);
    const range = maxValue - minValue || 1;

    // Convert points to coordinates
    const coords = points.map((point, index) => ({
      x: (index / (points.length - 1)) * width,
      y: height - ((point - minValue) / range) * height,
    }));

    if (coords.length < 2) return "";

    let path = `M ${coords[0].x} ${coords[0].y}`;

    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];

      if (i === 1) {
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        path += ` Q ${curr.x} ${curr.y} ${midX} ${midY}`;
      } else if (i === coords.length - 1) {
        path += ` Q ${prev.x} ${prev.y} ${curr.x} ${curr.y}`;
      } else {
        const next = coords[i + 1];
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;
        path += ` Q ${curr.x} ${curr.y} ${midX} ${midY}`;
      }
    }

    return path;
  };

  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-lg font-semibold">{title}</h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="">
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          <div className="flex items-center gap-1">
            <TrendIcon
              size={16}
              className={trend === "up" ? "text-green-500" : "text-red-500"}
            />
            <span className={`text-sm font-medium ${trendColor}`}>
              {trendValue}% vs last month
            </span>
          </div>
        </div>

        {/* SparkLine chart */}
        <div className=" w-30 h-12">
          <svg width="120" height="48" className="overflow-visible">
            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id={`gradient-${trend}-${title.replace(/\s+/g, "")}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={trend === "up" ? "#10b981" : "#ef4444"}
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor={trend === "up" ? "#10b981" : "#ef4444"}
                  stopOpacity="0.00"
                />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={`${generateSparklinePath(sparklinePoints)} L 120 48 L 0 48 Z`}
              fill={`url(#gradient-${trend}-${title.replace(/\s+/g, "")})`}
            />

            {/* Main line */}
            <path
              d={generateSparklinePath(sparklinePoints)}
              stroke={trend === "up" ? "#10b981" : "#ef4444"}
              strokeWidth="1.5"
              fill="none"
              className="drop-shadow-sm"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.oneOf(["up", "down"]).isRequired,
  trendValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  trendColor: PropTypes.string.isRequired,
  sparklinePoints: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const DashboardCard = () => {
  const {analytics, loading} = useAnalytics()
  console.log(analytics);
  const totalEarning = [8, 10, 15, 13, 18, 23, 20, 25, 22, 27, 25, 32];
  const totalOrder = [8, 10, 15, 11, 16, 13, 24, 20, 25, 30, 28, 32];
  const totalUser = [8, 10, 15, 11, 16, 13, 24, 20, 25, 30, 28, 32];

if(loading){
  return <div>
    loading
  </div>
}

  return (
    <div className="">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Earning"
            value={analytics?.total_earning}
            trend="up"
            trendValue="1"
            trendColor="text-green-600"
            sparklinePoints={totalEarning}
          />

          <MetricCard
            title="Total Orders"
            value= {analytics?.order_count}
            trend="up"
            trendValue="10"
            trendColor="text-green-500"
            sparklinePoints={totalOrder}
          />
          <MetricCard
            title="Total Users"
            value= {analytics?.user_count}
            trend="up"
            trendValue="10"
            trendColor="text-green-500"
            sparklinePoints={totalUser}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
