import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import Session from "./Session";
import DurationButtons from "./DurationButtons";
import TimerControls from "./TimerControls";

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

function nextSession(focusDuration, breakDuration) {

  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const handleFocusDecrease = () => {
    if (focusDuration > 5) setFocusDuration(focusDuration - 5);
  };

  const handleFocusIncrease = () => {
    if (focusDuration < 60) setFocusDuration(focusDuration + 5);
  };

  const handleBreakDecrease = () => {
    if (breakDuration > 1) {
      setBreakDuration(breakDuration - 1);
    }
  };

  const handleBreakIncrease = () => {
    if (breakDuration < 15) {
      setBreakDuration(breakDuration + 1);
    }
  };

  const handleStopSession = () => {
    setIsTimerRunning(false);
    setSession(null);
  };

  const displayDuration = (label) => {
    if (label === "Focusing") {
      return focusDuration;
    } else return breakDuration;
  };

  const updateAria = (time, label) => {
    return 100 - (time / (displayDuration(label) * 60)) * 100;
  };

  const updatedAria = updateAria(session?.timeRemaining, session?.label);

  useInterval(
    () => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  return (
    <div className="pomodoro">
      <DurationButtons
        session={session}
        focusDuration={focusDuration}
        breakDuration={breakDuration}
        handleFocusDecrease={handleFocusDecrease}
        handleFocusIncrease={handleFocusIncrease}
        handleBreakDecrease={handleBreakDecrease}
        handleBreakIncrease={handleBreakIncrease}
      />
      <TimerControls
        playPause={playPause}
        isTimerRunning={isTimerRunning}
        handleStopSession={handleStopSession}
        session={session}
      />
      <Session
        session={session}
        updatedAria={updatedAria}
        displayDuration={displayDuration}
        isTimerRunning={isTimerRunning}
      />
    </div>
  );
}

export default Pomodoro;
