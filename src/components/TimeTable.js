import TimeSlot from './TimeSlot';

const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, index) => (index < 10 ? `0${index}` : index));

const TimeTable = ({ slots, onMouseDown, onMouseUp, onMouseMove }) => {
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
      {slots.map((slot, i) => (
        <div className="slot-table__day-wrapper" key={i}>
          <span className="slot-table__day-title">{shortDayNames[i]}</span>
          <div className="slot-table__day">
            {slot.map((s) => (
              <TimeSlot
                {...s}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                key={`${s.day}/${s.hour}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeTable;
