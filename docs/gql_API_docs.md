# WEBGALLERY GraphQL API Documentation

### Operation type: Describes what type of operation that is being performed, such as query, mutation, or subscription
### Operation name: Similar to a function name, gives queries meaningful names
### Field: Denotes the specific fields on objects that will be included with the response data
### Arguments: A set of key-value pairs associated with a specific field. The parameters can be literal values or variables. NOTE: Arguments can appear on any field, even # fields nested deep in an operation.

### Note: All operations require a valid authToken that is automatically obtained when preforming operations through the application.

## Operation Type: Queries

### Users

- description: list of all users
- response: 200
    - content-type: `application/json`
    - fields: 
        - _id: ID!
        - username: String!
        - email: String!
        - createdAt: String!
        - privacy: String
        - bracket: [Int!]!
        - interests: [String]!
        - stocks: [String]!
        - stocksData: StockCollection!
        - friends: [User]!
        - notFriends: [User]!
        - inGroups: [String!]!
        - groups: [Group]!
        - receivedReqs: [User]!
        - sentReqs: [User]!
        - visiblePosts: [Post]!
        - error - if error occurs

``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDRlYmQwNTg2MGJmZWJmZmM4ZDVkZmUiLCJpYXQiOjE2MTgwODA0NTksImV4cCI6MTYxODA4NDA1OX0.HP7Clw1Wa7ha07ebbeWgwMjT8yfG9IoNR7vGTcc7LhI' --data-binary '{"query":"query{\n  users{\n    _id\n  }\n}"}' --compressed
```

### User
- description: Information on specific user
- arguments:
    - id: user ID 
    - time: (optional) timeframe of stock data to recieve - 1Min, 15Min, 1Day etc - string
    - dataPoints: (optional) Amount of datapoits of stock data go gather within the timeframe - Int
- response: 200
    - content-type: `application/json`
    - fields
        - _id: ID!
        - username: String!
        - email: String!
        - createdAt: String!
        - privacy: String
        - bracket: [Int!]!
        - interests: [String]!
        - stocks: [String]!
        - stocksData: StockCollection!
        - friends: [User]!
        - notFriends: [User]!
        - inGroups: [String!]!
        - groups: [Group]!
        - receivedReqs: [User]!
        - sentReqs: [User]!
        - visiblePosts: [Post]!
```
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDRlYmQwNTg2MGJmZWJmZmM4ZDVkZmUiLCJpYXQiOjE2MTgwODA0NTksImV4cCI6MTYxODA4NDA1OX0.HP7Clw1Wa7ha07ebbeWgwMjT8yfG9IoNR7vGTcc7LhI' --data-binary '{"query":"query{\n  user(id:\"6045c7e7ab8be63fd041f33f\"){\n    _id\n  }\n}"}' --compressed
```

### Group
- description: Information on specific group
- arguments:
    - id: group ID
    - time: (optional) timeframe of stock data to recieve - 1Min, 15Min, 1Day etc - String
    - dataPoints: (optional) Amount of datapoits of stock data go gather within the timeframe - Int
- response: 200
    - content-type: `application/json`
    - fields
        - _id: ID!
        - name: String!
        - subscribedStocks: [String]!
        - stocksData: StockCollection!
        - predictions: [String]
        - admins: [User!]!
        - createdAt: String!
        - users: [User!]!
        - messages: [Message]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDRlYmQwNTg2MGJmZWJmZmM4ZDVkZmUiLCJpYXQiOjE2MTgwODA0NTksImV4cCI6MTYxODA4NDA1OX0.HP7Clw1Wa7ha07ebbeWgwMjT8yfG9IoNR7vGTcc7LhI' --data-binary '{"query":"query{\n  group(id:\"60490024a080cfb15efd7b7d\"){\n    _id\n  }\n}"}' --compressed
```

