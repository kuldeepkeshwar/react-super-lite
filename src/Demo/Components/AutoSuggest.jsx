import React from "react";
const listStyle={
    display: 'flex',
    flexDirection: 'column',
}
const listWapperStyle = {
    borderTop: "1px #D6D8D3 solid"
};
const styles = {
  boxShadow: "1px 1px 1px 1px #D6D8D3",
  width:'400px',
  display: "flex",
  flexDirection: "column"
};
const inputStyle = {
  outline: "none",
  border: "0px",
  height: "20px"
};
const labelContainerStyle = {
  display: "flex",
  flexDirection: "column"
};
function onMouseOver(){
    this.style.background = "#D6D8D3";
}

function onMouseOut() {
  this.style.background = "white";
}
class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleKeyUp(e) {
    const value = e.target.value;
    this.props.onChange(value)
  }
  render() {
      const {options,value}= this.props;
    return <div style={options.length ? styles : {}}>
        <div style={options.length ? labelContainerStyle : styles}>
          <label>Search Users:</label>
          <input style={inputStyle} type="text" value={value} onChange={this.handleChange} onKeyUp={this.handleKeyUp} />
        </div>
        <div style={listWapperStyle}>
          {options.length ? <div style={listStyle}>
              {options.map((o, i) => {
                return <div id={o.id} key={i} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
                    {o.name}
                  </div>;
              })}
            </div> : null}
        </div>
      </div>;
  }
}
export default AutoSuggest;
