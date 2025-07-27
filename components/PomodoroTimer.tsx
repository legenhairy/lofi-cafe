import { useState, useEffect } from 'react';
import { playSound } from 'react-sounds';

interface PomodoroTimerProps {
  showTimer: () => void;
}

const PomodoroTimer = ({ showTimer }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  // drag component state values
  const [position, setPosition] = useState({ x: 200, y: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // controls are not needed since sound playing isnt attached to a button 
  const handleSound = () => playSound('notification/notification')

  // Format the time into MM:SS format - add this as a util function
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning)
  }

  // Reset the timer back to full time again, check if its break or work mode
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(isBreak ? 5 * 60: 25 * 60)
  }

  const switchMode = () => {
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // handles the logic for the dragging of timer container, makes sure it can't leave browser boundaries
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Get the dimensions of the draggable container
      const element = document.querySelector('.fixed') as HTMLDivElement; // Assuming 'fixed' class is unique to this draggable element
      const elementRect = element.getBoundingClientRect();

      // Calculate boundaries
      const maxX = window.innerWidth - elementRect.width;
      const maxY = window.innerHeight - elementRect.height;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  //Timer countdown exists here
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      //play the end sound as a user notification
      handleSound();
      // Switch between the work and break mode
      setIsBreak(!isBreak)
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60)
      setIsRunning(false)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    };
  }, [isRunning, timeLeft, isBreak]);

  // Drag behavior event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className={`fixed z-20 bg-black bg-opacity-60 rounded-lg shadow-lg border-2 ${
        isBreak ? 'border-green-400' : 'border-red-400'
      } p-6 w-80 select-none cursor-move`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-blue-400" onMouseDown={handleMouseDown}>
          <h2 className={`text-xl font-bold ${
            isBreak ? 'text-green-500' : 'text-red-500'
          }`}>
            {isBreak ? '☕ Break Time' : '🍅 Focus Time'}
          </h2>
          <div className="flex cursor-pointer" onClick={showTimer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#77279f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              className="lucide lucide-x-icon hover:cursor-pointer"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>

        {/* Timer Display with Circular Progress */}
        <div className="text-center mb-6 cursor-default">
          <div className="relative inline-block">
            {/* Circular Progress SVG */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={isBreak ? 'text-green-400' : 'text-red-400'}
                style={{
                  strokeDasharray: `${2 * Math.PI * 50}`,
                  strokeDashoffset: `${2 * Math.PI * 50 * (1 - (timeLeft / (isBreak ? 5 * 60 : 25 * 60)))}`
                }}
              />
            </svg>
            {/* Timer Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl font-bold ${
                isBreak ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
        </div>

        {/* Controls */}
        <div className="flex justify-center z-10 gap-3 mb-4 cursor-default">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : isBreak
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
          >
            🔄 Reset
          </button>
        </div>

        {/* Mode Switch */}
        <div className="text-center cursor-default">
          <button
            onClick={switchMode}
            className="text-lg text-blue-600 hover:text-gray-800 underline"
          >
            Switch to {isBreak ? 'Focus' : 'Break'} Mode
          </button>
        </div>
    </div>
  )
}

export default PomodoroTimer