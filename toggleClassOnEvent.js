const toggleTarget = "op-toggle-target-selector";
const toggleEvents = "op-toggle-events";
const toggleClass = "op-toggle-class";
const toggleChildren = "op-toggle-child-";

const parents = document.querySelectorAll(
  `[${toggleTarget}][${toggleEvents}][${toggleClass}]`,
);

parents.forEach((parent) => {
  const targetSelector = parent.getAttribute(toggleTarget);
  const targets = parent.querySelectorAll(targetSelector);
  const className = parent.getAttribute(toggleClass);
  const eventNames = parent
    .getAttribute(toggleEvents)
    .split(",")
    .map((ev) => ev.trim());

  const childToggleClasses = Array.from(parent.attributes)
    .filter((attr) => attr.name.includes(toggleChildren))
    .map((attr) => attr.value.split(":").map((str) => str.trim()));

  targets.forEach((target) => {
    eventNames.forEach((eventName) => {
      target.addEventListener(eventName, (e) => {
        targets.forEach((__target) => {
          if (e.currentTarget !== __target) {
            e.currentTarget.classList.add(className);
            __target.classList.remove(className);
          }
        });
      });
    });
  });
});

//_____________________________________
const openSpine = "open-spine";
const spines = Array.from(document.querySelectorAll(".spine"));

spines.forEach((spine) => {
  spine.addEventListener("click", (e) => {
    const currentTarget = e.currentTarget;
    const currentLever = currentTarget.querySelector(".pg-title__lever");
    spines.forEach((_spine) => {
      const lever = _spine.querySelector(".pg-title__lever");
      if (currentTarget !== _spine) {
        currentTarget.classList.add(openSpine);
        currentLever.classList.add(openSpine);
        _spine.classList.remove(openSpine);
        lever.classList.remove(openSpine);
      }
    });
  });
});
