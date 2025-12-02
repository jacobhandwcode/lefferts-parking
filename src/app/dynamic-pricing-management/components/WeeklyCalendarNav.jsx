import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const WeeklyCalendarNav = ({ currentWeek, onWeekChange, selectedLocation }) => {
  const formatWeekRange = (weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd?.setDate(weekEnd?.getDate() + 6);
    
    return `${weekStart?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${weekEnd?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek?.setDate(newWeek?.getDate() + (direction * 7));
    onWeekChange(newWeek);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart?.setDate(today?.getDate() - today?.getDay());
    onWeekChange(currentWeekStart);
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart?.setDate(today?.getDate() - today?.getDay());
    return currentWeek?.toDateString() === currentWeekStart?.toDateString();
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Weekly Pricing Calendar</h2>
          <p className="text-sm text-muted-foreground">Configure pricing for {selectedLocation}</p>
        </div>
        <button
          onClick={goToCurrentWeek}
          disabled={isCurrentWeek()}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-micro ${
            isCurrentWeek()
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          Current Week
        </button>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateWeek(-1)}
          className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
        >
          <Icon name="ChevronLeftIcon" size={20} />
          <span className="text-sm font-medium">Previous Week</span>
        </button>

        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {formatWeekRange(currentWeek)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Week of {currentWeek?.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <button
          onClick={() => navigateWeek(1)}
          className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
        >
          <span className="text-sm font-medium">Next Week</span>
          <Icon name="ChevronRightIcon" size={20} />
        </button>
      </div>
    </div>
  );
};

WeeklyCalendarNav.propTypes = {
  currentWeek: PropTypes?.instanceOf(Date)?.isRequired,
  onWeekChange: PropTypes?.func?.isRequired,
  selectedLocation: PropTypes?.string?.isRequired
};

export default WeeklyCalendarNav;