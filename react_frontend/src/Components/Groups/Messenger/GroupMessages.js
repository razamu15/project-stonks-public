import React from 'react'
import { useMessageContext } from '../../Utils/MessageContext';

const mystyle = {
    padding: '2px .75rem 5px .75rem',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    cursor: 'pointer'
};

const GroupMessages = (props) => {
    const { setStockContext } = useMessageContext();
    const contextInfo = props.context;

    function viewContext() {
        setStockContext({
            stock: contextInfo.stock,
            start: contextInfo.startEpochTime,
            end: contextInfo.endEpochTime,
            bar: contextInfo.bar,
            mode: "view"
        });
    }

    return (
        <article className={!props.loggedIn ? "has-background-success-light message card column is-half has-text-left" : "has-background-link-light message card column is-half is-offset-6 has-text-left"} style={{ padding: '0px' }}>
            <div style={{ padding: '.75rem .75rem 0px .75rem' }}>
                <span className={!props.loggedIn ? "has-text-success has-text-weight-bold" : "has-text-link has-text-weight-bold"}>{props.username}</span>:{props.userMessage}
            </div>
            {props.context ?
                <div onClick={viewContext} className="msg-context is-size-7 has-text-grey" style={mystyle}>
                    <span className="icon">
                        <i className="fas fa-arrow-right"></i>
                    </span>
                    <span className="">See Attached Context</span>
                </div> : <span></span>}
        </article>
    )
}
export default GroupMessages
