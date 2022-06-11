const socket=io();
/* socket.on('countUpdated',(count)=>{
    console.log("The count has been updated",count);
})
document.querySelector('#increament').addEventListener('click',()=>{
    console.log("clicked");
    socket.emit('increament')
}) */
//elements
const $messageForm=document.querySelector("#messageForm")
const $messageFormInput  = $messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#sendLocation')
const $messages=document.querySelector('#messages')
//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#locationMessage-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//Options
const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll = ()=>{
    //new message element
    const $newMessage=$messages.lastElementChild
    //height of new message
    const newMessageStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
   // console.log(newMessageMargin)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    //visible height
    const visibleHeight=$messages.offsetHeight
    //Height of message container
    const containerHeight=$messages.scrollHeight
    //how far have i scrolled
    const scrollOffset=$messages.scrollTop + visibleHeight
    if(containerHeight-newMessageHeight <= scrollOffset)
    {
      $messages.scrollTop=$messages.scrollHeight
    }

}
socket.on('message',(message)=>{
    console.log(message);
    const html=Mustache.render(messageTemplate,{username:message.username,message:message.message,createdAt:moment(message.createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})
socket.on('locationMessage',(location)=>{
    console.log(location);
    const html=Mustache.render(locationTemplate,{username:location.username,location:location.location,createdAt:moment(location.createdAt).format('h:mm')})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})
socket.on('roomData',({room,users})=>{
    console.log(room);
    console.log(users);
    const html=Mustache.render(sidebarTemplate,{
        room,users
    })
    document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    msg=e.target.elements.msg.value
    socket.emit('messageSent',msg,(verification)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value="";
        $messageFormInput.focus()
        console.log(verification);
    });
})
$locationButton.addEventListener('click',()=>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    return alert("Geolocation not supported in your browser");
    navigator.geolocation.getCurrentPosition((position)=>{
        position={
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
       socket.emit('locationSent',position,(verification)=>{
        $locationButton.removeAttribute('disabled')
           console.log(verification);
       })
    })
})
socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})