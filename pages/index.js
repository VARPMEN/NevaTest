const dataBlocks = document.querySelectorAll(".event__option-data-block");

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

function createMoreBtn(item) {
  const moreBtn = document.createElement("button");
  moreBtn.textContent = "еще...";
  moreBtn.id = "moreBtn";
  moreBtn.classList.add("event__data-more-button");
  moreBtn.addEventListener("click", showDataBtn);
  return item.appendChild(moreBtn);
}

function removeMoreBtn(item) {
  const moreBtn = item.querySelector("#moreBtn");
  moreBtn.removeEventListener("click", showDataBtn);
  item.removeChild(moreBtn);
}

function renderMoreBtn() {
  dataBlocks.forEach((item) => {
    item.offsetHeight;
    const buttons = item.querySelectorAll(".event__data-btn");
    const length = buttons.length;
    const disButtons = item.querySelectorAll(".event__data-btn_disable");

    if (item.offsetHeight > 29 && !item.querySelector("#moreBtn")) {
      createMoreBtn(item);
    }

    for (let i = 0; i < length; i++) {
      if (item.offsetHeight > 29) {
        buttons.item(length - 1 - i).classList.add("event__data-btn_disable");
      } else if (disButtons.length != 0 && disButtons.item(i) != null) {
        disButtons.item(i).classList.remove("event__data-btn_disable");
        if (item.offsetHeight > 29) {
          disButtons.item(i).classList.add("event__data-btn_disable");
          return;
        }
      }
    }
  });
}

renderMoreBtn();

window.addEventListener("resize", (e) => {
  e.preventDefault();
  renderMoreBtn();
});
