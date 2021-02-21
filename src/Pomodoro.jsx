import React, { useReducer , useEffect } from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import useSound from 'use-sound'
import Sound from './ring.mp3'

//! estado inicial 
const initialState = {
  title: 'Setealo y dale Play',
  timeLeft: 10,
  isRunning: false,
  isZero: false,
}

// !funcion de useReduce
const reducerPomodoro = ( state = initialState , action ) => {
  switch (action.type) {
    case "START_TIMER": 
      return {
        title: 'Descontando',
        timeLeft: state.timeLeft - 1,
        isRunning: true,
        isZero: false,
      }
    case "STOP_TIMER":
      return {
        title: 'Pausa',
        timeLeft: state.timeLeft,
        isRunning: false,
        isZero: false,
      }       
    case "RESET_TIMER":
      return {
        title: 'Setealo y dale Play',
        timeLeft: 10,
        isRunning: false,
        isZero: false,
      }   
    case "ON_ZERO":
      return {
        title: 'Tiempo Cumplido',
        timeLeft: state.timeLeft === 0,
        isRunning: true,
        isZero: true,
      }
    case "ADD_MIN":
      return {
        title: 'Agregando Minutos',
        timeLeft: state.timeLeft + 1 * 60 >= 59 * 60 + 59 ? 59 * 60 + 59 : state.timeLeft + 1 * 60,
        isRunning: false,
        isZero: false,
      }           
    case "ADD_SEC":
      return {
        title: 'Agregando Segundos',
        timeLeft: state.timeLeft + 1 >= 59 * 60 + 59 ? 59 * 60 + 59 : state.timeLeft + 1,
        isRunning: false,
        isZero: false,
      }           
    case "REM_MIN":
      return {
        title: 'Removiendo Minutos',
        timeLeft: state.timeLeft - 1 * 60 <= 0 ? state.timeLeft > 0 : state.timeLeft - 1 * 60,
        isRunning: false,
        isZero: false,
      }       
    case "REM_SEC":
      return {
        title: 'Removiendo Segundos',
        timeLeft: state.timeLeft - 1 <= 0 ? 1 : state.timeLeft - 1,
        isRunning: false,
        isZero: false,
      }   
    default:
      return state
  }
}

const Pomodoro = () => {

  //! hook del estado del pomodoro 
  const [{ title, timeLeft, isRunning, isZero }, dispatch] = useReducer(reducerPomodoro, initialState)
  
  //! hooks de sonidos
  const [playOn] = useSound(Sound,{ volume: 0.25 });
  const [playOff] = useSound(Sound,{ volume: 0.25 });

  //! funcion para agregar los ceros que faltan
  const padTime = (time) => {
    return time.toString().padStart(2, '0');
  }

  // ! minutos y segundos
  const minutes = padTime(Math.floor(timeLeft / 60));
  const seconds = padTime(Math.floor(timeLeft - minutes * 60));
  
  
  //! descontando pomodoro  
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'START_TIMER' })
      }, 1000);
    }  
    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  
  useEffect(() => {
    if (isZero) {
      playOn()
    }
    if (isZero===false) {
      playOff()
    }
  }, [isZero])
  
  {timeLeft === 0 ? dispatch({ type: 'ON_ZERO' }): null}


  return (
    <>
    <div className="app">  
      <h2>{title}</h2>
        <div className="timer">
          {!isRunning &&
            <div className="btn btnMin">
            <div
              className="add"
              onClick={() => {
                dispatch({ type: 'ADD_MIN' })
              }}
            >
              +
            </div>
            <div
              className="rem"
              onClick={() => {
                dispatch({ type: 'REM_MIN' })
              }}
            >
              -
            </div>
            </div>}
          {!isRunning &&
          <div className="btn btnSec">
            <div
              className="add"
              onClick={() => {
                dispatch({ type: 'ADD_SEC' })
              }}
            >
              +
            </div>  
            <div
              className="rem"
              onClick={() => {
                dispatch({ type: 'REM_SEC' })
              }}
            >
              -
            </div>  
          </div>
          }
          { isZero ?
            null
            :
            <span >{minutes}</span>
          }
          {isZero ?
            <span className="onZero">RING!</span>
            :
            <span>:</span>
          }
          {isZero ?
            null
            :
            <span>{seconds}</span>
          }        
        </div>
        {timeLeft && 
          <div className="buttons">
              {!isRunning && <button onClick={() => (dispatch({ type: 'START_TIMER' }))}>
                <FontAwesomeIcon icon={faPlay} />
              </button>}
              {isRunning && !isZero && <button onClick={() => (dispatch({ type: 'STOP_TIMER' }))}>
                <FontAwesomeIcon icon={faStop} />
              </button>}
          {timeLeft && <button onClick={() => (dispatch({ type: 'RESET_TIMER' }))} >
                <FontAwesomeIcon icon={faRedoAlt} />
              </button>}
          </div>
        }
      </div>
    </>
  );
}

export default Pomodoro;
