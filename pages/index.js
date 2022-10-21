const dataBlocks = document.querySelectorAll(".event__option-data-block");
let oldPosition = -1;

function showDataBtn(e) {
  e.preventDefault();
  e.target
    .closest(".event__option-data-block")
    .querySelectorAll(".event__data-btn_disable")
    .forEach((button) => {
      button.classList.remove("event__data-btn_disable");
    });
  e.target.classList.add("event__data-btn_disable");
}

function createMoreBtn(item, element) {
  const moreBtn = document.createElement("button");
  moreBtn.textContent = "еще...";
  moreBtn.id = "moreBtn";
  moreBtn.classList.add("event__data-more-button");
  moreBtn.addEventListener("click", showDataBtn);
  return item.insertBefore(moreBtn, element);
}

function removeMoreBtn(item) {
  const moreBtn = item.querySelector("#moreBtn");
  moreBtn.removeEventListener("click", showDataBtn);
  item.removeChild(moreBtn);
}

function checkDisableBtn(buttons, position) {
  buttons.forEach((button, index) => {
    if (index > position) {
      button.classList.add("event__data-btn_disable");
    } else if (button.classList.contains("event__data-btn_disable")) {
      button.classList.remove("event__data-btn_disable");
    }
  });
}

function renderMoreBtn() {
  dataBlocks.forEach((item) => {
    const blockWidth = item.offsetWidth;
    const blockHeight = item.offsetHeight;
    const buttons = item.querySelectorAll(".event__data-btn");
    const optionWidth = item.querySelector(".event__option").offsetWidth;
    const buttonWidth = item.querySelector(".event__data-btn").offsetWidth;
    const maxBtnInLine = Math.floor((blockWidth - optionWidth) / buttonWidth);

    let diffBtnQuantity = buttons.length - maxBtnInLine;

    if (
      diffBtnQuantity === 0 &&
      blockHeight != 29 &&
      !item.querySelector("#moreBtn")
    ) {
      diffBtnQuantity = +1;
    }

    let newPosition = buttons.length - diffBtnQuantity - 1;

    if (diffBtnQuantity > 0) {
      if (oldPosition < 0) {
        createMoreBtn(item, buttons[newPosition]);
        oldPosition = newPosition;
        checkDisableBtn(buttons, newPosition);
      } else if (oldPosition != newPosition && item.querySelector("#moreBtn")) {
        removeMoreBtn(item);
        createMoreBtn(item, buttons[newPosition]);
        oldPosition = newPosition;
        checkDisableBtn(buttons, newPosition);
      }
    } else if (item.querySelector("#moreBtn")) {
      removeMoreBtn(item);
      oldPosition = -1;
    }
  });
}

renderMoreBtn();

window.addEventListener("resize", (e) => {
  e.preventDefault();
  renderMoreBtn();
});
