const dataBlocks = document.querySelectorAll(".event__option-data-block"); // находим все элементы где возможно необходима кнопка

//функция раскрытия скрытых кнопок
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

// функция создания кнопки
function createMoreBtn(item) {
  const moreBtn = document.createElement("button");
  moreBtn.textContent = "еще...";
  moreBtn.id = "moreBtn";
  moreBtn.classList.add("event__data-more-button");
  moreBtn.addEventListener("click", showDataBtn);
  return item.appendChild(moreBtn);
}

// функция отображения кнопок
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

renderMoreBtn(); // первый рендер кнопок

// вызов слушателя для отслеживания корректного отображения кнопок при изменении ширины экрана
window.addEventListener("resize", (e) => {
  e.preventDefault();
  renderMoreBtn();
});
