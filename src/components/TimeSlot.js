const TimeSlot = (props) => {
  const { day, hour, isActive, onMouseDown, onMouseUp, onMouseMove } = props;
  const slotClassName = `slot-item ${isActive ? 'active' : ''}`;
  return (
    <span
      className={slotClassName}
      onMouseDown={() => onMouseDown({ day: day, hour: hour })}
      onMouseMove={() => onMouseMove({ day: day, hour: hour })}
      onMouseUp={() => onMouseUp({ day: day, hour: hour })}
    >
      {/*{day}, {hour}*/}
    </span>
  );
};

export default TimeSlot;
