const score = document.querySelector('.score'),
	bestScore = document.querySelector('.best-score'),
	scoreWrap = document.querySelector('.score-wrap'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div');

car.classList.add('car');

let topScore;

const audio = new Audio('./audio.mp3');
const crash = new Audio('./crash.mp3');
let allow = false;
audio.addEventListener('loadeddata', function(){
 allow = true;
});


start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
};

const setting = {
	start: false,
	score: 0,
	speed: 5,
	traffic: 3,
	level: 2000
};

function getQuantityElements(hightElement){
	return Math.ceil(gameArea.offsetHeight / hightElement) +1;
}

function startGame(event){

	

	if (event.target.classList.contains('start')){
		return;
	}
	if (event.target.classList.contains('easy')) {
		setting.speed = 5;
		setting.traffic = 4;

	}
	if (event.target.classList.contains('medium')) {
		setting.speed = 7;
		setting.traffic = 3;
	}
	if (event.target.classList.contains('hard')) {
		setting.speed = 9;
		setting.traffic = 2;
	}

	start.classList.add('hide');
	gameArea.innerHTML = '';
	
	for (let i = 0; i < getQuantityElements(100); i++){
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * 100) + 'px';
		line.y = i * 100;
		gameArea.appendChild(line);
	}

	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		let enemyImg = Math.floor(Math.random() * 4 ) + 1;
		enemy.y = -100 * setting.traffic * i + 1;
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		enemy.style.top = enemy.y + 'px';
		enemy.style.backgroundImage = `url(./img/car${enemyImg}.png)`;
		gameArea.appendChild(enemy);
	}

	if (allow){
		audio.play();
	}
	
	setting.score = 0;
	setting.start = true;
	bestScore.classList.add('hide');
	gameArea.appendChild(car);
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
	car.style.top = 'auto';
	car.style.bottom = '10px';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame(){

	if (setting.score > setting.level) {
		setting.speed++;
		setting.level += 2000;
	}
	setting.score += Math.ceil(setting.speed*0.2);
	score.innerHTML = 'SCORE<br>' + setting.score;
	moveRoad();
	moveEnemy();
	if(keys.ArrowLeft && setting.x > 0) {
		setting.x -= setting.speed;
	}
	if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
		setting.x += setting.speed;
	}
	if (keys.ArrowUp && setting.y > 0) {
		setting.y -= setting.speed;
	}
	if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
		setting.y += setting.speed;
	}

	car.style.left = setting.x + 'px';
	car.style.top = setting.y + 'px';

	if(setting.start){
		requestAnimationFrame(playGame);
	}
}

function startRun(event){
	event.preventDefault();
	keys[event.key] = true;
}

function stopRun(event){
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad(){
	let lines = document.querySelectorAll('.line');
	lines.forEach(function(line){
		line.y += setting.speed;
		line.style.top = line.y + 'px';

		if (line.y >= document.documentElement.clientHeight){
			line.y = -100;
		}
	});
}

function moveEnemy(){
	let enemy = document.querySelectorAll('.enemy');
	topScore = localStorage.getItem('topScore');
	enemy.forEach(function(item){
		let carRect = car.getBoundingClientRect();
		let enemyRect = item.getBoundingClientRect();

		if (carRect.top <= enemyRect.bottom - 3 &&
			carRect.right - 3 >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {
			setting.start = false;
			setting.level = 0;
			audio.pause();
			crash.play();
			
				if (topScore < setting.score) {
					localStorage.setItem('topScore', setting.score);
				}
			topScore = localStorage.getItem('topScore');
			bestScore.innerHTML = 'BEST SCORE<br>' + topScore;
			start.classList.remove('hide');
			bestScore.classList.remove('hide');
			start.style.top = scoreWrap.offsetHeight;
		}
		item.y += setting.speed / 2;
		item.style.top = item.y + 'px';
		if (item.y >= gameArea.offsetHeight){
			let enemyImg = Math.floor(Math.random() * 4) + 1;
			item.y = -100 * setting.traffic;
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
			item.style.backgroundImage = `url(./img/car${enemyImg}.png)`;
		}
	});

}