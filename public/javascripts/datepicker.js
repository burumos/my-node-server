
const year = document.getElementById('year');
const month = document.getElementById('month');
const day = document.getElementById('day');
const now = dayjs();

function setOptions(element, values, selectedValue=null) {
    values.forEach(v => {
        const option = document.createElement('option');
        option.setAttribute('value', v);
        option.innerText = v;
        if (selectedValue == v) {
            option.setAttribute('selected', true);
        }
        element.append(option);
    })
}

function setDayOptions(selectedDay) {
    Object.values(day.children).forEach(e => e.remove());
    const y = year.value;
    const m = month.value;
    const dayEnd = dayjs().year(y).month(m - 1).endOf('month');
    setOptions(day, _.range(1, dayEnd.date() + 1), selectedDay);
}

function paramDate() {
    const url = new URL(location.href);
    const searchParams = url.searchParams;
    if (searchParams.get(year.name)) {
        let dayObj = dayjs();
        dayObj = dayObj.year(searchParams.get(year.name))
            .month(Number(searchParams.get(month.name)) - 1)
            .date(searchParams.get(day.name))
        return dayObj;
    }
    return null;
}

if (year) {

    const searchParams = (new URL(location.href)).searchParams;
    const selectedYear = searchParams.get(year.name) || now.year();
    const selectedMonth = searchParams.get(month.name) || now.month() + 1;
    const selectedDay = searchParams.get(day.name) || now.date();
    const dayEnd = dayjs().year(selectedYear).month(selectedMonth - 1).endOf('month');
    setOptions(year, _.range((new Date).getFullYear(), 2016, -1), selectedYear);
    setOptions(month, _.range(1, 13), selectedMonth);
    setDayOptions(selectedDay);



    year.addEventListener('change', e => {
        setDayOptions(1);
    });
    month.addEventListener('change', e => {
        setDayOptions(1)
    })

    document.getElementById('nextDate').addEventListener('click', () => {
        let dayObj = paramDate() || dayjs();
        dayObj = dayObj.add(1, 'day');
        const url = new URL(location.href);
        const searchParams = url.searchParams;
        searchParams.set(year.name, dayObj.year())
        searchParams.set(month.name, dayObj.month() + 1);
        searchParams.set(day.name, dayObj.date());
        location.href = url.toString();
    })

    document.getElementById('prevDate').addEventListener('click', () => {
        let dayObj = paramDate() || dayjs();
        dayObj = dayObj.add(-1, 'day');
        const url = new URL(location.href);
        const searchParams = url.searchParams;
        searchParams.set(year.name, dayObj.year())
        searchParams.set(month.name, dayObj.month() + 1);
        searchParams.set(day.name, dayObj.date());
        location.href = url.toString();
    });

    const todayElem = document.getElementById('today-display');
    if (todayElem) {
        const dayObj = paramDate() || dayjs();
        todayElem.innerText = dayObj.format('YYYY/MM/DD')
    }
}