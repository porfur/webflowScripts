document.addEventListener('DOMContentLoaded'setupClassToggle)
function setupClassToggle() {
  const toggleTarget = "op-toggle-target-selector";
  const toggleEvents = "op-toggle-events";
  const toggleClass = "op-toggle-class";
  const toggleChildren = "op-toggle-child-";

  const parents = document.querySelectorAll(
    `[${toggleTarget}][${toggleEvents}][${toggleClass}]`,
  );

  parents.forEach((parent) => {
    const targetSelector = parent.getAttribute(toggleTarget);
    const eventNames = parent
      .getAttribute(toggleEvents)
      .split(",")
      .map((ev) => ev.trim());

    const targets = parent.querySelectorAll(targetSelector);
    const childToggleClasses = Array.from(parent.attributes)
      .filter((attr) => attr.name.includes(toggleChildren))
      .map((attr) => attr.value.split(":").map((str) => str.trim()));

    childToggleClasses.forEach(([selector, className]) => {
      parent
        .querySelectorAll(selector)
        .forEach((child) => child.setAttribute(toggleClass, className));
    });

    targets.forEach((targetNode) =>
      targetNode.setAttribute(toggleClass, parent.getAttribute(toggleClass)),
    );

    targets.forEach((target) => {
      eventNames.forEach((eventName) => {
        target.addEventListener(eventName, (e) => {
          targets.forEach((__target) => {
            if (e.currentTarget !== __target) {
              e.currentTarget.classList.add(
                e.currentTarget.getAttribute(toggleClass),
              );
              __target.classList.remove(__target.getAttribute(toggleClass));

              e.currentTarget
                .querySelectorAll(`[${toggleClass}]`)
                .forEach((child) =>
                  child.classList.add(child.getAttribute(toggleClass)),
                );
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
