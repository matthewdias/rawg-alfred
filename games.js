const alfy = require('alfy')
const fs = require('fs')
const got = require('got')

got(`https://api.rawg.io/api/games?search=${encodeURI(alfy.input)}`).then((response) => {
  let games = JSON.parse(response.body).results
  alfy.output(games.map((game) => {
    let url = 'https://rawg.io/games/' + game.slug
    let output = {
      uid: game.id,
      title: game.name,
      arg: url,
      autocomplete: game.autocomplete_name,
      text: { copy: url, largetype: url },
      quicklookurl: url
    }

    if (game.released) {
      output.subtitle = game.released.slice(0, 4)
    }

    if (game.background_image) {
      let path = `./cache/games/${game.id}.jpg`
      if (!fs.existsSync(path)) {
        got.stream(game.background_image).pipe(fs.createWriteStream(path))
      }
      output.icon = { path }
    }

    return output
  }))
})
