const opMasonry = (() => {
  function setup() {
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

    const roots = document.querySelectorAll(`[${attr.root}]`);

    roots.forEach((root) => applyMasonryToRoot(root, attr));
  }

  // [[ Global helpers ]]
  function applyMasonryToRoot(root, attr) {
    root.style.visibility = "hidden";
    const childSelector = root.getAttribute(attr.child);
    const isSmartStack = root.hasAttribute(attr.smartStack);
    const isLazy = root.hasAttribute(attr.lazy);
    const delay = parseInt(root.getAttribute(attr.delay)) || 100;
    const id = root.getAttribute(attr.root);
    const cssVarNameColumns = root.getAttribute(attr.columnCssVariable);
    const cssVarNameRows = root.getAttribute(attr.rowCssVariable);
    const templateCss = getTemplateColCss(id, attr.template);
    const children = root.querySelectorAll(childSelector);
    const parent = children[0].parentElement;
    let currentColumnNr = getColumnNr(
      cssVarNameColumns,
      cssVarNameRows,
      children,
    );

    window.removeEventListener("resize", onResize);
    window.addEventListener("resize", onResize);

    updateMasonry(currentColumnNr);
    root.style.removeProperty("visibility");

    // Override possible conflicting styles from webflow
    parent.style.display = "flex";
    parent.style.flexDirection = "row";
    parent.style.flexFlow = "nowrap";

    // [[ Local Helpers ]]
    function updateMasonry(colNr) {
      parent.replaceChildren(
        isSmartStack
          ? isLazy
            ? getLazyMasonry(colNr, children, templateCss)
            : getSmartStackMasonry(colNr, children, templateCss)
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
    const columns = Array.from(columnsFragment.children)
    const heightsTracker = makeColumnHeightsTracker(colNr);
    getSmartStackItemPlacementFn({ children, heightsTracker, columns })();
    return columnsFragment;
  }

  function getMasonry(colNr, children, templateCss) {
    let columnsFragment = document.createDocumentFragment();
    for (let colIndex = 0; colIndex < colNr; colIndex++) {
      const column = document.createElement("div");
      addStyleToColumn(column, colNr, templateCss);

      columnsFragment.appendChild(column);

      for (
        let rowIndex = colIndex;
        rowIndex < children.length;
        rowIndex += colNr
      ) {
        children[rowIndex].style.width = "100%";
        column.appendChild(children[rowIndex]);
      }
    }
    return columnsFragment;
  }

  function getLazyMasonry(colNr, children, templateCss) {
    const columnsFragment = makeColumnsFragment(colNr, templateCss);
    const heightsTracker = makeColumnHeightsTracker(colNr);
    const columns = Array.from(columnsFragment.children)
    getLazyItemPlacementFn({ children, heightsTracker, columns })();

    function getLazyItemPlacementFn({ children, heightsTracker, columns }) {
      function placeLazyItems(index = 0) {
        if (index >= children.length) return;
        const child = children[index];
        const lazyItems = Array.from( child.querySelectorAll('[loading="lazy"]'),);
        const isLazyItemsLoaded = isEveryElementLoaded(lazyItems);
        const smallestColumnIndex = getSmallestColumnIndex(heightsTracker);
        let onLoadDidRun = false;
        batchAddEventTo(lazyItems,"load", onLoad);

        if (isLazyItemsLoaded) {
          batchRequestAnimationFrameFor(lazyItems, dispatchLoadEvent);
        }

        columns[smallestColumnIndex].append(child);

        function onLoad(e) {
          e.currentTarget.removeEventListener("load", onLoad);
          if (onLoadDidRun) {
            return;
          }
          onLoadDidRun = true;
          heightsTracker[smallestColumnIndex] += getHeight(child);
          placeLazyItems(index + 1);
        }
      }
      return placeLazyItems;
    }
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

  function makeColumn(colNr, templateCss) {
    const column = document.createElement("div");
    if (templateCss.length > 0) {
      column.classList.add(...templateCss);
    } else {
      column.style.width = `calc(100% / ${colNr})`;
    }
    return column;
  }

  function getHeight(child) {
    return child.getBoundingClientRect().height;
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

  return setup;
})();

document.addEventListener("DOMContentLoaded", opMasonry);
