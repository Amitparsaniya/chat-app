exports.generateMessage = (username,text)=>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

exports.generateLocationMessage = (username,url)=>{
    console.log(/username.........../,username);

    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}