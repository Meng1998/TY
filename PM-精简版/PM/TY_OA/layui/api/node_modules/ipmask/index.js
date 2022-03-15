module.exports = function addr () {
  var ip = require('ip').address()
  var ifaces = require('os').networkInterfaces()

  for (var i in ifaces) {
    var f = ifaces[i].filter(j => {
      if (j.address === ip)
        return j
    })

    if (f.length)
      return f[0]
  }
}
