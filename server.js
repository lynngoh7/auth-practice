require('dotenv').config()
const express = require('express')
const { supabase } = require('./lib/supabaseClient')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

async function startServer() {
  const { error } = await supabase.auth.getSession()
  if (error) {
    console.error('Failed to connect to Supabase:', error.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log('Server running and connected to Supabase')
  })
}

startServer()