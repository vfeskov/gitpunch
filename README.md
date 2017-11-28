## Production

```
docker build -t win-a-beer-react .
docker run --env-file server/.env -p 3000:3000 -it win-a-beer-react
```

Access `http://localhost:3000`

## Development

`npm start` in `./client` folder

`PORT=3001 npm run watch` in `./server` folder

Access `http://localhost:3000`
