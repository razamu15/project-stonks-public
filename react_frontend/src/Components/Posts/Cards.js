import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../Styles/Cards.css'
import Comments from './Comments';

const POSTS_QUERY = gql`
      query visPosts($userID: ID!){
        user(id: $userID){
          visiblePosts {
            post_user{
              username
              bracket
              email
            }
            _id
            userID
            content
            stock
            shares
            action
            agree_count
            disagree_count
            createdAt
          }
        }
      }
`;
const DEL_POST = gql`
      mutation poopyTest($postID: String!) {
        removePost(postID: $postID) {
            _id
        }
      }
`;
const ADD_POST = gql`
      mutation poopTest($userID: String!, $content: String!, $stock: String!, $action: String!, $shares: Int!) {
        addPost(userID: $userID, content: $content, stock: $stock, action: $action, shares: $shares) {
            post_user{
              username
              bracket
              email
            }
            _id
            userID
            content
            stock
            shares
            action
            agree_count
            disagree_count
            createdAt
        }
      }
`;
const AGREE_POST = gql`
  mutation poop($postID: String!){
    agreePost(postID: $postID){
            post_user{
              username
              bracket
              email
            }
            _id
            userID
            content
            stock
            shares
            action
            agree_count
            disagree_count
            createdAt
    }
  }
`;
const DISAGREE_POST = gql`
  mutation poop($postID: String!){
    disagreePost(postID: $postID){
            post_user{
              username
              bracket
              email
            }
            _id
            userID
            content
            stock
            shares
            action
            agree_count
            disagree_count
            createdAt
    }
  }
`;
const Cards = () => {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  const [comments, setComments] = useState(USERID);
  const [visPosts, setPosts] = useState([]);
  const [isVisible, setVisibility] = useState(true);
  const [form, updateForm] = useState({
    shares: "",
    action: "",
    stock: "",
    caption: "",
  });
  const [addPost, { data: resultData, error:addPostError }] = useMutation(ADD_POST);
  const [delPost, { data: deletedData, error:delPostError }] = useMutation(DEL_POST);
  const [agrPost, { data: incPost }] = useMutation(AGREE_POST);
  const [disPost, { data: decPost }] = useMutation(DISAGREE_POST);

  function handleFormChange(e) {
    let newState = {
      ...form,
    };
    newState[e.target.id] = e.target.value;
    updateForm(newState);
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    //get userID from localstorage
    addPost({
      variables: {
        userID: USERID,
        content: form.caption,
        stock: form.stock,
        shares: parseInt(form.shares),
        action: form.action,
      },
    }).catch(err =>console.error(err));
    updateForm({ shares: "", action: "", stock: "", caption: "" });
  }
  function DeletePost(postID) {
    //https://stackoverflow.com/a/58620507
    
    delPost({ variables: { postID: postID } }).catch(err =>console.error(err)).then(setPosts(visPosts.filter((item) => item._id !== postID)));
    //need to delete all comments with postID
  }
  function displayForm(){
    setVisibility(!isVisible);
  }

  //Switch to current user
  const { loading, error, data } = useQuery(POSTS_QUERY, {
    variables: {userID: USERID},
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (data) {
      setPosts(data.user.visiblePosts);
    }
  }, [data]);

  useEffect(() => {
    if (resultData) {
      setPosts((oldArray) => [...oldArray, resultData.addPost]);
    }
  }, [resultData]);

  useEffect(() => {
    if (incPost) {
      let newArr = visPosts.map((element) =>{
        if(incPost.agreePost._id == element._id){
          return incPost.agreePost
        }
        else{
          return element
        }
      })
      setPosts(newArr);
      //create new array and replace
    }
  }, [incPost]);

  if (loading) return <p>Loading...</p>;
  if (error) console.log(error);
  if (error) return <p>Error :(</p>;

  function actionOfPost(action, title, shares, stock) {
    if (action == "hold") {
      return (
        <section class="hero is-warning">
          <div class="hero-body">
            <p class="title">
              HOLD {shares} {stock} Stocks
            </p>
          </div>
        </section>
      );
    } else if (action == "buy") {
      return (
        <section class="hero is-success">
          <div class="hero-body">
            <p class="title">
              BUY {shares} {stock} Stocks
            </p>
          </div>
        </section>
      );
    } else {
      return (
        <section class="hero is-danger">
          <div class="hero-body">
            <p class="title">
              SELL {shares} {stock} Stocks
            </p>
          </div>
        </section>
      );
    }
  }

  //https://stackoverflow.com/questions/24502898/show-or-hide-element-in-react

  function displayComments(postID) {
    setComments(postID);
  }
  function agreePost(curValue){
    agrPost({ variables: { postID: curValue } });
  }
  function disagreePost(curValue){
    disPost({ variables: { postID: curValue } });
  }
  return (
    <div class="columns">
      <div class="column">
        <button onClick={displayForm} className="button is-block is-fullwidth is-primary is-medium is-rounded">Add Stonk</button>
        {/* <article className={!props.loggedIn? "message column is-half is-primary" : "message column is-half is-offset-6 is-info"} style={mystyle}> */}
        <form id="addPostForm" style={{display: isVisible? "none": ""}} onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="control">
              <p>Number of Stocks</p>
              <input
                className="input is-medium is-rounded"
                placeholder="Number of Stocks"
                type="number"
                step="1"
                id="shares"
                name="shares"
                value={form.shares}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <p>Action</p>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium is-rounded"
                placeholder="Buy/Sell/Hold"
                type="text"
                id="action"
                name="action"
                value={form.action}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <p>Caption</p>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium is-rounded"
                type="text"
                id="caption"
                name="caption"
                value={form.caption}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <p>Stock</p>
          <div className="field">
            <div className="control">
              <input
                className="input is-medium is-rounded"
                type="text"
                id="stock"
                name="stock"
                value={form.stock}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <br />
          <button
            className="button is-block is-fullwidth is-primary is-medium is-rounded"
            type="submit"
          >
            Post Stonk
          </button>
        </form>
        <br/>
              {addPostError && <p>Forbidden - Cannot add Post</p>}
              {delPostError && <p>Forbidden - Cannot remove Post</p>}
        {visPosts.map((element) => {
          return (
            <div>
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">
                    [{element.post_user.bracket[0]}:{element.post_user.bracket[1]}
                    ] {element.post_user.username}
                  </p>
                  <p class="card-header-icon">
                    {element.createdAt.split(" ")[2]}{" "}
                    {element.createdAt.split(" ")[1]}
                  </p>
                  <button
                    class="delete"
                    onClick={() => DeletePost(element._id)}
                  ></button>
                </header>

                <div class="card-content">
                  {actionOfPost(
                    element.action.toLowerCase(),
                    element.content,
                    element.shares,
                    element.stock
                  )}
                  <div class="box">
                    <strong>{element.content}</strong>
                  </div>
                </div>

                <footer class="card-footer">
                  <button class="button is-success card-footer-item" onClick={() => agreePost(element._id)}>
                    Agree {element.agree_count}
                  </button>
                  <button
                    class="button is-link is-light card-footer-item"
                    value={element.stock}
                    onClick={() => displayComments(element._id)}
                  >
                    Comments
                  </button>
                  <button class="button is-danger card-footer-item" onClick={() => disagreePost(element._id)}>
                    Disagree {element.disagree_count}
                  </button>
                </footer>
              </div>
              <br/>
            </div>
          );
        })}
      </div>
      {/* Second column */}
      <div class="column" >
        <Comments post={comments} userID={USERID} />
      </div>
    </div>
  );
};

export default Cards;