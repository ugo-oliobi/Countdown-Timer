import React, { useState, useEffect, useRef } from "react";

function App() {
  // State for timer, break, session, play status, and title
  const [time, setTime] = useState({
    seconds: 0,
    minutes: 25,
    break: 5,
    session: 25,
    isPlaying: false,
    title: "Session",
  });
  // Ref for audio element
  const audioRef = useRef(null);

  // Handle break length increment/decrement
  function handleBreakLength(e) {
    // Only allow change if timer is at initial state
    if (time.minutes !== 25 && time.seconds !== 0) return;
    if (e.currentTarget.value === "-") {
      if (time.break === 1) return; // Minimum break length
      setTime((preState) => {
        return {
          ...preState,
          break: preState.break - 1,
        };
      });
    }
    if (e.currentTarget.value === "+") {
      if (time.break === 60) return; // Maximum break length
      setTime((preState) => {
        return {
          ...preState,
          break: preState.break + 1,
        };
      });
    }
  }
  // Handle session length increment/decrement
  function handleSessionLength(e) {
    // Only allow change if timer is at initial state
    if (time.minutes !== 25 && time.seconds !== 0) return;
    if (e.currentTarget.value === "-") {
      if (time.session === 1) return;
      setTime((preState) => {
        return {
          ...preState,
          minutes: preState.minutes - 1,
          session: preState.session - 1,
        };
      });
    }
    if (e.currentTarget.value === "+") {
      if (time.session === 60) return; // Maximum session length
      setTime((preState) => {
        return {
          ...preState,
          minutes: preState.minutes + 1,
          session: preState.session + 1,
        };
      });
    }
  }
  // Handle timer reaching below zero, switch between session and break
  if (time.minutes < 0) {
    audioRef.current.play(); // Play beep sound
    if (time.title === "Session") {
      setTime((preState) => {
        return {
          ...preState,
          seconds: 0,
          minutes: preState.break,
          title: "Break",
        };
      });
    }
    if (time.title === "Break") {
      setTime((preState) => {
        return {
          ...preState,
          seconds: 0,
          minutes: preState.session,
          title: "Session",
        };
      });
    }
  }
  let timer; // Timer variable for interval

  // useEffect to handle timer countdown
  useEffect(() => {
    if (time.isPlaying) {
      // Start interval if playing
      timer = setInterval(() => {
        setTime((preState) => {
          return {
            ...preState,
            seconds: preState.seconds === 0 ? 59 : preState.seconds - 1,
            minutes:
              preState.seconds === 0 ? preState.minutes - 1 : preState.minutes,
          };
        });
      }, 1000);
    } else {
      // Pause timer if not playing
      clearInterval(timer);
    }
    // Cleanup interval on unmount or when isPlaying changes
    return () => clearInterval(timer);
  }, [time.isPlaying]);

  // Toggle play/pause state
  function playPause(e) {
    if (!e.currentTarget) return;

    setTime((preState) => {
      return {
        ...preState,
        isPlaying: !preState.isPlaying,
      };
    });
  }

  // Reset timer and audio
  function reset() {
    clearInterval(timer);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    setTime({
      seconds: 0,
      minutes: 25,
      break: 5,
      session: 25,
      isPlaying: false,
      title: "Session",
    });
  }

  // Style for timer color change when minutes reach zero
  const myStyle = {
    color: time.minutes === 0 ? "red" : "white",
  };
  // Render UI
  return (
    <div id="container">
      <div id="app">
        <div className="main-title"> 25 + 5 Clock</div>
        <div className="control">
          {/* Break Length Controls */}
          <div className="length-control">
            <div id="break-label">Break Length</div>
            <div className="bl">
              <button
                className="btn-level"
                onClick={handleBreakLength}
                id="break-decrement"
                value="-"
              >
                <i className="fa fa-arrow-down fa-2x btn"></i>
              </button>
              <div id="break-length">{time.break}</div>
              <button
                className="btn-level"
                onClick={handleBreakLength}
                id="break-increment"
                value="+"
              >
                <i className="fa fa-arrow-up fa-2x btn"></i>
              </button>
            </div>
          </div>
          {/* Session Length Controls */}
          <div className="session-control">
            <div id="session-label">Session Length</div>
            <div className="bl">
              <button
                className="btn-level"
                onClick={handleSessionLength}
                id="session-decrement"
                value="-"
              >
                <i className="fa fa-arrow-down fa-2x btn"></i>
              </button>
              <div id="session-length">{time.session}</div>
              <button
                className="btn-level"
                onClick={handleSessionLength}
                id="session-increment"
                value="+"
              >
                <i className="fa fa-arrow-up fa-2x btn"></i>
              </button>
            </div>
          </div>
        </div>
        {/* Timer Display */}
        <div className="session-timer">
          <div id="timer-label" className="timer-title" style={myStyle}>
            {time.title}
          </div>
          <div
            id="time-left"
            className="digits"
            style={myStyle}
          >{`${time.minutes.toString().padStart(2, "0")}:${time.seconds
            .toString()
            .padStart(2, "0")}`}</div>
        </div>
        {/* Timer Controls */}
        <div className="timer-control">
          <button id="start_stop" onClick={playPause}>
            <i className="fa fa-play fa-2x btn"></i>
            <i className="fa fa-pause fa-2x btn"></i>
          </button>
          <button id="reset" onClick={reset}>
            <i className="fa fa-refresh fa-2x btn"></i>
          </button>
          {/* Audio element for beep */}
          <audio
            id="beep"
            ref={audioRef}
            preload="auto"
            src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
        {/* Author Footer */}
        <div className="author">
          Designed and Coded by <br />{" "}
          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            Ugonna Oliobi
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
