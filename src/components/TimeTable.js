import TimeSlot from './TimeSlot';

const TimeTable = (props) => {
  const { slots, onMouseDown, onMouseUp, onMouseMove } = props;
  return (
    <div className="slot-table">
      {slots.map((slot, i) => (
        <div key={i} className="slot-table-row">
          {slot.map((s) => (
            <TimeSlot
              day={s.day}
              hour={s.hour}
              isActive={s.isActive}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              key={`${s.day}/${s.hour}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TimeTable;
