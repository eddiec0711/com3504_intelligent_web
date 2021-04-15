exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    try {
     socket.on('create or join', function(room, userId) {
         socket.join(room)
         io.sockets.to(room).emit('joined', room, userId)
     });

     socket.on('chat', function (room, userId, chatText){
         io.sockets.to(room).emit('chat', room, userId, chatText);
     });

     socket.on('draw', function(room, userId, canvasWidth, canvasHeight, x1, y21, x2, y2, color, thickness){
         console.log("socket receiving")
         io.sockets.to(room).emit('draw', room, userId, canvasWidth, canvasHeight, x1, y21, x2, y2, color, thickness);
     });

     socket.on('clear', function(room){
         io.sockets.to(room).emit('clear')
     })

     socket.on('disconnect', function (){
         console.log('someone disconnected')
     });
     } catch (e) {
    }
  });
}
