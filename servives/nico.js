const request = require('request-promise');
const dayjs = require('dayjs');
const nicoGames = require('../models/nico_games');

const fields = ['title', 'contentId', 'startTime','tags','viewCounter', 'thumbnailUrl'];

function getUrl(keyword, limit, filters, targets='title,description,tags', sort='startTime') {
    const params = {
        q: keyword,
        targets,
        _context: 'private-app',
        _sort: sort,
        fields: fields.join(','),
        _limit: limit,
    };
    Object.entries(filters).forEach(([key, obj]) =>
        Object.entries(obj).forEach(([i, val]) => params[`filters[${key}][${i}]`] = val)
    );

    const url = new URL('https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search');

    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    return url.toString();
}

function afterProcess(list) {
    return list.map(rec => {
        rec.url = 'https://nico.ms/' + rec.contentId;
        rec.startTime = dayjs(rec.startTime).format('YYYY/M/D HH:mm');
        return rec;
    });
}

const nicoService = function() {}

/**
 * fetchUtau
 * @param {*} dateString
 */
nicoService.fetchUtau = async (dateString) => {
    const fromDate = dayjs(dateString).startOf('day').toISOString();
    const toDate = dayjs(dateString).endOf('day').toISOString();
    const url = getUrl('UTAU', 10, {
        startTime: {
            gte: fromDate,
            lte: toDate,
        },
    }, 'tags', 'viewCounter');
    const options = { url, method: 'GET', json: true};
    let res;
    try {
        res = await request(options);
    } catch (e) {
        console.error(e.message);
        return [];
    }

    const data = afterProcess(res.data);

    return data;
}

/**
 * fetchVocaloid
 * @param {*} dateString
 */
nicoService.fetchVocaloid = async (dateString) => {
    const fromDate = dayjs(dateString).startOf('day').toISOString();
    const toDate = dayjs(dateString).endOf('day').toISOString();
    const url = getUrl('VOCALOID オリジナル', 10, {
        startTime: {
            gte: fromDate,
            lte: toDate,
        },
    }, 'tags', 'viewCounter');
    const options = { url, method: 'GET', json: true};
    let res;
    try {
        res = await request(options);
    } catch (e) {
        console.error(e.message);
        return [];
    }

    const data = afterProcess(res.data);

    return data;
}

nicoService.fetchByKeyword = async (keyword, limit=5, MinimumView=1000) => {
    const fromDate = dayjs().startOf('date').add(-5, 'day').startOf('day').toISOString();
    const url = getUrl(keyword, limit, {
        startTime: {
            gte: fromDate,
        },
        viewCounter: {
            gte: MinimumView,
        }
    });
    const options = { url, method: 'GET', json: true};
    let res;
    try {
        res = await request(options);
    } catch (e) {
        console.error(e.message);
        return [];
    }

    return res.data;
}

/**
 * fetchGame
 */
nicoService.fetchGame = async () => {
    const list = await nicoGames.fetchAll();
    return afterProcess(list);
}

module.exports = nicoService;