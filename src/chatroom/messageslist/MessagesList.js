import React from 'react'
import Message from "./message/Message";

function MessagesList(props) {
    return (
        props.messages.map(m=>{
            try{
                return <Message key={m.id} name ={m.name} date={m.date} text={m.text} img={m.image} color={m.color} isMain={m.isMain}/>
            }catch(e){
                return ""
            }
        })
    )
}

export default MessagesList