### Posts
- description: Get information on all posts
- response: 200
    - content-type: `application/json`
    - fields
        - _id: ID!
        - title: String!
        - content: String!
        - userID: String!
        - stock: String!
        - shares: Int!
        - action: String!
        - comments: [Comment]!
        - agree_count: Int!
        - disagree_count: Int!
        - agreeCount: Int!
        - disagreeCount: Int!
        - createdAt: String!
        - post_user: User!

``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDRlYmQwNTg2MGJmZWJmZmM4ZDVkZmUiLCJpYXQiOjE2MTgwODEzMDgsImV4cCI6MTYxODA4NDkwOH0.I9iI1s5dFLe6WEmVEr7ClBSk9N2M0i-Ds0pX3bW4BQQ' --data-binary '{"query":"query{\n  posts{\n    _id\n  }\n}"}' --compressed
```

### Post
- description: Information on specific post
- arguments:
    - id: post ID
- response: 200
    - content-type: `application/json`
    - fields
        - _id: ID!
        - title: String!
        - content: String!
        - userID: String!
        - stock: String!
        - shares: Int!
        - action: String!
        - comments: [Comment]!
        - agree_count: Int!
        - disagree_count: Int!
        - agreeCount: Int!
        - disagreeCount: Int!
        - createdAt: String!
        - post_user: User!
```
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDRlYmQwNTg2MGJmZWJmZmM4ZDVkZmUiLCJpYXQiOjE2MTgwODEzMDgsImV4cCI6MTYxODA4NDkwOH0.I9iI1s5dFLe6WEmVEr7ClBSk9N2M0i-Ds0pX3bW4BQQ' --data-binary '{"query":"query{\n  post(id:\"605aa0ca15f561c0ec2f4017\"){\n    _id\n  }\n}"}' --compressed
```

### Stock
- description: Stock information range
- arguments:
    - ticker: post ID
    - rangeStart: start of range - String
    - rangeEnd: end of range - String
- response: 200
    - content-type: `application/json`
    - fields
        ticker: String!
        data: [Bars!]!
        performance: Performance!
``` 
$ curlXXX
```

## Operation Type: Mutations

### setPrivacy
- description: Change privacy of a given user
- arguments:
    - id: user ID
    - privacy: new privacy level (public/private) - String
- response: 200
    - content-type: `application/json`
    - fields
        - User
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation changePrivacy{\n  setPrivacy(\n    id:\"6045c7e7ab8be63fd041f33f\" privacy:\"public\"){\n\t\tusername\n    privacy\n  }\n}"}' --compressed
```

### setBracket

- description: Change Bracket of a given user
- arguments:
    - id: user ID
    - newBracket: new bracket level ([0,100]/[100,1000]) - Integer Array
