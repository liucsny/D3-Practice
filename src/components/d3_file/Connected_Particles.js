// https://bl.ocks.org/mbostock/157333662ef11c151080

module.exports = function (vm) {
  let width = vm.$refs.chartArea.offsetWidth * 0.95
  let height = 600


  const canvas = document.createElement('canvas')
  canvas.setAttribute('width',width)
  canvas.setAttribute('height',height)
  vm.$refs.chartArea.appendChild(canvas)

  let context = canvas.getContext("2d")

  let tau = 2 * Math.PI
  let n = 300
  let particles = new Array(n)
  let radius = 2.5
  let minDistance = 80
  let maxDistance = 100
  let minDistance2 = minDistance * minDistance
  let maxDistance2 = maxDistance * maxDistance

  for (let i = 0; i < n; ++i) {
    particles[i] = {
      x: width * Math.random(),
      y0: height * Math.random(),
      v: 0.1 * (Math.random() - 0.5)
    };
  }
  
  d3.timer(function(elapsed) {
    // console.log(elapsed)

    context.clearRect(0, 0, width, height);

    for (let i = 0; i < n; ++i) {
      for (let j = i + 1; j < n; ++j) {

        let pi = particles[i],
            pj = particles[j],
            dx = pi.x - pj.x,
            dy = pi.y - pj.y,
            d2 = dx * dx + dy * dy;

        if (d2 < maxDistance2) {

          context.globalAlpha = d2 > minDistance2 ? (maxDistance2 - d2) / (maxDistance2 - minDistance2) : 1;
          context.beginPath();
          context.moveTo(pi.x, pi.y);
          context.lineTo(pj.x, pj.y);
          context.stroke();

        }

      }
    }
  
    context.globalAlpha = 1;
  
    for (let i = 0; i < n; ++i) {

      let p = particles[i];
      p.y = p.y0 + elapsed * p.v;
      if (p.y > height + maxDistance) p.x = width * Math.random(), p.y0 -= height + 2 * maxDistance;
      else if (p.y < -maxDistance) p.x = width * Math.random(), p.y0 += height + 2 * maxDistance;
      context.beginPath();
      context.arc(p.x, p.y, radius, 0, tau);
      context.fill();

    }
  })
}