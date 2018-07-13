import React from 'react';

import Button from './Button';
const btnStyles = {
  // border: '1px #807c7c solid',
  background: 'white'
};

class Counter extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log('got new props', nextProps);
  }
  render() {
    const props = this.props;
    return (
      <div>
        Counter: <span>{props.value}</span>
        {props.showBtns ? (
          <Button onClick={props.minus} style={btnStyles}>
            🔥🎮🔥
          </Button>
        ) : null}
      </div>
    );
  }
}
export default Counter;
