
/**
 * @param {number} x 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export const clamp = (x, min, max) => {
	return x < min ? min : x > max ? max : x
}

/**
 * @param {number} x 
 * @returns {number}
 */
export const clamp01 = (x) => {
	return x < 0 ? 0 : x > 1 ? 1 : x
}

/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} x 
 * @returns {number}
 */
export const lerp = (a, b, x) => {
	return a + (b - a) * clamp01(x)
}

/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} x 
 * @returns {number}
 */
export const lerpUnclamped = (a, b, x) => {
	return a + (b - a) * x
}

/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} x 
 * @returns {number}
 */
export const inverseLerp = (a, b, x) => {
	return clamp01((x - a) / (b - a))
}

/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} x 
 * @returns {number}
 */
export const inverseLerpUnclamped = (a, b, x) => {
	return (b - x) / (b - a)
}

/**
 * 
 * @param {number} x 
 * @param {number} base 
 * @returns {number}
 */
export const round = (x, base = 1) => {
	return Math.round(x / base) * base
}

/**
 * 
 * @param {number} x 
 * @param {number} base 
 * @returns {number}
 */
export const ceil = (x, base = 1) => {
	return Math.ceil(x / base) * base
}

/**
 * 
 * @param {number} x 
 * @param {number} base 
 * @returns {number}
 */
export const floor = (x, base = 1) => {
	return Math.floor(x / base) * base
}

/**
 * 
 * @param {number} x 
 * @returns {number}
 */
export const toff = (x) => {
	return clamp(Math.floor(0x100 * x), 0, 0xff)
}

/**
 * 
 * @param {number} x 
 * @param {number} limit 
 * @returns {number}
 */
export const limited = (x, limit) => {
	return x * limit / (x + limit)
}

/**
 * 
 * @param {number} x 
 * @param {number} limit 
 * @returns {number}
 */
export const signedLimited = (x, limit) => {
	return x < 0 ? -limited(-x, limit) : limited(x, limit)
}

/**
 * Returns the "positive" modulo of "x".
 * ```
 * positiveModulo(-2, 10) // -> 8
 * ```
 */
export const positiveModulo = (x, base) => {
	x %= base
	return x < 0 ? x + base : x
}

/**
 * Clamps a value with progressive limit. Useful for user "drag" feedbacks.
 * https://www.desmos.com/calculator/rnsygpvpcb
 */
export const limitedClamp = (x, min, minLimit, max, maxLimit) => {
	let limit = 0, delta = 0
	return (
		x < min ? min + (limit = minLimit - min) * (delta = x - min) / (limit + delta) :
		x > max ? max + (limit = maxLimit - max) * (delta = x - max) / (limit + delta) :
		x
	)
}
