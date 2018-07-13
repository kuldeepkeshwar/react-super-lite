import React from 'react';
import Counter from './../Components/Counter';
import Result from "./../Components/Result";
import Button from "./../Components/Button";

const winCondition = 10;
const STATE = {
  INIT: 'INIT',
  RUNNING: 'RUNNING',
  PAUSE: 'PAUSE',
  STOPPED: 'STOPPED'
};
const pauseBtnStyle = {
  fontSize: '17px',
  fontWeight: 'bold',
  fontStretch: 'extra-expanded'
};
const actionBarStyles = {
  display: 'flex',
  justifyContent: 'space-around'
};
const actionBtnStyle = {
  border: '1px black solid',
  background: 'white'
};
const styles = {
  display: 'flex',
  height: '10rem',
  fontSize: '2rem',
  color: 'black',
  justifyContent: 'center',
  alignItems: 'center'
};
class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: winCondition + 1,
      currentState: STATE.INIT
    };
    this.cancelId = null;
    this.minus = this.minus.bind(this);
    this.init = this.init.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
  }
  updateCounter(counter) {
    this.setState({
      counter: counter
    });
    if (counter <= winCondition) {
      this.stop();
    }
  }
  minus() {
    this.updateCounter(this.state.counter - 1);
  }
  init() {
    this.setState({
      counter: winCondition + 1,
      currentState: STATE.INIT
    });
  }
  resume() {
    this.setState({
      currentState: STATE.RUNNING
    });
    this.cancelId = setInterval(() => {
      this.updateCounter(this.state.counter + 1);
    }, 250);
  }
  pause() {
    this.setState({
      currentState: STATE.PAUSE
    });
    this.cleanUp();
  }
  stop() {
    this.setState({
      currentState: STATE.STOPPED
    });
    this.cleanUp();
  }
  cleanUp() {
    this.cancelId && clearInterval(this.cancelId);
    this.cancelId = null;
  }
  componentWillUnmount() {
    this.cleanUp();
  }

  render() {
    return (
      <div>
        <div style={styles}>
          {this.state.currentState === STATE.STOPPED ? (
            <Result
              won={this.state.counter <= winCondition}
              reset={this.init}
            />
          ) : (
            <div>
              <div style={actionBarStyles}>
                {this.state.currentState === STATE.INIT ||
                this.state.currentState === STATE.STOPPED ? (
                  <div>
                    <Button style={actionBtnStyle} onClick={this.resume}>
                      Start
                    </Button>
                  </div>
                ) : (
                  <div>
                    {this.state.currentState === STATE.RUNNING ? (
                      <Button style={actionBtnStyle} onClick={this.pause}>
                        <span style={pauseBtnStyle}>|</span>
                        <span style={pauseBtnStyle}>|</span>
                      </Button>
                    ) : (
                      <Button style={actionBtnStyle} onClick={this.resume}>
                        ▶
                      </Button>
                    )}
                    <Button style={actionBtnStyle} onClick={this.stop}>
                      🛑
                    </Button>
                  </div>
                )}
              </div>
              <Counter
                showBtns={this.state.currentState !== STATE.INIT}
                minus={this.minus}
                value={this.state.counter}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Container;
