const opToggleClassesOnWindowScroll = (() => {
  function setup() {
    const scrollClass = "op-y-scroll__class";
    const scrollOffset = "op-y-scroll__offset";
    const scrollChild = "op-y-scroll__child";
    const scrollCondition = "op-y-scroll__condition";
    const scrollConditionType = "op-y-scroll__cond-type";
    const every = "every"; // Default
    const some = "some";
    const getConditionResult = {
      [every]: getEveryConditionResult,
      [some]: getSomeConditionResult,
    };
    const targets = document.querySelectorAll(`[${scrollClass}]`);

    targets.forEach((target) => {
      const childrenAndClasses = getKeyValuePairs(target, scrollChild);
      addCustomAttributeToChildren(target, childrenAndClasses, scrollClass);
      const conditions = getKeyValuePairs(target, scrollCondition);

      if (conditions.length === 0) {
        addListenerOnScroll(scrollClass, scrollOffset);
        return;
      }
      const conditionType = getConditionType(
        target,
        scrollConditionType,
        every,
      );
      getConditionResult[conditionType](conditions) &&
        addListenerOnScroll(scrollClass, scrollOffset);
    });
  }

  //Helpers
  function addListenerOnScroll(scrollClass, scrollOffset) {
    let isActive = false;
    window.addEventListener("scroll", () => {
      const offset = getScrollOffset(target, scrollOffset);
      const passedOffset = window.scrollY > offset;

      if (passedOffset && !isActive) {
        activateNodeAndChildren(target, scrollClass);
        isActive = true;
      } else if (!passedOffset && isActive) {
        deactivateNodeAndChildren(target, scrollClass);
        isActive = false;
      }
    });
  }

  function getSomeConditionResult(conditions) {
    return conditions.some(([selector, className]) =>
      document
        .querySelectorAll(selector)
        .some((element) => element.classList.contains(className)),
    );
  }
  function getEveryConditionResult(conditions) {
    return conditions.every(([selector, className]) =>
      document
        .querySelectorAll(selector)
        .every((element) => element.classList.contains(className)),
    );
  }

  function getConditionType(target, scrollConditionType, defaultCondition) {
    return target.hasAttribute(scrollConditionType)
      ? target.getAttribute(scrollConditionType)
      : defaultCondition;
  }

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

  function getKeyValuePairs(parent, identifierAttr) {
    return Array.from(parent.attributes)
      .filter((attr) => attr.name.includes(identifierAttr))
      .map((attr) => attr.value.split(":").map((str) => str.trim()));
  }

  return setup;
})();

document.addEventListener("DOMContentLoaded", opToggleClassesOnWindowScroll);
