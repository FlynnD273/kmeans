const points = [];
const centroids = [];
const colours = ["blue", "red", "green", "orange", "teal", "forest green", "aqua", "blueviolet", "deeppink"];
const deviation = 20;
const num_points = 100;
function setup() {
  resizeCanvas(400, 400);
  frameRate(24);
  rectMode(CENTER);
  init();
}

function init() {
  centroids.splice(0, centroids.length);
  points.splice(0, points.length);
  end_count = 0;
  for (let i = 0; i < 2; i++) {
    centroids.push([random(400), random(400)]);
  }
  const group_count = random(2, colours.length);
  for (let i = 0; i < group_count; i++) {
    const c_x = random(deviation, 400 - deviation);
    const c_y = random(deviation, 400 - deviation);
    for (let j = 0; j < num_points; j++) {
      points.push([randomGaussian(c_x, deviation), randomGaussian(c_y, deviation)]);
    }
  }
}

function get_dist(p1, p2) {
  const x = p1[0] - p2[0];
  const y = p1[1] - p2[1]
  return x * x + y * y;
}

var is_done = true;
var end_count = 0;

function draw() {
  background(0);
  noStroke();

  is_done = true;
  const centroid_points = [];
  for (let i = 0; i < centroids.length; i++) {
    centroid_points.push([]);
  }
  for (let point of points) {
    let min_idx = 0;
    let min_dist = get_dist(point, centroids[min_idx]);
    for (let i = 1; i < centroids.length; i++) {
      const new_dist = get_dist(point, centroids[i]);
      if (new_dist < min_dist) {
        min_dist = new_dist;
        min_idx = i;
      }
    }
    centroid_points[min_idx].push(point);
    fill(colours[min_idx]);
    ellipse(point[0], point[1], 5, 5);
  }
  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < centroids.length; i++) {
    fill(colours[i]);
    rect(centroids[i][0], centroids[i][1], 5, 5);
    if (centroid_points[i].length > 0) {
      let avg_x = 0;
      let avg_y = 0;
      for (let j = 0; j < centroid_points[i].length; j++) {
        avg_x += centroid_points[i][j][0];
        avg_y += centroid_points[i][j][1];
      }
      avg_x /= centroid_points[i].length;
      avg_y /= centroid_points[i].length;
      const new_center = [avg_x, avg_y];
      if (get_dist(centroids[i], new_center) != 0) {
        centroids[i] = [avg_x, avg_y];
        is_done = false;
      }
    }
    else {
      centroids[i] = [random(400), random(400)];
      is_done = false;
    }
  }

  if (is_done) {
    const centroid_size = [];
    for (let i = 0; i < centroids.length; i++) {
      if (centroid_points[i].length > 0) {
        let avg_dist = 0;
        for (const v of centroid_points[i]) {
          avg_dist += get_dist(centroids[i], v);
        }
        // avg_dist /= centroid_points[i].length;
        centroid_size.push(avg_dist);
      }
    }
    let min_size = Math.min(...centroid_size);

    let max_idx = 0;
    let max_size = centroid_size[0];
    for (let i = 1; i < centroids.length; i++) {
      const new_size = centroid_size[i];
      if (new_size > max_size) {
        max_size = new_size;
        max_idx = i;
      }
    }
    if (centroids.length < colours.length && max_size / min_size > 3.5) {
      let x = centroids[max_idx][0] + 1;
      let y = centroids[max_idx][1] + 1;
      centroids.push([x, y]);
      is_done = false;
    }
  }
  if (is_done) {
    end_count++;
    if (end_count > 10) {
      init();
    }
  }
}
