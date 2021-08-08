const { gql } = require('apollo-server');

const typeDefs = gql`
  type Bars {
    startEpochTime: Int!
    openPrice: Float!
    highPrice: Float!
    lowPrice: Float!
    closePrice: Float!
    volume: Int!
  }

  type Performance {
	startEpochTime: Int!
	endEpochTime: Int!
    changeAmount: Float!
	changePercentage: Float!
	startPrice: Float!
	endPrice: Float!
  }

  type Stock {
    ticker: String!
    data: [Bars!]!
	performance: Performance!
  }

  type StockCollection {
    stocks: [Stock!]!
    total: Stock!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    createdAt: String!
    privacy: String
    bracket: [Int!]!
    interests: [String]!
    stocks: [String]!
    stocksData: StockCollection!
	friends: [User]!
	notFriends: [User]!
	inGroups: [String!]!
	groups: [Group]!
	receivedReqs: [User]!
	sentReqs: [User]!
	visiblePosts: [Post]!
  }

  type Group {
	_id: ID!
	name: String!
	subscribedStocks: [String]!
	stocksData: StockCollection!
	predictions: [String]
	admins: [User!]!
	createdAt: String!
	users: [User!]!
	messages: [Message]!
  }

  type MessageContext {
	  bar: String!
	  startEpochTime: Int!
	  endEpochTime: Int!
	  stock: String!
  }

  type Message {
	_id: ID!
	groupID: String!
	userID: String!
	user: User!
	content: String!
	createdAt: String!
	context: MessageContext
  }

  type Post {
    _id: ID!
    title: String!
	content: String!
    userID: String!
    stock: String!
	shares: Int!
	action: String!
	comments: [Comment]!
	agree_count: Int!
	disagree_count: Int!
	agreeCount: Int!
	disagreeCount: Int!
	createdAt: String!
	post_user: User!
  }

  type Comment {
	_id: ID!
	postID: String!
	userID: String!
	content: String
	createdAt: String!
	agree: Boolean!
	user: User!
  }

  type Mutation {
	setPrivacy(id: ID!, privacy: String!): User
	setBracket(id: ID!, newBracket: [Int!]!): User
	addInterests(id: ID!, newInterests: [String!]!): User
	addStocks(id: ID!, newStocks: [String!]!): User
	removeInterests(id: ID!, oldInterests: [String!]!): User
	removeStocks(id: ID!, oldStocks: [String!]!): User
	sendFriendRequest(senderID: String!, receiverID: String!): User
	removeFriendRequest(senderID: String!, receiverID: String!): User
	changeFriendStatus(senderID: String!, receiverID: String!, relationship: String!): User
	createGroup(name: String!, stocks: [String!]!, users: [String!]!, admins: [String!]!): Group
	addPost(userID: String!, content: String!, stock: String!, action: String!, shares:Int!): Post
	removePost(postID: String!): Post
	addComment(userID: String!, content: String!, postID: String!): Comment
	removeComment(commentID: String!): Comment
	agreePost(postID: String!): Post
	disagreePost(postID: String!): Post
  }

  type Query {
	users: [User!]!
    user(id: ID!, time: String, dataPoints: Int): User
	group(id: ID!, time: String, dataPoints: Int): Group
	posts: [Post!]!
	post(id: ID!, time: String, dataPoints: Int): Post
    stock(ticker: String!, rangeStart: String!, rangeEnd:String!): Stock
  }
`;

module.exports = { typeDefs };