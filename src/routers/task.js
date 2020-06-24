const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const router = new express.Router()

//@descript Create New Task
//@route POST /tasks
//@access Private Middleware JWT Auth 
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
      ...req.body,
      creator: req.user._id
    })
  
    try{
      await task.save()
      res.status(201).send(task)
    } catch (e) {
      res.status(400).send(e)
    }
  })

  
// GET /tasks?completed=false
// GET /tasks?limit=1&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if(req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch(e) {
    res.status(500).send()
  }
})

//@descript Get Single Task
//@route GET /tasks/:id
//@access Private Middleware Auth
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
   
    try {
      const task = await Task.findOne({ _id, creator: req.user._id})
  
      if(!task) {
      return res.status(404).send()
      }
      res.send(task)
    } catch (e) {
      res.status(500).send(e)
    }
  })
  
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidTaskUpdate = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidTaskUpdate) {
      return res.status(400).send({ error: 'Invalid updates'})
    }
  
    try{
      const task = await Task.findOne({ _id, creator: req.user._id })

      
              
        if(!task) {
        return  res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e) {
      res.status(400).send(e)
    }
  })
  
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
      const task = await Task.findOneAndDelete({ _id, creator: req.user._id })
  
      if(!task) {
      return  res.status(400).send()
      }
    res.send(task)
    } catch(e) {
      res.status(500).send(e)
    }
  })

module.exports = router