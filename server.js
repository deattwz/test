const express = require('express')
const request = require('request')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const getWebhookUrl = (name) => {
  name=name.toUpperCase() // idiot protection
  
  if (!process.env[`WB_${name}`]) return false
  
  return process.env[`WB_${name}`]
}

app.post('/api/:webhookId', async function(req, res, next) {
  //this is the code thats bad below
  var webhook = req.params.webhookId
  if (!webhook) return next()
  
  webhook = getWebhookUrl(webhook)
  if (webhook === false) return next()
  
  // webhook exists (gamer)
  
  let options = {
    'method': 'POST',
    'url': webhook,
    'headers': {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body)
  }
  
  return request(options, (error, response) => {
    if (error) throw new Error(error);
    return res.send(response.body)
  });
})

app.use((_req, res, _next) => {
  // error 404
  return res.redirect("https://www.youtube.com/watch?v=GY8PkikQ8ZE")
})

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
