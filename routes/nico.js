const express = require('express');
const dayjs = require('dayjs');
const router = express.Router();
const nicoService = require('../servives/nico');


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

