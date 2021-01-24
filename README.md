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

# .envをコピーして作成
cp example.env .env

# 依存ファイルを取得
yarn
# start server
yarn dev
```


本番での start server
```bash
yarn start
```

