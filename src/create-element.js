import { TEXT_NODE } from "./utils";
export const createElement = (type, props, ..._children) => {
  if (props === null) props = {};
  const children = []
    .concat(..._children)
    .filter(c => c)
    .map((c, i) => {
      if (typeof c !== "object") {
        return { type: TEXT_NODE, props: { value: c } };
      }
      return c;
    });
  if (typeof type === "object" && !(type instanceof Function)) {
    return {
      type: type.type,
      props: type.props,
      children: type.children
    };
  }
  return { type, props, children };
};
