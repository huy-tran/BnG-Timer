import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

const POMODORO_DEFAULT = 1500;
const LONG_BREAK = 600
const SHORT_BREAK = 300;
const TIMER_INTEVAL = 1000;
const TEST_ALARM = 5;

class App extends React.Component{
  constructor(){
    super();
    // Initial states
    this.state = {
      startingTime: new Date(),
      firstCount: true,
      running: false,
      stopTime: POMODORO_DEFAULT,
      remainingTime: POMODORO_DEFAULT,
      targetTime: POMODORO_DEFAULT
    }
    this.setTimer = this.setTimer.bind(this);
    this.countdown = this.countdown.bind(this);
  }
  // Time Format
  formattedTime(sec){
    let seconds = ('0' + sec % 60).slice(-2);
    let minutes = Math.floor(sec / 60);
    return `${minutes}:${seconds}`;
  }
  // Count down function
  countdown(){
    let currentTime = new Date(); // get current time

    this.state.startingTime = (this.state.firstCount) ? currentTime : this.state.startingTime; // Prevent delay or weird display when first countdown

    let elapsedRealTime = Math.floor((currentTime.getTime() - this.state.startingTime.getTime()) / TIMER_INTEVAL);

    this.setState({ remainingTime: this.state.stopTime - elapsedRealTime}); // update remainingTime

    document.title = `Pomodoro Timer (${this.formattedTime(this.state.remainingTime)})`; // Update document title based on elapsed second

    this.state.firstCount = false; // set flag to false

    if (this.state.remainingTime > 0) {
      this.timeout = setTimeout(this.countdown, TIMER_INTEVAL);
    } else {
      document.title = `Pomodoro Timer (BINGO)`; // Reset document title
      document.getElementById('bngAlarm').play(); // Trigger alarm sound when finish countdown
      clearTimeout(this.timeout); 
      this.setState({ 
        running: false,
        firstCount: true,
        stopTime: this.state.targetTime,
        remainingTime: this.state.targetTime // Reset time to target time
       });
    }
  }
  clickStart(){
    this.setState({ running: true });
    this.countdown();
  }
  clickStop(){
    this.setState({ 
      running: false, 
      firstCount: true, // set to true to get elapsedRealTime = 0, prevent gap when click Start button again
        stopTime: this.state.remainingTime // set stopTime to last remainingTime to resume countdown
      });
      clearTimeout(this.timeout);
  }
  clickReset(){
    this.setState({ 
      remainingTime: this.state.targetTime, // Rest time to target time
      stopTime: this.state.targetTime, // Set stopTime to use on countdown()
      firstCount: true // set to true to get elapsedRealTime = 0, prevent gap when click Start button again 
    });
  }
  setTimer(evt){
    this.setState({ 
      firstCount: true // set to true to get elapsedRealTime = 0, prevent gap when click Start button again
    });
    let type = evt.target.getAttribute("name");
    switch(type){
      case "Pomodoro": 
        this.setTimerState(POMODORO_DEFAULT);
        break;
      case "Short Break": 
        this.setTimerState(SHORT_BREAK); 
        break;
      case "Long Break": 
        this.setTimerState(LONG_BREAK); 
        break;
      case "Test Alarm": 
        this.setTimerState(TEST_ALARM);
        break;
    }
  }
  setLength(type) {
    var targetTime = this.state.targetTime;
  switch (type) {
    case 'increase':
      this.setTimerState(targetTime + 60);
      break;
    case 'decrease':
      if (targetTime > 60) {
        this.setTimerState(targetTime - 60);
      } else if (targetTime <= 60 && targetTime > 0) {
        this.setTimerState(targetTime - 5);
      } else {
        this.setTimerState(0);
      }
      break;
    };
  }
  setTimerState(length) {
    this.setState({ 
      stopTime: length, 
      remainingTime: length, 
      targetTime: length 
    }); 
  }
  render(){
    let controlButtons = ['Pomodoro', 'Short Break', 'Long Break', 'Test Alarm'].map( (label, index) => {
      return <Button key={index} name={label} handleClick={this.setTimer} className="me-btn-alt"/>
    })
    return (
      <div>
        <div className="timer-mode">
          {controlButtons}
        </div>
        <div className="timer-display">
          <h2>{this.formattedTime(this.state.remainingTime)}</h2>
          {!this.state.running && this.state.remainingTime == this.state.targetTime
            ? ( <div className="timer-setLength">
              <button className="me-btn setLength-btn arrow-up" onClick={() => this.setLength('increase')}><i className="fa fa-arrow-up"></i></button>
              <button className="me-btn setLength-btn arrow-down" onClick={() => this.setLength('decrease')}><i className="fa fa-arrow-down"></i></button>
            </div> )
            : null
          }
        </div>
        <div className="timer-controller">
          {!this.state.running
            ? <Button name="Start" handleClick={this.clickStart.bind(this)} className="me-btn btn-start"/>
            : <Button name="Stop" handleClick={this.clickStop.bind(this)} className="me-btn btn-stop"/>
          }
          {!this.state.running && this.state.remainingTime !== this.state.targetTime
            ? <Button name="Reset" handleClick={this.clickReset.bind(this)} className="me-btn btn-reset"/>
            : null
          }
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('bngTimer'));
export default App;