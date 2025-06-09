import React, { useState, useEffect } from 'react';
import { Plus, User, Calendar, Flag, Edit, Trash2, X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface TaskFormData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string;
}

const KanbanBoard: React.FC = () => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('todo');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    tags: ''
  });

  const defaultColumns: Column[] = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-gray-700',
      tasks: [
        {
          id: 1,
          title: 'Design System Update',
          description: 'Update the design system with new color palette and typography',
          assignee: 'John Doe',
          dueDate: '2024-01-20',
          priority: 'high',
          tags: ['Design', 'UI/UX']
        },
        {
          id: 2,
          title: 'User Research',
          description: 'Conduct user interviews for the new feature',
          assignee: 'Jane Smith',
          dueDate: '2024-01-25',
          priority: 'medium',
          tags: ['Research', 'UX']
        }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      color: 'bg-blue-900/20',
      tasks: [
        {
          id: 3,
          title: 'API Integration',
          description: 'Integrate the new payment API with the frontend',
          assignee: 'Bob Johnson',
          dueDate: '2024-01-18',
          priority: 'high',
          tags: ['Development', 'Backend']
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      color: 'bg-yellow-900/20',
      tasks: [
        {
          id: 4,
          title: 'Security Audit',
          description: 'Complete security audit for the authentication system',
          assignee: 'Charlie Wilson',
          dueDate: '2024-01-16',
          priority: 'high',
          tags: ['Security', 'Audit']
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-green-900/20',
      tasks: [
        {
          id: 5,
          title: 'Landing Page Redesign',
          description: 'Complete redesign of the landing page with new branding',
          assignee: 'Diana Davis',
          dueDate: '2024-01-15',
          priority: 'medium',
          tags: ['Design', 'Frontend']
        }
      ]
    }
  ];

  useEffect(() => {
    const savedColumns = localStorage.getItem('kanban-columns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else {
      setColumns(defaultColumns);
      localStorage.setItem('kanban-columns', JSON.stringify(defaultColumns));
    }
  }, []);

  const saveToLocalStorage = (newColumns: Column[]) => {
    localStorage.setItem('kanban-columns', JSON.stringify(newColumns));
    setColumns(newColumns);
  };

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask(task);
    setDraggedFrom(columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedTask || !draggedFrom || draggedFrom === targetColumnId) {
      setDraggedTask(null);
      setDraggedFrom(null);
      return;
    }

    const newColumns = [...columns];
    
    const sourceColumn = newColumns.find(col => col.id === draggedFrom);
    if (sourceColumn) {
      sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== draggedTask.id);
    }
    
    const targetColumn = newColumns.find(col => col.id === targetColumnId);
    if (targetColumn) {
      targetColumn.tasks.push(draggedTask);
    }
    
    saveToLocalStorage(newColumns);
    setDraggedTask(null);
    setDraggedFrom(null);
  };

  const handleAddTask = (columnId?: string) => {
    setEditingTask(null);
    setSelectedColumn(columnId || 'todo');
    setFormData({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      tags: ''
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      dueDate: task.dueDate,
      priority: task.priority,
      tags: task.tags.join(', ')
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const newColumns = columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }));
      saveToLocalStorage(newColumns);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (editingTask) {
      const newColumns = columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === editingTask.id 
            ? { ...task, ...taskData }
            : task
        )
      }));
      saveToLocalStorage(newColumns);
    } else {
      const newTask: Task = {
        id: Math.max(...columns.flatMap(col => col.tasks.map(t => t.id)), 0) + 1,
        ...taskData
      };
      
      const newColumns = columns.map(column => 
        column.id === selectedColumn 
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      );
      saveToLocalStorage(newColumns);
    }
    
    setShowTaskModal(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const TaskCard: React.FC<{ task: Task; columnId: string }> = ({ task, columnId }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(task, columnId)}
      className="p-4 rounded-lg border cursor-move transition-all duration-200 hover:shadow-md hover:scale-105 bg-gray-800 border-gray-600 hover:bg-gray-750 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-white text-sm">
          {task.title}
        </h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleEditTask(task)}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-primary-900/20 text-primary-400 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-400">
              {task.assignee}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-400">
              {task.dueDate}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            <Flag className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Project Board
          </h2>
          <p className="text-gray-400">
            Manage your tasks with drag-and-drop kanban board
          </p>
        </div>
        <button 
          onClick={() => handleAddTask()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`rounded-xl p-4 min-h-[500px] ${column.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">
                  {column.title}
                </h3>
                <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <button 
                onClick={() => handleAddTask(column.id)}
                className="p-1 rounded hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} columnId={column.id} />
              ))}
            </div>
            
            {column.tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-lg">
                <p className="text-gray-400 text-sm">
                  Drop tasks here
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Task Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Tasks</span>
              <span className="font-medium text-white">
                {columns.reduce((total, col) => total + col.tasks.length, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Completed</span>
              <span className="font-medium text-green-400">
                {columns.find(col => col.id === 'done')?.tasks.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In Progress</span>
              <span className="font-medium text-blue-400">
                {columns.find(col => col.id === 'progress')?.tasks.length || 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Priority Distribution
          </h3>
          <div className="space-y-3">
            {['high', 'medium', 'low'].map((priority) => {
              const count = columns.reduce((total, col) => 
                total + col.tasks.filter(task => task.priority === priority).length, 0
              );
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                    <span className="text-gray-400 capitalize">
                      {priority}
                    </span>
                  </div>
                  <span className="font-medium text-white">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Team Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg. Completion Time</span>
              <span className="font-medium text-white">3.2 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tasks This Week</span>
              <span className="font-medium text-green-400">+12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overdue Tasks</span>
              <span className="font-medium text-red-400">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  required
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Design, Frontend, UI/UX"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {!editingTask && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Column
                  </label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {columns.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingTask ? 'Update' : 'Add'} Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
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

export default KanbanBoard;