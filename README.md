# my-node-server
家にあるraspaiで動かすnode server

# 環境構築

```bash
pwd
# = path/to/project/my-node-server

# sqliteのデータベースファイル作成
sqlite3
.open --new data.db
.exit

# create tables
cat ./tables/nico_games.sql | sqlite3 data.db

# .envをコピーして作成
cp example.env .env

# 依存関係解決
yarn install
# start server
yarn dev
```

3000ポートに立ち上る

本番での start server
```bash
yarn start
```

