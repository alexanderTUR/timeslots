import React from 'react';
import TimeSlot from './TimeSlot';

const shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, index) =>
  index < 10 ? `0${index}:00` : `${index}:00`
);

const TimeTable = ({ slots, onMouseDown, onMouseUp, onMouseMove, activeSlots }) => {
  const timeSlots = slots.map((slot, dayIndex) => (
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
  ));
  const timeSlotsHead = (
    <div className="slot-table__hour-heading">
      <span className="slot-table__empty-title"></span>
      {hours.map((hour, index) => (
        <span key={index} className="slot-table__hour-title">
          {hour}
        </span>
      ))}
    </div>
  );
  return (
    <div className="time-table">
      {timeSlotsHead}
      {timeSlots}
    </div>
  );
};

export default TimeTable;
