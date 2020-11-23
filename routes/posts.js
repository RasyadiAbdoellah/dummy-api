const express = require('express');
const router = express.Router();

const faker = require('faker')
const addDays = require('date-fns/addDays')
const addHours = require('date-fns/addHours')
const isAfter = require('date-fns/isAfter')
const isValid = require('date-fns/isValid')
const { parse } = require('date-fns');

const types = ['event', 'article']
const categories = ['finance', 'creative', 'tech']

const data = []
//generate array of dummy posts
for(let i = 0 ; i < 1000; i++){

  //generate dummy content and exerpt
  const dummyContent = '<p>' + faker.lorem.paragraphs()
  const excerpt =  dummyContent.slice(0, 200)
  const slug = faker.lorem.slug()
  
  const dummyPost = {
    id: i+1,
    title: slug.split('-').join(' '),
    slug: slug,
    type: types[i%2], //Cycles through types. use Math.floor(Math.random() * 3) to randomly assign post type
    excerpt: excerpt + ( dummyContent.length > 200 ? '...' : '') + (excerpt.endsWith('</p>') ? '' : '</p>'),
    content: dummyContent,
    category: [categories[i%3]], //#finance, #creative, #tech. For UI and filtering. Post can have 1 or more categories. First element in array cycles through categories, second element is randomly picked
    author: {
      name: faker.name.findName(),
      url: faker.image.people(128,128)
    },
    dateCreated : addDays(new Date('2019-01-01T09:00:00+07:00'), i),
    url : faker.internet.url(),
  }
  if(dummyPost.type === types[0]) {
    //IF POST TYPE = EVENT
    let eventDate = addDays(new Date('2019-01-01T10:00:00+07:00'), i+2)
    dummyPost.startDate = eventDate,
    dummyPost.endDate = addHours(eventDate, 1),
    dummyPost.location = [faker.fake('{{address.streetAddress}}, {{address.city}} {{address.zipCode}}'),faker.fake('{{address.streetAddress}}, {{address.city}} {{address.zipCode}}')],
    dummyPost.quota = 100 //number of available space
  }

  data.push(dummyPost)

}

const postList = data.map(thePost => {
  const copied = Object.assign({}, thePost)
  if(copied.type === types[1]){
    copied.authorName = copied.author.name
  }
  delete copied.author
  delete copied.content

  return copied
})


/* GET posts. */
router.get('/', function(req, res, next) {

  let {offset = 0, limit = 10} = req.query
  let resArray = postList.map(post => post)
  
  try{

    offset = parseInt(offset)
    limit = parseInt(limit)

    if(isNaN(offset) || isNaN(limit)) {
      throw new Error('Invalid offset/limit')
    }

    if(req.query.type){
      
      if(!types.includes(req.query.type)){
        throw new Error('invalid type')
      }

      resArray = resArray.filter(post => post.type === req.query.type)

    }
  
    if(req.query.date){
      
      const theDate = parse(req.query.date, 'yyyyMMdd', new Date())

      if (!isValid(theDate)){
        throw new Error('invalid date')
      }

      resArray = resArray.filter(post => isAfter(post.dateCreated, theDate ))
    }

    res.status(200).send({
      count: resArray.length,
      data: resArray.slice(offset, offset+limit)
    });
    
  } catch (error) {
    res.status(400).send(error.toString())
  }


});

router.get('/:id', function (req, res, next) {

  try {
    const foundPost = data.find(post => req.params.id === (!parseInt(req.params.id) ? post.slug : post.id))
    
    if (foundPost.length === 0){
      throw new Error('Post not found')
    }

    res.send(foundPost)

  } catch (error) {
    res.status(404).send(error.toString())
  }

})

module.exports = router;
