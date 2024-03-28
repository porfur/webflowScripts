const opMasonry = (() => {
  const attr = {
    root: "op-masonry__root", //Add this as attribute to collection wrap, set value to some unique ID
    template: "op-masonry__col-template-for", // Optional
    columnCssVariable: "op-masonry__col-css-var", // The css var name
    rowCssVariable: "op-masonry__row-css-var", // The css var name
    delay: "op-masonry__delay", //defaults to 100ms
    child: "op-masonry__child-selector",
    smartStack: "op-masonry__smart-stack",
    lazy: "op-masonry__lazy",
  };
  function init() {
    const roots = document.querySelectorAll(`[${attr.root}]`);
    applyMasonryToAllRoots(roots);
  }

  // [[ Global helpers ]]
  function applyMasonryToAllRoots(roots) {
    const rootsLength = roots.length;
    for (let i = 0; i < rootsLength; i++) {
      const root = roots[i];
      applyMasonryToSingleRoot(root);
    }
  }

  function applyMasonryToSingleRoot(root) {
    const childSelector = root.getAttribute(attr.child);
    const isSmartStack = root.hasAttribute(attr.smartStack);
    const isLazy = root.hasAttribute(attr.lazy);
    const delay = parseInt(root.getAttribute(attr.delay)) || 100;
    const id = root.getAttribute(attr.root);
    const cssVarNameColumns = root.getAttribute(attr.columnCssVariable);
    const cssVarNameRows = root.getAttribute(attr.rowCssVariable);
    const templateCss = getTemplateColCss(id, attr.template);
    const children = root.querySelectorAll(childSelector);
    let currentColumnNr = getColumnNr(
      cssVarNameColumns,
      cssVarNameRows,
      children,
    );
    // In case the attriutes are added to the collection wrap
    const parent = children[0].parentElement;
    window.removeEventListener("resize", onResize);
    window.addEventListener("resize", onResize);

    updateMasonry(currentColumnNr);

    // Override possible conflicting styles from webflow
    root.style.removeProperty("visibility");
    parent.style.removeProperty("visibility");
    parent.style.display = "flex";
    parent.style.flexDirection = "row";
    parent.style.flexFlow = "nowrap";

    // [[ Local Helpers ]]
    function updateMasonry(colNr) {
      parent.replaceChildren(
        isLazy
          ? getLazyMasonry(colNr, children, templateCss)
          : isSmartStack
            ? getSmartStackMasonry(colNr, children, templateCss)
            : getMasonry(colNr, children, templateCss),
      );
    }

    function onResize() {
      setTimeout(() => {
        const newColumnNr = getColumnNr(
          cssVarNameColumns,
          cssVarNameRows,
          children,
        );
        if (newColumnNr !== currentColumnNr) {
          currentColumnNr = newColumnNr;
          updateMasonry(currentColumnNr);
        }
      }, delay);
    }
  }

  function getSmallestColumnIndex(columnsHeights) {
    const minVal = Math.min(...columnsHeights);
    return columnsHeights.findIndex((item) => minVal === item);
  }

  function makeColumnHeightsTracker(colNr) {
    const arr = [];
    for (let i = 0; i < colNr; i++) {
      arr.push(0);
    }
    return arr;
  }

  function getSmartStackMasonry(colNr, children, templateCss) {
    const columnsFragment = makeColumnsFragment(colNr, templateCss);
    const columns = Array.from(columnsFragment.children);
    const heightsTracker = makeColumnHeightsTracker(colNr);
    getSmartStackItemPlacementFn({ children, heightsTracker, columns })();
    return columnsFragment;
  }

  function getMasonry(colNr, children, templateCss) {
    let columnsFragment= makeColumnsFragment(colNr,templateCss)
    for (let colIndex = 0; colIndex < colNr; colIndex++) {
      const column = columnsFragment.children[colIndex]
      for ( let rowIndex = colIndex; rowIndex < children.length; rowIndex += colNr) {
        column.appendChild(children[rowIndex]);
      }
    }
    return columnsFragment;
  }

  function getLazyMasonry(colNr, children, templateCss) {
    const columnsFragment = makeColumnsFragment(colNr, templateCss);
    const heightsTracker = makeColumnHeightsTracker(colNr);
    const columns = Array.from(columnsFragment.children);
    getLazyItemPlacementFn({ children, heightsTracker, columns })();
    return columnsFragment;
  }

  function isEveryElementLoaded(arrayOfNodes) {
    return arrayOfNodes.every((node) => node.complete);
  }

  function getColumnNr(cssVarNameColumns, cssVarNameRows, children) {
    const childrenNr = children.length;
    const colNr =
      parseInt(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(cssVarNameColumns),
      ) || 0;
    const rowNr =
      parseInt(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(cssVarNameRows),
      ) || 0;
    if (rowNr) {
      return Math.ceil(childrenNr / rowNr);
    }
    return colNr;
  }

  function getTemplateColCss(id, masonryTemplate) {
    let css = [];
    let templateNode;
    if (id) {
      templateNode = document.querySelector(`[${masonryTemplate}="${id}"]`);
      css = templateNode?.classList || css;
      templateNode?.remove();
    }
    return css;
  }
  function makeColumnsFragment(colNr, templateCss) {
    const fragment = document.createDocumentFragment();
    for (let colIndex = 0; colIndex < colNr; colIndex++) {
      fragment.appendChild(makeColumn(colNr, templateCss));
    }
    return fragment;
  }

  function addStyleToColumn(column, colNr, templateCss) {
    if (templateCss.length > 0) {
      column.classList.add(...templateCss);
    } else {
      column.style.width = `calc(100% / ${colNr})`;
    }
  }
  function makeColumn(colNr, templateCss) {
    const column = document.createElement("div");
    addStyleToColumn(column, colNr, templateCss);
    return column;
  }

  function getHeight(child) {
    return child.getBoundingClientRect().height;
  }
  function getLazyItemPlacementFn({ children, heightsTracker, columns }) {
    function placeLazyItems(index = 0) {
      if (index >= children.length) return;
      const child = children[index];
      const lazyItems = Array.from(child.querySelectorAll('[loading="lazy"]'));
      const isLazyItemsLoaded = isEveryElementLoaded(lazyItems);
      const smallestColumnIndex = getSmallestColumnIndex(heightsTracker);
      let onLoadDidRun = false;
      const removeOnLoadFromLazyItems = batchAddEventTo(
        lazyItems,
        "load",
        onLoad,
      );

      if (isLazyItemsLoaded) {
        batchRequestAnimationFrameFor(lazyItems, dispatchLoadEvent);
      }

      columns[smallestColumnIndex].append(child);

      function onLoad() {
        if (onLoadDidRun) {
          return;
        }
        if (isEveryElementLoaded(lazyItems)) {
          onLoadDidRun = true;
          requestAnimationFrame(removeOnLoadFromLazyItems);
          heightsTracker[smallestColumnIndex] += getHeight(child);
          placeLazyItems(index + 1);
        }
      }
    }
    return placeLazyItems;
  }
  function getSmartStackItemPlacementFn({ children, heightsTracker, columns }) {
    function placeSmartStackItems(index = 0) {
      if (index >= children.length) return;
      const child = children[index];
      const smallestColumnIndex = getSmallestColumnIndex(heightsTracker);
      heightsTracker[smallestColumnIndex] += getHeight(child);
      columns[smallestColumnIndex].append(child);
      placeSmartStackItems(index + 1);
    }
    return placeSmartStackItems;
  }

  function batchAddEventTo(arr, event, callback) {
    const arrLen = arr.length;
    for (let i = 0; i < arrLen; i++) {
      arr[i].addEventListener(event, callback);
    }
    return (condition = true) => {
      if (!condition) return;
      batchRemoveEventsFrom(arr, event, callback);
    };
  }

  function batchRemoveEventsFrom(arr, event, callback) {
    const arrLen = arr.length;
    for (let i = 0; i < arrLen; i++) {
      arr[i].removeEventListener(event, callback);
    }
  }

  function batchRequestAnimationFrameFor(arr, callback) {
    const arrLen = arr.length;
    for (let i = 0; i < arrLen; i++) {
      requestAnimationFrame((t) => callback(arr[i], t));
    }
  }

  function dispatchLoadEvent(item) {
    item.dispatchEvent(new Event("load"));
  }

  return init;
})();

document.addEventListener("DOMContentLoaded", opMasonry);
