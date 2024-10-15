const users = []


const addUser =({id,username,room})=>{
    // clean the data
    console.log({id,username,room});
    username  = username?.toLowerCase()
    room  =room?.toLowerCase()
    console.log({id,username,room});

    if(!username || !room){
        return{
            error:"username and room are required"
        }
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    console.log(/aaaa/,existingUser);

    if(existingUser){
        console.log(/efef/);
        return {
            error:"username is in use!"
        }
    }
    
    console.log(/dfef/,{id,username,room}); 

    const user =  {id,username,room}

    console.log(/user/,user);
    users.push(user)
    return {user}
}

const removeUser  = (id)=>{
    const index = users.findIndex((user)=>user.id===id )
    console.log(index);
    if(index !== -1){
            return users.splice(index,1)[0]
    }
}

const getUser= (id)=>{
    const userdetail = users.find((user)=> user.id===id)
    if(userdetail){
        return userdetail
    }else{
        return {
            error :"user not exist"
        }
    }
}

const getUserInRoom = (room) =>{
    const roomDetail =  users.filter((user)=> user.room===room)
    if(roomDetail){
        return roomDetail
    }
}


// addUser({
//     id:22,
//     username:"amit",
//     room:"india"
// })
// addUser({
//     id:23,
//     username:"dwh",
//     room:"india"
// })

const aa = getUserInRoom('india')
console.log(/aa/,aa);
// console.log(users);


module.exports ={
    addUser,
    getUser,
    removeUser,
    getUserInRoom
}