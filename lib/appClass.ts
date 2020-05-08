const messages = document.getElementById("messages");
const messagesHistory = document.getElementById("messagesHistory");
const tableUsers = document.getElementById("tableUsers");

function forms(message,userId)
{
  //зашел/вышел пользователь
      if(message.online && cellsUsers[message.cell].children[0])
      {     
        cellsUsers[message.cell].children[0].src ='./img/'+(message.online =='Yes'? 'green':'red')+'.png' ;
            return;
        }
 //получение сообщений
        if( message.userFrom)
      {   
        // if((message.userTo!= 0 && (userId != message.userTo && userId != message.userFrom.id )))
        // if((message.userTo!= 0 && message.idChat ==0 && (userId != message.userTo && userId != message.userFrom.id )))
        // {return;}
          const li = document.createElement("li");
          if ( userId == message.userFrom.id) li.className = 'right';
          li.innerHTML = message.value;
          messages.appendChild(li);
          messagesHistory.appendChild(li.cloneNode(true));
    }

}
//список пользователей
let usersOnline;
function users(message, userId, change)
{          usersOnline = message; 
  //usersOnline = change.usersOnline; 
 // start()

          let online = false;
          message.forEach(message => {
        if(usersOnline.findIndex(x => x.GUID==message.GUID) !=-1) {online = true;} else  {online = false;} 
            createRowUsers(message.GUID,message.login, message.fio,online);
          })

finish(change.idChat,userId);

 }
 let id='0';
 function finish(idChat,userId)
{
  getSelectedRow();
  //пользователь зашел, отметить зеленым цветом
  ws.send(JSON.stringify({
    online: 'Yes',
    cell: '' + userId,
    value: cellsUsers['' + userId].value
  }));
 // id = (-idChat).toString();
  if (document.getElementsByName(id.toString())[0])
  {(<HTMLInputElement>document.getElementsByName(id.toString())[0]).checked = true;}
 // checkChat();
}

function getSelectedRow() {
  let table = <HTMLTableElement>document.getElementById("tableUsers");
  let index = null;
 // console.log('getSelectedRow', table);
  for (let i = 1; i < table.rows.length; i++) {
   // console.log('ii', i);
    table.rows[i].onclick = function() {

      if (typeof index !== "undefined" && table.rows[index]) {
        table.rows[index].classList.toggle("selected");
      }

      index = table.rows[index].rowIndex;
      table.rows[index].classList.toggle("selected");
      id =  table.rows[index].cells[0].textContent;
     // Chat=table.rows[index].cells[3].textContent;

    };
    
  }
}
 

const lettersUsers = ["id","v","","ФИО"];
const createRowUsers = (id,login, FIO,online) => {
  const trUsers = document.createElement("tr");
  trUsers.innerHTML =
  lettersUsers
      .map(col => `<td><output `  +(`${col}` == "id"?'class="id"':'')  +` id="${col}${id}" type="text"></td>`)
    .join("");
  // trUsers.innerHTML =
  //   lettersUsers
  //       .map(col => `<td><output ` +(((`${id}`).split(' ')[0])<0?'onchange="checkChat()"':'') +(`${col}` == "id"?'class="id"':'')  +` id="${col}${id}" type="text"></td>`)
  //     .join("");
  tableUsers.appendChild(trUsers);
  lettersUsers.forEach(col => {
    const cell = col + id;
    const input = document.getElementById(cell);
    switch (col)
    {
      case "id":
         (<HTMLInputElement>input).value = id;
          break; 
      case "v":

          let element1 = document.createElement("input");
          element1.type = "checkbox";
          element1.name=id;
          element1.style.width="15px"; //"width:15px;height:15px;"
          element1.style.height="15px";
          input.appendChild(element1);

          break; 
      case "":
       // if(id>0)
          insImg(input,(online?'green':'red'));
          break;            
      case "Login":
        (<HTMLInputElement>input).value = login;
        break;
      case "ФИО":
        (<HTMLInputElement>input).value = FIO;
        break;
    }
    cellsUsers[cell] = input;

  });
};
function insImg(input, name){
  if(input.children.length ==0)
  {
  let img = new Image();
  img.onload = function() {

      input.appendChild(img);
         }
         img.src = './img/'+name+'.png'
  }
    else
    input.children[0].src ='./img/'+name+'.png' ;

  };