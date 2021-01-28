import React, { Component } from 'react'
import MessagesList from "./messageslist/MessagesList";
import List from "./userlist/UserList";
import "./chatroom.css";
import { createRef } from 'react';
import Picker from 'emoji-picker-react';

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenEmoji :null,
            open:false
        }
    }
    
    input = createRef();
    picker = createRef();
  
    message = "";

    handleMessageChange(e) {
        this.message = e.target.value;
    }
     onEmojiClick = (event, emojiObject) => {
         console.log(emojiObject);
        this.input.current.value  += emojiObject.emoji;
      };
    componentDidMount() {
        var input = document.getElementById("msg");
        input.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("send").click();
            }
        });
    }

    handleEmojiOpen(e){
        this.setState({open:!this.state.open},()=>{
            if(this.state.open){
                e.target.innerHTML="❌";
              console.log(">>>>>>>>>>>>",this.picker.current.className);
              this.picker.current.className="show";
                //  this.picker.current.style ={{display:"block"}};
            }else{
                this.picker.current.className="hidden";
                e.target.innerHTML="😀";
            }
        });
        
    }

    render() {
        return (
            <div className="chat-container">
                <div className="app-header">
                {this.props.connection ? <span>Online</span> : <span>Offline</span>}
                    <h3>
                        {this.props.name}
                    </h3>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <List users={this.props.users}/>
                    </div>
                    <div className="col-md-7">
                        <MessagesList messages={this.props.messages} />
                    </div>
                </div>
                <div>
     <div className="hidden" ref={this.picker}>
      <Picker  className="picker" onEmojiClick={this.onEmojiClick} />
     </div>
    </div>
                    <div ref={this.props.bottom}>
                    </div>
                <div className="row typing-area-container">
                    <div className="col-sm-11">
                        <input id="msg" placeholder="type a message" className="typing-area-input" ref={this.input} onChange={(e) => this.handleMessageChange(e)} />
                        <span className="emoji-icon" onClick={(e)=>this.handleEmojiOpen(e)}>😀</span>
                    </div>
                    
                    <div className="col-sm-1">
                        <button id="send" className="btn-default btn typing-area-button" onClick={(e) => { this.props.sendMessage(e, this.message); this.message ="";this.input.current.value = ""; }}>send</button>
                    </div>
                </div>

            </div>
        )
    }
}
