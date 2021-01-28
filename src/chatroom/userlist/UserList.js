import React from 'react'
import "./userlist.css";

function UserList(props) {
    return (
        <div className="list-container">
            {props.users.map(
                e=>{
                   return <div className="user-item">
                        <img className="rounded-circle" width="60px" height="60px" src={"../"+e.image} alt=""/> 
                         <h3>{e.name}</h3>
                        
                       
                    </div>
                })}
        </div>
    )
}

export default UserList
