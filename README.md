# Dummy API
This is a placeholder dummy API. Designed to mock API responses, but has no DB connections. All data is generated when the API is started and no data is persisted. Has hot reloading so that the API reloads after code changes.

# Installation

1. Clone repo
2. Run `yarn install`
3. Run `yarn start`

# Endpoints

## GET /

response: 'Hello'

## GET /posts

Available queries:
* limit = number of posts in response
* offset = how many posts to skip. e.g. offset=10 first post in response will be id: 11.
* type = filters by post type. Must be either 'article' or 'event'. Returns posts where type === post.type.
* category = filters by post category. Must be 'tech', 'creative', or 'finance. Returns posts where category === post.category.

response 200: array of posts and pinned posts. post length = 20, pinned post length = 5
```json
"count" : 1234 // total number of posts
"offset" : 0 // current offset
"categories" : {
  "all": ["category 1", "category 2"] //list of all categories
  "active": {
    "category 1" : true, 
    "Category 2" : true
  }, //applied filters
},
"pinnedPost" : [
  // array of posts where pinned == 1
],
"posts":[ 
  //array of post objects (See GET /post/:id for post object info)
], 
```
## GET /posts/:id

response 200: post where `:id === post.id` or where `:id === post.slug`
```json
{
  "id": 1,
  "title": "post title",
  "slug": "post-slug",
  "type": "event", //can be event, article, topic
  "excerpt": "excerpt", //WP API sends out content in this format,
  "content": "content", //WP API sends out content in this format
  "category": ["category 1", "category 2"], //#finance, #creative, #tech. For UI and filtering. Post can have 1 or more categories
  "author": {
    "name": "author name",
    "url": "profile img url",
    },
  "imgUrl" : "url to banner img",
  "datePublished" : "datetime",
  "url" : "page url",
  "meta": {
    "description": "meta description",
    "title": "Jenius CoCreate - page title",
  },
  "pinned": 0 // 1 if pinned
  
  //IF POST TYPE = EVENT
  "startDate" : "datetime",
  "endDate" : "datetime",
  "location" : ["location names or link to location on map application", "array of links if more than one location"],
  "quota": 100 //number of available space
}
```
response 404: 'Post not found'

## GET /banner
response 200: array of banner object
```json
{
  "count": 10, //count of banner content
  "data": [
    {
      "id": 1,
      "title": "post title",
      "slug": "post-slug",
      "imgUrl" : "url to banner img",
      "url" : "page url",
    },
  ]
}
```
## GET /users

response 200: 'Users'

