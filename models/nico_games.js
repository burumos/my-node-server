const env = process.env;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(env.DB_FILE);

function nicoGames() {}
const tableName = 'nico_games';
const fillable = [
    'title',
    'contentId',
    'startTime',
    'viewCounter',
    'tags',
    'thumbnailUrl',
];

nicoGames.fetchAll = async () => {
    const sql = `SELECT * FROM ${tableName} ORDER BY startTime DESC`
    const list = await new Promise((resolve, reject) => db.all(sql,
        (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        }
    ));

    return list;
}

nicoGames.deleteAll = () => {
    return new Promise((resolve, reject) => db.run('DELETE FROM ' + tableName, (err) => {
        if (err) reject(err);
        resolve();
    }))
}

nicoGames.insert = (data) => {
    const sql = `INSERT INTO ${tableName} (${fillable.join(',')}) VALUES ("${fillable.map(k => data[k]).join('","')}")`;
    return new Promise((resolve, reject) => db.run(sql, (result, err) => {
        if (err) reject(err);
        resolve(result);
    }))
}

module.exports = nicoGames;

