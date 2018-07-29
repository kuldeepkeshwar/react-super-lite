import { TEXT_NODE, PATCH_TYPE } from "./utils";
import Component from "./component";

function generateKey(vnode,props){
  return vnode.props.key || props.key || props.$$key || "$$root_";
}
function addAttribute(el, props) {
  el.$$eventHandlers = el.$$eventHandlers || {};
  Object.keys(el.$$eventHandlers).forEach(eventName =>
    el.removeEventListener(eventName, el.$$eventHandlers[eventName])
  );
  for (const attr of el.attributes) el.removeAttribute(attr.name);
  Object.keys(props).forEach(k => {
    if (k.startsWith("on")) {
      const eventName = k.substring(2).toLowerCase();
      el.$$eventHandlers[eventName] = props[k];
      el.addEventListener(eventName, props[k]);
    } else {
      if (k === "$$key") {
        el.$$key = props[k];
      } else if (k === "style") {
        requestAnimationFrame(() => {
          Object.assign(el.style, props[k]);
        });
      } else if (k === "ref") {
        props[k](el);
      } else {
        el.setAttribute(k, props[k]);
      }
    }
  });
}
function renderTextNode(props, parent) {
  const el = document.createTextNode(props.value);
  el.$$key = props.$$key;
  parent && parent.appendChild(el);
  return el;
}
function renderChildren(_children, parent) {
  return [..._children].map((c, i) => {
    const { type, props = {}, children = [] } = c;
    props.$$key = props.key || `$$_${i}`;
    return render({ type, props, children }, parent);
  });
}
function renderElement(type, props, children, parent) {
  const el = document.createElement(type);
  addAttribute(el, props);
  renderChildren(children, el);
  if (parent) parent.appendChild(el);
  return el;
}

function renderComponent(type, _props, _children, parent) {
  const instance = new type({ ..._props, children: _children });
  let vnode = null,el = null;
  if (instance instanceof Component) {
    instance.componentWillMount();
    vnode = instance.render();
    vnode.props.$$key = generateKey(vnode, _props);
    el = render(vnode, parent);
    instance.componentDidMount();
    el.$$instance = instance;
    instance.$$setState = state => 
      patchSameComponent(el, instance, parent, PATCH_TYPE.STATE, _props, _children, state);  
  } else {
    vnode = instance;
    vnode.props.$$key = generateKey(vnode, _props);
    el = render(vnode, parent);
  }
  return el;
}
export function render(vnode, parent) {
  const { type, props = {}, children = [] } = vnode;
  if (type instanceof Function) {
    return renderComponent(type, props, children, parent);
  } else {
    return type === TEXT_NODE?renderTextNode(props, parent):renderElement(type, props, children, parent); 
  }
}
function patchTextNode(el, props) {
  if (el.textContent !== props.value) {
    el.textContent = props.value;
  }
}
function patchSameComponent(el,instance,parent,patchType,_props,_children,nextState) {
  if (patchType === PATCH_TYPE.STATE) {
    if (!instance.shouldComponentUpdate(instance.props, nextState)) {
      return;
    }
    instance.state = nextState;
  } else {
    const nextProps ={ ..._props, children: _children };
    instance.componentWillReceiveProps(nextProps);
    if (!instance.shouldComponentUpdate(nextProps, instance.state)) {
      return;
    }
    instance.props = { ...nextProps };
  }
  instance.componentWillUpdate();
  const vnode = instance.render();
  vnode.props.$$key = generateKey(vnode, _props);;
  patch(el, vnode, parent);
  instance.componentDidUpdate();
}
function patchComponent(el, _type, _props, _children, parent) {
  const instance = el.$$instance;
  if (el.$$instance instanceof _type) {
    patchSameComponent(el, instance, parent, PATCH_TYPE.PROPS, _props, _children,null);
  } else {
    el.$$instance && el.$$instance.componentWillUnmount();
    const nextel = renderComponent(_type, _props, _children);
    parent.replaceChild(nextel, el);
  }
}
function patchElement(el, type, props, children, parent) {
  if (el.nodeName === type.toUpperCase()) {
    addAttribute(el, props);
    const cache = {};
    // [...children].forEach((c, i) => (c.props.$$key = c.props.key || `$$_${i}`));
    el.childNodes.forEach(c => (cache[c.$$key] = c));
    [...children].forEach((c, i) => {
      c.props.$$key = c.props.key || `$$_${i}`;
      if (cache[c.props.$$key]) {
        if (el.childNodes[i].$$key !== c.props.$$key) {
          el.insertBefore(cache[c.props.$$key], el.childNodes[i]);
        }
        patch(cache[c.props.$$key], c, el);
      } else {
        render(c, el);
      }
      cache[c.props.$$key] = null;
    });
    Object.keys(cache).forEach(k => {
      if (cache[k]) {
        cache[k].$$instance && cache[k].$$instance.componentWillUnmount();
        el.removeChild(cache[k]);
      }
    });
  } else {
    el.$$instance && el.$$instance.componentWillUnmount();
    const nextel = render({ type, props, children });
    parent.replaceChild(nextel, el);
  }
}
function patch(el, vnode, parent = el.parentNode) {
  const { type, props = {}, children = [] } = vnode; 
    if (type instanceof Function) {
      patchComponent(el, type, props, children, parent);
    } else {
      if (type === TEXT_NODE && el.nodeName === type) {
        patchTextNode(el, props);
      } else {
        patchElement(el, type, props, children, parent);
      }
    } 
}
