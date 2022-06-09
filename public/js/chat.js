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
socket.on('message',(message)=>{
    console.log(message);
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