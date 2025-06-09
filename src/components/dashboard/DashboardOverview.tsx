import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      icon: DollarSign,
      positive: true,
    },
    {
      title: 'Active Users',
      value: '2,345',
      change: '+15.3%',
      icon: Users,
      positive: true,
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+7.2%',
      icon: ShoppingCart,
      positive: true,
    },
    {
      title: 'Growth Rate',
      value: '12.5%',
      change: '-2.4%',
      icon: TrendingUp,
      positive: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-xl transition-all duration-200 hover:scale-105 bg-gray-800 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary-900/20 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.positive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'User John Doe signed up', time: '2 minutes ago' },
              { action: 'New order #1234 received', time: '5 minutes ago' },
              { action: 'Payment processed for order #1233', time: '10 minutes ago' },
              { action: 'User Jane Smith updated profile', time: '15 minutes ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-gray-300">{activity.action}</p>
                <span className="text-sm text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add User', color: 'bg-blue-500' },
              { label: 'Create Report', color: 'bg-green-500' },
              { label: 'Send Message', color: 'bg-purple-500' },
              { label: 'Export Data', color: 'bg-orange-500' },
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 ${action.color}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;