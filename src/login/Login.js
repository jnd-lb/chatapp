import React, { Component } from 'react'
import "./login.css";

export default class Login extends Component {
    constructor(props){
        super(props);
    }
    name="";
    
    handleNameChange(e){
        this.name = e.target.value;
    }

    render() {
        
        return (
            <div className="login-container">
              <from> 
                  <input  onChange={this.handleNameChange.bind(this)} placeholder="Enter your Nickname here" type="text"/> 
              <button className="btn" onClick={(e)=>{this.props.setUser(e,this.name)}} color="primary" type="submit" name="submit">Submit</button>
              </from>
          </div>
        )
    }
}
