/* Step By Step Thoughts ->

1) intialize flowfield
2) normalize vector field
3) generate particles and their velocities (within a range) randomly

4) animate particles in flow field
	- a particles location in the flow field is at i = x // cellSize and j = y // cellSize flowField[i][j]
	- use grid square vector magnitude to effect particle angle

#### At this point a visible, and enjoyable, flow field should exist ####
5) make static vector field angles dynamic by applying time multiplacant adjuster
6) alter particle linewidth, visibility, opacity... etc
7) deal with window resizing !!!!!

*/
let canvas;
let ctx;
let flowField;
let cellSize = 25;
particles = [];
numParticles = 25000;

canvas = document.getElementById('canvas1');
ctx = canvas.getContext('2d');
ch = canvas.width = window.innerWidth;
cw = canvas.height = window.innerHeight;


class FlowField {
	#ctx;
	#width;
	#height;
	constructor(ctx, width, height){
		this.#ctx = ctx;
		this.#width = width;
		this.#height = height;
		this.#ctx.lineWidth = 2; // vector drawing width
		this.cellSize = cellSize;
		this.vectorLen = this.cellSize * 0.5;
		this.startingAngle = Math.random() * 360;
		this.flowField = []
		this.normalizationRange = 15;
		this.#initFlowField()
	}



	#initFlowField() {
		for(let y = 0; y < this.#height; y += this.cellSize){ // rows
			let flowFieldColumns = []
			for(let x = 0; x < this.#width; x += this.cellSize){ // columns
				let angle = Math.random() * 360;
				flowFieldColumns.push({'angle': angle, 'x': x, "y": y});
			}
			this.flowField.push(flowFieldColumns);
		}
		this.#normalizeFlowFieldVectors();
		// this.#drawVectors();
	}

	#normalizeFlowFieldVectors() {
		const yRangeMin = 0;
		const yRangeMax = this.flowField.length;
		const xRangeMin = 0;
		const xRangeMax = this.flowField[0].length;

		// gets grid squares in x/y range of normalization range and averages their angles (if x,y >= 0)
		for (let gridSquareRow = 0; gridSquareRow < this.flowField.length; gridSquareRow++){
			for (let gridSquareColumn = 0; gridSquareColumn < this.flowField[gridSquareRow].length; gridSquareColumn++){
				let angleAVG = 0;
				let angleCounter = 0;
				const yMin = (yRangeMin > gridSquareRow - this.normalizationRange) ? yRangeMin : gridSquareRow - this.normalizationRange;
				const yMax = (yRangeMax < gridSquareRow + this.normalizationRange) ? yRangeMax : gridSquareRow + this.normalizationRange;
				const xMin = (xRangeMin > gridSquareColumn - this.normalizationRange) ? xRangeMin : gridSquareColumn - this.normalizationRange;
				const xMax = (xRangeMax < gridSquareColumn + this.normalizationRange) ? xRangeMax : gridSquareColumn + this.normalizationRange;
				
				// calculate avg surrounding angle
				for(let y=yMin; y<yMax; y++){
					for(let x=xMin; x<xMax; x++){
						angleAVG += (this.flowField[y][x]).angle;
						angleCounter += 1;
					}
				}
				this.flowField[gridSquareRow][gridSquareColumn].angle = ~~(angleAVG/angleCounter);
			}
		}
	}

	#drawBorder(x, y){
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + this.cellSize);
		ctx.lineTo(x + this.cellSize, y + this.cellSize); 
		ctx.lineTo(x + this.cellSize, y);
		ctx.stroke();
	}

	#drawVectors(){
		for (let y = 0; y < this.flowField.length; y++){
			for (let x = 0; x < this.flowField[y].length; x++){
				const gridUnit = this.flowField[y][x]
				const angle = gridUnit.angle;
				this.#drawBorder(gridUnit.x, gridUnit.y);
				const centerX = gridUnit.x + (.5 * this.cellSize);
				const centerY = gridUnit.y + (.5 * this.cellSize);
				ctx.strokeStyle = "green";
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.lineTo(centerX + (this.vectorLen * Math.cos(angle)), (centerY + this.vectorLen * Math.sin(angle)));
				ctx.stroke();
			}
		}
	}
}

class Particle {
	#ctx;
	constructor(ctx){
		this.lastX = Math.random() * ch;
		this.lastY = Math.random() * cw;
		this.x = null;
		this.y = null;
		this.velo = 2;
		this.angle = 0;
		this.ctx = ctx;
	}

	resetParticle(){
		this.lastX = this.x = Math.random() * ch;
		this.lastY = this.y = Math.random() * cw;
		this.velo = 10;
		// this.angle = null; add in future
	}

	checkInBoundary(){
		if (this.lastY > cw || this.lastY < 0 || this.lastX > ch || this.lastX < 0){
			this.resetParticle();
		}
	}

	getFlowFieldGridCellAngle(){
		const rowLocation = Math.floor(this.y / cellSize);
		const columnLocation = Math.floor(this.x / cellSize);
		const gridCellAngle = flowField.flowField[rowLocation][columnLocation].angle;
		return gridCellAngle;
	}

	adjustParticleVelocity(){ // TO DO
		const gridCellAngle = this.getFlowFieldGridCellAngle();
		this.angle = gridCellAngle;
	}

	draw(){
		ctx.strokeStyle = 'hsla(260, 75%, 10%, 0.15)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.lastX, this.lastY);
		this.x = this.lastX + Math.cos(this.angle) * this.velo;
		this.y = this.lastY + Math.sin(this.angle) * this.velo;
		ctx.lineTo(this.x, this.y);
		ctx.stroke();	
	}
}



//////////////////////////////////////////////////////////////
flowField = new FlowField(ctx, canvas.width, canvas.height);

for (let p=0; p<numParticles; p++){
	particles.push(new Particle(ctx))
}

let counter = 0;
function animate() {
	for (let i=0; i<numParticles; i++){
		p = particles[i];
		p.checkInBoundary();
		p.adjustParticleVelocity();
		p.draw();
		p.lastX = p.x;
		p.lastY = p.y;
	}
	console.log("animating");
	requestAnimationFrame(this.animate.bind(this))
}
animate()

