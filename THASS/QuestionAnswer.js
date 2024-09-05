//provides the session cookie
function getSessionCookie(){
	let session = document.cookie.split('=').reverse()[0]
	console.log(session)
	return session

}

function main (){
	var session = getSessionCookie()
	console.table(session)
	fetch(`https://codecyprus.org/th/api/question?session=${session}`)
		.then(res => res.json())
		.then(data => {

			console.table(data)
			let questionType = data.questionType;
			console.log(questionType)
			let questionText = data.questionText;

			let questionContainer = document.getElementById('questionContainer')
			let question = document.createElement('p');
			question.innerHTML = questionText;

			question.style.fontSize = '18px';
			question.style.marginBottom= '20px';
			questionContainer.insertBefore(question, answerForm)

			getScore()

			let skip = document.getElementById('skip_button')
			skip.style.textAlign = 'center'

			if (data.canBeSkipped){
				skip.style.display='block'

			} else {
				skip.style.display='none'

			}


			let locationBool = data.requiresLocation;

			if(locationBool === true){
				setInterval(allowLocation, 5000);
			}

			if(locationBool === true){
				if(confirm("allow location")){
					allowLocation()
				}
				else{
					alert("location is needed for this question")
					document.getElementById('doneButton').disabled = true;

				}
			}

			//checks question type
			if(data.questionType === 'BOOLEAN'){
				console.log("MADE CHOICES")
				let normalAnswerField = document.getElementById('answerField')


				let trueOption = document.createElement("input");
				trueOption.setAttribute('type', 'checkbox');
				trueOption.setAttribute('name','boolAnswer')
				trueOption.setAttribute('value', 'true')
				trueOption.id = 'trueOption'

				let trueLabel = document.createElement('label');
				trueLabel.setAttribute('for', 'trueOption');
				trueLabel.textContent = "true";


				let falseOption = document.createElement("input");
				trueOption.setAttribute('type', 'checkbox');
				trueOption.setAttribute('name','boolAnswer')
				trueOption.setAttribute('value', 'false')
				trueOption.id = 'falseOption'

				let falseLabel = document.createElement('label');
				trueLabel.setAttribute('for', 'falseOption');
				trueLabel.textContent = "false";

				normalAnswerField.appendChild(trueOption);
				normalAnswerField.appendChild(trueLabel);
				normalAnswerField.appendChild(falseOption)
				normalAnswerField.appendChild(falseLabel);
			}
			else{

			}


			//redirects to leaderboard if all questions are complete.
			document.getElementById('questionContainer').appendChild(question)

			if(data.currentQuestionIndex === data.numOfQuestions){
				console.log("questions completed")
				window.location.replace("LeaderBoard.html")
			}


		})
		.catch(error => console.error('Failed to fetch', error))



}
main()

//uses a fetch from the api to check if a skip is allowed
function skipQuestion(){

	let session = getSessionCookie()
	fetch(`https://codecyprus.org/th/api/skip?session=${session}`)
		.then(data => console.log(data))
		.then(()=>window.location.reload())
		.then(()=>getScore())

}
//fetches player score
function getScore(){
	let session = getSessionCookie()
	fetch(`https://codecyprus.org/th/api/score?session=${session}`)
		.then(data=>data.json())
		.then(data => {

			let score = data.score;
			let scoreP = document.getElementById('score')
			scoreP.innerText = `score ${score}`

			console.table(data)
		})
}

//checks player answer
function getAnswer(){
	let session = getSessionCookie()
	let answer = document.getElementById("answerField").value
	document.getElementById('answerField').innerHTML = "";



	fetch(`https://codecyprus.org/th/api/answer?session=${session}&answer=${answer}`)
		.then(data => console.log(data))
		.then(()=>window.location.reload())
		.then(()=>getScore())

		return answer;
}


function allowLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getlocation); // checks if location is allowed
	}
	else{
		alert("Geolocation is not allowed")
	}
}

function getlocation(position){
	let session = getSessionCookie()
	let longitude = position.coords.longitude;
	let latitude = position.coords.latitude;
	console.log(`long: ${longitude} lat: ${latitude}`)
	fetch(`https://codecyprus.org/th/api/location?session=${session}&latitude=${latitude}&longitude=${longitude}`)
		.then(data => console.log(data))
}


