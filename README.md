## Project Proposal

### Other important documents found in /docs folder. 
## Video link:https://youtu.be/_DxDkdE2adE
## Website URL: projectstonks.me

### Title: Stonks Web Application

### Team:
- Saad Raza (razamu15)
- Mustafa Hafeez (hafeezm1)

### Description:
A social media platform that enables investors to collaborate with friends and family to enrich their investing experience whilst enabling them to be better informed on social trends resulting in more profitable and reliable stock trades. Users are capable of searching for similar investors, based on investment brackets and similar investment industries. 

### Beta Features
1) __Real time Stock Updates__ <br>
Users can add stocks to their protfolio and see real time updates on each stock and their portfolio value as a whole

2) __Real time social media updates(reddit, twitter)__ what people are saying about your stocks <br> 
Using Reddit/Twitter APIs we will check social media activity to determine influences on stock prices in real time. Users will recieve a mini feed inside the application to see what is being said about stock they are interested in, as well as condensed analysis of trending stocks and companies. This can aid in making decisions in regards to stocks you own/plan on buying.

3) __Social Investing__ <br>
Basic social media interactions with a focus on enabling sharing of investment knowledge. Add,delete Friends/Create voting posts asking for thoughts about a stock/ discuss industry trends etc. Friends are able to see more information about each other like portfolios, industry interests, reccomendations they have and more. Also allows for  privacy settings for who can see what.

4) __Investor groups__ (A private channel of friends or public group) <br>
Group chats with a twist. Groups can follow different stocks that they are interested in, and see how the selected stocks are doing. Members can make predictions which are tracked against the real life market movements. 

5) __user categorization based on investment bracket and interests__ <br>
Users can categorize themselves based on their interests and investment brackets(how much money they're currently willing to invest). They are recomended new stocks based on this information. Users can set their privacy setting so that they see other users with similar categorizations, allowing networking with other similar investors. 


### Final Features
1) __Focusing deeply on the UI__ <br>
Make everything look good with a css library

2) __Integrating Questrade API & Authorization__ (OAUTH2.0) <br>
Handle security and interleaving questrade api allowing users to see their real portfolio from questrade

3) __Web Scraping News Articles & Other Sources__ <br>
Scrape the web for more sources that are talking about certain stocks you/ your investment groups are interested in

4) __User configuratble charts__ <br>
Allow users to create customizable charts(ie bar graph, pie chart, line graph) based on different stock performance metrics they wish to use to analyze stocks


### Technologies
1) Apache kafka <br> 
Distributed event streaming platform. Used for event driven data streams to process data in real time. Also enabling microservices architecture with kafka as the central communication between them.

2) graphQL <br>
API implementation and query language for getting data from backend more predictably

3) Socket.io <br>
Enables real time bidirectional communication between the front end and the backend. Allows a wider variety of features we can use when sending/recieving information.

4) Mongodb or Cloud Firestore (TBD) <br>
No SQL database for storage. Stores data of stocks/groups/user information and more. 

5) React <br>
Javascript frontend framework to assist in the development of the user interface. 

6) Questrade API - 3rd party login using OAUTH2.0 <br>
Api that allows users to log into/through their questrade account, so we are able to extract information about that traders stocks/watchlists etc.

7) Twitter API <br>
to get real time tweets on wanted topics

8) Reddit API <br>
to get reddit info on stocks

9) Sources we will use to get Real time Stock prices and info <br> 
(Since we are using kafka, we will most likely have multiple producers pushing to one topic) 
IEX Cloud, Yahoo finance, Questrade etc. (APIs, Webhooks, SSEs)


10) Node JS with express <br>
Backend framework that will be used to create microservice.

11) Bulma CSS or Tailwind CSS (TBD) <br>
the css framework for the frontend 

### Techinical Challenges

1) __Learning react__ <br> 
This is going to be challenging as neither group member has used react before. Therefore, learing and implementing it for the project will be a challenge.

2) __Designing backend as microservices__. Cache invalidation and managing state across microservices.

3) __Integrating Apache Kafka__ <br>
Apache Kafka is used for event driven architecture and is a completely different paradigm of architecture than regular monolith web apps. Therefore learing how to implement the publish-subscribe messaging system that enables us to build distributed applications which support real time data updates will be hard.

4) ___Understanding and Incorporating GraphQL___ <br>
Graphql is very powerful in the sense that it can resolves issues that arise with the generic REST approach such as: over fetching & multiple requests. Therefore, to support GraphQL in our application, we need to overcome its learning curve which includes understanding its usages as well as the syntax so that we are able manipulate the language to  the most efficient and producitve way to fetch information from our backend. 

5) __Authentication and interweaving the questrade API__ <br>
Security is a main concern with this feature. We want to make sure users have no worries when logging in through their questrade account. In addition to this, since questrade is a massive company, their API's are quite complex. Therefore, really understanding how they work as well as integrating our app using these dependencies will be a challenge. 
