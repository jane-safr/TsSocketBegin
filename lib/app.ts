const status1 = document.getElementById("status");
const logout = document.getElementById("logout");
const welcome = document.getElementById("welcome");
const form = document.getElementById("form");
const input = document.getElementById("input");

let user = {fio:'',id:'',login:''};
const HOST =  window.location.host +window.location.pathname; //'localhost:' +  8125;
let cellsUsers =[];
let checkboxes =[];
var ws = new WebSocket("ws://" + HOST);

ws.onopen = () => setStatus("В сети");

ws.onclose = () => {setStatus("Отключен");  cellsUsers['' + user.id].children[0].src ='' ; }

ws.onmessage = response => 
printMessage(response.data);

function setStatus(value) {
  status1.innerHTML = "Статус: "+ value;
  (<HTMLLinkElement>logout).href = "http://"+HOST + '/logout';  (<HTMLLinkElement>welcome).href = "http://"+HOST + '/login'; 

}

function printMessage(value) {
  console.log('value',value);
  const change = JSON.parse(value);
  console.log('change',change);
  //Аутентификация в index.html
  if (change.cell == 'user')
  {

    if(change.user)
    {
      //user = new user();
      user.fio= change.user.fio;
      user.id= change.user.GUID;
      user.login= change.user.login;
      welcome.innerHTML =  user.fio;
      logout.innerHTML =   ' Выйти';

    }
    else
    {logout.innerHTML = 'Войти'; welcome.innerHTML = ''; }
    return;
  }
  if(change.message && change.message.online =="No" && change.message.cell == user.id)
  {welcome.innerHTML =  welcome.innerHTML + " в другой сессии";}
  if(!user){return;}

  let commands = {
  //зашел/вышел пользователь; получение сообщений
  form: forms,
  // // История сообщений
  // History: History1,
  //список пользователей
  users:  users,
  // //отметить пользователей в чате
  // checkUsersInChat: checkUsersInChat,
  // //фильтр с учетом регистра
  // getFilterUsers:  users
};



commands[change.cell](change.message,user,change);
}
//вышел пользователь
window.addEventListener('beforeunload', function() {
  if (user)
  ws.send(JSON.stringify({
    online: 'No',
    cell: '' + user.id,
    user: user
  }));
});