//provides the session cookie
function getSessionCookie(){

    let session = document.cookie.split('=').reverse()[0]
    console.log(session)
    return session

}


function startTH(){
    player = document.getElementById('player').value
    app = document.getElementById('app')
    console.log("startTH")
    console.log("player:" + player)
    console.table(document.cookie.split('='))
    console.log("Cookies: ",document.cookie)
    uuid = getSessionCookie()
    console.log(uuid)


    fetch(`https://codecyprus.org/th/api/start?player=${(player)}&app=${(app.value)}&treasure-hunt-id=${(uuid)}`)

        .then(res => res.json())
        .then(data =>{
            if(data.status === 'ERROR' && data.errorMessages) {
                const playerNameError = data.errorMessages.find(message => message.includes('already in use'));

                if (playerNameError){
                    alert("username is already used");
                }
                else {
                    console.log("error");
                }
            }
            console.log("th", data);
            if(data.status === 'OK'){
                console.log("th", data);
                console.log("session", data.session);
                setCookie('sessionId',data.session,3)
                console.log("cookies: ",document.cookie)
                console.log("redirecting")
                window.location.replace("questions.html");
            }
            console.log("UUID:", uuid);
            console.log("session:", data.session);
            console.log("Player:", player);
            console.log("App:", app);
        })

}


// fetches different types of treasure-hunts
fetch('https://codecyprus.org/th/api/list')
    .then(res => res.json())
    .then(data => {
        document.cookie = ""
        console.log(data);
        if (data.treasureHunts && Array.isArray(data.treasureHunts)) {
            const container = document.getElementById('treasureHunts');
            data.treasureHunts.forEach(th => {
                const button = document.createElement('button');
                //Button styling:
                button.textContent = th.name;
                button.style.cursor = 'pointer';
                button.style.padding = '10px 20px';
                button.style.border = 'none';
                button.style.borderRadius = '5px';
                button.style.color = 'white';
                button.style.fontSize = '16px';
                button.style.fontWeight = 'bold';
                button.style.textTransform = 'uppercase';
                button.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                button.style.transition = 'all 0.3s ease';
                button.style.margin = '10px';
                button.style.backgroundColor = '#ff8c00';
                button.addEventListener('click', () =>getID(th.uuid));
                button.onmouseover = function() {
                    this.style.backgroundColor = '#ffa500'; // Lighter shade on hover
                    this.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.3)';
                    this.style.transform = 'translateY(-3px)'; // Slight lift effect
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = '#ff8c00';
                    this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                    this.style.transform = 'translateY(0px)';
                };
                button.onmousedown = function() {
                    this.style.backgroundColor = '#cc7000';
                    this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.5)';
                    this.style.transform = 'translateY(1px)';
                };
                button.onmouseup = function() {
                    this.style.transform = 'translateY(-3px)';
                };
                const listItem = document.createElement('li');
                listItem.appendChild(button);
                container.appendChild(listItem);
            });

        } else {
            console.error('Unexpected data format:', data);
        }
    })
    .catch(error => console.error('Failed to fetch data:', error));

//function to create a new cookie
function setCookie(name, value, time){
    var expiry = "";
    if(time){
        var date = new Date();
        date.setTime(date.getTime() + (time * 24 * 60 * 60 * 1000));
        expiry = "; expires=" + date.toUTCString();
    }
    if (!document.cookie.includes(name)){
        document.cookie += name + "=" + (value || "") + expiry + "; path=/";
    }
    document.cookie = name + "=" + (value || "") + expiry + "; path=/";
}

function getID(uuid){
    console.log("Start TH for id", uuid);

    if(uuid) {
        setCookie('currentTH', uuid, 3);
        console.log(document.getElementById('showForm'));
        console.log( "ID:", uuid);
        showForm();

        console.log("cookies: ",document.cookie)
    }
    else{
        console.error("ID undefined");
    }
}

function showForm() {
    var formElement = document.getElementById('showForm');
    if (formElement) {
        formElement.style.display = 'block';
    } else {
        console.error('Element with ID "showForm" not found');
    }
}

//function to clear cookies on window load.
function clearCookies(){
    const cookies = document.cookie.split(";");

    for(let i = 0; i < cookies.length; i++){
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
}

window.onload = function (){
    clearCookies();
}



