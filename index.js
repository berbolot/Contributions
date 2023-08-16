const cellsEl = document.querySelector('.cells');
const daysEl = document.querySelector('.days');
const monthsEl = document.querySelector('.months');
const currentDate = new Date();
const currentWeekDay = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const currentDayOfWeek = currentDate.getDay();
const sortedWeekdays = [...currentWeekDay.slice(currentDayOfWeek), ...currentWeekDay.slice(0, currentDayOfWeek)];

const currentMonth = currentDate.getMonth();
const monthsList = ['Янв.', 'Февр.', 'Март.', 'Апр.', 'Май.', 'Июнь.', 'Июль.', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'];
const sortedMonths = [...monthsList.slice(currentMonth), ...monthsList.slice(0, currentMonth)];

daysEl.innerHTML = sortedWeekdays.map((el) => `<li>${el}</li>`).join('');
monthsEl.innerHTML = sortedMonths.map((el) => `<li>${el}</li>`).join('');

function getClassContribution(color) {
    if (color <= 9 && color > 1) {
        return 'color9';
    } else if (color >= 10 && color <= 19) {
        return 'color19';
    } else if (color >= 20 && color <= 29) {
        return 'color29';
    } else if (color >= 30) {
        return 'color30';
    } else {
        return 'color0';
    }
}

async function getContribution() {
    const res = await fetch('https://dpg.gg/test/calendar.json');
    return await res.json();
}

async function buildCells() {
    const dates = await getContribution();

    for (let i = 0; i < 358; i++) {
        const date357DaysAgo = new Date(currentDate);
        date357DaysAgo.setDate(currentDate.getDate() - 357 + i);
        const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
        const russianDate = new Intl.DateTimeFormat('ru-RU', options).format(date357DaysAgo);
        const year = date357DaysAgo.getFullYear();
        const month = date357DaysAgo.getMonth() + 1;
        const day = date357DaysAgo.getDate();
        const contribution = dates[`${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`] || 0;
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.classList.add('offModal');
        li.appendChild(div);
        li.classList.add(getClassContribution(contribution));

        div.innerHTML = `
            <div class='contribution '>${contribution} contributions </div>
            <div class='date'>${currentWeekDay[date357DaysAgo.getDay()]} ${russianDate}</div>
        `;

        li.addEventListener('mouseover', () => {
            div.classList.add('onModal');
            div.classList.remove('offModal');
        });

        li.addEventListener('mouseout', () => {
            div.classList.add('offModal');
            div.classList.remove('onModal');
        });

        li.addEventListener('click', () => {
            div.classList.toggle('select');
            li.style.border = div.classList.contains('select') ? '2px solid #000000E5' : 'none';
            div.classList.remove('onModal');
            div.classList.remove('offModal');
        });

        cellsEl.appendChild(li);
    }
}

buildCells();
