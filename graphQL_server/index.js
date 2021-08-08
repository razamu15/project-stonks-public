const { ApolloServer, ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server');
const { ObjectId, MongoClient } = require('mongodb');
const jwt = require("jsonwebtoken");
const Alpaca = require('@alpacahq/alpaca-trade-api');
const { alpacaConfig, loginConfig, mongoConfig } = require('../config/config');

var mongoDB;
const client = new MongoClient(mongoConfig.URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
client.connect((err, returnedClient) => {
	if (err) {
		console.error(err);
	} else {
		mongoDB = returnedClient.db("stonks");
	}
});

const alpaca = new Alpaca({
	keyId: alpacaConfig.KEY,
	secretKey: alpacaConfig.SECRET,
	paper: true,
	usePolygon: false
});

const { typeDefs } = require('./typeDefs');

async function topLevelStockCollection(args) {
	if (args.time == null || args.dataPoints == null) {
		throw new ApolloError("both time and dataPoints params need to be specified to query for stock data");
	}
	// return object we will build/fill in below
	let resultStocks = { stocks: [] };
	// use async to make alpaca api calls for each stock we need to get data for
	// we cant do multiple because the library is broken
	try {
		for (const stk of args.tickers) {
			let barset = await alpaca.getBars(args.time, stk, {
				limit: args.dataPoints
			});
			let stockType = {
				ticker: stk,
				data: barset[stk]
			};
			// push this stock's data into the result object
			resultStocks.stocks.push(stockType);
		}
	} catch (error) {
		throw new ApolloError(error);
	}
	// after the we set the data for all the stock the resolver for this query will end
	// but the resolver we defined for the total field on the StockCollection type will run
	return resultStocks;
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const resolvers = {
	Query: {
		async user(parent, args, context, info) {
			try {
				let user = await mongoDB.collection("Users").findOne({ _id: new ObjectId(args.id) });
				// set optional params in context if given
				if (args.time) {
					context.time = args.time;
				}
				if (args.dataPoints) {
					context.last = args.dataPoints
				}
				return user;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async users() {
			try {
				let users = await mongoDB.collection("Users").find({}, { projection: { password: 0 } }).toArray();
				return users;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async post(parent, args, context, info) {
			try {
				let post = await mongoDB.collection("Posts").findOne({ _id: new ObjectId(args.id) });
				// set optional params in context if given
				if (args.time) {
					context.time = args.time;
				}
				if (args.dataPoints) {
					context.last = args.dataPoints
				}
				return post;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async posts() {
			try {
				let posts = await mongoDB.collection("Posts").find({}).toArray();
				return posts;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async group(parent, args, context, info) {
			try {
				// get all the group objects that this user is in
				let group = await mongoDB.collection("Groups").findOne({ _id: new ObjectId(args.id) });
				// set optional params in context if given
				if (args.time) {
					context.time = args.time;
				}
				if (args.dataPoints) {
					context.last = args.dataPoints
				}
				return group;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async stock(parent, args, context, info) {
			try {
				let barset = await alpaca.getBars('15Min', args.ticker, {
					start: (new Date(parseInt(args.rangeStart) * 1000)).toISOString(),
					end: (new Date(parseInt(args.rangeEnd) * 1000)).toISOString(),
				});
				return {
					ticker: args.ticker,
					data: barset[args.ticker]
				};
			} catch (error) {
				throw new ApolloError(error);
			}	
		},
	},
	Mutation: {
		async setPrivacy(parent, args, context, info) {
			if(context.user._id !== args.id){
				throw new ForbiddenError('Not allowed');
			}
			try {
				let result = await mongoDB.collection("Users").findOneAndUpdate({ _id: new ObjectId(args.id) }, { $set: { privacy: args.privacy } }, { returnOriginal: false });
				return result.value;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async setBracket(parent, args, context, info) {
			if(context.user._id !== args.id){
				throw new ForbiddenError('Not allowed');
			}
			try {
				let result = await mongoDB.collection("Users").findOneAndUpdate({ _id: new ObjectId(args.id) }, { $set: { bracket: args.newBracket } }, { returnOriginal: false });
				return result.value;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async addInterests(parent, args, context, info) {
			if(context.user._id !== args.id){
				throw new ForbiddenError('Not allowed');
			}
			try {
				// append items from the interest list in args to the interests array for this user
				let result = await mongoDB.collection("Users").findOneAndUpdate({ _id: new ObjectId(args.id) }, { $push: { interests: { $each: args.newInterests } } }, { returnOriginal: false });
				return result.value;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async addStocks(parent, args, context, info) {
			if(context.user._id !== args.id){
				throw new ForbiddenError('Not allowed');
			}
			try {
				// check if the ticker is valid
				let barset = await alpaca.getBars('1D', args.newStocks[0], {
					limit: 1
				});
				if(barset[ args.newStocks[0] ] [0] ) {
					// append items from the interest list in args to the interests array for this user
					let result = await mongoDB.collection("Users").findOneAndUpdate({ _id: new ObjectId(args.id) }, { $push: { stocks: { $each: args.newStocks } } }, { returnOriginal: false });
					return result.value;
				} else {
					return {
						stocks: []
					}
				}
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async removeInterests(parent, args, context, info) {
			if(context.user._id !== args.id){
				throw new ForbiddenError('Not allowed');
			}
			try {
				let result = await mongoDB.collection("Users").findOneAndUpdate({ _id: new ObjectId(args.id) }, { $pull: { interests: { $in: args.oldInterests } } }, { returnOriginal: false });
				return result.value;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async removeStocks(parent, args, context, info) {
			if(context.user._id !== args.id){
				throw new ForbiddenError('Not allowed');
			}
			try {
				// append items from the interest list in args to the interests array for this user
				let result = await mongoDB.collection("Users").findOneAndUpdate({ _id: new ObjectId(args.id) }, { $pull: { stocks: { $in: args.oldStocks } } }, { returnOriginal: false });
				return result.value;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async sendFriendRequest(parent, args, context, info) {
			if(context.user._id !== args.senderID){
				throw new ForbiddenError('Not allowed');
			}
			try {
				let time = (new Date()).toUTCString();
				let new_rel = {
					senderID: args.senderID,
					receiverID: args.receiverID,
					createdAt: time,
					updatedAt: time,
					relationship: null,
					requestCompleted: false
				}
				let rel_insert = await mongoDB.collection("Relations").insertOne(new_rel);
				// insert happened, so now do query for user
				let user = await mongoDB.collection("Users").findOne({ _id: new ObjectId(args.senderID) });
				return user;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async removeFriendRequest(parent, args, context, info) {
			if(context.user._id !== args.senderID && context.user._id !== args.receiverID){
				throw new ForbiddenError('Not allowed');
			}
			try {
				// insert happened, so now do query for user
				let relation = await mongoDB.collection("Relations").removeOne({ senderID: args.senderID, receiverID: args.receiverID });
				let user = await mongoDB.collection("Users").findOne({ _id: new ObjectId(args.senderID) });

				return user;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async changeFriendStatus(parent, args, context, info) {
			try {
				let status = true;
				if(args.relationship == "delete"){
					status = false;
				}
				let result = await mongoDB.collection("Relations").findOneAndUpdate({senderID: args.senderID, receiverID: args.receiverID}, { $set: { relationship: args.relationship, requestCompleted: true } });
				let user = await mongoDB.collection("Users").findOne({ _id: new ObjectId(args.senderID) });
				return user ;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async createGroup(parent, args, context, info) {
			try {
				let new_group = {
					name: args.name,
					users: args.users,
					admins: args.admins,
					subscribedStocks: args.stocks,
					predictions: [],
					createdAt: (new Date()).toUTCString()
				}
				let result = await mongoDB.collection("Groups").insertOne(new_group);
				return result.ops[0];
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async addPost(parent, args, context, info) {
			if(context.user._id !== args.userID){
				throw new ForbiddenError('Not allowed');
			}
			try {
				let time = (new Date()).toUTCString();
				let new_post = {
					content: args.content,
					userID: args.userID,
					stock: args.stock,
					action: args.action,
					createdAt: time,
					updatedAt: time,
					shares: args.shares,
					agree_count: 0,
					disagree_count: 0
				}
				let result = await mongoDB.collection("Posts").insertOne(new_post);
				return result.ops[0];
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async removePost(parent, args, context, info){
			try {
				// append items from the interest list in args to the interests array for this user
				let temp = await mongoDB.collection("Posts").findOne({ _id: new ObjectId(args.postID) });
				//check if args.user == postId user
				if(temp.userID !== context.user._id){
					throw new ForbiddenError('Not allowed');
				}
				// let remove = await mongoDB.collection("Posts").removeOne({ _id: new ObjectId(args.postID) });
				// let removeComments = await mongoDB.collection("Comments").remove({ postID: args.postID });
				return temp;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async addComment(parent, args, context, info){
			if(context.user._id !== args.userID){
				throw new ForbiddenError('Not allowed');
			}
			try {
				let time = (new Date()).toUTCString();
				let new_comment = {
					content: args.content,
					userID: args.userID,
					postID: args.postID,
					createdAt: time,
				}
				let result = await mongoDB.collection("Comments").insertOne(new_comment);
				return result.ops[0];
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async removeComment(parent, args, context, info){
			try {
				let temp = await mongoDB.collection("Comments").findOne({ _id: new ObjectId(args.commentID) });
				let tempPost = await mongoDB.collection("Posts").findOne({ _id: new ObjectId(temp.postID) });

				if(context.user._id !== temp.userID && context.user._id !== tempPost.userID){
					throw new ForbiddenError('Not allowed');
				}
				let remove = await mongoDB.collection("Comments").removeOne({ _id: new ObjectId(args.commentID) });
				return temp;
			} catch (error) {
				throw new ApolloError(error);
			}	
		},
		async agreePost(parent, args, context, info){
			try {
				// append items from the interest list in args to the interests array for this user
				await mongoDB.collection("Posts").updateOne({ _id: new ObjectId(args.postID) }, {$inc: {"agree_count":1}});
				let temp = await mongoDB.collection("Posts").findOne({ _id: new ObjectId(args.postID) });
				//check if args.user == postId user
				return temp;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async disagreePost(parent, args, context, info){
			try {
				// append items from the interest list in args to the interests array for this user
				await mongoDB.collection("Posts").updateOne({ _id: new ObjectId(args.postID) }, {$inc: {"disagree_count":1}});
				let temp = await mongoDB.collection("Posts").findOne({ _id: new ObjectId(args.postID) });
				//check if args.user == postId user
				return temp;

			} catch (error) {
				throw new ApolloError(error);
			}
		},
	},
	User: {
		// we define the friends field for the user object because it doesnt some directly from the database
		async friends(parent) {
			// args contains the arguments to this query
			try {
				// get a list of userids that have realtionship friends with this userid
				// the serch criteria is (sender_id = user._id || receiver_id = user._id) && (relationship = "friends")
				let relations = await mongoDB.collection("Relations").find({ $and: [{ $or: [{ senderID: `${parent._id}` }, { receiverID: `${parent._id}` }] }, { relationship: 'friends' }] }).toArray();
				// now we turn the list of relation objects into a list of userids of friends
				let friend_ids = relations.map((relation) => {
					//return the one that is not the same as the parent's id
					if (relation.receiverID == parent._id) {
						return new ObjectId(relation.senderID)
					} else {
						return new ObjectId(relation.receiverID)
					}
				});
				// now get all the user documents from list of friends
				let friends = await mongoDB.collection("Users").find({ _id: { $in: friend_ids } }).toArray();
				// now we need to figure out how to enbed this into the user tings
				return friends;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async notFriends(parent) {
			// args contains the arguments to this query
			try {
				// get a list of userids that have realtionship friends with this userid
				let relations = await mongoDB.collection("Relations").find({ $or: [{ senderID: `${parent._id}` }, { receiverID: `${parent._id}` }] }).toArray();
				// now we turn the list of relation objects into a list of userids of friends
				let friend_ids = relations.map((relation) => {
					//return the one that is not the same as the parent's id
					if (relation.receiverID == parent._id) {
						return new ObjectId(relation.senderID)
					} else {
						return new ObjectId(relation.receiverID)
					}
				});
				// also append the user's itself userid
				friend_ids.push(new ObjectId(parent._id))
				// now get all the user documents from list of friends
				let friends = await mongoDB.collection("Users").find({ _id: { $nin: friend_ids } }).toArray();
				// now we need to figure out how to enbed this into the user tings
				return friends;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async groups(parent) {
			try {
				// get all the group objects that this user is in
				let groups = await mongoDB.collection("Groups").find({ users: `${parent._id}` }).toArray();
				return groups;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async receivedReqs(parent) {
			try {
				// get the relation that are incomplete and have received by this ussrid
				let reqs = await mongoDB.collection("Relations").find({ $and: [{ receiverID: `${parent._id}` }, { requestCompleted: false }] }).toArray();
				// now map the relations objects to the sender ids
				let senders = reqs.map(relation => new ObjectId(relation.senderID));
				let sending_users = await mongoDB.collection("Users").find({ _id: { $in: senders } }).toArray();
				return sending_users;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async sentReqs(parent) {
			try {
				// get the relation that are incomplete and have received by this ussrid
				let reqs = await mongoDB.collection("Relations").find({ $and: [{ senderID: `${parent._id}` }, { requestCompleted: false }] }).toArray();
				// now map the relations objects to the sender ids
				let sentTo = reqs.map(relation => new ObjectId(relation.receiverID));
				let rec_users = await mongoDB.collection("Users").find({ _id: { $in: sentTo } }).toArray();
				return rec_users;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async visiblePosts(parent) {
			// let friends = {//list of friends of user logged in};
			// args contains the arguments to this query
			try {
				// get a list of userids that have realtionship friends with this userid
				// the serch criteria is (sender_id = user._id || receiver_id = user._id) && (relationship = "friends")
				let relations = await mongoDB.collection("Relations").find({ $and: [{ $or: [{ senderID: `${parent._id}` }, { receiverID: `${parent._id}` }] }, { relationship: 'friends' }] }).toArray();
				// now we turn the list of relation objects into a list of userids of friends
				let friend_ids = relations.map((relation) => {
					//return the one that is not the same as the parent's id
					if (relation.receiverID == parent._id) {
						return new ObjectId(relation.senderID)
					} else {
						return new ObjectId(relation.receiverID)
					}
				});
				// now get all the user documents from list of friends
				let friends = await mongoDB.collection("Users").find({ _id: { $in: friend_ids } }).project({ _id: 1 }).toArray();
				friends.push({ _id: parent._id })
				friendsList = [];
				friends.forEach(element => {
					friendsList.push(element._id.toString());
				});
				// now we need to figure out how to enbed this into the user tings
				//friends now has a list of users that are friends
				let posts = await mongoDB.collection("Posts").find({ userID: { $in: friendsList } }).toArray();
				return posts
			} catch (error) {
				throw new ApolloError(error);
			}

			// let posts = await mongoDB.collection("Posts").find({_id: }).toArray();
			return [{ _id: 65, stock: "GME" }];
		},
		async stocksData(parent, args, context, info) {
			let result = await topLevelStockCollection({
				time: context.time,
				dataPoints: context.last,
				tickers: parent.stocks,
			});
			return result;
		}
	},
	Group: {
		async admins(parent) {
			try {
				// get all the users that are in list of admin username strings
				let admin_users = parent.admins.map(userID => new ObjectId(userID));
				let user_objs = await mongoDB.collection("Users").find({ _id: { $in: admin_users } }).toArray();
				return user_objs;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async users(parent) {
			try {
				// get all the users that are in list of admin username strings
				let users = parent.users.map(userID => new ObjectId(userID));
				let user_objs = await mongoDB.collection("Users").find({ _id: { $in: users } }).toArray();
				return user_objs;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async messages(parent) {
			try {
				// get all the messages with the group id
				let messages = await mongoDB.collection("Messages").find({ groupID: `${parent._id}` }).toArray();
				return messages;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async stocksData(parent, args, context, info) {
			let result = await topLevelStockCollection({
				time: context.time,
				dataPoints: context.last,
				tickers: parent.subscribedStocks,
			});
			return result;
		}
	},
	Post: {
		async comments(parent) {
			try {
				// get all the messages with the group id
				let comments = await mongoDB.collection("Comments").find({ postID: `${parent._id}` }).toArray();
				return comments;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async agreeCount(parent) {
			try {
				// get all the messages with the group id     
				let count = await mongoDB.collection("Comments").countDocuments({ $and: [{ postID: `${parent._id}` }, { agree: true }] });
				return count;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async disagreeCount(parent) {
			try {
				// get all the messages with the group id     
				let count = await mongoDB.collection("Comments").countDocuments({ $and: [{ postID: `${parent._id}` }, { agree: false }] });
				return count.toArray;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		async post_user(parent) {
			try {
				// get all the messages with the group id     
				let user = await mongoDB.collection("Users").findOne({ _id: new ObjectId(parent.userID) });
				return user;
			} catch (error) {
				throw new ApolloError(error);
			}
		}
	},
	Comment: {
		async user(parent) {
			try {
				// get all the messages with the group id     
				let user = await mongoDB.collection("Users").findOne({ _id: new ObjectId(parent.userID) });
				return user;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
	},
	Message: {
		async user(parent) {
			try {
				// get all the messages with the group id     
				let user = await mongoDB.collection("Users").findOne({ _id: new ObjectId(parent.userID) });
				return user;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
	},
	StockCollection: {
		async total(parent) {
			// loop through each stock of the resolved parent and add it to the total
			let resultTotal = { ticker: "TOTAL", data: [] };

			let stockCount = parent.stocks.length;
			if (stockCount > 0) {
				let barsCount = parent.stocks[0].data.length;
				let bar;
				// outer loop to add across the bars
				for (let i = 0; i < barsCount; i++) {
					// inner loop to add across the stocks
					bar = {
						startEpochTime: 0,
						openPrice: 0,
						highPrice: 0,
						lowPrice: 0,
						closePrice: 0,
						volume: 0
					};
					for (let j = 0; j < stockCount; j++) {
						bar.openPrice += parent.stocks[j].data[i].openPrice;
						bar.highPrice += parent.stocks[j].data[i].highPrice;
						bar.lowPrice += parent.stocks[j].data[i].lowPrice;
						bar.closePrice += parent.stocks[j].data[i].closePrice;
						bar.volume += parent.stocks[j].data[i].volume;
					}
					bar.startEpochTime = parent.stocks[stockCount-1].data[i].startEpochTime;
					resultTotal.data.push(bar);
				}
			}

			return resultTotal;
		}
	},
	Stock: {
		async performance(parent) {
			let first = parent.data[0];
			let last = parent.data[parent.data.length - 1];
			return {
				startEpochTime: first.startEpochTime,
				startPrice: first.openPrice,
				endEpochTime: last.startEpochTime,
				endPrice: last.closePrice,
				changeAmount: last.closePrice - first.closePrice,
				changePercentage: Math.abs((last.closePrice / first.closePrice) - 1) * 100
			};
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	cors: false,
	context: ({ req }) => {
		// To find out the correct arguments for a specific integration,
		// see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields
		// and https://www.apollographql.com/docs/apollo-server/integrations/middleware/

		// user is empty to begin with
		let user = {};
		// Get the user token from the headers.
		const authHeader = req.headers['authorization'];
    	const token = authHeader && authHeader.split(' ')[1];

		try {
			let decoded = jwt.verify(token, loginConfig.TOKEN_SECRET); 
			user._id = decoded.userID;
		} catch (err) {
			throw new AuthenticationError('Invalid or Missing Auth Header Found in Request Headers')
		}
		
		// Add the user to the context
		return { user };
	},
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
