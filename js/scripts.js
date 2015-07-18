
// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var SprinklesAPI = (function sprinkles() {
	var canvas,
	context,
	fps = 60,
	x = 0,
	y = 0,
	r = 15,
	speed = 104,
	mousePos = {x : 0, y : 0},
	mouseDown = 0,                   
	fpsInterval = setInterval(updateFPS, 1000),
	numFramesDrawn = 0,
	curFPS = 0,
	ch = 0,
	cw = 0,
	testing = true,
	objects = [{x:10,y:105,r:10,alive:true},{x:102,y:500,r:6,alive:true}]
	init()

	
	document.onmousemove = function(event){
		mousePos = {
			x: event.pageX,
			y: event.pageY
		}
	}
	document.body.onmousedown = function() { 
		++mouseDown;
	}
	document.body.onmouseup = function() {
		--mouseDown;
	}

	function cleanup(){
		objects.filter(function(obj){
			return obj.alive
		})
	}

	function updateFPS() {
		
		curFPS = numFramesDrawn;
		numFramesDrawn = 0;
	}	

	function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
	{	ch = canvasHeight;
		cw = canvasWidth
		// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
		canvas = document.createElement('canvas');
		canvas.setAttribute('width', canvasWidth);
		canvas.setAttribute('height', canvasHeight);
		canvas.setAttribute('id', 'canvas');
		canvasDiv.appendChild(canvas);

		context = canvas.getContext("2d"); // Grab the 2d canvas context
		// Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
		//     context = document.getElementById('canvas').getContext("2d");
		loaded();
	}



	function loaded() {
	  	setInterval(movePlayer, 1000 / fps);
		setInterval(redraw, 1000 / fps);

	}

	function redraw() {
		checkCollision()
						
		canvas.width = canvas.width; // clears the canvas 

		fillBackground('black');
		drawPlayer(x,y)
		if(mouseDown){
		  	drawBlast()
		}
		objects.forEach(drawObject)
		
		if(testing){
			context.font = "bold 12px sans-serif";
			context.fillStyle = "white";
			context.fillText("fps: " + curFPS + "/" + fps + " (" + numFramesDrawn + ")", 0, 12);
			context.fillText("x: "+mousePos.x +"  y: "+mousePos.y , 0, 24);
			context.fillText("xp: "+x +"  yp: "+y , 0, 36);
			context.fillText("mouseDown:"+ mouseDown , 0, 48);
			context.fillText("direction:"+ getDirection() , 0, 60);
			++numFramesDrawn;
	  }
	}
	function checkCollision(){
		objects.forEach(function(obj,index){
			
			if(
			obj.alive         &&
			x < obj.x + r &&
  			x + r > obj.x     &&
   			y < obj.y + r &&
   			r + y > obj.y
   			)
   			{
				obj.alive = false
				r++
			}


		})
	}
	function drawObject(obj){
		if(obj.alive){
		context.beginPath()
		context.fillStyle = 'white'
		context.arc(obj.x,obj.y,obj.r,0,2*Math.PI)
		context.fill()}
		
	}
	function drawBlast(){


	}
	function getDirection(){
		return Math.atan2( y - mousePos.y , x - mousePos.x  ) * 180 / Math.PI;
	}
	function movePlayer(){
		x = mousePos.x - (mousePos.x - x) * (100/speed);
		y = mousePos.y - (mousePos.y - y) * (100/speed);
	}
	function drawPlayer(x,y){
		context.beginPath();
		context.fillStyle = 'white';
		context.arc(x,y,r,0,2*Math.PI);
		context.fill();
	}


	function fillBackground(color){
		context.fillStyle = color;
		context.fillRect(0,0,cw,ch);
	}
	function init(){
		for(var n = 50; n--;){
			objects.push({x:Math.random()*1000,y:Math.random()*1000,r:5,alive:true})
		}


		setInterval(cleanup, 1000)

	}


	return {
		updateFPS: updateFPS,
		prepareCanvas: prepareCanvas,
		loaded: loaded,
		redraw: redraw,
	}

})();