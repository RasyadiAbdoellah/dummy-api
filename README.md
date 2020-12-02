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

Available query parameters:
* limit = number of posts in response
* offset = how many posts to skip. e.g. offset=10 will skip 10 posts.
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
  "excerpt": "<p>excerpt</p>", //WP API sends out content in this format,
  "content": "<p>content</p>", //WP API sends out content in this format
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

## GET /posts/:id/comments

Available query parameters:
* limit = number of comments in response
* offset = how many comments to skip. e.g. offset=10 will skip 10 comments.

response 200: comments for post where `:id === post.id` or where `:id === post.slug`
```json
{
  "count": 12, //total number of comments
  "offset": 0, //offset of response
  "limit": 5, //limit of response. Default is 5,
  "comments": [
    {
      "id": 1, //comment ID
      "author": {
        "name": "user name",
        "imgUrl": "profile url img",
      },
      "content": "<p>comment content</p>",
      "replies": [
        {
          "id": 2, //comment ID
          "author": {
            "name": "user name",
            "imgUrl": "profile url img",
          },
          "content": "<p>comment content</p>",
          "parent": {
            "id": 1, //parent comment ID
            "author": {
              "name": "user name",
            },
          }
        }
      ]
    }
  ]
}
```
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

WIP
response 200: 'Users'

