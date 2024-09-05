//provides the session cookie
function getSessionCookie(){

    let session = document.cookie.split('=').reverse()[0]
    console.log(session)
    return session

}
//fetches the leaderboard from api
function getLeaderBoard(){

    let session = getSessionCookie()
    console.log(session)
    fetch(`https://codecyprus.org/th/api/leaderboard?session=${session}&sorted&limit=10`)
        .then(data => data.json())
        .then(data => {

            console.log(data)
            console.log("data",data)
            let leaderBoard = data.leaderboard;
            console.log(leaderBoard)
            const container = document.getElementById('leaderBoardContainer')



            for(let i =0; i < leaderBoard.length; i++){
                const entry = leaderBoard[i];
                const element = document.createElement('div')

                element.innerHTML = `player: ${entry.player}, Score: ${entry.score}, completionTime: ${entry.completionTime}`
                container.appendChild(element)
            }
        })
}


getLeaderBoard()



