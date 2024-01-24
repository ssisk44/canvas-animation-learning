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
	flowField.animate();
}

window.addEventListener('resize', function() {
	cancelAnimationFrame(flowFieldAnimation);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
	flowField.animate();
});

class FlowFieldEffect {
	#ctx;
	#width;
	#height;
	constructor(ctx, width, height){
		this.#ctx = ctx;
		this.#ctx.strokeStyle = 'white';
		this.#width = width;
		this.#height = height;
		this.angle = 0;
	}

	#draw(x,y){ // private method that draws a single frame
		const length = 300;
		this.#ctx.beginPath(); // closes previous shape and begins drawing a new one
		this.#ctx.moveTo(x, y);
		this.#ctx.lineTo(x + length, y + length);
		this.#ctx.stroke();	
	}
	animate(){
		this.angle += .05;
		this.#ctx.clearRect(0, 0, this.#width, this.#height)
		this.#draw(this.#width/2 + Math.sin(this.angle) * 100, this.#height/2 + Math.cos(this.angle) * 100);
		console.log("animating");
		flowFieldAnimation = requestAnimationFrame(this.animate.bind(this)); // creates looping animation, same as setInterval, bind required to keep "this" in memory after loops
	}
}