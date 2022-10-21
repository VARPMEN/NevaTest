const form = calculateForm;
const message = form.querySelector(".messageForm");
const blockTo = form.querySelector(".blockTimeTo");
const blockBack = form.querySelector(".blockTimeBack");
const formButton = form.formButton;
const routeSelect = form.route;
const timeTo = form.timeTo;
const timeBack = form.timeBack;

const firstPrice = 700;
const secondPrice = 1200;
const timeToRoute = 50 * 60000;
let route = "default";

const currentGMT = 0 - new Date().getTimezoneOffset() / 60 - 3;

function filterCurrentTime(select) {
  const selectOpt = select.options;

  if (currentGMT != 0) {
    for (let i = 0; i < selectOpt.length; i++) {
      const arrOption = selectOpt[i].textContent.split("(");
      console.log();
      arrOption[0] = convertTime(arrOption[0]);
      arrOption[0] = arrOption[0] + currentGMT * 3600000;
      arrOption[0] = deconvertTime(arrOption[0]);
      selectOpt[i].textContent = arrOption.join("(");

      let valueOption = convertTime(selectOpt[i].value);
      valueOption = valueOption + currentGMT * 3600000;
      selectOpt[i].value = deconvertTime(valueOption);
    }
  }
}

function convertTime(option) {
  const timeHM = option.split(":");
  timeHM[0] = Number(timeHM[0]) * 3600000;
  timeHM[1] = Number(timeHM[1]) * 60000;
  const time = timeHM[0] + timeHM[1];
  return time;
}

function deconvertTime(time) {
  let minutes = (time % 3600000) / 60000;
  let hours = Math.floor(time / 3600000);
  if (hours >= 24) {
    hours = hours - 24;
    if (hours < 10) {
      hours = "0" + String(hours);
    }
  }

  if (minutes < 10) {
    minutes = "0" + String(minutes);
  }

  return hours + ":" + minutes;
}

function showBlock(block) {
  block.classList.remove("calculate__disable");
}

function hideBlock(block) {
  block.classList.add("calculate__disable");
}

function setListener(select) {
  if (select.value === "из A в B и обратно в А") {
    timeTo.addEventListener("change", handleTimeTo);
  } else {
    availableIncorrectTime();
    timeTo.removeEventListener("change", handleTimeTo);
  }
}

function handleTimeTo(e) {
  e.preventDefault();
  showBackBlock(timeTo);
}

function showBackBlock(select) {
  if (select.value != "default") {
    showBlock(blockBack);
    disableIncorrectTime(select.value);
  } else {
    hideBlock(blockBack);
  }
}

function disableIncorrectTime(value) {
  const optionsBack = timeBack.options;
  for (let i = 0; i < optionsBack.length; i++) {
    if (convertTime(value) + timeToRoute > convertTime(optionsBack[i].value)) {
      optionsBack[i].setAttribute("disabled", true);
    } else {
      optionsBack[i].removeAttribute("disabled");
    }
  }
}

function availableIncorrectTime() {
  const optionsBack = timeBack.options;
  for (let i = 0; i < optionsBack.length; i++) {
    optionsBack[i].removeAttribute("disabled");
  }
}

function getTime(value) {
  let time = convertTime(value);
  time = time + timeToRoute;
  return deconvertTime(time);
}

function templateMessage(inputForm, route, firstTime, secondTime) {
  message.textContent = `Вы выбрали ${inputForm} билета по маршруту ${route} стоимостью ${
    inputForm * firstPrice
  }р.
  Это путешествие займет у вас 50 минут. 
  Теплоход отправляется в ${firstTime}, а прибудет в ${getTime(secondTime)}.`;
}

function handleButton() {
  const inputForm = form.inputForm.value;
  let x = route;
  switch (x) {
    case "из A в B":
      templateMessage(inputForm, route, timeTo.value, timeTo.value);
      break;
    case "из B в A":
      templateMessage(inputForm, route, timeBack.value, timeBack.value);
      break;
    case "из A в B и обратно в А":
      templateMessage(inputForm, route, timeTo.value, timeBack.value);
      break;
  }
}

function selectedRoute(select) {
  let x = select.value;
  switch (x) {
    case "из A в B":
      showBlock(blockTo);
      hideBlock(blockBack);
      route = select.value;
      break;
    case "из B в A":
      showBlock(blockBack);
      hideBlock(blockTo);
      route = select.value;
      break;
    case "из A в B и обратно в А":
      showBlock(blockTo);
      route = select.value;
      break;
    case "default":
      hideBlock(blockTo);
      hideBlock(blockBack);
      break;
  }
}

filterCurrentTime(timeTo);
filterCurrentTime(timeBack);

routeSelect.addEventListener("change", (e) => {
  e.preventDefault();
  selectedRoute(routeSelect);
  setListener(routeSelect);
});

formButton.addEventListener("click", (e) => {
  e.preventDefault();
  handleButton();
});
