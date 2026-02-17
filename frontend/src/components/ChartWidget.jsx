import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import theme from '../styles/theme';

const chartTypes = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart
};

const ChartWidget = ({
  title,
  data = [],
  type = 'line',
  dataKeys = [],
  xKey = '_id',
  height = 300,
  className = ''
}) => {
  const ChartComponent = chartTypes[type] || LineChart;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="glass-card-static !p-3 !rounded-xl text-sm">
        <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-gray-600 dark:text-gray-400" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{Math.round(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className={`glass-card text-center py-12 ${className}`}>
        <p className="text-gray-400 dark:text-gray-500">No data yet. Start tracking to see charts!</p>
      </div>
    );
  }

  return (
    <div className={`glass-card ${className}`}>
      {title && (
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {dataKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '12px' }} />}
          
          {dataKeys.map((dk) => {
            const color = theme.chart[dk.key] || theme.colors.primary;
            
            if (type === 'bar') {
              return (
                <Bar
                  key={dk.key}
                  dataKey={dk.key}
                  name={dk.label}
                  fill={color}
                  radius={[6, 6, 0, 0]}
                  fillOpacity={0.8}
                />
              );
            }
            if (type === 'area') {
              return (
                <Area
                  key={dk.key}
                  type="monotone"
                  dataKey={dk.key}
                  name={dk.label}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              );
            }
            return (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.label}
                stroke={color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: color }}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWidget;
