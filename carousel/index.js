const collectionList = document.querySelector(".home__wall-of-love__cms-list");
const collectionWrap = collectionList.parentElement;
let children = Array.from(collectionList.children);
const observer = new IntersectionObserver(intersectionCallback, {
  root: collectionWrap,
  threshold:0,
  rootMargin:"10%"
});
let leftPosition = getLeftPosition(collectionList);
let isFirstRun = true;

observeCollection()

function observeCollection(){
  children.forEach((column) => observer.unobserve(column));
  children.forEach((column) => observer.observe(column));
}

function intersectionCallback(entries) {
  const lastIndex = entries.length - 1;
  const updatedLeftPosition = getLeftPosition(collectionList);
  const isPositiveScroll = updatedLeftPosition > leftPosition;
  leftPosition = updatedLeftPosition;

  entries.forEach((entry, i) => {
    if (entry.isIntersecting) return;

    if (isFirstRun) {
      scrollLeft(i === 0, entry);
      scrollRight(i === lastIndex, entry);
      return;
    }
    scrollLeft(!isPositiveScroll, entry);
    scrollRight(isPositiveScroll, entry);
  });
  isFirstRun = false;
}

function getLeftPosition(collectionList) {
  return collectionList.getBoundingClientRect().left;
}

function scrollLeft(condition, entry) {
  if (condition) {
    collectionList.append(collectionList.firstChild);
    collectionWrap.scrollLeft -= entry.boundingClientRect.width;
  }
}

function scrollRight(condition, entry) {
  if (condition) {
    collectionList.prepend(collectionList.lastChild);
    collectionWrap.scrollLeft += entry.boundingClientRect.width;
  }
}

// On resize
let childrenLen = children.length;
window.addEventListener('resize',onResize)
function onResize() {
  setTimeout(() => {
    const newChildrenLen = collectionList.children.length;
    if (newChildrenLen !== childrenLen) {
      childrenLen = newChildrenLen;
      children=Array.from(collectionList.children)
      observeCollection()
    }
  }, 100);
}

// Scroll animation

const fps = 60;
const interval = 1000 / fps;
let prevTimeStamp;
let animationID = requestAnimationFrame(animationCallback);
let then = 0;

function animationStep(now, fn) {
  const delta = now - then;
  if (delta > interval) {
    fn();
  }
  then = now - (delta % interval);
  animationID = requestAnimationFrame(animationCallback);
}

function scrollCollection() {
  collectionWrap.scrollLeft += 1;
}

function animationCallback(timestamp) {
  animationStep(timestamp, scrollCollection);
}

// Pause/resume animation on mouse enter/leave
collectionWrap.addEventListener("mouseenter",(e)=>{
  e.preventDefault()
  cancelAnimationFrame(animationID)
})
collectionWrap.addEventListener("mouseleave",(e)=>{
  e.preventDefault()
animationID = requestAnimationFrame(animationCallback);
})

