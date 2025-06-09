import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardOverview from './components/dashboard/DashboardOverview';
import DataTable from './components/tables/DataTable';
import Charts from './components/charts/Charts';
import Calendar from './components/calendar/Calendar';
import KanbanBoard from './components/kanban/KanbanBoard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'tables':
        return <DataTable />;
      case 'charts':
        return <Charts />;
      case 'calendar':
        return <Calendar />;
      case 'kanban':
        return <KanbanBoard />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-900 transition-colors">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;