const opToggleClassesOnWindowScroll = (() => {
  function setup() {
    const scrollClass = "op-y-scroll__class";
    const scrollOffset = "op-y-scroll__offset";
    const scrollChild = "op-y-scroll__child";
    const targets = document.querySelectorAll(`[${scrollClass}]`);

    targets.forEach((target) => {
      const childrenAndClasses = getChildrenAndClasses(target, scrollChild);

      addCustomAttributeToChildren(target, childrenAndClasses, scrollClass);

      let isActive = false;
      window.addEventListener("scroll", () => {
        const offset = getScrollOffset(target, scrollOffset);
        const passedOffset = window.scrollY > offset;

        if (passedOffset && !isActive) {
          activateNodeAndChildren(target, scrollClass);
          isActive=true
        } else if (!passedOffset && isActive) {
          deactivateNodeAndChildren(target, scrollClass);
          isActive = false;
        }
      });
    });
  }

  //Helpers
  function getScrollOffset(parentNode, scrollOffset) {
    let targetOffset = parseInt(parentNode.getAttribute(scrollOffset));
    return isNaN(targetOffset) ? 0 : targetOffset;
  }

  function activateNodeAndChildren(parentNode, attrName) {
    parentNode.classList.add(parentNode.getAttribute(attrName));
    parentNode
      .querySelectorAll(`[${attrName}]`)
      .forEach((child) => child.classList.add(child.getAttribute(attrName)));
  }

  function deactivateNodeAndChildren(parentNode, attrName) {
    parentNode.classList.remove(parentNode.getAttribute(attrName));
    parentNode
      .querySelectorAll(`[${attrName}]`)
      .forEach((child) => child.classList.remove(child.getAttribute(attrName)));
  }

  function addCustomAttributeToNodes(nodes, attrName, attrValue) {
    nodes.forEach((node) => node.setAttribute(attrName, attrValue));
  }

  function addCustomAttributeToChildren(parent, tupleArr, attrName) {
    tupleArr.forEach(([selector, className]) => {
      const childNodes = parent.querySelectorAll(selector);
      addCustomAttributeToNodes(childNodes, attrName, className);
    });
  }

  function getChildrenAndClasses(parent, identifierAttr) {
    return Array.from(parent.attributes)
      .filter((attr) => attr.name.includes(identifierAttr))
      .map((attr) => attr.value.split(":").map((str) => str.trim()));
  }

  return setup;
})();

document.addEventListener("DOMContentLoaded", opToggleClassesOnWindowScroll);
