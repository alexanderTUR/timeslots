import './App.css';
import TimeTable from './components/TimeTable';
import { useState } from 'react';

// Constants for the number of days in a week and hours in a day
const weekDays = 7;
const hoursInDay = 24;

// Function to generate initial slot data with inactive slots
const generateInitialSlotData = () =>
  Array.from({ length: weekDays }, (_, day) =>
    Array.from({ length: hoursInDay }, (_, hour) => ({
      day: day + 1,
      hour: hour + 1,
      isActive: false,
    }))
  );

function App() {
  // State variables
  const [slotData, setSlotData] = useState(generateInitialSlotData); // Stores slot data
  const [isSelectingSlots, setIsSelectingSlots] = useState(false); // Tracks if user is selecting slots
  const [startSlotCoordinates, setStartSlotCoordinates] = useState(null); // Starting coordinates of selection
  const [currentSlotCoordinates, setCurrentSlotCoordinates] = useState(null); // Current coordinates of selection
  const [selectedRanges, setSelectedRanges] = useState([]); // Stores selected ranges of slots

  // Function to handle mouse down event on a slot
  const handleMouseDown = (slotCoordinates) => {
    setIsSelectingSlots(true);
    setStartSlotCoordinates(slotCoordinates);
    setCurrentSlotCoordinates(slotCoordinates);
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    setIsSelectingSlots(false);
    setStartSlotCoordinates(null);
    setCurrentSlotCoordinates(null);

    // Calculate the range of days and hours for the selection
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

  // Function to handle mouse move event during selection
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

    // Update the isActive state based on the selected ranges
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

    // Update the slot data with the updated isActive state
    setSlotData(updatedSlotData);
  };

  return (
    <section className="container">
      <h1 className="app-heading">Time Slot Selector</h1>
      <TimeTable
        slots={slotData}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </section>
  );
}

export default App;
