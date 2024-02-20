const opMasonry = (() => {
  function setup() {
    const masonryRoot = "op-masonry__root"; //Add this as attribute to collection wrap, set value to some unique ID
    const masonryTemplate = "op-masonry__col-template-for"; // Optional
    const masonryCssVariable = "op-masonry__col-css-var";
    const masonryDelay = "op-masonry__delay";//defaults to 100ms
    const masonryChild = "op-masonry__child";//Mark children with this 

    const roots = document.querySelectorAll(`[${masonryRoot}]`);

    roots.forEach((root) => {
      const delay = parseInt(root.getAttribute(masonryDelay)) || 100;
      const id = root.getAttribute(masonryRoot);
      const cssVarName = root.getAttribute(masonryCssVariable);
      const templateCss = getTemplateColCss(id, masonryTemplate);
      const children = root.querySelectorAll(`[${masonryChild}]`);
      const parent = children[0].parentElement;
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
      window.removeEventListener("resize", onResize);
      window.addEventListener("resize", onResize);
    });
  }

  //Helpers

  function getMasonry(colNr, children, templateCss) {
    let columns = document.createDocumentFragment();
    for (let colIndex = 0; colIndex < colNr; colIndex++) {
      const column = document.createElement("div");
      column.classList.add(...templateCss);
      columns.appendChild(column);

      for (
        let rowIndex = colIndex;
        rowIndex < children.length;
        rowIndex += colNr
      ) {
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
      templateNode.remove();
    }
    return css;
  }
  return setup;
})();

document.addEventListener("DOMContentLoaded", opMasonry);
