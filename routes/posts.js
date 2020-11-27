const express = require('express');
const router = express.Router();

const data = require('../data')
const {postData, types, categories } = data

//generates post list. Post list does not include author img and full content


/* GET posts. */
router.get('/', function(req, res, next) {
  
  const resArray = postData.map(thePost => {
    const copied = Object.assign({}, thePost)
    return copied
  })
  let {offset = 0, limit = 10} = req.query
  const pinnedArray = resArray.filter(post => post.pinned )
  pinnedArray.reverse()

  try{

    offset = parseInt(offset)
    limit = parseInt(limit)

    if(req.query.type){
      
      // if(!types.includes(req.query.type)){
      //   throw new Error('invalid type')
      // }
      pinnedArray = pinnedArray.filter(post => post.type === req.query.type)
      resArray = resArray.filter(post => post.type === req.query.type)

    }

    if(req.query.category) {
      // if(!categories.includes(req.query.category)){
      //   throw new Error('invalid category')
      // }
      pinnedArray = pinnedArray.filter(post => post.category === req.query.category)
      resArray = resArray.filter(post => post.category === req.query.category)

    }
  
    if(req.query.date){
      
      const theDate = parse(req.query.date, 'yyyyMMdd', new Date())

      // if (!isValid(theDate)){
      //   throw new Error('invalid date')
      // }

      resArray = resArray.filter(post => isAfter(post.dateCreated, theDate ))
    }



    res.status(200).send({
      count: resArray.length,
      offset,
      limit,
      categories:{
        all: categories,
        active: req.query.categories || {}
      },
      pinnedPosts: pinnedArray.slice(0, 4),
      posts: resArray.slice(offset, offset+limit),
    });
    
  } catch (error) {
    res.status(400).send(error.toString())
  }


});

router.get('/:id', function (req, res, next) {
  
  const isNum = !!parseInt(req.params.id)
  const id = isNum ? parseInt(req.params.id) : req.params.id

  try {
    const foundPost = postData.find(post =>  id === (isNum ? post.id : post.slug))
    
    if (foundPost.length === 0){
      throw new Error('Post not found')
    }

    res.status(200).send(foundPost)

  } catch (error) {
    res.status(404).send(error.toString())
  }

})

module.exports = router;
