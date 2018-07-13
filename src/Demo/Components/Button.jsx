import React from 'react';
const baseStyles = {
  outline: 'none',
  fontSize: '1rem',
  margin: '1rem',
  border: '0px',
  backgroundColor: 'skyblue',
  height: '2rem',
  minWidth: '5rem',
  cursor: 'pointer'
};
export default props => {
  const { style, children, ...rest } = props;
  const styles = { ...baseStyles, ...style };
  return (
    <button style={styles} {...rest}>
      {children}
    </button>
  );
};
