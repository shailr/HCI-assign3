$(document).ready(function() {

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var BORDER_COLOR = 'black';
  var FILL_COLOR = 'white';
  var ACTIVE_FILL_COLOR = 'red';

  var svg = document.getElementById('app');
  var num_circles = document.getElementById('num_circles').value;
  var size_circles = document.getElementById('size_circles').value;
  var dist_circles = document.getElementById('dist_circles').value;
  var circle_list = [];
  var readings = [];

  $("#redraw_btn").on("click", function() {
    redrawCanvas(svg);
  });
  $("#export_btn").on("click", function() {
    exportCSV();
  });
  $("#reset_btn").on("click", function() {
    reset();
  });

  redrawCanvas(svg);

  // Create circles as per input parameters
  function newCircle(cx, cy, r, strokecolor, fillcolor, c_id) {
    var new_circle = document.createElementNS(SVG_NS, 'circle');
    new_circle.setAttributeNS(null, 'cx', cx);
    new_circle.setAttributeNS(null, 'cy', cy);
    new_circle.setAttributeNS(null, 'r', r);
    new_circle.setAttributeNS(null, 'stroke', strokecolor);
    new_circle.setAttributeNS(null, 'stroke-width', 2);
    new_circle.setAttributeNS(null, 'fill', fillcolor);
    new_circle.onclick = function() { clickCircle(c_id); };

    return new_circle;
  }

  // Clear the canvas before redrawing
  function clearAllChildren(node) {
    while(node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  // Redraw the canvas as per input parameters
  function redrawCanvas(svg) {
    num_circles = document.getElementById('num_circles').value;
    size_circles = document.getElementById('size_circles').value;
    dist_circles = document.getElementById('dist_circles').value;
    var center_x = (svg.width.baseVal.value) / 2, center_y = (svg.height.baseVal.value) / 2;

    clearAllChildren(svg);
    circle_list = [];
    for (var i = 0; i < num_circles; i++) {
      var angle = i * 2 * Math.PI / num_circles;

      var rad = dist_circles / 2;
      var n_circle = newCircle(center_x + rad * Math.cos(angle),
        center_y + rad * Math.sin(angle),
        size_circles,
        BORDER_COLOR, FILL_COLOR, i);
      circle_list.push(n_circle)
      svg.appendChild(n_circle);
    }
    svg.firstChild.setAttributeNS(null, 'fill', ACTIVE_FILL_COLOR);
  }

  function clickCircle (c_id) {
    var reading = {};
    reading.id = c_id;
    reading.cx = parseFloat(circle_list[c_id].getAttribute('cx'));
    reading.cy = parseFloat(circle_list[c_id].getAttribute('cy'));
    reading.radius = parseFloat(circle_list[c_id].getAttribute('r'));
    reading.dist = parseFloat(dist_circles);
    reading.num_circles = parseFloat(num_circles);
    reading.timestamp = Date.now();
    reading.valid = false;

    if (circle_list[c_id].getAttribute('fill') == ACTIVE_FILL_COLOR) {
      circle_list[c_id].setAttribute('fill', FILL_COLOR);
      if (c_id < circle_list.length / 2) {
        circle_list[c_id + (circle_list.length / 2)].setAttribute('fill', ACTIVE_FILL_COLOR);
      } else {
        if ((c_id + 1 - (circle_list.length / 2)) ==  (circle_list.length / 2)){
          circle_list[0].setAttribute('fill', ACTIVE_FILL_COLOR);
        } else {
          circle_list[c_id + 1 - (circle_list.length / 2)].setAttribute('fill', ACTIVE_FILL_COLOR);
        }
      }
      reading.valid = true;
    }

    readings.push(reading);
    updateTable(reading);
  }

  function updateTable (reading) {
    var table_body = $('#readings-table tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td'); td.innerHTML = reading.id; tr.appendChild(td);
    var td = document.createElement('td'); td.innerHTML = reading.timestamp; tr.appendChild(td);
    var td = document.createElement('td'); td.innerHTML = reading.cx; tr.appendChild(td);
    var td = document.createElement('td'); td.innerHTML = reading.cy; tr.appendChild(td);
    var td = document.createElement('td'); td.innerHTML = reading.radius; tr.appendChild(td);
    var td = document.createElement('td'); td.innerHTML = reading.dist; tr.appendChild(td);
    var td = document.createElement('td'); td.innerHTML = reading.num_circles; tr.appendChild(td);
    var td = document.createElement('td'); td.innerHTML = reading.valid; tr.appendChild(td);

    table_body.append(tr);
  }

  function reset() {
    document.getElementById('num_circles').value = 8;
    document.getElementById('size_circles').value = 25;
    document.getElementById('dist_circles').value = 200;
    readings = [];

    var table_body = $('#readings-table tbody')[0];

    clearAllChildren(table_body);
    redrawCanvas(svg);
  }

  function exportCSV() {
    var fields = ['id', 'timestamp', 'cx', 'cy', 'radius', 'dist', 'num_circles', 'valid'];
    var csv = json2csv( { data: readings, fields: fields } );

    var exportedFilenmae = 'export.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", exportedFilenmae);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});