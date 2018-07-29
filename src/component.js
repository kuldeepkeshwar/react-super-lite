class Component {
  constructor(props) {
    this.props = props;
    this.$$commits=[];
    this.$$running=false;
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
      this.$$commits.push(partialNextState);
      if (!this.$$running){
        this.$$running = true; 
        window.requestIdleCallback((deadline) => {
          const nextState=Object.assign.apply(null, [
            {},
            this.state,
            ...this.$$commits
          ]);
          this.$$setState(nextState, deadline);
          this.$$commits.length=0;
          this.$$running = false;
        });
      } 
    } else {
      this.$$setState(Object.assign({}, this.state, partialNextState));
    }
  }
}
export default Component;
