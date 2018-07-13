import { TEXT_NODE, PATCH_TYPE } from './utils';
import Component from './component';

function addAttribute(el, props) {
  el.$$eventHandlers = el.$$eventHandlers || {};
  Object.keys(el.$$eventHandlers).forEach(eventName =>
    el.removeEventListener(eventName, el.$$eventHandlers[eventName])
  );
  for (const attr of el.attributes) el.removeAttribute(attr.name);
  Object.keys(props).forEach(key => {
    if (key.startsWith('on')) {
      const eventName = key.substring(2).toLowerCase();
      el.$$eventHandlers[eventName] = props[key];
      el.addEventListener(eventName, props[key]);
    } else {
      if (key === 'key') {
        el.key = props[key];
      } else if (key === 'style') {
        Object.assign(el.style, props[key]);
      } else if (key === 'ref') {
        props[key](el);
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  });
}
function renderTextNode(props, parent) {
  const el = document.createTextNode(props.value);
  el.key = props.key;
  parent && parent.appendChild(el);
  return el;
}
function renderChildren(_children, parent) {
  return [..._children].map((c, i) => {
    const { type, props = {}, children = [] } = c;
    props.key = props.key || `$$_${i}`;
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
  let vnode = null,
    el = null;
  if (instance instanceof Component) {
    instance.componentWillMount();
    vnode = instance.render();
    vnode.props.key = vnode.props.key || _props.key || '$$root_';
    el = render(vnode, parent);
    instance.componentDidMount();
    el.$$instance = instance;
    instance.$$setState = state => {
      patchSameComponent(
        el,
        instance,
        parent,
        PATCH_TYPE.STATE,
        _props,
        _children,
        state
      );
    };
  } else {
    vnode = instance;
    vnode.props.key = vnode.props.key || _props.key || '$$root_';
    el = render(vnode, parent);
  }
  return el;
}
export function render(vnode, parent) {
  const { type, props = {}, children = [] } = vnode;
  if (type === TEXT_NODE) {
    return renderTextNode(props, parent);
  } else {
    if (type instanceof Function) {
      return renderComponent(type, props, children, parent);
    } else {
      return renderElement(type, props, children, parent);
    }
  }
}
function patchTextNode(el, props) {
  if (el.textContent !== props.value) {
    el.textContent = props.value;
  }
}
function patchSameComponent(
  el,
  instance,
  parent,
  patchType,
  _props,
  _children,
  state
) {
  if (patchType === PATCH_TYPE.STATE) {
    instance.state = state;
  } else {
    instance.componentWillReceiveProps(_props);
    instance.props = { ..._props, children: _children };
  }
  if (!instance.shouldComponentUpdate()) {
    return;
  }
  instance.componentWillUpdate();
  const { type, props = {}, children = [] } = instance.render();
  props.key = props.key || _props.key || '$$root_';
  patch(el, { type, props, children }, parent);
  instance.componentDidUpdate();
}
function patchComponent(el, _type, _props, _children, parent) {
  const instance = el.$$instance;
  if (el.$$instance instanceof _type) {
    patchSameComponent(
      el,
      instance,
      parent,
      PATCH_TYPE.PROPS,
      _props,
      _children
    );
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
    [...children].forEach((c, i) => (c.props.key = c.props.key || `$$_${i}`));
    el.childNodes.forEach(c => (cache[c.key] = c));
    [...children].forEach(c => {
      if (cache[c.props.key]) {
        patch(cache[c.props.key], c, el);
      } else {
        render(c, el);
      }
      cache[c.props.key] = null;
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
  if (type === TEXT_NODE && el.nodeName === type) {
    patchTextNode(el, props);
  } else {
    if (type instanceof Function) {
      patchComponent(el, type, props, children, parent);
    } else {
      patchElement(el, type, props, children, parent);
    }
  }
}
