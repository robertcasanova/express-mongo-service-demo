## Run Mongo locally

```
docker run -p 27017:27017 -v $(pwd)/data:/data/db --rm --name mongodb mongo 
```

## Create a DB

`use pixar` 

## Setup user

```
db.createUser(
  {
    user: "test",
    pwd:  passwordPrompt(),   // or cleartext password
    roles: [ { role: "readWrite", db: "pixar" }]
  }
)
```

## Create a collection and populate

Use `Compass` GUI for simplicity

## Setup text index for search

`db.movies.createIndex({ title: "text"})`

Query es: `db.movies.find({ $text: { $search: "toy" } } ).sort({"score":-1})`