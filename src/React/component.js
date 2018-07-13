class Component {
  constructor(props) {
    this.props = props;
  }
  componentWillMount() {}
  componentDidMount() {}
  shouldComponentUpdate() {
    return true;
  }
  componentWillUpdate() {}
  componentDidUpdate() {}
  componentWillReceiveProps(props) {}
  componentWillUnmount() {}
  setState(partialNextState) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        this.$$setState(Object.assign({}, this.state, partialNextState));
      });
    } else {
      this.$$setState(Object.assign({}, this.state, partialNextState));
    }
  }
}
export default Component;
