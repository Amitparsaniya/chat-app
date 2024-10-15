const socket = io()

// socket.on("count",(count)=>{
//     console.log(`count:${count}`);
// })

// document.querySelector("#increment").addEventListener("click",()=>{
//     console.log(/clicked/);

//     socket.emit("increment")
// })

const $messageForm  = document.querySelector("#form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton  = $messageForm.querySelector("button")
const $sendLocationButton  = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML


const {username,room}=   Qs.parse(location.search ,{ignoreQueryPrefix:true})




socket.on("message",(msg)=>{
    console.log(msg);
    const html = Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.text,
        createdAt: moment(msg.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
})

socket.on("locationMessage",(url)=>{
    console.log(/url/,url);
    const html = Mustache.render(locationMessageTemplate,{
        username:url.username,
        url:url.url,
        createdAt: moment(url.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
})

socket.on("roomData",({room,users})=>{
    const html  = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML =html
})

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    // disabled send button
    $messageFormButton.setAttribute("disabled","disabled")
    // const message = document.querySelector("input").value
    const message  = e.target.elements.message.value

    socket.emit("sendMessage",message,(error)=>{

        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error);
        }
        console.log("message was delivered!");  
    })
})

$sendLocationButton.addEventListener("click",()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
        $sendLocationButton.setAttribute("disabled","disabled")

        console.log("latitude:",position.coords.latitude,"longitude:",position.coords.longitude);
        socket.emit("send-location",{latitude:position.coords.latitude,longitude:position.coords.longitude})
        $sendLocationButton.removeAttribute("disabled")

    })

})


socket.emit("join",{username,room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }

})