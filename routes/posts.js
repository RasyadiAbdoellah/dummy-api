const express = require('express');
const router = express.Router();

const data = require('../data')
const {postData, types, categories } = data

/* GET posts. */
router.get('/', function(req, res, next) {
  
  let resArray = postData.map(thePost => {
    const copied = Object.assign({}, thePost)
    return copied
  })

  let {offset = 0, limit = 10, category, type, date} = req.query

  try{

    offset = parseInt(offset)
    limit = parseInt(limit)

    if(type){
      
      // if(!types.includes(type)){
      //   throw new Error('invalid type')
      // }
      resArray = resArray.filter(post => post.type === type)

    }

    if(category) {
      // if(!categories.includes(req.query.category)){
      //   throw new Error('invalid category')
      // }
      resArray = resArray.filter(post => {
        //convert to category array to object
        const postCat = post.category.reduce((obj, val) => {
          obj[val] = true
          return obj
        }, {})
        
        let result = 0

        if(Array.isArray(category)){
          
          for(const category of category){
            if(postCat.hasOwnProperty(category)){
              // result++ // AND logic
              result = true // OR logic
            }
          }
          // result = result === category.length // AND logic

        } else {
          if(postCat.hasOwnProperty(category)){
            result = true
          }
        }

        return result
      })

    }
  
    if(date){
      
      const theDate = parse(date, 'yyyyMMdd', new Date())

      // if (!isValid(theDate)){
      //   throw new Error('invalid date')
      // }

      resArray = resArray.filter(post => isAfter(post.datePublished, theDate ))
    }

    const pinnedArray = resArray.filter(post => post.pinned).reverse().slice(0, 4)
    resArray = resArray.filter(post => !post.pinned).slice(offset, offset+limit)


    res.status(200).send({
      count: resArray.length,
      offset,
      limit,
      categories:{
        all: categories,
        active: category || []
      },
      pinnedPosts: pinnedArray,
      posts: resArray,
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
