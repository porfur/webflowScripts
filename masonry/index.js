const opMasonry = (() => {
  function setup() {
    const masonryRoot = "op-masonry__root"; //Add this as attribute to collection wrap, set value to some unique ID
    const masonryTemplate = "op-masonry__col-template-for"; // Optional
    const masonryColumnCssVariable = "op-masonry__col-css-var"; // The css var name
    const masonryRowCssVariable = "op-masonry__row-css-var"; // The css var name
    const masonryDelay = "op-masonry__delay"; //defaults to 100ms
    const masonryChild = "op-masonry__child-selector";
    const masonrySmartStack = "op-masonry__smart-stack";

    const roots = document.querySelectorAll(`[${masonryRoot}]`);

    roots.forEach((root) => {
      root.style.visibility = "hidden";
      const childSelector = root.getAttribute(masonryChild);
      const isSmartStack = root.hasAttribute(masonrySmartStack);
      const delay = parseInt(root.getAttribute(masonryDelay)) || 100;
      const id = root.getAttribute(masonryRoot);
      const cssVarNameColumns = root.getAttribute(masonryColumnCssVariable);
      const cssVarNameRows = root.getAttribute(masonryRowCssVariable);
      const templateCss = getTemplateColCss(id, masonryTemplate);
      const children = root.querySelectorAll(childSelector);
      const parent = children[0].parentElement;

      parent.style.display = "flex";
      parent.style.flexDirection = "row";
      parent.style.flexFlow = "nowrap";

      let colNr = getColNr(cssVarNameColumns, cssVarNameRows, children);

      const updateMasonry = () => {
        parent.replaceChildren(
          isSmartStack
            ? getSmartMasonry(colNr, children, templateCss)
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
            colNr = newColNr;
            updateMasonry();
          }
        }, delay);
      };

      updateMasonry();
      root.style.removeProperty("visibility");
      window.removeEventListener("resize", onResize);
      window.addEventListener("resize", onResize);
    });
  }

  //Helpers
  function getSmallestColumnHeightAndIndex(columnsHeights) {
    const minVal = Math.min(...columnsHeights)
     return columnsHeights.findIndex((item) => minVal===item)
  }
  function getColumnHeights(colNr){
    const arr = []
    for (let i = 0; i < colNr; i++) {
      arr.push(0)
    }
    return arr
  }

  function getSmartMasonry(colNr, children, templateCss) {
    let columnsFragment = document.createDocumentFragment();
    let columnsHeights = getColumnHeights(colNr)
    for (let colIndex = 0; colIndex < colNr; colIndex++) {
      const column = document.createElement("div");
      columnsFragment.appendChild(column);
      if (templateCss.length > 0) {
        column.classList.add(...templateCss);
      } else {
        column.style.width = `calc(100% / ${colNr})`;
      }
    }

    children.forEach((child) => {
      const index = getSmallestColumnHeightAndIndex(columnsHeights);
      columnsHeights[index] += child.clientHeight;
      columnsFragment.children[index].appendChild(child);
    });
    return columnsFragment;
  }

  function getMasonry(colNr, children, templateCss) {
    let columns = document.createDocumentFragment();
    for (let colIndex = 0; colIndex < colNr; colIndex++) {
      const column = document.createElement("div");
      if (templateCss.length > 0) {
        column.classList.add(...templateCss);
      } else {
        column.style.width = `calc(100% / ${colNr})`;
      }

      columns.appendChild(column);

      for (
        let rowIndex = colIndex;
        rowIndex < children.length;
        rowIndex += colNr
      ) {
        children[rowIndex].style.width = "100%";
        column.appendChild(children[rowIndex]);
      }
    }
    return columns;
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
  return setup;
})();

document.addEventListener("DOMContentLoaded", opMasonry);
