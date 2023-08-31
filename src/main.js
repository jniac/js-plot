import { easeInOut3 } from './easing.js'
import { ceil, floor, positiveModulo } from './math.js'

const svg = document.querySelector('svg')

let zoom = 40
const focusPoint = new DOMPoint()
const view = new DOMRect()

function updateView() {
  const width = window.innerWidth
  const height = window.innerHeight
  view.width = width / zoom
  view.height = height / zoom
  view.x = focusPoint.x - 0.5 * view.width
  view.y = focusPoint.y - 0.5 * view.height
  svg.setAttributeNS(
    null,
    'viewBox',
    [view.x, view.y, view.width, view.height].join(' ')
  )
}

updateView()

/**
 *
 * @param {keyof SVGElementTagNameMap} type
 * @param {Record<string, any>} props
 * @returns {SVGElement}
 */
function create(type, props) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', type)
  for (const [name, value] of Object.entries(props)) {
    element.setAttributeNS(null, name, String(value))
  }
  return element
}

/**
 * @typedef {{
 *   step?: number
 *   opacity?: number
 *   skip?: (current: { value: number, type: 'x' | 'y' }) => boolean
 * }} Parameter
 * @param {Parameter} param0
 */
function grid({ step = 1, opacity = 0.33, skip } = {}) {
  const xmin = ceil(view.left, step)
  const xmax = floor(view.right, step)
  for (let x = xmin; x <= xmax; x += step) {
    if (skip?.({ value: x, type: 'x' }) === true) {
      continue
    }
    const line = create('line', {
      x1: x,
      x2: x,
      y1: view.top,
      y2: view.bottom,
      opacity,
    })
    svg.querySelector('g').append(line)
  }

  const ymin = ceil(view.top, step)
  const ymax = floor(view.bottom, step)
  for (let y = ymin; y <= ymax; y += step) {
    if (skip?.({ value: y, type: 'y' }) === true) {
      continue
    }
    const line = create('line', {
      x1: view.left,
      x2: view.right,
      y1: y,
      y2: y,
      opacity,
    })
    svg.querySelector('g').append(line)
  }
}

/**
 * @typedef {{
 *   fn: (x: number) => number
 *   color?: string
 *   thickness?: number
 * }} Arg
 * @param {Arg} param0
 */
function plot({ fn, thickness, color }) {
  const step = window.innerWidth
  const points = []
  for (let i = 0; i < step; i++) {
    const t = i / step
    const x = view.x + view.width * t
    const y = fn(x)
    points.push([x, -y].join(','))
  }
  const polyline = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polyline'
  )
  polyline.setAttributeNS(null, 'points', points.join(' '))
  if (color) {
    polyline.setAttributeNS(null, 'stroke', color)
  }
  if (thickness !== undefined) {
    polyline.setAttributeNS(null, 'stroke-width', (0.01 * thickness).toString())
  }
  svg.querySelector('g').append(polyline)
}

grid({
  skip: info => info.value % 5 === 0,
  opacity: 0.2,
})

grid({
  step: 5,
  skip: info => info.value === 0,
  opacity: 0.5,
})

grid({
  step: 100,
  opacity: 1,
})

plot({ fn: x => x })

plot({
  color: 'red',
  thickness: 4,
  fn: x => {
    const d1 = 2
    const d2 = 3
    const d = d1 + d2
    x = positiveModulo(x, d * 2)
    x = x < d ? Math.min(1, x / d1) : Math.max(0, 1 - (x - d) / d1)
    return easeInOut3(x)
  },
})
