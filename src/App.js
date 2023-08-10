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
  const [startSlotCoordinates, setStartSlotCoordinates] = useState(null);
  const [currentSlotCoordinates, setCurrentSlotCoordinates] = useState(null);
  const handleMouseDown = (slotCoordinates) => {
    setIsSelectingSlots(true);
    setStartSlotCoordinates(slotCoordinates);
  };
  const handleMouseUp = (slotCoordinates) => {
    setIsSelectingSlots(false);
    setStartSlotCoordinates(null);
    setCurrentSlotCoordinates(null);
  };
  const handleMouseMove = (slotCoordinates) => {
    if (!isSelectingSlots) {
      return;
    }

    setCurrentSlotCoordinates(slotCoordinates);

    // Calculate the range of days and hours
    const startDay = Math.min(startSlotCoordinates.day, slotCoordinates.day);
    const endDay = Math.max(startSlotCoordinates.day, slotCoordinates.day);
    const startHour = Math.min(startSlotCoordinates.hour, slotCoordinates.hour);
    const endHour = Math.max(startSlotCoordinates.hour, slotCoordinates.hour);

    // Update the isActive state based on the range
    const updatedSlotData = slotData.map((daySlots) =>
      daySlots.map((slot) => {
        const withinDayRange = slot.day >= startDay && slot.day <= endDay;
        const withinHourRange = slot.hour >= startHour && slot.hour <= endHour;

        return {
          ...slot,
          isActive: withinDayRange && withinHourRange,
        };
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
