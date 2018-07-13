import React from 'react';

import Button from './Button';
const btnStyle = {
  background: '##227a9e',
  color: 'white'
};
const styles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
};
export default ({ reset, won }) => (
  <div style={styles}>
    {won ? <div>You won 🌟💰🏆🌟</div> : <div>You lost ☹</div>}
    <Button style={btnStyle} onClick={reset}>
      Play Again
    </Button>
  </div>
);
