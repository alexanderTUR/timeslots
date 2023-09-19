import './App.css';
import TimeTable from './components/TimeTable';
import { useCallback, useReducer, useState } from 'react';

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

// Reducer to manage slot coordinates state
const slotCoordinatesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_START_COORDINATES':
      return { ...state, startSlotCoordinates: action.payload };
    case 'SET_CURRENT_COORDINATES':
      return { ...state, currentSlotCoordinates: action.payload };
    default:
      return state;
  }
};

function App() {
  // State management for slot coordinates
  const [slotCoordinates, dispatchSlotCoordinates] = useReducer(slotCoordinatesReducer, {
    startSlotCoordinates: null,
    currentSlotCoordinates: null,
  });
  const { startSlotCoordinates, currentSlotCoordinates } = slotCoordinates;

  // State variables to manage slot selection and active slots
  const [slotData, setSlotData] = useState(generateInitialSlotData);
  const [isSelectingSlots, setIsSelectingSlots] = useState(false);
  const [isStartingFromSelected, setIsStartingFromSelected] = useState(false);
  const [activeSlots, setActiveSlots] = useState(new Set());

  // Function to handle mouse down event on a slot
  const handleMouseDown = useCallback(
    (slotCoordinates) => {
      setIsSelectingSlots(true);
      dispatchSlotCoordinates({ type: 'SET_START_COORDINATES', payload: slotCoordinates });
      dispatchSlotCoordinates({ type: 'SET_CURRENT_COORDINATES', payload: slotCoordinates });

      // Check if the clicked slot is already active
      setIsStartingFromSelected(activeSlots.has(`${slotCoordinates.day}-${slotCoordinates.hour}`));
    },
    [activeSlots]
  );

  // Function to handle mouse up event
  const handleMouseUp = useCallback(() => {
    setIsSelectingSlots(false);
    dispatchSlotCoordinates({ type: 'SET_START_COORDINATES', payload: null });
    dispatchSlotCoordinates({ type: 'SET_CURRENT_COORDINATES', payload: null });

    setIsStartingFromSelected(false); // Reset the starting from selected state
  }, []);

  // Function to handle mouse move event during selection
  const handleMouseMove = useCallback(
    (slotCoordinates) => {
      if (!isSelectingSlots) {
        return;
      }

      dispatchSlotCoordinates({ type: 'SET_CURRENT_COORDINATES', payload: slotCoordinates });

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
          const isRange = day >= startDay && day <= endDay && hour >= startHour && hour <= endHour;
          if (isRange) {
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
    },
    [
      activeSlots,
      currentSlotCoordinates,
      isSelectingSlots,
      isStartingFromSelected,
      startSlotCoordinates,
    ]
  );

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
