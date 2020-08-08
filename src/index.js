const express = require('express')
require('./db/mongoose')
const userrouter = require('./routers/userouters')
const taskrouter = require('./routers/taskrouter')

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

app.listen(PORT, ()=>{ 
    console.log(`Listening on PORT ${PORT}...`) 
})
