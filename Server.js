var app     =     require("express")();
var mysql   =     require("mysql");
var http    =     require('http').Server(app);
var io      =     require("socket.io")(http);

/* Creating POOL MySQL connection.*/

var pool    =    mysql.createPool({
      connectionLimit   :   100,
      host              :   'localhost',
      user              :   'root',
      password          :   '',
      database          :   'mydb',
      debug             :   false
});

app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});
// var connection = mysql.createConnection({  
//   host     : 'localhost',  
//   user     : 'root',  
//   password : '',  
//   database : 'mydb'  
// });
// app.get('/rows', function (req, res) {
//   connection.connect();  

//   connection.query('SELECT * FROM chat', function(err, rows, fields)   
//   {  
//       connection.end();

//       if (err) throw err;  
//       //console.log(rows);
//       res.json(rows); 

//   });
// });

/*  This is auto initiated event when Client connects to Your Machien.  */

io.on('connection',function(socket){  
    console.log("A user is connected");
    socket.on('status added',function(status){
      add_status(status,function(res){
        if(res){
            io.emit('refresh feed',status);
        } else {
            io.emit('error');
        }
      });
    });
});

var add_status = function (status,callback) {
    pool.getConnection(function(err,connection){
        if (err) {
          callback(false);
          return;
        }
    connection.query("INSERT INTO `chat` (`msg`) VALUES ('"+status+"')",function(err,rows){
            connection.release();
            if(!err) {
              callback(true);
            }
        });
     
        
         
     connection.on('error', function(err) {
              callback(false);
              return;
        });
    });
}

http.listen(3000,function(){
    console.log("Listening on 3000");
});
