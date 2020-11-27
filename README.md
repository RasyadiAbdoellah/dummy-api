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

response 200: array of posts. Array length = 20
respsonse 400: error message
## GET /posts/:id

response 200: posts where `:id === post.id` or where `:id === post.slug`

response 404: 'Post not found'

## GET /users

response 200: 'Users'

