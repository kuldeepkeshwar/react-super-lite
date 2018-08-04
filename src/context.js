import Component from "./component";
import { createElement } from "./create-element";

const React = {
  createElement
};
function createContext(defaultValue) {
  let value = null;
  let listeners = [];
  class Consumer extends Component {
    constructor(props) {
      super(props);
      this.state = { value };
    }
    componentDidMount() {
      listeners.push(value => {
        this.setState({ value });
      });
    }
    shouldComponentUpdate(nextProps) {
      return nextProps.value !== defaultValue;
    }
    render() {
      return <div>
          {this.props.children[0](this.state.value || defaultValue)}
        </div>;
    }
  }
  class Provider extends Component {
    componentDidMount() {
      value = this.props.value;
    }
    componentWillReceiveProps(nextProps) {
      debugger;
      if (nextProps.value !== this.props.value) {
        listeners.forEach(listener => listener(nextProps.value));
      }
    }
    shouldComponentUpdate(nextProps) {
      return false;
    }
    render() {
      return <div>{this.props.children}</div>;
    }
  }
  return { Provider, Consumer };
}
export default createContext;
