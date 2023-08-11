import React from 'react';
import TimeSlot from './TimeSlot';

const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, index) => (index < 10 ? `0${index}` : index));

const TimeTable = ({ slots, onMouseDown, onMouseUp, onMouseMove, activeSlots }) => {
  return (
    <div className="time-table">
      <div className="slot-table__hour-heading">
        <span className="slot-table__empty-title"></span>
        {hours.map((hour, index) => (
          <span key={index} className="slot-table__hour-title">
            {hour}
          </span>
        ))}
      </div>
      {slots.map((slot, dayIndex) => (
        <div className="slot-table__day-wrapper" key={dayIndex}>
          <span className="slot-table__day-title">{shortDayNames[dayIndex]}</span>
          <div className="slot-table__day">
            {slot.map((timeSlot) => {
              const isActive = activeSlots.has(`${timeSlot.day}-${timeSlot.hour}`);

              return (
                <TimeSlot
                  {...timeSlot}
                  isActive={isActive}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseMove={onMouseMove}
                  key={`${timeSlot.day}/${timeSlot.hour}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeTable;
