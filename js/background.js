var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


var c = document.getElementById("bkgCanvas");
c.width = c.height * (c.clientWidth / c.clientHeight)
var ctx = c.getContext("2d");
ctx.fillStyle = 'white';
ctx.imageSmoothingEnabled = false;
//ctx.lineWidth = .5;
var raf;

class Point {
  constructor(x, y, vx, vy, flashRate) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.flashRate = flashRate;
    this.brightness = 1.0;
  }
}

class DrawThing {
  constructor(points) {
    this.points = points;
  }

  draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    this.points.forEach(pt => function() {
      pt.x += pt.vx
      pt.y += pt.vy
      pt.brightness += pt.flashRate;
      if (pt.brightness >= 1.0 || pt.brightness < 0) pt.flashRate = -pt.flashRate;
      if (pt.x < 0 || pt.x > c.width) pt.vx = -pt.vx;
      if (pt.y < 0 || pt.y > c.width) pt.vy = -pt.vy;

      var roundedX, roundedY;
      if (pt.vx > 0) roundedX = Math.floor(pt.x);
      else roundedX = Math.ceil(pt.x);
      if (pt.vx > 0) roundedY = Math.floor(pt.y);
      else roundedY = Math.ceil(pt.y);

      ctx.fillStyle = `rgb(
        ${Math.floor(255 * pt.brightness)},
        ${Math.floor(255 * pt.brightness)},
        ${Math.floor(255 * pt.brightness)})`;
        
      ctx.beginPath();
      ctx.arc(roundedX+0.5, roundedY+0.5, 1, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }());
  }
}

function boundedRand(min, max) {
  var rv = Math.random();
  return (max - min) * rv + min;
}

points = [];
for (i = 0; i < 40; ++i) {
  points.push(new Point(boundedRand(0, c.width), boundedRand(0, c.height), Math.random()*0.1, Math.random()*0.1, Math.random()*0.01));
}

dt = new DrawThing(points)
function draw() {
  dt.draw();
  raf = window.requestAnimationFrame(draw);
}
ctx.font = "30px Arial";
ctx.strokeText("Hello World", 10, 50);

draw();
