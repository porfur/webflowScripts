document.addEventListener("DOMContentLoaded", setupClassToggle);

function addCustomAttributeToNodes(nodes, attrName, attrValue) {
  nodes.forEach((node) => node.setAttribute(attrName, attrValue));
}
function addCustomAttributeToChildren(parent,tupleArr,attrName){
    tupleArr.forEach(([selector, className]) => {
      const childNodes= parent.querySelectorAll(selector);
      addCustomAttributeToNodes(childNodes, attrName, className);
    });
}
function getChildrenToggleClasses(parent, identifierAttr) {
  Array.from(parent.attributes)
    .filter((attr) => attr.name.includes(identifierAttr))
    .map((attr) => attr.value.split(":").map((str) => str.trim()));
}
function getEventNames(parent, identifierAttr) {
  return parent
    .getAttribute(identifierAttr)
    .split(",")
    .map((ev) => ev.trim());
}

function setupClassToggle() {
  const toggleTarget = "op-toggle__target-selector";
  const toggleClass = "op-toggle__class";
  const toggleEvents = "op-toggle__events";
  const toggleChild = "op-toggle__child";
  const toggleOptionCloseOthers = "op-toggle__opt--close-others";
  const toggleOptionCloseOnSecondEvent =
    "op-toggle__opt--close-on-second-event";

  const parents = document.querySelectorAll(
    `[${toggleTarget}][${toggleEvents}][${toggleClass}]`,
  );

  parents.forEach((parent) => {
    const shouldCloseOthers =
      parent.getAttribute(toggleOptionCloseOthers) !== null;
    const shouldCloseOnSecondEvent =
      parent.getAttribute(toggleOptionCloseOnSecondEvent) !== null;

    const targetSelector = parent.getAttribute(toggleTarget);
    const targetToggleClass = parent.getAttribute(toggleClass);
    const eventNames = getEventNames(parent, toggleEvents);
    const targets = parent.querySelectorAll(targetSelector);
    const childToggleClasses = getChildrenToggleClasses(parent, toggleChild);

    addCustomAttributeToNodes(targets, toggleClass, targetToggleClass);
    addCustomAttributeToChildren(parent, childToggleClasses, toggleClass);

    let currentTarget;
    targets.forEach((target) => {
      currentTarget = target.classList.contains(
        parent.getAttribute(toggleClass),
      )
        ? target
        : null;

      eventNames.forEach((eventName) => {
        target.addEventListener(eventName, (e) => {
          currentTarget = e.currentTarget;
          const className = currentTarget.getAttribute(toggleClass);
          currentTarget.classList.add(className);
          currentTarget
            .querySelectorAll(`[${toggleClass}]`)
            .forEach((child) =>
              child.classList.add(child.getAttribute(toggleClass)),
            );
          if (shouldCloseOnSecondEvent) {
            const shouldClose =
              target.getAttribute(toggleOptionCloseOnSecondEvent) !== null;
            if (shouldClose) {
              target.classList.remove(target.getAttribute(toggleClass));
              target
                .querySelectorAll(`[${toggleClass}]`)
                .forEach((child) =>
                  child.classList.remove(child.getAttribute(toggleClass)),
                );
              target.removeAttribute(toggleOptionCloseOnSecondEvent, "");
            } else target.setAttribute(toggleOptionCloseOnSecondEvent, "");
          }

          targets.forEach((__target) => {
            if (shouldCloseOthers && __target !== currentTarget) {
              __target.removeAttribute(toggleOptionCloseOnSecondEvent, "");
              __target.classList.remove(__target.getAttribute(toggleClass));
              __target
                .querySelectorAll(`[${toggleClass}]`)
                .forEach((child) =>
                  child.classList.remove(child.getAttribute(toggleClass)),
                );
            }
          });
        });
      });
    });
  });
}
