import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Edit, Trash2, X } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: 'meeting' | 'event' | 'reminder';
}

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'event' | 'reminder';
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'meeting'
  });

  const defaultEvents: Event[] = [
    { id: 1, title: 'Team Meeting', date: '2024-01-15', time: '10:00 AM', location: 'Conference Room A', type: 'meeting' },
    { id: 2, title: 'Project Review', date: '2024-01-18', time: '2:00 PM', location: 'Online', type: 'meeting' },
    { id: 3, title: 'Client Presentation', date: '2024-01-22', time: '3:30 PM', location: 'Client Office', type: 'event' },
    { id: 4, title: 'Deadline Reminder', date: '2024-01-25', time: '9:00 AM', type: 'reminder' },
  ];

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(defaultEvents);
      localStorage.setItem('calendar-events', JSON.stringify(defaultEvents));
    }
  }, []);

  const saveToLocalStorage = (newEvents: Event[]) => {
    localStorage.setItem('calendar-events', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleAddEvent = (date?: string) => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: date || '',
      time: '',
      location: '',
      type: 'meeting'
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location || '',
      type: event.type
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const newEvents = events.filter(event => event.id !== id);
      saveToLocalStorage(newEvents);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      const newEvents = events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      );
      saveToLocalStorage(newEvents);
    } else {
      const newEvent: Event = {
        id: Math.max(...events.map(e => e.id), 0) + 1,
        ...formData
      };
      saveToLocalStorage([...events, newEvent]);
    }
    
    setShowEventModal(false);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number) => {
    return today.getFullYear() === currentDate.getFullYear() &&
           today.getMonth() === currentDate.getMonth() &&
           today.getDate() === day;
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-gray-800 border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-primary-400 hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2" />;
                }
                
                const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayEvents = getEventsForDate(dateString);
                const isSelected = selectedDate === dateString;
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : dateString)}
                    className={`p-2 min-h-[3rem] text-sm rounded-lg transition-all duration-200 hover:scale-105 ${
                      isToday(day)
                        ? 'bg-primary-500 text-white font-bold'
                        : isSelected
                        ? 'bg-primary-900/20 text-primary-400'
                        : 'hover:bg-gray-700 text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                event.type === 'meeting' 
                                  ? 'bg-blue-500' 
                                  : event.type === 'event'
                                  ? 'bg-green-500'
                                  : 'bg-orange-500'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-gray-800 border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Upcoming Events
              </h3>
              <button
                onClick={() => handleAddEvent()}
                className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md bg-gray-700/50 border-gray-600 hover:bg-gray-700 group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      event.type === 'meeting' 
                        ? 'bg-blue-500' 
                        : event.type === 'event'
                        ? 'bg-green-500'
                        : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white mb-1">
                          {event.title}
                        </h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {selectedDate && (
        <div className="mt-6 rounded-xl bg-gray-800 border border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Events for {selectedDate}
              </h3>
              <button
                onClick={() => handleAddEvent(selectedDate)}
                className="flex items-center gap-2 px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                Add Event
              </button>
            </div>
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-400">No events scheduled for this date.</p>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border bg-gray-700/50 border-gray-600 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'meeting' 
                          ? 'bg-blue-500' 
                          : event.type === 'event'
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">
                            {event.title}
                          </h4>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">
                          {event.time} {event.location && `• ${event.location}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
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
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'meeting' | 'event' | 'reminder' })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="meeting">Meeting</option>
                  <option value="event">Event</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingEvent ? 'Update' : 'Add'} Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
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

export default Calendar;