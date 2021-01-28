import React from 'react'
import "./message.css";

function Message(props) {
    const displayName = { display: (props.isMain) ? "none" : "flex" };
    const main = (props.isMain)?"main":"";
console.log("text:",props.text);
    return (
        <div className={"message-container "+main}>
            <div style={displayName} className="user-details">
                <img className="rounded-circle" width="60px" height="60px" src={props.img} />
                <h2 className="message-sender-name">{props.name}</h2>
            </div>
            <p className="message-text">{props.text}</p>
            <span className="date">{props.date}</span>
        </div>
    )
    
}

export default Message
