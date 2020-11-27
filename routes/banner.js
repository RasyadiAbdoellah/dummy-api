const express = require('express');
const router = express.Router();

const bannerData = require('../data').bannerData


/* GET posts. */
router.get('/', function(req, res, next) {
  const resArray = bannerData.map(post => {
    const {id, title, slug, imgUrl, url} = post
    return {
      id,
      title,
      slug,
      url,
      imgUrl,
    }
  })
  try{
    res.status(200).send({
      count: resArray.length,
      posts: resArray,
    });
    
  } catch (error) {
    res.status(400).send(error.toString())
  }

});

module.exports = router;