- response: 200
    - content-type: `application/json`
    - fields
        - User
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation changeBracket{\n  setBracket(\n    id:\"6045c7e7ab8be63fd041f33f\" newBracket:[1,100]){\n\t\tusername\n    privacy\n    bracket\n  }\n}"}' --compressed
```


### addInterest

- description: Add new stock interests to a user
- arguments:
    - id: user ID
    - newInterest: new stock interest name  - String array
- response: 200
    - content-type: `application/json`
    - fields
        - User
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation changeInterests{\n  addInterests(\n    id:\"6045c7e7ab8be63fd041f33f\" newInterests:[\"Technology!\", \"Healthcare\"]){\n\t\tusername\n    interests\n\n  }\n}"}' --compressed
```

### addStocks

- description: Add new stock following for a given user
- arguments:
    - id: user ID
    - newStocks: stock names - String array
- response: 200
    - content-type: `application/json`
    - fields
        - User
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation changeStocks{\n  addStocks(\n    id:\"6045c7e7ab8be63fd041f33f\" newStocks:[\"AAPL\"]){\n\t\tusername\n    stocks\n\n  }\n}"}' --compressed
```

### removeInterest

- description: Remove stock interest from given user
- arguments:
    - id: user ID
    - oldInterests: Interests to remove - String Array
- response: 200
    - content-type: `application/json`
    - fields
        - User
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation changeInterest{\n  removeInterests(\n    id:\"6045c7e7ab8be63fd041f33f\" oldInterests:[\"Healthcare\"]){\n\t\tusername\n    interests\n\n  }\n}"}' --compressed
```

### removeStocks

- description: Remove stock following from given user
- arguments:
    - id: user ID
    - oldStocks: Stocks to remove - String Array
- response: 200
    - content-type: `application/json`
    - fields
        - User
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation changeInterest{\n  removeStocks(\n    id:\"6045c7e7ab8be63fd041f33f\" oldStocks:[\"AAPL\"]){\n\t\tusername\n    stocks\n\n  }\n}"}' --compressed
```

### sendFriendRequest

- description: Send friend request from one user to another
- arguments:
    - senderID: user ID of sender - String
    - receiverID: user ID of receiver - String
- response: 200
    - content-type: `application/json`
    - fields
        - User - Sender user
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation sendRequest{\n  sendFriendRequest(\n    senderID:\"6045c7e7ab8be63fd041f33f\" receiverID:\"604ac6de2b3fac1590d2bf48\"){\n\t\tusername\n\n  }\n}"}' --compressed
```

### changeFriendStatus

- description: Change status of relationship between two users
- arguments:
    - senderID: user ID of sender - String
    - receiverID: user ID of receiver - String
    - relationship: new relationship between two users (blocked/friends) - String
- response: 200
    - content-type: `application/json`
    - fields
        - User - Sender user
            - _id: ID!
            - username: String!
            - email: String!
            - createdAt: String!
            - privacy: String
            - bracket: [Int!]!
            - interests: [String]!
            - stocks: [String]!
            - stocksData: StockCollection!
            - friends: [User]!
            - notFriends: [User]!
            - inGroups: [String!]!
            - groups: [Group]!
            - receivedReqs: [User]!
            - sentReqs: [User]!
            - visiblePosts: [Post]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation change{\n  changeFriendStatus(\n    senderID:\"6045c7e7ab8be63fd041f33f\" receiverID:\"604ac6de2b3fac1590d2bf48\" relationship:\"friends\"){\n\t\tusername\n\n  }\n}"}' --compressed
```

### createGroup

- description: Create group chat of users
- arguments:
    - name: Group chat name - String
    - stocks: Stocks followed by group - String Array
    - users: users in the group - String Array
    - admins: Admins of the group - String
- response: 200
    - content-type: `application/json`
    - fields
        - Group -
            - _id: ID!
            - name: String!
            - subscribedStocks: [String]!
            - stocksData: StockCollection!
            - predictions: [String]
            - admins: [User!]!
            - createdAt: String!
            - users: [User!]!
            - messages: [Message]!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation change{\n  createGroup(\n    name:\"gqltest\"\n    stocks: [\"AAPL\"]\n    users: [\"6045c7e7ab8be63fd041f33f\"]\n    admins: [\"6045c7e7ab8be63fd041f33f\"]\n    ){\n\t\tname\n  }\n}"}' --compressed
```

### addPost

- description: Add a new post
- arguments:
    - userID: User ID of post creator
    - content: Caption of the post - String
    - stock: stock with relation to post - String
    - action: action of the post - buy/sell/hold - String
    - shares: Number of shares of the action of the post - Int
- response: 200
    - content-type: `application/json`
    - fields
        - Post
            - _id: ID!
            - title: String!
            - content: String!
            - userID: String!
            - stock: String!
            - shares: Int!
            - action: String!
            - comments: [Comment]!
            - agree_count: Int!
            - disagree_count: Int!
            - agreeCount: Int!
            - disagreeCount: Int!
            - createdAt: String!
            - post_user: User!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation change{\n  addPost(\n    content:\"gqltest\"\n    stock: \"AAPL\"\n    userID: \"6045c7e7ab8be63fd041f33f\"\n    action: \"hold\"\n    shares: 25\n    ){\n\t\tcontent\n    shares\n  }\n}"}' --compressed
```

### removePost

- description: Remove a post
- arguments:
    - postID: String
- response: 200
    - content-type: `application/json`
    - fields
        - Post 
            - _id: ID!
            - title: String!
            - content: String!
            - userID: String!
            - stock: String!
            - shares: Int!
            - action: String!
            - comments: [Comment]!
            - agree_count: Int!
            - disagree_count: Int!
            - agreeCount: Int!
            - disagreeCount: Int!
            - createdAt: String!
            - post_user: User!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation change{\n  removePost(\n    postID: \"60720954bb45ec4700958298\"\n    ){\n\t\tcontent\n    shares\n    _id\n  }\n}"}' --compressed
```

### addComment

- description: Add a comment to a post
- arguments:
    - userID: String
    - content: String
    - postID: String
- response: 200
    - content-type: `application/json`
    - fields
        - Comment 
            - _id: ID!
            - postID: String!
            - userID: String!
            - content: String
            - createdAt: String!
            - agree: Boolean!
            - user: User!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation change{\n  addComment(\n    postID: \"60720954bb45ec4700958298\"\n    userID: \"6045c7e7ab8be63fd041f33f\"\n    content: \"yurr\"\n    ){\n    postID\n  }\n}"}' --compressed
```

### removeComment

- description: Remove a comment to a post
- arguments:
    - commentID: String
- response: 200
    - content-type: `application/json`
    - fields
        - Comment 
            - _id: ID!
            - postID: String!
            - userID: String!
            - content: String
            - createdAt: String!
            - agree: Boolean!
            - user: User!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODQ1MDMsImV4cCI6MTYxODA4ODEwM30.Br5ZkLWdzS0GqeYQd7GlUJjgdF_l6ZnuUaGQnvq9o74' --data-binary '{"query":"mutation change{\n  removeComment(\n    commentID: \"60720954bb45ec4700958298\"  ){\n    commentID\n  }\n}"}' --compressed
```

### agreePost

- description: Agree to a post
- arguments:
    - postID: String
- response: 200
    - content-type: `application/json`
    - fields
        - Post 
            - _id: ID!
            - title: String!
            - content: String!
            - userID: String!
            - stock: String!
            - shares: Int!
            - action: String!
            - comments: [Comment]!
            - agree_count: Int!
            - disagree_count: Int!
            - agreeCount: Int!
            - disagreeCount: Int!
            - createdAt: String!
            - post_user: User!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODY1NzYsImV4cCI6MTYxODA5MDE3Nn0.SusCA6bCcGg5ccuU4-_KFoWP-_yqlGERuEF35vLphis' --data-binary '{"query":"mutation change{\n  agreePost(\n    postID: \"605aa0ca15f561c0ec2f4017\"\n    ){\n    agree_count\n  }\n}"}' --compressed
```

### disagreePost

- description: Disagree to a post
- arguments:
    - postID: String
- response: 200
    - content-type: `application/json`
    - fields
        - Post 
            - _id: ID!
            - title: String!
            - content: String!
            - userID: String!
            - stock: String!
            - shares: Int!
            - action: String!
            - comments: [Comment]!
            - agree_count: Int!
            - disagree_count: Int!
            - agreeCount: Int!
            - disagreeCount: Int!
            - createdAt: String!
            - post_user: User!
``` 
$ curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MDQ1YzdlN2FiOGJlNjNmZDA0MWYzM2YiLCJpYXQiOjE2MTgwODY1NzYsImV4cCI6MTYxODA5MDE3Nn0.SusCA6bCcGg5ccuU4-_KFoWP-_yqlGERuEF35vLphis' --data-binary '{"query":"mutation change{\n  disagreePost(\n    postID: \"605aa0ca15f561c0ec2f4017\"\n    ){\n    disagree_count\n  }\n}"}' --compressed
```
