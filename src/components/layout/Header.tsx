import React from 'react';
import { useTheme, ThemeColor } from '../../contexts/ThemeContext';

interface HeaderProps {
  title?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Dashboard', 
  activeTab = 'dashboard', 
  onTabChange 
}) => {
  const { color, setColor } = useTheme();
  
  const themeColors: { name: string; value: ThemeColor; color: string }[] = [
    { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
    { name: 'Emerald', value: 'emerald', color: 'bg-emerald-500' },
    { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
    { name: 'Rose', value: 'rose', color: 'bg-rose-500' },
  ];

  // Navigation items
  const navItems = [
    { name: 'Dashboard', tab: 'dashboard' },
    { name: 'Tables', tab: 'tables' },
    { name: 'Charts', tab: 'charts' },
    { name: 'Calendar', tab: 'calendar' },
    { name: 'Kanban', tab: 'kanban' },
  ];

  // Determine title based on active tab
  const getPageTitle = () => {
    const currentTabItem = navItems.find(item => item.tab === activeTab);
    return currentTabItem ? currentTabItem.name : title;
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {getPageTitle()}
          </h2>
          <p className="text-gray-400">
            Welcome back! Here's what's happening.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <nav className="mr-6">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.tab}>
                  {item.tab === activeTab ? (
                    <span className={`text-sm font-medium text-${color}-400`}>
                      {item.name}
                    </span>
                  ) : (
                    <button
                      onClick={() => onTabChange && onTabChange(item.tab)}
                      className="text-sm font-medium transition-colors text-gray-400 hover:text-white"
                    >
                      {item.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center gap-2">
            {themeColors.map((themeColor) => (
              <button
                key={themeColor.value}
                onClick={() => setColor(themeColor.value)}
                className={`w-6 h-6 rounded-full ${themeColor.color} transition-all duration-200 ${
                  color === themeColor.value 
                    ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-gray-400' 
                    : 'hover:scale-110'
                }`}
                title={themeColor.name}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;