var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
//Tao server
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);
var mang = ['Hội yêu thầm D','Hội phát cuồng vì D'];
io.on("connection",function(socket){
	console.log("Co nguoi ket noi: " + socket.id);
	console.log(socket.adapter.rooms);
	io.sockets.emit("sever-phat-danh-sach-phong",mang);
	socket.on("tao-room",function(data){
		socket.join(data);
		if(mang.indexOf(data)>=0){
			socket.emit("tao-room-that-bai");
		}
		else{
			mang.push(data);
			io.sockets.emit("sever-phat-danh-sach-phong",mang);
			socket.emit("sever-phat-ten-phong-chat",data);
		}
		
	});
	socket.on("chon-room",function(data){
		socket.join(data);
		socket.phong = data;
		socket.emit("sever-phat-ten-phong-chat",data);
	});
	socket.on("client-chat",function(data){
		io.sockets.in(socket.phong).emit("server-sent-chat",data);
	});

 console.log(mang);
});
app.get("/", function(req,res){
  res.render("trangchu");
});
