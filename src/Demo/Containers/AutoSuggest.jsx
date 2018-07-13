import React from "react";
import AutoSuggest from "./../Components/AutoSuggest";
const getUrl =(id)=> `https://jsonplaceholder.typicode.com/comments?postId=${id}`;
class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id:"",options:[] };
    this.handleChange=this.handleChange.bind(this)
  }

  handleChange(id){
    this.setState({ options:[], id });
    fetch(getUrl(id))
      .then(resp => resp.json())
      .then(posts => {
        const options=posts.map(({id,name})=>({id,name}))
        this.setState({ options,id });
      });
  }
  render() {
    return <div>
        <AutoSuggest options={this.state.options} value={this.state.id} onChange={this.handleChange} />
      </div>;
  }
}
export default Container;
