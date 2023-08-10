import './App.css';
import TimeTable from './components/TimeTable';
import { useState } from 'react';

const weekDays = 7;
const hoursInDay = 24;

const initialSlotData = Array.from({ length: weekDays }, (_, day) =>
  Array.from({ length: hoursInDay }, (_, hour) => ({
    day: day + 1,
    hour: hour + 1,
    isActive: false,
  }))
);

function App() {
  const [slotData, setSlotData] = useState(initialSlotData);
  const [isSelectingSlots, setIsSelectingSlots] = useState(false);
  const [startSlotCoordinates, setStartSlotCoordinates] = useState(null);
  const [currentSlotCoordinates, setCurrentSlotCoordinates] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState([]); // Store selected ranges

  const handleMouseDown = (slotCoordinates) => {
    setIsSelectingSlots(true);
    setStartSlotCoordinates(slotCoordinates);
    setCurrentSlotCoordinates(slotCoordinates);
  };

  const handleMouseUp = () => {
    setIsSelectingSlots(false);
    setStartSlotCoordinates(null);
    setCurrentSlotCoordinates(null);

    // Calculate the range of days and hours
    const startDay = Math.min(startSlotCoordinates.day, currentSlotCoordinates.day);
    const endDay = Math.max(startSlotCoordinates.day, currentSlotCoordinates.day);
    const startHour = Math.min(startSlotCoordinates.hour, currentSlotCoordinates.hour);
    const endHour = Math.max(startSlotCoordinates.hour, currentSlotCoordinates.hour);

    // Store the selected range
    setSelectedRanges([
      ...selectedRanges,
      {
        startDay,
        endDay,
        startHour,
        endHour,
      },
    ]);
  };

  const handleMouseMove = (slotCoordinates) => {
    if (!isSelectingSlots) {
      return;
    }

    setCurrentSlotCoordinates(slotCoordinates);

    // Calculate the range of days and hours for the current selection
    const startDay = Math.min(startSlotCoordinates.day, slotCoordinates.day);
    const endDay = Math.max(startSlotCoordinates.day, slotCoordinates.day);
    const startHour = Math.min(startSlotCoordinates.hour, slotCoordinates.hour);
    const endHour = Math.max(startSlotCoordinates.hour, slotCoordinates.hour);

    // Update the isActive state based on the previous selected ranges
    const updatedSlotData = slotData.map((daySlots) =>
      daySlots.map((slot) => {
        const isActive = selectedRanges.some(
          (range) =>
            slot.day >= range.startDay &&
            slot.day <= range.endDay &&
            slot.hour >= range.startHour &&
            slot.hour <= range.endHour
        );

        return {
          ...slot,
          isActive,
        };
      })
    );

    // Update the isActive state for the current selection
    for (let day = startDay; day <= endDay; day++) {
      for (let hour = startHour; hour <= endHour; hour++) {
        updatedSlotData[day - 1][hour - 1].isActive = true;
      }
    }

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
