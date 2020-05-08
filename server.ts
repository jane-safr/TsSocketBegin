import {app} from  "./lib/myExpress" ;
import {sC as serverClass} from "./lib/serverClass"
declare function require(path: string): any;
let  session = require('./sessions/core').magicSession();
declare var process : {
  env: {
    port: string
  }
}
const HOST = 'localhost';
const webSocket = require("ws");
const mode = 'AD';
let mySession;
let _user;
let usersOnline=[];
let porthttp = process.env.port || 8125
let fs = require('fs');
let path = require('path');
let ejs = require('ejs');

//server http
const serverHttp = require("http").createServer(onRequest);

function onRequest(req, res)  {
  if (req.url.startsWith('/') || req.url.startsWith('/login') ) {
    res.redirect = function(location)
        {   
          res.writeHead(302,  {Location: location})
          res.end();
        }
        if(!req.cookies)
        {req.cookies = [];}
        
    handleGreetRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Страница не найдена.');
  }
};

const handleGreetRequest = (request, response) => {
  console.log('Start ',request.url);
  
  //сессия
  mySession = request.session;
  if(mySession)
  {
  // serverClass.login(function(err,user){
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   console.log('logout',_user);
  // },_user,null,mode)
  }

  //разборка/определение url

    let filePath = '.' + request.url;
    let extname = String(path.extname(request.url)).toLowerCase();

 //выход
 //includes
 if(filePath.match('logout')) 
 { 
     console.log('logout');
      request.logout();
    if(_user)
        {  serverClass.login(function(err,user){
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('logout',_user);
              },_user,null,mode)}
              mySession = null; 
    console.log('logout', request.session.data.user,_user);
   }
   console.log('filePath before dispatch ',filePath,request.url);

  filePath = app.dispatch(request.url,extname);
  console.log(Date(),'filePath',filePath,request.url);   
  
  if( request.session && request.session.data.user)
    {
      _user = JSON.parse(request.session.data.user);
    }

    extname = String(path.extname(filePath)).toLowerCase();
    let contentType = app.mimeTypes[extname] || 'text/html; charset=utf-8';

    //POST login
    if (request.method === 'POST') {
      console.log('POST',request.url)
     if(request.url.match("/login") )
        { 

          app.postForm(request, function(err,body){
              if(err){console.log(err);return;}
              serverClass.login(function(err,user){
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('POST2',err,user)
                if (!user) {
                  let content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: undefined, message: "Укажите правильный " + (mode=="AD"?"логин":"email") + " или пароль!", SelForm: 'formlogin', notUser: undefined,mode: mode});
                  app.Render(response,content,contentType);

                  return;
                }
                else
                _user = JSON.parse(user);
                 request.logIn(_user);
                
                console.log('login', mySession.data.user, mySession.id);

              //  {
                // if(usersOnline.) 
                //   if(usersOnline.findIndex(x => x && x.GUID==_user.GUID) ===-1)
                // {
                //   usersOnline.push(_user);
                // }
                
                let find= false;
                usersOnline.forEach(function (x) {
                  if (x.GUID==_user.GUID)
                  find= true;
              });

              
              if(!find) 
               usersOnline.push(_user);
                console.log('usersOnlinePush',usersOnline)
                response.redirect(process.env.port ? "/Messager/server.js": "/");
            //  }
              },body,mySession,mode)
          })
        } 
  }
  else
 { 
  //console.log('nen',filePath);
   fs.readFile(filePath, function(error, content) {
   // console.log('nen222');
      if (error) {
       // console.log('nenerr');
          if(error.code == 'ENOENT') {
              fs.readFile('./404.html', function(error, content) {
                  response.writeHead(404, { 'Content-Type': 'text/html' });
                  response.end(content, 'utf-8');
              });
          }
          else
           {
              response.writeHead(500);
              response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
          }
      }
      else 
      {
        //console.log('nen0');
                  if(filePath.match('ejs'))
            {   
                content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: undefined, message: ' ' , SelForm: 'formlogin', notUser: undefined,mode: mode});
            }
            app.Render(response,content,contentType);

      }
  });
}
}

///WebSocket

//let cookie_date = new Date().toGMTString(); 
const server =  new webSocket.Server({
  server: serverHttp,
 // port,
    verifyClient: (info, done) => {
    done(mySession);
  },
  noServer: false
});

server.on("connection", function(ws, request) {
  let commands = {
  //   //добавление/изменение пользователей в чате
  // insertUserInChat: serverClass.insertUserInChat,
  //  //выбор пользователей в чате
  // checkUsersInChat:  serverClass.checkUsersInChat,
  // //история чата
  // History:  serverClass.History,
  // //фильтр пользователей
  // getFilterUsers:  serverClass.getFilterUsers,
  // //сохранение сообщений
  // saveMessage:  serverClass.saveMessage,
  //пользователи онлайн
  usersOnline: serverClass.usersOnline,
  };

  ws.on("message", message => {

    message = JSON.parse(message);
    //закрытие сокета с клиента вводом строки exit
    if (message.value === "exit") {
    ws.close();
    console.log("Exit " + server);
    } 
    //рассылка сообщений пользователям
    else 
    {
          server.clients.forEach(client => {
          if (client.readyState === webSocket.OPEN) {
          console.log('рассылка сообщений пользователям',message, client.user,server.clients.size);
            if ( client.user && (message.online || client.user.id == ws.user.id || message.usersSend.split(',').findIndex(x => x==client.user.id)  !=-1)) 
                {  
                  console.log('рассылка', client.user.id);
                client.send(
                  JSON.stringify({
                    cell: "form",
                    message
                  })
                );
                console.log('ws.send4')
                }
          }
        });
    }
})

if(_user)ws.user =_user ;
//пользователь зашел
if (ws.user)
{
  ws.send(
    JSON.stringify({
      cell: "user",
      user: ws.user
    //   ,
    //  clients: JSON.stringify(server.clients)
    }));
    //пользователи онлайн
    commands['usersOnline'](function( _usersOnline)
      {usersOnline =_usersOnline;
        ws.send(
          JSON.stringify({
            cell: "users",
            message: usersOnline
          //   ,
          //  clients: JSON.stringify(server.clients)
          }));
      },usersOnline,server.clients)
    console.log('пользователи онлайн',usersOnline);
}
    //заполнение таблицы пользователей
    //console.log('getFilterUsers1',mode);
    // commands['getFilterUsers'](function(err, idChat,wsSend) {
    //   // console.log('getFilterUsers2',mode);
    //    if(err){return;}
    //      if(idChat)  _idChat = idChat;
    //      if(wsSend) 
    //      {
    //              wsSend = JSON.parse(wsSend); 
    //              wsSend.usersOnline = usersOnline; 
    //              wsSend.idChat= _idChat;
    //              wsSend = JSON.stringify(wsSend); 
                 
    //            ws.send(wsSend);
    //           // console.log('ws.send2',wsSend)
    //      }
    //    },null,_idChat?_idChat:0, (ws.user?ws.user.id:0),mode);

ws.on ("error", (error) => {
  if (error.code != "ECONNRESET") {
        throw error;
   }
   else{
    console.log("ECONNRESET" + error);
   }
});

})

serverHttp.listen(porthttp, function() {
  console.log(`Listening on http://${HOST}:${porthttp}`);
});


