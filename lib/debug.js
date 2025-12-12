/* node:coverage disable */
module.exports = process.env.DEBUG_NOPT || process.env.NOPT_DEBUG
  // eslint-disable-next-line no-console
  ? (...a) => console.error(...a)
  : () => {}
/* node:coverage enable */
