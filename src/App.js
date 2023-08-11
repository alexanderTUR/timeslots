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

    // Create a new Set to store the updated active slots
    const newActiveSlots = new Set(activeSlots);

    // Calculate the range of days and hours for the selection
    const startDay = Math.min(startSlotCoordinates.day, currentSlotCoordinates.day);
    const endDay = Math.max(startSlotCoordinates.day, currentSlotCoordinates.day);
    const startHour = Math.min(startSlotCoordinates.hour, currentSlotCoordinates.hour);
    const endHour = Math.max(startSlotCoordinates.hour, currentSlotCoordinates.hour);

    // Add or remove slots based on the selection
    for (let day = startDay; day <= endDay; day++) {
      for (let hour = startHour; hour <= endHour; hour++) {
        const slotKey = `${day}-${hour}`;

        if (isStartingFromSelected) {
          // Remove the slot if it's active
          newActiveSlots.delete(slotKey);
        } else {
          // Add the slot if it's not active
          newActiveSlots.add(slotKey);
        }
      }
    }

    // Update the active slots state with the new Set
    setActiveSlots(newActiveSlots);
  };

  // Function to handle mouse move event during selection
  const handleMouseMove = (slotCoordinates) => {
    if (!isSelectingSlots) {
      return;
    }

    setCurrentSlotCoordinates(slotCoordinates);

    // Update the slot data with the updated active status for each slot
    setSlotData((prevSlotData) =>
      prevSlotData.map((daySlots, dayIndex) =>
        daySlots.map((slot, hourIndex) => {
          const isActive =
            (isStartingFromSelected && slot.isActive) || // If starting from selected, make active slots inactive
            activeSlots.has(`${dayIndex + 1}-${hourIndex + 1}`) ||
            (dayIndex + 1 === slotCoordinates.day && hourIndex + 1 === slotCoordinates.hour); // Add currently hovered slot

          return {
            ...slot,
            isActive,
          };
        })
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
