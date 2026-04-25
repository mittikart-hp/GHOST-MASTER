// USERS (Default Data)
let users = JSON.parse(localStorage.getItem("users")) || [
{name:"Lucas_Arora", password:"lucas9389", rank:15},
{name:"Aarushkumar_Kumar", password:"arush8888", rank:14},
{name:"Vivek_Singh", password:"vivek0000", rank:13},
{name:"Lucas_Parker", password:"lucas1234", rank:4}
];

// SAVE users (IMPORTANT for GitHub)
localStorage.setItem("users", JSON.stringify(users));

// AUTO LOGIN
window.onload = function(){
 let user = localStorage.getItem("currentUser");
 let rank = localStorage.getItem("currentRank");

 if(user){
    document.querySelector(".login-container").style.display="none";
    document.getElementById("dashboard").style.display="block";
    document.getElementById("userInfo").innerText =
    user + " (Rank " + rank + ")";
 }
}

// LOGIN
function login(){
 let n = document.getElementById("name").value.trim();
 let r = document.getElementById("rank").value;
 let p = document.getElementById("password").value;
 let msg = document.getElementById("msg");

 let user = users.find(u => u.name === n);

 if(!user){ msg.innerText="❌ Name Wrong"; return; }
 if(user.rank != r){ msg.innerText="❌ Rank Wrong"; return; }
 if(user.password != p){ msg.innerText="❌ Password Wrong"; return; }

 localStorage.setItem("currentUser", n);
 localStorage.setItem("currentRank", user.rank);

 location.reload();
}

// LOGOUT
function logout(){
 localStorage.removeItem("currentUser");
 localStorage.removeItem("currentRank");
 location.reload();
}