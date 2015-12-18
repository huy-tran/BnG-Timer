import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

var App = React.createClass({
    getInitialState: function(){
        return {
            running: false,
            secondsElapsed: 1500,
            choosenTime: 1500
        };
    },
    formattedTime: function(sec){
        var seconds = ('0' + sec % 60).slice(-2);
        var minutes = Math.floor(sec / 60);
        return (minutes + ":" + seconds);
    },
    clickStart: function(){
        this.setState({ running: true });
        this.interval = setInterval(function(){
            this.setState({ secondsElapsed: this.state.secondsElapsed - 1 });
            document.title = "Pomodoro Timer (" +  this.formattedTime(this.state.secondsElapsed) + ")";
            if (this.state.secondsElapsed == 0) {
                document.getElementById('bngAlarm').play();
                clearInterval(this.interval);
                this.setState({ 
                    running: false,
                    secondsElapsed: this.state.choosenTime 
                });
            }
        }.bind(this), 1000);
    },
    clickStop: function(){
        this.setState({ running: false });
        clearInterval(this.interval);
    },
    clickReset: function(){
        this.setState({ secondsElapsed: this.state.choosenTime });
    },
    setTimer: function(evt){
        var type = evt.target.getAttribute("name");
        switch(type){
            case "Pomodoro": this.setState({ secondsElapsed: 1500, choosenTime: 1500 }); break;
            case "Short Break": this.setState({ secondsElapsed: 300, choosenTime: 300 }); break;
            case "Long Break": this.setState({ secondsElapsed: 600, choosenTime: 600 }); break;
        }
    },
    render: function(){
        return (
            <div>
                <div className="timer-mode">
                    <Button name="Pomodoro" handleClick={this.setTimer} className="me-btn-alt"/>
                    <Button name="Short Break" handleClick={this.setTimer} className="me-btn-alt"/>
                    <Button name="Long Break" handleClick={this.setTimer} className="me-btn-alt"/>
                </div>
                <h2>{this.formattedTime(this.state.secondsElapsed)}</h2>
                <div className="timer-controller">
                    {!this.state.running
                        ? <Button name="Start" handleClick={this.clickStart} className="me-btn btn-start"/>
                        : <Button name="Stop" handleClick={this.clickStop} className="me-btn btn-stop"/>
                    }
                    {!this.state.running && this.state.secondsElapsed !== this.state.choosenTime
                        ? <Button name="Reset" handleClick={this.clickReset} className="me-btn btn-reset"/>
                        : null
                    }
                </div>
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('bngTimer'));
export default App;