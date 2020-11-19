const express = require('express');
const router = express.Router();
const LoremIpsum = require('lorem-ipsum').LoremIpsum
const addDays = require('date-fns/addDays')
const addHours = require('date-fns/addHours')
const isAfter = require('date-fns/isAfter')
const parseISO = require('date-fns/parseISO');
const { parse } = require('date-fns');
const e = require('express');

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 2,
  },
  wordsPerSentence : {
    max: 20,
    min: 5,
  }
})

const types = ['event', 'article', 'topic']
const categories = ['finance', 'creative', 'tech']

const postArray = []

for(let i = 0 ; i < 365; i++){

  const dummyContent = lorem.generateParagraphs(Math.floor(Math.random() * 5)).split('\n').map(para => '<p>'+para+'</p>').join('')
  const exerpt = dummyContent.slice(0, 200)
  
  const dummyPost = {
    id: i+1,
    title:lorem.generateWords(Math.floor(Math.random() * 21)),
    type: types[Math.floor(Math.random() * 3)], //can be event, article, topic
    exerpt: exerpt + ( dummyContent.length > 200 ? '...' : '') + (exerpt.endsWith('</p>') ? '' : '</p>'), //WP API sends out content in this format
    content: dummyContent, //WP API sends out content in this format
    category: [categories[Math.floor(Math.random() * 3)]], //#finance, #creative, #tech. For UI and filtering. Post can have 1 or more categories
    author: {
      name: lorem.generateWords(2),
      url: "profile img url"
    },
    dateCreated : addDays(new Date('2019-01-01T09:00:00+07:00'), i),
    url : "page url",
  }
  if(dummyPost.type === types[0]) {
    //IF POST TYPE = EVENT
    let eventDate = addDays(new Date('2019-01-01T10:00:00+07:00'), i+2)
    dummyPost.startDate = eventDate,
    dummyPost.endDate = addHours(eventDate, 1),
    dummyPost.location = ["location names or link to location on map application", "array of links if more than one location"],
    dummyPost.quota = 100 //number of available space
  }

  postArray.push(dummyPost)

}



/* GET home page. */
router.get('/', function(req, res, next) {

  const {offset = 0} = req.query

  let resArray = postArray.map(post => post)

  if(req.query.type){
    resArray = resArray.filter(post => post.type === req.query.type)
  }

  if(req.query.date){
    resArray = resArray.filter(post => isAfter(post.dateCreated, parse(req.query.date, 'yyyyMMdd', new Date())))
  }

  res.status(200).send(resArray.slice(offset, +offset+20));
});

router.get('/:id', function (req, res, next) {
  if(postArray[+req.params.id-1]){
    res.send(postArray[+req.params.id-1])
  } else {
    res.status(404).send('Post not found')
  }
})

module.exports = router;
