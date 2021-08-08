import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../../Utils/Socket";
import { useMessageContext } from '../../Utils/MessageContext';
import GroupMessage from './GroupMessages';

function GroupChat(props) {
  const { username: USERNAME, userID: USERID } = JSON.parse(localStorage.getItem("user"));
  const [messageInput, setMessageInput] = useState('');
  const [curMessages, setMessages] = useState([]);
  const messageContext = useMessageContext();
  const divRef = useRef(null);
  let keyCount = 0;


  let { initialized, addHandler, emitMessage } = useSocket("/groups");
  useEffect(() => {
    if (props) {
      setMessages(props.messages);
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    if (initialized()) {
      addHandler('message', (data) => {
        console.log("received message from server", data);
        addMessage(data);
      });
      // this is so that the socketio server does not need to do a mongodb query now
      emitMessage("subscribe", [props.groupID]);
    }
  }, [initialized()]);

  //https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }, [curMessages]);

  function addMessage(msg) {
    setMessages(old => [...old, msg]);
  }

  function onMessageSubmit(e) {
    e.preventDefault();
    let messagePacket = {
      groupID: props.groupID, 
      userID: USERID, 
      username: USERNAME, 
      userMessage: messageInput,
      context: messageContext.stockContext.mode === "no-context" ? null : { 
        bar: messageContext.stockContext.bar,
        startEpochTime: messageContext.stockContext.start,
        endEpochTime: messageContext.stockContext.end,
        stock: messageContext.stockContext.stock
      } 
    }
    emitMessage("message", messagePacket);
    // only update the context mode if this was a new context
    if (messageContext.stockContext.mode === "create") {
      messageContext.setStockContext((old) => {
        let ns = {
          ...old,
          mode: 'view'
        }
        return ns;
      });
    }
    setMessageInput('');
  }

  return (
    <div className="column" style={{padding:'0px'}}>
      <div className="columns hero" id="message-pane">
        <div className=" message-preview" ref={divRef}>
          { 
            curMessages.map(element => {
              let msg = (element.userMessage == null) ? element.content : (element).userMessage;
              let name = (element.username == null) ? element.user.username : element.username;
              return <GroupMessage key={keyCount+=1} userMessage={msg} username={name} loggedIn={(name == USERNAME) ? 1 : 0} context={element.context}/>
            })
          }
        </div>
      </div>
      <form id="message-form" onSubmit={onMessageSubmit}>
        <div className="field level is-grouped">
          <span className="icon" style={{ marginRight: "15px" }}>
            <i className="fas fa-2x fa-home"></i>
          </span>
          <div className="control is-expanded">
            <input
              id="message"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              required
              className="input is-hovered is-rounded"
              type="text"
              placeholder="Hovered input"
            />
          </div>
          <div className="control">
            <button className="button is-rounded is-primary">Send</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GroupChat;
