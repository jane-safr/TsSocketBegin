import {AD} from "./AD"

let sC=
{
  usersOnline:
  function (cb,usersOnline,clients) {
    usersOnline=[];
      clients.forEach(client => {
      if(client.user)   usersOnline.push(client.user);})
        cb(usersOnline);
  }
  ,
  login:
  function(cb,user,Session,mode)
  {
  // console.log('Я тут!',user,Session,mode);
  let all; let SessionId = Session?Session.id:null
  {

    if(Session)
    {
      AD.login( user,Session,function(err,_all)
    {
      all= _all;
      console.log('_all',_all,all)
      send(err,all);
    }
      )
    }

  }
  let wsSend;
  function send(err,all)
  { 
    if (err) {
      console.log("err login",err);
      cb(err,null);
    }
    //console.log(err,all);
    if(all)
    wsSend =
    JSON.stringify({
    id:     all.id,
    email:  all.email,
    login:  all.login,
    fio:   all.fio,
    GUID: all.GUID
  })
  console.log('wsSend',wsSend)
  cb('',all?wsSend:false);
  }
  
  
  }
}

export {sC}

