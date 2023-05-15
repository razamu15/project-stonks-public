## Docs

## Overview
I built this app as side-project to learn combine and learn a bunch of new tech together. 
### for a quick view on how everything fits together: __see the [architecture pdf](https://github.com/razamu15/project-stonks-public/blob/master/docs/architecture.pdf)__


<object data="https://github.com/razamu15/project-stonks-public/blob/master/docs/architecture.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="https://github.com/razamu15/project-stonks-public/blob/master/docs/architecture.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="https://github.com/razamu15/project-stonks-public/blob/master/docs/architecture.pdf">Download PDF</a>.</p>
    </embed>
</object>

\


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

<!-- 6) Questrade API - 3rd party login using OAUTH2.0 <br>
Api that allows users to log into/through their questrade account, so we are able to extract information about that traders stocks/watchlists etc. -->

<!-- 7) Twitter API <br>
to get real time tweets on wanted topics

8) Reddit API <br>
to get reddit info on stocks -->

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

<!-- 5) __Authentication and interweaving the questrade API__ <br>
Security is a main concern with this feature. We want to make sure users have no worries when logging in through their questrade account. In addition to this, since questrade is a massive company, their API's are quite complex. Therefore, really understanding how they work as well as integrating our app using these dependencies will be a challenge.  -->
