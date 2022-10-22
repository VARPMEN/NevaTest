// Находим необходимые элементы
const form = calculateForm; //Форма
const message = form.querySelector(".messageForm"); //Абзац вывода сообщения
const blockTo = form.querySelector(".blockTimeTo"); //Блок из А в В
const blockBack = form.querySelector(".blockTimeBack"); // Блок из И в А
const formButton = form.formButton; // Кнопка формы
const routeSelect = form.route; // select маршрутов
const timeTo = form.timeTo; // select из А в В
const timeBack = form.timeBack; // select из В в А

const firstPrice = 700; // цена в одну сторону
const secondPrice = 1200; // цена в обе стороны
const timeToRoute = 50; // время на маршруте
let route = "default"; // переменая для определения маршрута

const currentGMT = 0 - new Date().getTimezoneOffset() - 180; // переменная получения локальной разницы во времени в минутах

// перевод времени в локальное
function filterCurrentTime(select) {
  const selectOpt = select.options;

  if (currentGMT != 0) {
    for (let i = 1; i < selectOpt.length; i++) {
      const arrOption = selectOpt[i].textContent.split("(");
      arrOption[0] = convertLocalTime(arrOption[0]);
      selectOpt[i].textContent = arrOption.join("(");

      selectOpt[i].value = convertLocalTime(selectOpt[i].value);
    }
  }
}

// конвертация времени в локальное
function convertLocalTime(time) {
  time = convertTime(time);
  time = time + currentGMT;
  time = deconvertTime(time);
  return time;
}

// конвертация времени из строки в число
function convertTime(option) {
  const timeHM = option.split(":");
  timeHM[0] = Number(timeHM[0]) * 60;
  timeHM[1] = Number(timeHM[1]);
  const time = timeHM[0] + timeHM[1];
  return time;
}

// конвертация времени из числа в строку
function deconvertTime(time) {
  let minutes = time % 60;
  let hours = Math.floor(time / 60);
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

// отображение скрытого блока
function showBlock(block) {
  block.classList.remove("calculate__disable");
}

// скрытие блока
function hideBlock(block) {
  block.classList.add("calculate__disable");
}

// перевод select к дефолтному значению при смене маршрута
function setDefaultOption(select) {
  select.value = select.options[0].value;
}

// коллбек слушателя для блокировки некорректного времени
function setListener(select) {
  if (select.value === "из A в B и обратно в А") {
    timeTo.addEventListener("change", handleTimeTo);
  } else {
    availableIncorrectTime();
    timeTo.removeEventListener("change", handleTimeTo);
  }
}

//коллбек слушателя для раскрытия второго select из В в А при дороге туда и обратно
function handleTimeTo(e) {
  e.preventDefault();
  showBackBlock(timeTo);
}

// функция отображения второго select
function showBackBlock(select) {
  if (select.value != "default") {
    showBlock(blockBack);
    setDefaultOption(timeBack);
    disableIncorrectTime(select.value);
  } else {
    hideBlock(blockBack);
  }
}

// функция для обработки второго select'а на корректное время
function disableIncorrectTime(value) {
  const optionsBack = timeBack.options;
  for (let i = 1; i < optionsBack.length; i++) {
    if (
      convertTime(value) + timeToRoute >= convertTime(optionsBack[i].value) &&
      ((i - 1 != 0 &&
        convertTime(optionsBack[i].value) >
          convertTime(optionsBack[i - 1].value)) ||
        (i + 1 != optionsBack.length &&
          convertTime(optionsBack[i].value) <
            convertTime(optionsBack[i + 1].value)))
    ) {
      optionsBack[i].setAttribute("disabled", true);
    } else {
      optionsBack[i].removeAttribute("disabled");
    }
  }
}

// функция отчистки недоступи времени при изменении маршрута
function availableIncorrectTime() {
  const optionsBack = timeBack.options;
  for (let i = 0; i < optionsBack.length; i++) {
    optionsBack[i].removeAttribute("disabled");
  }
}

// функция рассчета время прибытия
function getTime(value) {
  let time = convertTime(value);
  time = time + timeToRoute;
  return deconvertTime(time);
}

// функция выводи сообщение
function templateMessage(inputForm, route, price, time, firstTime, secondTime) {
  message.textContent = `Вы выбрали ${inputForm} билета по маршруту ${route} стоимостью ${
    inputForm * price
  }р.
  Это путешествие займет у вас ${time} минут. 
  Теплоход отправляется в ${firstTime}, а прибудет в ${getTime(secondTime)}.`;
}

// колбек для слушателя кнопки
function handleButton() {
  const inputForm = form.inputForm.value;
  let x = route;
  switch (x) {
    case "из A в B":
      templateMessage(
        inputForm,
        route,
        firstPrice,
        timeToRoute,
        timeTo.value,
        timeTo.value
      );
      break;
    case "из B в A":
      templateMessage(
        inputForm,
        route,
        firstPrice,
        timeToRoute,
        timeBack.value,
        timeBack.value
      );
      break;
    case "из A в B и обратно в А":
      templateMessage(
        inputForm,
        route,
        secondPrice,
        timeToRoute * 2,
        timeTo.value,
        timeBack.value
      );
      break;
  }
}

// колбек отображения select'ов времени в соответствии с маршрутом
function selectedRoute(select) {
  let x = select.value;
  switch (x) {
    case "из A в B":
      showBlock(blockTo);
      setDefaultOption(timeTo);
      hideBlock(blockBack);
      route = select.value;
      break;
    case "из B в A":
      showBlock(blockBack);
      setDefaultOption(timeBack);
      hideBlock(blockTo);
      route = select.value;
      break;
    case "из A в B и обратно в А":
      showBlock(blockTo);
      setDefaultOption(timeTo);
      route = select.value;
      break;
    case "default":
      hideBlock(blockTo);
      hideBlock(blockBack);
      route = "default";
      break;
  }
}

filterCurrentTime(timeTo); // вызов коррекции времени
filterCurrentTime(timeBack); // вызов коррекции времени

// объявление слушателя для списка маршрутов
routeSelect.addEventListener("change", (e) => {
  e.preventDefault();
  selectedRoute(routeSelect);
  setListener(routeSelect);
});

// объявление слушателя для кнопки
formButton.addEventListener("click", (e) => {
  e.preventDefault();
  handleButton();
});
