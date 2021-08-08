import React, {useState, useEffect} from 'react'
import { useQuery, gql, useMutation } from "@apollo/client";

const COMMENTS_QUERY = gql`
      query commentsQuery($postID: ID!){
        post(id: $postID){
            comments{
                _id
                content
                user{
                    username
                    email
                    bracket
                }
            }
        }
      }
    `;

const DEL_COMMENT = gql`
      mutation poopTest($commentID: String!) {
        removeComment(commentID: $commentID) {
            userID
            content
            postID
        }
      }
    `;
const ADD_COMMENT = gql`
      mutation poopTest($userID: String!, $content: String!, $postID: String!) {
        addComment(userID: $userID, content: $content, postID: $postID) {
          _id
          content
	        user{
            username
          }
        }
      }
    `;


const Comments = ({ post, userID }) => {
  const [form, updateForm] = useState({ comment: "" });
  const [visComments, setComments] = useState([]);
  const { loading, error, data } = useQuery(COMMENTS_QUERY, {
    variables: {postID: post},
    fetchPolicy: "network-only"
  })

  const [delComment, { data: deletedData, error:delCommentError }] = useMutation(DEL_COMMENT);
  const [addComment, { data: resultData, error:addCommentError }] = useMutation(ADD_COMMENT);

  useEffect(() => {
    if (data) {
      if (data.post) {
        setComments(data.post.comments);
      }
    }
  }, [data]);

  useEffect(() => {
    if (resultData) {
      setComments((visComments) => [...visComments, resultData.addComment]);
    }
  }, [resultData]);

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
    addComment({
      variables: {
        userID: userID,
        content: form.caption,
        postID: post,
      },
    }).catch(err =>console.error(err));
    updateForm({ caption: "" });
  }

  if (loading) return <p>Loading...</p>;
  if (error) console.log(error);
  if (error) return <p>Error :(</p>;
  function deleteComment(delCommentID) {
    setComments(visComments.filter((item) => item._id !== delCommentID));
    delComment({ variables: { commentID: delCommentID } }).catch(err =>console.error(err));
  }
  return (
    <div style={{position:"fixed", width:"47%"}}>
      <form id="addPostForm" onSubmit={handleFormSubmit} >
        <br />
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

        <br />
        <button
          className="button is-block is-fullwidth is-primary is-medium is-rounded"
          type="submit"
        >
          Add Comment
        </button>
      </form>
        {addCommentError && <p>Forbidden - Cannot add comment</p>}
        {delCommentError && <p>Forbidden - Cannot delete comment</p>}

      <br/>
      
      {visComments.map((element) => {
        return (
            <article class="media" style={{border:"double"}}>
              <div class="media-content">
                <nav class="level is-mobile">
                  <div class="level-left">
                    <strong style={{paddingLeft:"15px"}}>{element.user.username}</strong>{" "} :    {element.content}
                  </div>
                  <div class="level-right">
                    <button class="delete" onClick={() => deleteComment(element._id)}></button>
                  </div>
                </nav>
              </div>
            </article>
        );
      })}
    </div>
  );
};

export default Comments;
