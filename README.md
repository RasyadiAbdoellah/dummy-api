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

response 200: array of posts. Array length = 20

## GET /posts/:id

response 200: posts where :id = post id

response 404: 'Post not found'

## GET /users

response 200: 'Users'

