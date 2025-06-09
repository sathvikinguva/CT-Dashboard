import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface ChartDataPoint {
  id: number;
  label: string;
  value: number;
}

interface ChartFormData {
  label: string;
  value: number;
}

const Charts: React.FC = () => {
  const [activeChart, setActiveChart] = useState('bar');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPoint, setEditingPoint] = useState<ChartDataPoint | null>(null);
  const [formData, setFormData] = useState<ChartFormData>({
    label: '',
    value: 0
  });

  const defaultData: ChartDataPoint[] = [
    { id: 1, label: 'Jan', value: 45 },
    { id: 2, label: 'Feb', value: 52 },
    { id: 3, label: 'Mar', value: 48 },
    { id: 4, label: 'Apr', value: 61 },
    { id: 5, label: 'May', value: 55 },
    { id: 6, label: 'Jun', value: 67 },
    { id: 7, label: 'Jul', value: 73 },
    { id: 8, label: 'Aug', value: 69 },
    { id: 9, label: 'Sep', value: 78 },
    { id: 10, label: 'Oct', value: 84 },
    { id: 11, label: 'Nov', value: 91 },
    { id: 12, label: 'Dec', value: 87 },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('chart-data');
    if (savedData) {
      setChartData(JSON.parse(savedData));
    } else {
      setChartData(defaultData);
      localStorage.setItem('chart-data', JSON.stringify(defaultData));
    }
  }, []);

  const saveToLocalStorage = (newData: ChartDataPoint[]) => {
    localStorage.setItem('chart-data', JSON.stringify(newData));
    setChartData(newData);
  };

  const pieData = [
    { label: 'Desktop', value: 45, color: 'bg-blue-500' },
    { label: 'Mobile', value: 35, color: 'bg-green-500' },
    { label: 'Tablet', value: 20, color: 'bg-purple-500' },
  ];

  const handleAdd = () => {
    setEditingPoint(null);
    setFormData({ label: '', value: 0 });
    setShowModal(true);
  };

  const handleEdit = (point: ChartDataPoint) => {
    setEditingPoint(point);
    setFormData({ label: point.label, value: point.value });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this data point?')) {
      const newData = chartData.filter(point => point.id !== id);
      saveToLocalStorage(newData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPoint) {
      const newData = chartData.map(point => 
        point.id === editingPoint.id 
          ? { ...point, ...formData }
          : point
      );
      saveToLocalStorage(newData);
    } else {
      const newPoint: ChartDataPoint = {
        id: Math.max(...chartData.map(p => p.id), 0) + 1,
        ...formData
      };
      saveToLocalStorage([...chartData, newPoint]);
    }
    
    setShowModal(false);
  };

  const BarChart = () => {
    const maxValue = Math.max(...chartData.map(d => d.value));
    
    return (
      <div className="h-80 flex items-end justify-center gap-3 p-4">
        {chartData.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center gap-2 group">
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(item)}
                className="p-1 bg-blue-500 text-white rounded text-xs"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 bg-red-500 text-white rounded text-xs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div 
              className="bg-primary-500 rounded-t-lg transition-all duration-700 hover:bg-primary-600 w-8 cursor-pointer"
              style={{ 
                height: `${(item.value / maxValue) * 250}px`,
                animationDelay: `${index * 100}ms`
              }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-xs text-gray-400 font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const LineChart = () => {
    const maxValue = Math.max(...chartData.map(d => d.value));
    const points = chartData.map((item, index) => ({
      x: (index / (chartData.length - 1)) * 100,
      y: 100 - (item.value / maxValue) * 80
    }));
    
    const pathData = points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '');

    return (
      <div className="h-80 p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#gradient)"
          />
          <path
            d={pathData}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="0.5"
            className="drop-shadow-sm"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1"
              fill="rgb(59, 130, 246)"
              className="hover:r-2 transition-all duration-200 cursor-pointer"
            >
              <title>{`${chartData[index]?.label}: ${chartData[index]?.value}`}</title>
            </circle>
          ))}
        </svg>
        <div className="flex justify-between mt-2">
          {chartData.map((item, index) => (
            <span key={index} className="text-xs text-gray-400">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const PieChart = () => {
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
      <div className="flex items-center justify-center gap-8 h-80 p-4">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {pieData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage * circumference / 100;
              
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={item.color.replace('bg-', '').replace('-500', '')}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 hover:stroke-[25] cursor-pointer"
                  style={{ 
                    stroke: item.color === 'bg-blue-500' ? '#3B82F6' : 
                            item.color === 'bg-green-500' ? '#10B981' : '#8B5CF6'
                  }}
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-3">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${item.color}`} />
              <div>
                <p className="text-sm font-medium text-white">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">
                  {item.value}% ({item.value})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AreaChart = () => {
    const maxValue = Math.max(...chartData.map(d => d.value));
    const points = chartData.map((item, index) => ({
      x: (index / (chartData.length - 1)) * 100,
      y: 100 - (item.value / maxValue) * 70
    }));
    
    const pathData = points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '');

    return (
      <div className="h-80 p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 100 95 L 0 95 Z`}
            fill="url(#areaGradient)"
          />
          <path
            d={pathData}
            fill="none"
            stroke="rgb(16, 185, 129)"
            strokeWidth="0.8"
            className="drop-shadow-sm"
          />
        </svg>
        <div className="flex justify-between mt-2">
          {chartData.map((item, index) => (
            <span key={index} className="text-xs text-gray-400">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', component: BarChart },
    { id: 'line', label: 'Line Chart', component: LineChart },
    { id: 'pie', label: 'Pie Chart', component: PieChart },
    { id: 'area', label: 'Area Chart', component: AreaChart },
  ];

  const ActiveChartComponent = chartTypes.find(chart => chart.id === activeChart)?.component || BarChart;

  return (
    <div className="p-6">
      <div className="rounded-xl bg-gray-800 border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Analytics Dashboard
              </h3>
              <p className="text-gray-400">
                Visualize your data with interactive charts
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Data
              </button>
              {chartTypes.map((chart) => (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeChart === chart.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {chart.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <ActiveChartComponent />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {[
          { title: 'Total Sales', value: '$125,430', change: '+12.5%', color: 'text-green-400' },
          { title: 'Conversion Rate', value: '3.2%', change: '+0.8%', color: 'text-green-400' },
          { title: 'Avg. Order Value', value: '$89.50', change: '-2.1%', color: 'text-red-400' },
        ].map((metric, index) => (
          <div
            key={index}
            className="p-6 rounded-xl bg-gray-800 border border-gray-700"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              {metric.title}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                {metric.value}
              </span>
              <span className={`text-sm font-medium ${metric.color}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingPoint ? 'Edit Data Point' : 'Add New Data Point'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingPoint ? 'Update' : 'Add'} Data Point
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;