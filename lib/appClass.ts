const messages = document.getElementById("messages");
const messagesHistory = document.getElementById("messagesHistory");
const tableUsers = document.getElementById("tableUsers");
const tableTest= document.getElementById("tableTest");

function forms(message)
{
  //зашел/вышел пользователь
      if(message.online && message.cell)
      { 
        if(message.online =='Yes' &&  message.user.id != user.id)
        {      
              
          createRowUsers(message.user.id,message.user.login, message.user.fio,true,null);
        }  
        else
        {
          if( cellsUsers[message.cell].children[0])
          cellsUsers[message.cell].children[0].src ='./img/red.png' ;
        }  
            return;
        }
 //получение сообщений
        if( message.userFrom)
      {   

          const li = document.createElement("li");
          if ( user.id == message.userFrom.id) li.className = 'right';
          li.innerHTML = message.value;
          messages.appendChild(li);
          messagesHistory.appendChild(li.cloneNode(true));
    }

}
//список пользователей
let usersOnline;
function users(usersOnline, user,change)
{         
 //  usersOnline = message; 
  //usersOnline = change.usersOnline; 
start()
const trUsers = document.createElement("tbody"); 
tableUsers.appendChild(trUsers);
         // let online = false;
         usersOnline.forEach(usersOnline => {
        // if(usersOnline.findIndex(x => x.GUID==message.GUID) !=-1) {online = true;} else  {online = false;} 
            createRowUsers(usersOnline.GUID,usersOnline.login, usersOnline.fio,true,trUsers);
          })

finish(user);

 }
 //const lettersUsers = ["id","v","","ФИО"];
function start()
{
  let table = document.getElementById("tableUsers");
  table.innerHTML = '';
  //таблица пользователей

const trUsers = document.createElement("thead");

trUsers.innerHTML = lettersUsers.map(col => (`${col}` == "v"?'<td><INPUT type="checkbox"  onchange="checkAll()" name="chk[]" style="width:15px;height:15px;"/></td>':`<td  `+(`${col}` == "id"?'style="visibility:hidden;"':'')  +`>${col}</td>`) ).join("");
tableUsers.appendChild(trUsers);
makeSortable(tableUsers);
}
 let id='0';
 function finish(user)
{
  getSelectedRow();
  //пользователь зашел, отметить зеленым цветом
  ws.send(JSON.stringify({
    online: 'Yes',
    cell: '' + user.id,
    value: cellsUsers['' + user.id].value,
    user: user
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

      index = (<HTMLTableRowElement>this).rowIndex;
      (<HTMLTableRowElement>this).classList.toggle("selected");
      id =  table.rows[index].cells[0].textContent;
     // Chat=table.rows[index].cells[3].textContent;

    };
    
  }
}
 

//const lettersUsers = ["id","v","","ФИО"];
const lettersUsers = ["id","","ФИО"];
const createRowUsers = (id,login, FIO,online, trUsers) => {
  //const trUsers = document.createElement("tbody"); 
  trUsers = trUsers || tableUsers.getElementsByTagName('tBody')[0];
  const tr = document.createElement("tr"); 
  tr.innerHTML =
  lettersUsers
      .map(col => `<td><output `  +(`${col}` == "id"?'class="id"':'')  +` id="${col}${id}" type="text"></td>`)
    .join("");
  // trUsers.innerHTML =
  //   lettersUsers
  //       .map(col => `<td><output ` +(((`${id}`).split(' ')[0])<0?'onchange="checkChat()"':'') +(`${col}` == "id"?'class="id"':'')  +` id="${col}${id}" type="text"></td>`)
  //     .join("");
  //tableUsers.appendChild(trUsers);
  trUsers.appendChild(tr);
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

  function sortTable(table, col, reverse) {
    var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
    reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) { // sort rows
        return reverse // `-1 *` if want opposite order
            * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                .localeCompare(b.cells[col].textContent.trim())
               );
    });
    for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
  }
  
  function makeSortable(table) {
    console.log("l");
    let th = table.tHead, i;
    th && (th = th.rows[0]) && (th = th.cells);
    if (th) i = th.length;
    else return; // if no `<thead>` then do nothing
    while (--i >= 0) (function (i) {
        var dir = 1;
        th[i].addEventListener('click', function () {sortTable(table, i, (dir = 1 - dir))});
    }(i));
  }
  
  function makeAllSortable(parent) {
    parent = parent || document.body;
    var t = parent.getElementsByTagName('table'), i = t.length;
    while (--i >= 0) makeSortable(t[i]);
  }
  
  // window.onload = function () {
  //   makeAllSortable( null);
  // };