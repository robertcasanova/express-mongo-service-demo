set -e

mongosh <<EOF

use $MONGO_DB

db.createUser(
  {
    user: '$MONGO_USER',
    pwd:  '$MONGO_PWD',
    roles: [ { role: "readWrite", db: "$MONGO_DB" }]
  }
)

db.createCollection('movies')
db.movies.createIndex({ title: "text"})

EOF

mongoimport --db $MONGO_DB --collection movies --jsonArray --file /tmp/movies.json
