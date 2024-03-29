const express = require('express');
const dayjs = require('dayjs');
const router = express.Router();
const nicoService = require('../servives/nico');

const beforeRender = function(req, res, next) {
    const render = res.render;
    res.render = (view, options = {}, callback) => {
        if (typeof options !== 'object') {
            return render.call(res, view, options, callback);
        }

        if (!options.hasOwnProperty('originalUrl')) {
            options.originalUrl = req.originalUrl;
        }
        render.call(res, view, options, callback);
    }
    next();
};
router.use(beforeRender);

/**
 * controller
 */

router.get('/games', async (req, res, next) => {
    const list = await nicoService.fetchGame();
    res.render('nico/games', {
        title: 'nico games',
        list,
    });
})

router.get('/search', async (req, res, next) => {
    const word = req.query.q ?? '';
    const limit = (50 >= req.query?.limit && req.query?.limit > 0) ? req.query.limit : 10;
    const minimumView = (req.query?.minimumView > 0) ? req.query.minimumView : 100;
    let list = (word.length > 0)
        ? await nicoService.fetchSearch(word, limit, minimumView)
        : [];
    res.render('nico/search', {
        title: 'ニコニコ動画検索',
        query: {
            word,
            limit,
            minimumView
        },
        list
    });
});

router.get('/vocaloid', async (req, res, next) => {
    const today = dayjs();
    let list = await nicoService.fetchVocaloid(
        `${req.query.year || today.year()}-${req.query.month || (today.month() + 1)}-${req.query.day || today.date()}`
    );

    res.render('nico/vocaloid', {
        title: 'nico vocaloid',
        list,
    });
})

router.get('/utau', async (req, res, next) => {
    const today = dayjs();
    let list = await nicoService.fetchUtau(
        `${req.query.year || today.year()}-${req.query.month || (today.month() + 1)}-${req.query.day || today.date()}`
    );

    res.render('nico/utau', {
        title: 'nico utau',
        list,
    });
})

module.exports = router;

/**
 * helper
 */

