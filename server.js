require('dotenv').config()
const express = require('express')
const { supabase } = require('./lib/supabaseClient')
const { refresh } = require('next/cache')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

app.post('/auth/signup', async (req, res) =>{
  const { email, password } = req.body
  if(!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const { data, error } = await supabase.auth.signUp({ email, password})
  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(201).json({user: data.user})

})

app.post('/auth/login', async (req,res) => {
  const { email, password } = req.body
  if( !email || !password) {
    return res.status(400).json({ error: 'Email and password required'})
  }
  const { data, error } = await supabase.auth.signInWithPassword({email, password})
  if (error){
    return res.status(401).json({ error: 'Invalid login credentials'})
  }
  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: data.user,
  })
})

app.get('/public/info', (req, res) => {
  return res.status(200).json({ message: 'Welcome stranger! This info is public.' })
})

app.get('/protected/profile', async (req, res) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  const { data, error } =  await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired access token' })
  }


  return res.status(200).json({
    id: data.user.id,
    email: data.user.email,
    created_at: data.user.created_at,
  })
})

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