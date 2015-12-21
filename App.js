import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

const POMODORO_TIMESET = 1500;
const LONG_BREAK = 600
const SHORT_BREAK = 300;
const TIMER_INTEVAL = 1000;
const TEST_ALARM = 3;

class App extends React.Component{
    constructor(){
        super();
        // Initial states
        this.state = {
            running: false,
            secondsElapsed: POMODORO_TIMESET,
            chosenTime: POMODORO_TIMESET
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
        this.setState({ secondsElapsed: this.state.secondsElapsed - 1 });
        document.title = `Pomodoro Timer (${this.formattedTime(this.state.secondsElapsed)})`; // Update document title based on elapsed second

        if (this.state.secondsElapsed !== 0) {
            this.timeout = setTimeout(this.countdown, 1000);
        } else {
            document.getElementById('bngAlarm').play(); // Trigger alarm sound when finish countdown
            clearTimeout(this.timeout); 
            this.setState({ 
                running: false,
                secondsElapsed: this.state.chosenTime // Reset time to chosen time
            });
        }
    }
    clickStart(){
        this.setState({ running: true}); 
        this.timeout = this.countdown();
    }
    clickStop(){
        this.setState({ running: false });
        clearTimeout(this.timeout);
    }
    clickReset(){
        this.setState({ secondsElapsed: this.state.chosenTime });
    }
    setTimer(evt){
        let type = evt.target.getAttribute("name");
        switch(type){
            case "Pomodoro": this.setState({ secondsElapsed: POMODORO_TIMESET, chosenTime: POMODORO_TIMESET }); break;
            case "Short Break": this.setState({ secondsElapsed: SHORT_BREAK, chosenTime: SHORT_BREAK }); break;
            case "Long Break": this.setState({ secondsElapsed: LONG_BREAK, chosenTime: LONG_BREAK }); break;
            case "Test Alarm": this.setState({ secondsElapsed: TEST_ALARM, chosenTime: TEST_ALARM }); break;
        }
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
                <h2>{this.formattedTime(this.state.secondsElapsed)}</h2>
                <div className="timer-controller">
                    {!this.state.running
                        ? <Button name="Start" handleClick={this.clickStart.bind(this)} className="me-btn btn-start"/>
                        : <Button name="Stop" handleClick={this.clickStop.bind(this)} className="me-btn btn-stop"/>
                    }
                    {!this.state.running && this.state.secondsElapsed !== this.state.chosenTime
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