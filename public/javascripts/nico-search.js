const searchConditionKey = 'nico-search-conditions';

const nicoSearch = {};
nicoSearch.conditions = [];

nicoSearch.appendRow = (word, limit, minimumView) => {
    const newRow = document.getElementById('nico-search-words-format').cloneNode(true);
    newRow.removeAttribute('id');
    newRow.classList.remove('hidden');
    newRow.dataset.word = word;
    newRow.dataset.limit = limit;
    newRow.dataset.minimumView = minimumView;
    newRow.querySelector('.word').innerText = word;
    newRow.querySelector('.limit').innerText = limit;
    newRow.querySelector('.minimumView').innerText = minimumView;
    document.getElementById('nico-search-words').appendChild(newRow);
    newRow.querySelector('.delete').addEventListener('click', e => {
        const row = e.target.parentNode.parentNode;
        e.stopPropagation();
        nicoSearch.delete(row.dataset.word, row.dataset.limit, row.dataset.minimumView);
        row.remove();
    });
    newRow.querySelector('.row').addEventListener('click', e => {
        const data = e.currentTarget.parentNode.dataset;
        const form = document.querySelector('#nico-search-form');
        form.querySelector('input[name="q"]').value = data.word;
        form.querySelector('input[name="limit"]').value = data.limit;
        form.querySelector('input[name="minimumView"]').value = data.minimumView;

    })

    return newRow;
}

nicoSearch.save = (word, limit, minimumView) => {
    nicoSearch.conditions.push({
        word, limit, minimumView,
    });
    localStorage.setItem(searchConditionKey, JSON.stringify(nicoSearch.conditions));
}

nicoSearch.delete = (word, limit, minimumView) => {
    nicoSearch.conditions = nicoSearch.conditions.filter(x =>
        x.word !== word
        || x.limit !== limit
        || x.minimumView !== minimumView);
    localStorage.setItem(searchConditionKey, JSON.stringify(nicoSearch.conditions));
}

nicoSearch.init = () => {
    const json = localStorage.getItem(searchConditionKey);
    let list = [];
    try {
        if (json) {
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) {
                list = parsed;
            }
        }
    } catch(e) {
        list = [];
    }
    nicoSearch.conditions = list;
    list.forEach(record => {
        nicoSearch.appendRow(record.word, record.limit, record.minimumView);
    });

}
nicoSearch.init();


document.querySelector('#nico-search-save').addEventListener('click', e => {
    const form = document.querySelector('#nico-search-form');
    const word = form.querySelector('input[name="q"]').value;
    const limit = form.querySelector('input[name="limit"]').value;
    const minimumView = form.querySelector('input[name="minimumView"]').value;
    nicoSearch.appendRow(word, limit, minimumView);
    nicoSearch.save(word, limit, minimumView);
});

