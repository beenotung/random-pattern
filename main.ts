let { sqrt, random, floor } = Math

let canvas = document.createElement('canvas')

let ratio = 3

canvas.width = 400 / ratio
canvas.height = 400 / ratio

canvas.style.width = canvas.width * ratio + 'px'
canvas.style.height = canvas.height * ratio + 'px'

let context = canvas.getContext('2d')!
let imageData = context.getImageData(0, 0, canvas.width, canvas.height)

type Point = {
  x: number
  y: number
  offset: number
  r: number
  g: number
  b: number
}
let points: Point[] = []

for (let i = 0; i < imageData.data.length; i += 4) {
  imageData.data[i + 3] = 255
}

type Candidate = { point: Point; dist: number }

function distSquare(a: Point, b: Point) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
}

function tick() {
  let candidates: Candidate[] = []
  let n = sqrt(points.length)
  if (n == 0) n = 1
  // n *= 10
  // n = canvas.width * canvas.height

  // console.log(points.length, n)

  let f = (x: number, y: number) => {
    let offset = (y * canvas.width + x) * 4
    let r = 132
    let g = 64
    let b = 132
    let point: Point = { x, y, offset, r, g, b }
    // let dist = Math.min(...points.map(p => distSquare(p, point)))
    let dist = Number.POSITIVE_INFINITY
    for (let i = 0; points.length > 0 && i < n; i++) {
      let d = distSquare(point, points[floor(random() * points.length)])
      if (d < dist) dist = d
    }
    candidates.push({ point, dist })
  }

  // for (let y = 0; y < canvas.height; y++) {
  //   for (let x = 0; x < canvas.width; x++) {
  //     f(x, y)
  //   }
  // }

  for (let i = 0; i < n; i++) {
    let x = floor(random() * canvas.width)
    let y = floor(random() * canvas.height)
    f(x, y)
  }

  let { point } = candidates.sort((a, b) => b.dist - a.dist)[0]
  points.push(point)
  let { offset, r, g, b } = point
  imageData.data[offset + 0] = r
  imageData.data[offset + 1] = g
  imageData.data[offset + 2] = b
  // imageData.data[offset + 3] = 255

  context.putImageData(imageData, 0, 0)

  requestAnimationFrame(tick)
  // setTimeout(tick, 300)
}

requestAnimationFrame(tick)

document.body.appendChild(canvas)

Object.assign(window, { canvas, context, imageData, ratio, tick })
