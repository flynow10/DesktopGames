import { createVNode, render } from "vue";

export default function renderComponent({
  el,
  component,
  props,
  appContext,
}: any) {
  let vnode = createVNode(component, props);
  vnode.appContext = { ...appContext }; // must spread new object here
  render(vnode, el);

  return {
    close: () => {
      // destroy component
      render(null, el);
      vnode = undefined;
    },
    node: vnode,
  };
}
