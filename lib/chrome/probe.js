const config = require('../config')
    , sessions = require('../sessions')
    , utils = require('../utils')

module.exports = function() {

  return sessions.get(config.name + config.url)
  .then(session => {
    config.debugPort = session || (config.port + 1)
    config.chromeUrl = 'http://localhost:' + config.debugPort
  })
  .then(() => utils.request(config.chromeUrl + '/json/list/'))
  .catch(() => {
    // If a connection could not be made we have no tabs
  })
  .then(tabs => tabs && tabs.find(t => config.url && t.url.startsWith(config.url.slice(0, -1))))
  .then(tab => !tab && utils.nextFreePort(config.debugPort))
  .then(port => {
    if (port) {
      config.debugPort = port
      config.chromeUrl = 'http://localhost:' + config.debugPort
    }
    return utils.nextFreePort(config.debugPort + 1)
  })
  .then(port => config.debugProxyPort = port)
  .then(() => sessions.set(config.name + config.url, config.debugPort))

}