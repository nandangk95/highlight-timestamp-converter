window.onload = async function load(event) {
  // console.log("loaded Highlight Timestamp Converter");
  const body = document.body;

  function appendListener(winRoot) {
    winRoot.addEventListener("mouseup", (event) => {
      let result = getSelectionText(winRoot, event);
      let selectedText = result.selectedText;
      let selection = result.selection;
      if (selectedText) {
        let date = convertTimestamp(selectedText);
        if (date) {
          if (selection) {
            try {
              // let range = selection.getRangeAt(0);
              // let oReact = range.getBoundingClientRect();

              // if (0 != oReact.top || 0 != oReact.left) {
              //   let top = event.clientY;
              //   top - oReact.top > oReact.height / 2
              //     ? (top = oReact.bottom + 1)
              //     : (top = oReact.top - 1 - 27);
              createTooltip(
                event.clientX,
                event.clientY + winRoot.pageYOffset,
                date
              );
              // }
            } catch (error) {}
          } else {
            removeTooltip();
          }
        } else {
          removeTooltip();
        }
      } else {
        removeTooltip();
      }
    });

    winRoot.addEventListener("mousedown", () => {
      let result = getSelectionText(winRoot, event);
      let selectedText = result.selectedText;

      selectedText.length < 1 ? removeTooltip() : null;
    });
  }

  function getSelectionText(winRoot, event) {
    let selectedText = "";
    let selection = null;
    if (winRoot.getSelection) {
      selectedText = winRoot.getSelection().toString().trim();
      selection = window.getSelection();
    }
    return {
      selectedText: selectedText,
      selection: selection,
    };
  }

  function convertTimestamp(timestampString) {
    let dateFormated = "";
    if (
      typeof timestampString == "number" ||
      !isNaN(parseInt(timestampString))
    ) {
      if (timestampString.length === 10) {
        dateFormated = new Date(parseInt(timestampString + "000"));
      } else if (timestampString.length === 13) {
        dateFormated = new Date(parseInt(timestampString));
      }
    }
    return dateFormated;
  }

  function createTooltip(left, top, text) {
    removeTooltip();
    const elemtTooltip = document.createElement("div");
    elemtTooltip.setAttribute("id", "toolbar-highlight-timestamp");
    elemtTooltip.style.position = "absolute";
    elemtTooltip.style.left = left + "px";
    elemtTooltip.style.top = top + "px";
    elemtTooltip.style.display = "block";
    elemtTooltip.style.visibility = "visible";
    elemtTooltip.innerHTML = text;
    body.appendChild(elemtTooltip);
  }

  function removeTooltip() {
    const elemtTooltip = document.getElementById("toolbar-highlight-timestamp");
    if (elemtTooltip) {
      elemtTooltip.remove();
    }
  }

  function handleMutations(mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.querySelector("iframe")) {
        //inject into iframe
        let iframe = mutation.target.querySelector("iframe");

        iframe.onload = function loaded(event) {
          // console.log("iframe loaded Highlight Timestamp Converter");
          let iframeElement = document.getElementById(iframe.id);
          if (iframeElement && iframeElement.contentWindow) {
            appendListener(iframeElement.contentWindow);
          }
        };
      }
    });
  }

  const observer = new MutationObserver(handleMutations);
  observer.observe(document.body, { childList: true, subtree: true });

  //inject main body
  appendListener(window);
};
