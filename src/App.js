// App.js -- this is  the full file
import React, { Component } from 'react';
import io from 'socket.io-client';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./login/Login";
import ChatRoom from "./chatroom/ChatRoom";
import { createRef } from 'react/cjs/react.development';

class App extends Component {
  
  state = {
    isConnected: false,
    id: null,
    messages: [],
    users: [],
    name: null
  }
  bottom = createRef();
  id = null;
  socket = null;
  getId=false;

 
  shouldComponentUpdate(nextProps, nextState) {
    if ((nextState.users !== this.state.users) || nextState.id !== this.state.id || (nextState.messages !== this.state.messages) ) return true;
    return false;
  }

  componentDidMount() {
    this.socket = io('https://codi-server.herokuapp.com');

/* // Retrieve
 if(localStorage.getItem("id")!== null){
   
   let userName = localStorage.getItem("userName");
   let image = localStorage.getItem("userImage");
   let id = localStorage.getItem("userId");
   this.setState({name:userName,image:image,id:id});
 } 
 */
    this.socket.on('connect', () => {
      this.setState({ isConnected: true })
    })

    this.socket.on('disconnect', () => {
      this.setState({ isConnected: false })
    })

    this.socket.on('peeps', (peeps) => {
      let users = peeps.map(p => {
        return { id: p, name: "", image:this.getImage() }
      })
      console.log("On peeps:", users);
    
     this.setState({ users: users });
    })

    this.socket.on('pong!', (additionalStuff) => {
      //console.log('server answered!', additionalStuff)
    })


    this.socket.on('youare', (answer) => {
      if(this.state.id === null) this.setState({id:answer.id});
      
    })
    
    this.socket.on('new connection', (newId) => {
      let users = [...this.state.users];
      users.push({ id: newId, name: "" })
      this.setState({ users: users });
    })
    
    this.socket.on('new disconnection', (id) => {
      let users = [...this.state.users].filter(p => {
        return p.id !== id
      });
      this.setState({ users: users });
    })
    
    this.socket.on("next", (message) => {
      console.log("next", message);
    })
    
    this.socket.on("room_message", (message) => {
      message["isMain"] = this.state.id === message.id;
      let users = [...this.state.users];
      let user= users.filter(u=>{return (u.id === message.id)});
      if(user.length==0){
        let img = this.getImage();
        users.push({name:message.name,image:img,id:message.id})
        message["image"] = img;
        this.setState({users:users});
      } else{
        message["image"] = user[0].image;
      }
      this.addMessage(message);
      this.scrollToBottom();
      console.log("room_message", message);
    })
    
    /** this will be useful way, way later **/
    this.socket.on('room', (old_messages) => {
      //todo check the data
      /* old_messages=[
        {text:"this is a text",name:'fgfdgdfgdgdg',id:"tridnf",date:"1-48-5"},
        {text:"this fffffffffffff sfhg g  g yyggiyug gi y y ugigyuyg is a text",name:'Jiahd',id:"tridnf",date:"1-48-5"},
        {text:"this is a text",name:'Jiahd',id:"tridnf",date:"1-48-5"},
        {text:"this is a text",name:'Jiahd',id:"tridnf",date:"1-48-5"},
        {text:"this is a text",name:'Jiahd',id:"tridnf",date:"1-48-5"},
        {text:"this is a text",name:'Jiahd',id:"tridnf",date:"1-48-5"},
        {text:"this is a text",name:'Jiahd',id:"tridnf",date:"1-48-5"}
      ] */
      old_messages.map(m => {
        m["isMain"] = this.state.id === m.id;
        let users = [...this.state.users];
        let user= users.filter(u=>{return (u.id === m.id)});
        if(user.length==0){
          let img = this.getImage();
          users.push({name:m.name,image:img,id:m.id})
          m["image"] = img;
          this.setState({users:users});
        } else{
          m["image"] = user[0].image;
        }
        return m;
    
      });

    this.setState({ messages: old_messages });
    });
  }
  

  getImage(){
    let num =Math.floor(Math.random() * (10 - 1) + 1);
    return `../../assets/images/${num}.png`;
  }

  calcAndSend(val1, val2, val3) {
    let res = (+val1) + (+val2) + (+val3);
    this.socket.send('answer', res)
  }
  
  componentWillUnmount() {
    this.socket.close()
    this.socket = null
  }
  
   setUser(e, name) {
    e.preventDefault();
    this.socket.emit("whoami");
    this.setState({ name:name},()=>{
   /*    // Store
      let users= [...this.state.users];
      users.push({ name:name,image:this.getImage(),id:this.state.id})
    localStorage.setItem("id", this.state.id);
    localStorage.setItem("userName",this.state.name);
    localStorage.setItem("image",this.getImage()); */
    });
  }

  scrollToBottom = () => {
    this.bottom.current.scrollIntoView({ behavior: 'smooth' })
  }

  addition(e) {
    e.preventDefault();
    this.socket.emit('addition')
  }

  sendMessage(e, message) {
   e.preventDefault();
   console.log("id",this.state.id);
   this.socket.send({ text: message, name: this.state.name, id: this.state.id })
  }

  addMessage(message){
    let messages = [...this.state.messages];
      messages.push({isMain:message.id==this.state.id,date:message.date,text:message.text,name:message.name,id:message.id});
      this.setState({messages:messages});
  }
 
  
  render() {
    return (
      <div className="App">
        {(this.state.name !== null) ? <ChatRoom users={this.state.users} bottom={this.bottom} connection={this.state.isConnected} name={this.state.name} messages={this.state.messages} sendMessage={this.sendMessage.bind(this)} /> : <Login setUser={this.setUser.bind(this)} />}
      </div>
    );
  }
}

export default App;
