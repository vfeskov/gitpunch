<p align="center">
  <br/>
  <a href="https://gitpunch.com"><img width="300px" src="https://raw.githubusercontent.com/vfeskov/gitpunch/master/client/src/big-logo.png"/></a>
  <br/>
  <br/>
  Watch for releases on GitHub
</p>

## Features

- **Realtime** or **daily** updates
- Ignore **minor**, **patch** or **pre-releases** ([semver](https://semver.org/))
- Optionally **watch starred** repos
- Completely **open-source**

## API

### `POST /api/sign_in`

Gets you an authorization token via cookie

Example payload
```json
{
  "email": "test@email.com",
  "password": "testpassword"
}
```

Responds with user record (see [profile](#profile)) and `Set-Cookie` header that sets `token` cookie. The cookie must be sent with subsequent requests for authorization

### `DELETE /api/sign_out`

Unsets `token` cookie

### <a id="profile"></a>`GET /api/profile`

Returns authorized user record

Example response:
```js
{
  "id":"5bd5f53e66785643e93c83a9",
  "email":"test@email.com",
  "frequency":"daily",
  "checkAt":9, // UTC hour
  "accessToken":"tui43sg76bbcbfce178bb682b01d6ebcd8b1c221", // of github
  "watching":true,
  "watchingStars":1, // 0: not watching stars
                     // 1: adding new stars
                     // 2: 1 + removing nonstars
  "alerted":[["angular/angular","7.1.0-beta.1"],["vuejs/vue","v2.5.17"]],
  "repos":[
    {
      "repo":"angular/angular",
      "muted":false,
      "filter":0 // 0: only major releases
                 // 1: major & minor
                 // 2: major, minor & patch
                 // 3: all
    },
    {
      "repo":"vuejs/vue",
      "muted":true,
      "filter":2
    }
  ]
}
```

### `PATCH /api/profile`

Updates record of authorized user

Any of the params can be send alone or all together:
```js
{
  "frequency":"daily",
  "checkAt":9, // UTC hour
  "watching":true,
  "watchingStars":1, // 0: not watching stars
                     // 1: adding new stars
                     // 2: 1 + removing nonstars
  "repos":[
    {
      "repo":"angular/angular",
      "muted":false,
      "filter":0 // 0: only major releases
                 // 1: major & minor
                 // 2: major, minor & patch
                 // 3: all
    },
    {
      "repo":"vuejs/vue",
      "muted":true,
      "filter":2
    }
  ]
}
```

Responds with result user record, see [profile](#profile)

### `POST /api/repos`

Adds a repo to authorized user

Params:
```js
{
  "repo":"angular/angular",
  "muted":false,
  "filter":0 // 0: only major releases
             // 1: major & minor
             // 2: major, minor & patch
             // 3: all
}
```

Responds with all repos of authorized user, <a id="all-repos-example"></a>example:
```js
{
  "repos":[
    {
      "repo":"angular/angular",
      "muted":false,
      "filter":0 // 0: only major releases
                 // 1: major & minor
                 // 2: major, minor & patch
                 // 3: all
    },
    {
      "repo":"vuejs/vue",
      "muted":true,
      "filter":2
    }
  ]
}
```

### `POST /api/repos/bulk`

Adds multiple repos to authorized user

Params:
```js
{
  "repos":[
    {
      "repo":"angular/angular",
      "muted":false,
      "filter":0 // 0: only major releases
                 // 1: major & minor
                 // 2: major, minor & patch
                 // 3: all
    },
    {
      "repo":"vuejs/vue",
      "muted":true,
      "filter":2
    }
  ]
}
```

Responds with all repos of authorized user, see [example](#all-repos-example)

### `PATCH /api/repos/all`

Updates all repos of authorized user

Params can be sent alone or all together:
```js
{
  "muted":false,
  "filter":0 // 0: only major releases
             // 1: major & minor
             // 2: major, minor & patch
             // 3: all
}
```

Responds with all repos of authorized user, see [example](#all-repos-example)

### `PATCH /api/repos/:repo`

Updates a single repo of authorized user

Params:
```js
{
  "muted":false,
  "filter":0 // 0: only major releases
             // 1: major & minor
             // 2: major, minor & patch
             // 3: all
}
```

Responds with all repos of authorized user, see [example](#all-repos-example)

### `DELETE /api/repos/all`

Deletes all repos of authorized user

Responds with `{repos: []}`

### `DELETE /api/repos:repo`

Deletes a repo of authorized user

Responds with all repos of authorized user, see [example](#all-repos-example)

## Notifier Stats
<img src="https://raw.githubusercontent.com/vfeskov/gitpunch/master/monitoring.png" width="800px" />

## Credits

Logo by [Sasha Feskova](https://www.behance.net/feskovochka). Special thanks to [@soulim](https://github.com/soulim) and [@luziamg](https://github.com/luziamg)

----------

Support GitPunch by reporting bugs, suggesting ideas and starring the project - your feedback really helps me stay motivated ♥
