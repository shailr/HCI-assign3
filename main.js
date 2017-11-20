$(document).ready(function() {

  var ns = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('app');
  $("#redraw_btn").on("click", function() {
    redrawCanvas(svg);
  });

  redrawCanvas(svg);

  function newCircle(cx, cy, r, strokecolor, fillcolor) {
    var new_circle = document.createElementNS(ns, 'circle');
    new_circle.setAttributeNS(null, 'cx', cx);
    new_circle.setAttributeNS(null, 'cy', cy);
    new_circle.setAttributeNS(null, 'r', r);
    new_circle.setAttributeNS(null, 'stroke', strokecolor);
    new_circle.setAttributeNS(null, 'stroke-width', 2);
    new_circle.setAttributeNS(null, 'fill', fillcolor);

    return new_circle;
  }

  function clearAllChildren(node) {
    while(node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  function redrawCanvas(svg) {
    var num_circles = document.getElementById('num_circles').value;
    var size_circles = document.getElementById('size_circles').value;
    var dist_circles = document.getElementById('dist_circles').value;
    var center_x = (svg.width.baseVal.value) / 2, center_y = (svg.height.baseVal.value) / 2;

    clearAllChildren(svg);
    for (var i = 0; i < num_circles; i++) {
      var angle = i * 2 * Math.PI / num_circles;

      svg.appendChild(newCircle(center_x + dist_circles * Math.cos(angle),
        center_y + dist_circles * Math.sin(angle),
        size_circles,
        'black', 'white'));
    }
  }
});