require('dotenv').config();
const nicoService = require('../servives/nico');
const nicoGames = require('../models/nico_games');

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(
        () => resolve(),
        milliseconds
    ));
}

async function process() {
    nicoGames.deleteAll();
    let data = await nicoService.fetchByKeyword('mtg -mtga -mtgアリーナ', 5, 300);
    await wait(500);
    data = data.concat(await nicoService.fetchByKeyword('sims -MMD -MikuMikuDance', 5, 100));
    await wait(500);
    data = data.concat(await nicoService.fetchByKeyword('tropico', 3, 100));
    await wait(500);
    data = data.concat(await nicoService.fetchByKeyword('cities:skylines', 5, 500));
    await wait(500);
    data = data.concat(await nicoService.fetchByKeyword('格ゲー淫夢', 5, 500));
    await wait(500);
    data = data.concat(await nicoService.fetchByKeyword('ets2 -MMD', 5, 100));

    data = data.sort((r1, r2) => {
        return r1.startTime >= r2.startTime ? -1 : 1;
    });

    data.map(rec => nicoGames.insert(rec));
}

process();
