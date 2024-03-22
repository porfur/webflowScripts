const opMasonry = (() => {
  function setup() {
    const masonryRoot = "op-masonry__root"; //Add this as attribute to collection wrap, set value to some unique ID
    const masonryTemplate = "op-masonry__col-template-for"; // Optional
    const masonryColumnCssVariable = "op-masonry__col-css-var"; // The css var name
    const masonryRowCssVariable = "op-masonry__row-css-var"; // The css var name
    const masonryDelay = "op-masonry__delay"; //defaults to 100ms
    const masonryChild = "op-masonry__child-selector";
    const masonrySmartStack = "op-masonry__smart-stack";
    const masonryLazy = "op-masonry__lazy";

    const roots = document.querySelectorAll(`[${masonryRoot}]`);

    roots.forEach((root) => {
      root.style.visibility = "hidden";
      const childSelector = root.getAttribute(masonryChild);
      const isSmartStack = root.hasAttribute(masonrySmartStack);
      const isLazy = root.hasAttribute(masonryLazy);
      const delay = parseInt(root.getAttribute(masonryDelay)) || 100;
      const id = root.getAttribute(masonryRoot);
      const cssVarNameColumns = root.getAttribute(masonryColumnCssVariable);
      const cssVarNameRows = root.getAttribute(masonryRowCssVariable);
      const templateCss = getTemplateColCss(id, masonryTemplate);
      const children = root.querySelectorAll(childSelector);
      const parent = children[0].parentElement;

      const updateMasonry = (colNr) => {
        // if (true) {
        // parent.replaceChildren(
        //   isSmartStack
        //     ? getSmartMasonry(colNr, children, templateCss)
        //     : getMasonry(colNr, children, templateCss),
        // );
        // }
        parent.replaceChildren(
          isSmartStack
            ? getLazyMasonry(colNr, children, templateCss)
            : getMasonry(colNr, children, templateCss),
        );
      };

      const onResize = () => {
        setTimeout(() => {
          const newColNr = getColNr(
            cssVarNameColumns,
            cssVarNameRows,
            children,
          );
          if (newColNr !== colNr) {
            updateMasonry(newColNr);
          }
        }, delay);
      };

      updateMasonry(getColNr(cssVarNameColumns, cssVarNameRows, children));

      root.style.removeProperty("visibility");
      window.removeEventListener("resize", onResize);
      window.addEventListener("resize", onResize);

      parent.style.display = "flex";
      parent.style.flexDirection = "row";
      parent.style.flexFlow = "nowrap";
    });
  }

  //Helpers
  function getSmallestColumnIndex(columnsHeights) {
    const minVal = Math.min(...columnsHeights);
    return columnsHeights.findIndex((item) => minVal === item);
  }
  function generateColumnHeights(colNr) {
    const arr = [];
    for (let i = 0; i < colNr; i++) {
      arr.push(0);
    }
    return arr;
  }

  function getMasonry(colNr, children, templateCss) {
    const columns = makeColumnsFragment(colNr, templateCss);
    const columnsHeights = generateColumnHeights(colNr);

    children.forEach((child) => {
      const smallestColumnIndex = getSmallestColumnIndex(columnsHeights);
      columnsHeights[smallestColumnIndex] += child.clientHeight;
      columns.children[smallestColumnIndex].appendChild(child);
    });
    return columns;
  }

  function getLazyMasonry(colNr, children, templateCss) {
    const columnsFragment = makeColumnsFragment(colNr, templateCss);
    const columnsHeights = generateColumnHeights(colNr);
    const columns = Array.from(columnsFragment.children);
    placeChild(0, children, columnsHeights, columns);

    function placeChild(childIndex, children, columnsHeights, columns) {
      if (childIndex >= children.length) return;

      const child = children[childIndex];
      const lazyItems = Array.from(child.querySelectorAll('[loading="lazy"]'));
      const isLazyItemsLoaded = isEveryElementLoaded(lazyItems);
      const smallestColumnIndex = getSmallestColumnIndex(columnsHeights);

      if (isLazyItemsLoaded) {
        lazyItems.forEach(item=>{
          const url = item.getAttribute('src')
          item.removeAttribute('src')
          item.setAttribute('src',url)
        })
      }

      let onLoadRan = false;
      lazyItems.forEach((item) => {
        item.addEventListener("load", onLoad);
      });
      columns[smallestColumnIndex].appendChild(child);

      function onLoad(e) {
        e.currentTarget.removeEventListener("load", onLoad);
        if (onLoadRan) {
          return;
        }
        onLoadRan = true;
        columnsHeights[smallestColumnIndex] += child.clientHeight;
        placeChild(childIndex + 1, children, columnsHeights, columns);
      }
    }

    return columnsFragment;
  }

  function isEveryElementLoaded(arrayOfNodes) {
    return arrayOfNodes.every((node) => node.complete);
  }

  function getColNr(cssVarNameColumns, cssVarNameRows, children) {
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

  return setup;
})();

document.addEventListener("DOMContentLoaded", opMasonry);
