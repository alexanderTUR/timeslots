import './App.css';
import TimeTable from './components/TimeTable';
import { useState } from 'react';

const weekDays = 7;
const hoursInDay = 24;

const slots = Array.from({ length: weekDays }, (_, day) =>
  Array.from({ length: hoursInDay }, (_, hour) => ({
    day: day + 1,
    hour: hour + 1,
    isActive: false,
  }))
);

function App() {
  const [slotData, setSlotData] = useState(slots);
  const [isSelectingSlots, setIsSelectingSlots] = useState(false);
  const [clickedSlotCoordinates, setClickedSlotCoordinates] = useState(null);
  const handleMouseDown = (slotCoordinates) => {
    setIsSelectingSlots(true);
    setClickedSlotCoordinates(slotCoordinates);
  };
  const handleMouseUp = (slotCoordinates) => {
    setIsSelectingSlots(false);
    setClickedSlotCoordinates(null);
  };
  const handleMouseMove = (slotCoordinates) => {
    if (!isSelectingSlots) {
      return;
    }

    const { day, hour } = slotCoordinates;
    const startDay = Math.min(clickedSlotCoordinates.day, day);
    const endDay = Math.max(clickedSlotCoordinates.day, day);
    const startHour = Math.min(clickedSlotCoordinates.hour, hour);
    const endHour = Math.max(clickedSlotCoordinates.hour, hour);

    const updatedSlotData = slotData.map((daySlots, dayIndex) =>
      daySlots.map((slot, hourIndex) => {
        const isInsideSelectedArea =
          dayIndex + 1 >= startDay &&
          dayIndex + 1 <= endDay &&
          hourIndex + 1 >= startHour &&
          hourIndex + 1 <= endHour;

        if (isInsideSelectedArea) {
          return {
            ...slot,
            isActive: !clickedSlotCoordinates.isActive, // Toggle based on the clicked slot's isActive state
          };
        }

        return slot;
      })
    );

    setSlotData(updatedSlotData);
  };

  return (
    <div className="App">
      <TimeTable
        slots={slotData}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}

export default App;
