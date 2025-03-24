import React, { useState, useEffect, useRef } from "react";

function App() {
  const [time, setTime] = useState({
    seconds: 0,
    minutes: 25,
    break: 5,
    session: 25,
    isPlaying: false,
    title: "Session",
  });

  const audioRef = useRef(null);
  function handleBreakLength(e) {
    if (time.minutes !== 25 && time.seconds !== 0) return;
    if (e.currentTarget.value === "-") {
      if (time.break === 1) return;
      setTime((preState) => {
        return {
          ...preState,
          break: preState.break - 1,
        };
      });
    }
    if (e.currentTarget.value === "+") {
      if (time.break === 60) return;
      setTime((preState) => {
        return {
          ...preState,
          break: preState.break + 1,
        };
      });
    }
  }
  function handleSessionLength(e) {
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
      if (time.session === 60) return;
      setTime((preState) => {
        return {
          ...preState,
          minutes: preState.minutes + 1,
          session: preState.session + 1,
        };
      });
    }
  }
  if (time.minutes < 0) {
    audioRef.current.play();
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
  let timer;
  useEffect(() => {
    if (time.isPlaying) {
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
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [time.isPlaying]);

  function playPause(e) {
    if (!e.currentTarget) return;

    setTime((preState) => {
      return {
        ...preState,
        isPlaying: !preState.isPlaying,
      };
    });
  }

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
  const myStyle = {
    color: time.minutes === 0 ? "red" : "white",
  };
  return (
    <div id="container">
      <div id="app">
        <div className="main-title"> 25 + 5 Clock</div>
        <div className="control">
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
        <div className="timer-control">
          <button id="start_stop" onClick={playPause}>
            <i className="fa fa-play fa-2x btn"></i>
            <i className="fa fa-pause fa-2x btn"></i>
          </button>
          <button id="reset" onClick={reset}>
            <i className="fa fa-refresh fa-2x btn"></i>
          </button>
          <audio
            id="beep"
            ref={audioRef}
            preload="auto"
            src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
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
