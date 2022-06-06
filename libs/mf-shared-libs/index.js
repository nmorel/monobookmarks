const deps = require('./package.json').dependencies

module.exports = Object.entries(deps).reduce((acc, [key, value]) => {
  acc[key] = {
    singleton: true,
    eager: true,
    requiredVersion: value,
  }
  return acc
}, {})
