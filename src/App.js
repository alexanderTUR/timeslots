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
  // State variables to manage slot selection and active slots
  // Stores slot data
  const [slotData, setSlotData] = useState(generateInitialSlotData);
  // Tracks if user is selecting slots
  const [isSelectingSlots, setIsSelectingSlots] = useState(false);
  // Starting coordinates of selection
  const [startSlotCoordinates, setStartSlotCoordinates] = useState(null);
  // Current coordinates of selection
  const [currentSlotCoordinates, setCurrentSlotCoordinates] = useState(null);
  // Stores if selection starts from active slot
  const [isStartingFromSelected, setIsStartingFromSelected] = useState(false);
  // Stores active slots
  const [activeSlots, setActiveSlots] = useState(new Set());

  // Function to handle mouse down event on a slot
  const handleMouseDown = (slotCoordinates) => {
    setIsSelectingSlots(true);
    setStartSlotCoordinates(slotCoordinates);
    setCurrentSlotCoordinates(slotCoordinates);

    // Check if the clicked slot is already active
    setIsStartingFromSelected(activeSlots.has(`${slotCoordinates.day}-${slotCoordinates.hour}`));
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    setIsSelectingSlots(false);
    setStartSlotCoordinates(null);
    setCurrentSlotCoordinates(null);
    setIsStartingFromSelected(false); // Reset the starting from selected state
  };

  // Function to handle mouse move event during selection
  const handleMouseMove = (slotCoordinates) => {
    if (!isSelectingSlots) {
      return;
    }

    setCurrentSlotCoordinates(slotCoordinates);

    const newActiveSlots = new Set(activeSlots);

    const [startDay, endDay] = [Math.min, Math.max].map((fn) =>
      fn(startSlotCoordinates.day, currentSlotCoordinates.day)
    );
    const [startHour, endHour] = [Math.min, Math.max].map((fn) =>
      fn(startSlotCoordinates.hour, currentSlotCoordinates.hour)
    );

    for (let day = 1; day <= weekDays; day++) {
      for (let hour = 1; hour <= hoursInDay; hour++) {
        const slotKey = `${day}-${hour}`;

        if (day >= startDay && day <= endDay && hour >= startHour && hour <= endHour) {
          if (isStartingFromSelected) {
            // Remove the slot if it's active
            newActiveSlots.delete(slotKey);
          } else {
            // Add the slot if it's not active
            newActiveSlots.add(slotKey);
          }
        }
      }
    }

    setActiveSlots(newActiveSlots);

    setSlotData((prevSlotData) =>
      prevSlotData.map((daySlots, dayIndex) =>
        daySlots.map((slot, hourIndex) => ({
          ...slot,
          isActive:
            (isStartingFromSelected && slot.isActive) ||
            newActiveSlots.has(`${dayIndex + 1}-${hourIndex + 1}`),
        }))
      )
    );
  };

  return (
    <section className="container">
      <h1 className="app-heading">Time Slot Selector</h1>
      <TimeTable
        slots={slotData}
        activeSlots={activeSlots}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </section>
  );
}

export default App;
