/* NOTES



*/


let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

window.onload = function() { // event fires when DOM is ready
	canvas = document.getElementById('canvas1');
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
	flowField.animate(0);
}

window.addEventListener('resize', function() {
	cancelAnimationFrame(flowFieldAnimation);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
	flowField.animate();
});

const mouse = {
	x: 0,
	y: 0,
}

window.addEventListener('mousemove', function(e) {
	mouse.x = e.x;
	mouse.y = e.y;
})


class FlowFieldEffect {
	#ctx;
	#width;
	#height;
	constructor(ctx, width, height){
		this.#ctx = ctx;
		this.#ctx.lineWidth=1;
		this.#width = width;
		this.#height = height;
		this.lastTime = 0;
		this.interval = 1000 / 60;
		this.timer = 0;
		this.cellSize = 15;
		this.gradient;
		this.#createGradient();
		this.#ctx.strokeStyle = this.gradient;
		this.radius = 3;
		this.vr = 2;
	}

	#createGradient(){
		this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
		this.gradient.addColorStop(0.1, '#ff5c33');
		this.gradient.addColorStop(0.2, '#ffff33');
		this.gradient.addColorStop(0.3, '#ff5c33');
		this.gradient.addColorStop(0.5, '#ffff33');
		this.gradient.addColorStop(0.6, '#ff5c33');
		this.gradient.addColorStop(0.8, '#ffff33');
	}

	#drawLine(angle, x, y){ // private method that draws a single frame
		let positionX = x;
		let positionY = y;
		let dx = mouse.x - positionX;
		let dy = mouse.y - positionY;
		let distance = (dx * dx + dy* dy) // Math.sqrt() 
		if (distance > 600000) distance = 600000; // cap line length
		if (distance < 50000) distance = 50000; // cap line length

		const length = distance/10000;

		
		this.#ctx.beginPath(); // closes previous shape and begins drawing a new one
		this.#ctx.moveTo(x, y);
		this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length); // multiplier is line length
		this.#ctx.stroke();	
	}

	animate(timeStamp){
		let deltaTime = timeStamp - this.lastTime; // ensure all computers run this animation at the same frame rate
		this.lastTime = timeStamp;

		if (this.timer > this.interval){
			this.#ctx.clearRect(0, 0, this.#width, this.#height)
			this.radius += this.vr;
			if (this.radius > 100 || this.radius < -100){
				this.vr *= -1;
			}

			for(let y = 0; y < this.#height; y += this.cellSize){
				for(let x = 0; x < this.#width; x += this.cellSize){
					const angle = (Math.cos(x * .01) + Math.sin(y * .01)) * this.radius;
					this.#drawLine(angle, x, y);
				}
			}
			

			this.timer=0;
		} else {
			this.timer += deltaTime;
		}
		
		flowFieldAnimation = requestAnimationFrame(this.animate.bind(this)); // creates looping animation, same as setInterval, bind required to keep "this" in memory after loops
	}
}