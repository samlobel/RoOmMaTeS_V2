


module.exports = function(server){
  server.on('clientError', function(err, socket){
    console.log(err)
    console.log(socket);
  })
}