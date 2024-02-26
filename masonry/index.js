const opMasonry = (() => {
  function setup() {
    const masonryRoot = "op-masonry__root"; //Add this as attribute to collection wrap, set value to some unique ID
    const masonryTemplate = "op-masonry__col-template-for"; // Optional
    const masonryCssVariable = "op-masonry__col-css-var"; // The css var name
    const masonryDelay = "op-masonry__delay"; //defaults to 100ms
    const masonryChild = "op-masonry__child-selector";

    const roots = document.querySelectorAll(`[${masonryRoot}]`);

    roots.forEach((root) => {
      root.style.visibility = "hidden";
      const childSelector = root.getAttribute(masonryChild);
      const delay = parseInt(root.getAttribute(masonryDelay)) || 100;
      const id = root.getAttribute(masonryRoot);
      const cssVarName = root.getAttribute(masonryCssVariable);
      const templateCss = getTemplateColCss(id, masonryTemplate);
      const children = root.querySelectorAll(childSelector);
      const parent = children[0].parentElement;

      parent.style.display = "flex";
      parent.style.flexDirection = "row";
      parent.style.flexWrap = "no-wrap";

      let colNr = getColNr(cssVarName);

      const updateMasonry = () => {
        parent.replaceChildren(getMasonry(colNr, children, templateCss));
      };

      const onResize = () => {
        setTimeout(() => {
          const newColNr = getColNr(cssVarName);
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
  function getMasonry(colNr, children, templateCss) {
    let columns = document.createDocumentFragment();
    for (let colIndex = 0; colIndex < colNr; colIndex++) {
      const column = document.createElement("div");
    if (templateCss) {
      column.classList.add(...templateCss);
    }
      else{
        column.style.width=`calc(100% / var(${cssVarName}))`
      }

      columns.appendChild(column);

      for (
        let rowIndex = colIndex;
        rowIndex < children.length;
        rowIndex += colNr
      ) {
        children[rowIndex].style.width = '100%'
        column.appendChild(children[rowIndex]);
      }
    }
    return columns;
  }

  function getColNr(cssVarName) {
    return (
      parseInt(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(cssVarName),
      ) || 0
    );
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
