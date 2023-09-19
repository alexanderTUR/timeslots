import { memo } from 'react';

const TimeSlot = memo(({ day, hour, isActive, onMouseDown, onMouseUp, onMouseMove }) => {
  const slotClassName = `time-slot ${isActive ? 'time-slot--active' : ''}`;

  return (
    <span
      className={slotClassName}
      onMouseDown={() => onMouseDown({ day, hour })}
      onMouseMove={() => onMouseMove({ day, hour })}
      onMouseUp={() => onMouseUp({ day, hour })}
    ></span>
  );
});

export default TimeSlot;
