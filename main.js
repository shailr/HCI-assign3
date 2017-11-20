$(document).ready(function() {

  var canvas = document.getElementById('app');
  var ctx = canvas.getContext('2d');
  var num_circles = document.getElementById('num_circles').value;
  var size_circles = document.getElementById('num_circles').value;
  var dist_circles = document.getElementById('num_circles').value;
  ctx.fillStyle = "#ff0000";

  ctx.beginPath();
  ctx.arc(10,10,5,0,2*Math.PI);
  ctx.stroke();
});