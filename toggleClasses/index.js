const opToggleClasses = (() => {
  function setup() {
    const toggleTarget = "op-toggle__target-selector";
    const toggleClass = "op-toggle__class";
    const toggleEvents = "op-toggle__events";
    const toggleChild = "op-toggle__child";
    const toggleOptionCloseOthers = "op-toggle__opt--close-others";
    const toggleOptionCloseOnSecondEvent = "op-toggle__opt--close-on-second-event";

    const parents = document.querySelectorAll(
      `[${toggleTarget}][${toggleEvents}][${toggleClass}]`
    );

    parents.forEach((parent) => {
      const shouldCloseOthers = parent.getAttribute(toggleOptionCloseOthers) !== null;
      const shouldCloseOnSecondEvent = parent.getAttribute(toggleOptionCloseOnSecondEvent) !== null;

      const targetSelector = parent.getAttribute(toggleTarget);
      const targetToggleClass = parent.getAttribute(toggleClass);
      const eventNames = getEventNames(parent, toggleEvents);
      const targets = parent.querySelectorAll(targetSelector);
      const childToggleClasses = getChildrenToggleClasses(parent, toggleChild);

      addCustomAttributeToNodes(targets, toggleClass, targetToggleClass);
      addCustomAttributeToChildren(parent, childToggleClasses, toggleClass);

      let activeNode;
      targets.forEach((target) => {
        activeNode = target.classList.contains(parent.getAttribute(toggleClass))
          ? target
          : null;

        eventNames.forEach((eventName) => {
          target.addEventListener(eventName, (e) => {
            //Handle the behavior of the clicked target
            activeNode = e.currentTarget;
            activateNodeAndChildren(activeNode, toggleClass);

            //Handles the behavior of the non clicked targets
            targets.forEach((__target) => {
              if (shouldCloseOthers && __target !== activeNode) {
                deactivateNodeAndChildren(__target, toggleClass);
                resetSecondEventTracker(
                  shouldCloseOnSecondEvent,
                  __target,
                  toggleOptionCloseOnSecondEvent
                );
              }
            });

            //Handle close on 2nd click
            if (shouldCloseOnSecondEvent) {
              handleOnSecondEvent(
                target,
                toggleClass,
                toggleOptionCloseOnSecondEvent
              );
            }
          });
        });
      });
    });
  }

  //Helpers
  function handleOnSecondEvent(node, attrName, secondEventAttrName) {
    const shouldClose = node.getAttribute(secondEventAttrName) !== null;
    if (shouldClose) {
      deactivateNodeAndChildren(node, attrName);
      node.removeAttribute(secondEventAttrName, "");
    } else {
      node.setAttribute(secondEventAttrName, "");
    }
  }
  function resetSecondEventTracker(condition, targetNode, attrName) {
    condition && targetNode.removeAttribute(attrName, "");
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

  function getChildrenToggleClasses(parent, identifierAttr) {
    return Array.from(parent.attributes)
      .filter((attr) => attr.name.includes(identifierAttr))
      .map((attr) => attr.value.split(":").map((str) => str.trim()));
  }

  function getEventNames(parent, identifierAttr) {
    return parent
      .getAttribute(identifierAttr)
      .split(",")
      .map((ev) => ev.trim());
  }

  return setup;
})();

document.addEventListener("DOMContentLoaded", opToggleClasses);
