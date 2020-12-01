const faker = require('faker')
const addDays = require('date-fns/addDays')
const addHours = require('date-fns/addHours')
const isAfter = require('date-fns/isAfter')
const isValid = require('date-fns/isValid')
const { parse } = require('date-fns');

//returns either 1 or 0
function coinFlip() {
  return (Math.floor(Math.random() * 2))
}

const types = ['event', 'article']
const categories = ['finance', 'creative', 'tech']


const postData = []
const bannerData = []

function genAuthor() {
  return {
    name: faker.name.findName(),
    imgUrl: faker.image.people(128,128)
  }
}

function genContent() {
  return '<p>' + faker.lorem.paragraphs() + '</p>'
}

//generate array of dummy posts
for(let i = 0 ; i < 1000; i++){
  
  const comment = {
    id: 1,
    author: genAuthor(),
    content: genContent()
  }
  
  //Mock comment data with an array of replies
  const comments = {
    ...comment,
    replies: [
      {content: genContent(), author: genAuthor(), id: 2, parent: {id: 1, author: comment.author}},
      {content: genContent(), author: genAuthor(), id: 3, parent: {id: 1, author: comment.author}},
    ]
  }

  //generate dummy content and exerpt
  const dummyContent = '<p>' + faker.lorem.paragraphs() + '</p>'
  const excerpt =  dummyContent.slice(0, 200)
  const title = faker.lorem.sentence()

  const dummyPost = {
    id: i+1,
    title,
    slug: title.replace(/ /g, '-').replace(/[^\w\-]+/g, '').toLowerCase(),
    type: types[coinFlip()], //randomly returns either 0 or 1
    excerpt: excerpt + ( dummyContent.length > 200 ? '...' : '') + (excerpt.endsWith('</p>') ? '' : '</p>'),
    content: dummyContent,
    category: [categories[i%3], categories[(Math.floor(Math.random() * 3))]], //#finance, #creative, #tech. For UI and filtering. Post can have 1 or more categories. First element in array cycles through categories, second element is randomly picked
    author: genAuthor(),
    imgUrl: coinFlip() ? "https://jenius-cocreate.s3.ap-southeast-1.amazonaws.com/assets/2020/11/25134436/feature-bener.png" : '',
    datePublished : addDays(new Date('2019-01-01T09:00:00+07:00'), i),
    url : faker.internet.url(),
    meta: {
      description: faker.lorem.sentences(),
      title: `Jenius CoCreate - ${title}`,
    },
    pinned: coinFlip(),
    comments:[{...comments}]
  }
  if(dummyPost.type === types[0]) {
    //IF POST TYPE = EVENT
    let eventDate = addDays(new Date('2019-01-01T10:00:00+07:00'), i+2)
    dummyPost.startDate = eventDate,
    dummyPost.endDate = addHours(eventDate, 1),
    dummyPost.location = [faker.fake('{{address.streetAddress}}, {{address.city}} {{address.zipCode}}'),faker.fake('{{address.streetAddress}}, {{address.city}} {{address.zipCode}}')],
    dummyPost.quota = 100 //number of available space
  }

  if(coinFlip() && dummyPost.imgUrl !== '' && bannerData.length < 10){
    bannerData.push(dummyPost)
  }
  postData.push(dummyPost)

}

module.exports = {
  types,
  categories,
  postData,
  bannerData
}