let currentUser = null;

// USERS
let users = JSON.parse(localStorage.getItem("users")) || [];

// VIDEOS
let videos = JSON.parse(localStorage.getItem("videos")) || [];

// SUB REQUESTS
let subscribeRequests = JSON.parse(
localStorage.getItem("subscribeRequests")
) || [];

// WITHDRAW REQUESTS
let withdrawRequests = JSON.parse(
localStorage.getItem("withdrawRequests")
) || [];

// AUTO OWNER
if(users.length === 0){

users = [

{
name:"Lucas_Arora",
password:"admin123",
role:"owner",
coins:0
}

];

save();

}

// SAVE
function save(){

localStorage.setItem(
"users",
JSON.stringify(users)
);

}

// SIGNUP
function signup(){

let u =
document.getElementById("username").value;

let p =
document.getElementById("password").value;

if(users.find(x=>x.name===u)){

alert("User already exists");
return;

}

users.push({

name:u,
password:p,
role:"subscriber",
coins:0

});

save();

alert("Signup successful ✅");

}

// LOGIN
function login(){

let u =
document.getElementById("username").value;

let p =
document.getElementById("password").value;

let user = users.find(

x => x.name===u &&
x.password===p

);

if(!user){

alert("Wrong login ❌");
return;

}

currentUser = user;

localStorage.setItem(
"currentUser",
u
);

showDashboard();

}

// SHOW DASHBOARD
function showDashboard(){

hideAllPages();

document.getElementById("dashboard")
.classList.remove("hidden");

document.getElementById("userInfo")
.innerText =
"User: " + currentUser.name;

document.getElementById("roleInfo")
.innerText =
"Role: " + currentUser.role;

updateUI();

}

// UPDATE UI
function updateUI(){

let user = users.find(
x => x.name===currentUser.name
);

document.getElementById("coins")
.innerText = user.coins;

// ADMIN PANEL
document.getElementById("adminPanel")
.classList.add("hidden");

if(
user.role==="owner" ||
user.role==="admin"
){

document.getElementById("adminPanel")
.classList.remove("hidden");

}

// SUBSCRIBE BUTTON HIDE
let approvedUsers = JSON.parse(
localStorage.getItem("subApproved")
) || [];

if(
approvedUsers.includes(user.name)
){

document.getElementById("subscribeBox")
.style.display = "none";

}else{

document.getElementById("subscribeBox")
.style.display = "block";

}

}

// HIDE ALL
function hideAllPages(){

document.getElementById("loginPage")
.classList.add("hidden");

document.getElementById("dashboard")
.classList.add("hidden");

document.getElementById("earnPage")
.classList.add("hidden");

document.getElementById("subscribePage")
.classList.add("hidden");

document.getElementById("membersPage")
.classList.add("hidden");

document.getElementById("newSubscriberPage")
.classList.add("hidden");

document.getElementById("withdrawPage")
.classList.add("hidden");

document.getElementById("withdrawRequestPage")
.classList.add("hidden");

}

// BACK
function backDashboard(){

showDashboard();

}

// STATUS
function statusFeature(){

let history = JSON.parse(
localStorage.getItem(
"history_"+currentUser.name
)
) || [];

let text = "";

history.forEach(h=>{

text += "• " + h + "\n";

});

if(text===""){
text = "No history";
}

alert(

"📊 STATUS 📊\n\n" +

"Name: " + currentUser.name + "\n\n" +

"Role: " + currentUser.role + "\n\n" +

"Coins: " + currentUser.coins + "\n\n" +

"━━━━━━━━━━\n\n" +

text

);

}

// HISTORY
function addHistory(user,text){

let history = JSON.parse(
localStorage.getItem(
"history_"+user
)
) || [];

history.push(text);

localStorage.setItem(
"history_"+user,
JSON.stringify(history)
);

}

// EARN PAGE
function openEarnPage(){

hideAllPages();

document.getElementById("earnPage")
.classList.remove("hidden");

showVideos();

if(
currentUser.role==="owner"
){

document.getElementById("uploadBox")
.style.display = "block";

}else{

document.getElementById("uploadBox")
.style.display = "none";

}

}

// UPLOAD VIDEO
function uploadVideo(){

let link =
document.getElementById("videoLink").value;

let reward =
parseInt(
document.getElementById("videoReward").value
);

if(!link || !reward){

alert("Fill all fields");
return;

}

videos.push({

id:Date.now(),
link:link,
reward:reward

});

localStorage.setItem(
"videos",
JSON.stringify(videos)
);

// DISCORD WEBHOOK
fetch(
"https://discord.com/api/webhooks/1503774481582395592/LaQ3H8clAQcjLsWoJAEttASiwbOcyFYSNdyum1YsbQ7S3E-z_8rsfMvF8Ja835N-73by",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

content:
"🎥 NEW VIDEO UPLOADED\n\n" +
link

})

});

alert("Video uploaded ✅");

showVideos();

}

// SHOW VIDEOS
function showVideos(){

let area =
document.getElementById("videoArea");

area.innerHTML = "";

if(videos.length===0){

area.innerHTML = `
<h3>
No Videos Available 📭
</h3>
`;

return;

}

videos.forEach(v=>{

area.innerHTML += `

<div class="card">

<h3>
Reward:
${v.reward} Coins
</h3>

<button
onclick="watchVideo(
'${v.link}',
${v.reward},
${v.id}
)">

Watch Video ▶

</button>

</div>

`;

});

}

// WATCH VIDEO
function watchVideo(link,reward,id){

let claimed = JSON.parse(
localStorage.getItem(
"claimed_"+currentUser.name
)
) || [];

if(claimed.includes(id)){

alert("Already claimed ❌");
return;

}

window.open(
link,
"_blank"
);

let user = users.find(x => x.name === currentUser.name);
user.coins += reward;
currentUser.coins = user.coins;
save();

save();

claimed.push(id);

localStorage.setItem(
"claimed_"+currentUser.name,
JSON.stringify(claimed)
);

addHistory(

currentUser.name,

"You earned " +
reward +
" coins by video"

);

videos = videos.filter(
x=>x.id!==id
);

localStorage.setItem(
"videos",
JSON.stringify(videos)
);

updateUI();

alert(
"You earned " +
reward +
" coins 💰"
);

showVideos();

}

// OPEN SUBSCRIBE
function openSubscribePage(){

hideAllPages();

document.getElementById("subscribePage")
.classList.remove("hidden");

}

 // SUBMIT VERIFICATION
function submitVerification(){

let name =
document.getElementById("gameName").value;

let number =
document.getElementById("gameNumber").value;

let file =
document.getElementById("proofImage").files[0];

if(!name || !number || !file){

alert("Fill all fields");
return;

}

// CHECK EXISTING REQUEST
let alreadyApplied =
subscribeRequests.find(
x => x.user === currentUser.name
);

if(alreadyApplied){

alert(
"You already submitted verification ❌"
);

return;

}

// CHECK APPROVED
let approvedUsers = JSON.parse(
localStorage.getItem("subApproved")
) || [];

if(
approvedUsers.includes(currentUser.name)
){

alert(
"You are already approved ✅"
);

return;

}

let reader = new FileReader();

reader.onload = function(e){

subscribeRequests.push({

user:currentUser.name,
game:name,
number:number,
image:e.target.result

});

localStorage.setItem(

"subscribeRequests",

JSON.stringify(subscribeRequests)

);

// DISCORD WEBHOOK
fetch(
"https://discord.com/api/webhooks/1503773951325638716/zeBKmrRqWRfaSZBFC07__bZ_hqOsnFqSgyd_zigjklRT4ebCsmq8jhGP5ZbYrcoD6oNX",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

content:
"🆕 NEW SUBSCRIBER REQUEST\n\n" +
"User: " + currentUser.name + "\n" +
"Game Name: " + name + "\n" +
"Number: " + number

})

});

alert(
"Application Submitted ✅"
);

backDashboard();

};

reader.readAsDataURL(file);

}
// NEW SUBSCRIBERS PAGE
function openNewSubscriberPage(){

hideAllPages();

document.getElementById("newSubscriberPage")
.classList.remove("hidden");

let box =
document.getElementById("subscriberList");

box.innerHTML = "";

subscribeRequests.forEach((s,i)=>{

box.innerHTML += `

<div class="card">

<h3>
${s.user}
</h3>

<p>
Game:
${s.game}
</p>

<p>
Number:
${s.number}
</p>

<img
src="${s.image}"
style="
width:100%;
border-radius:10px;
">

<button
onclick="approveSubscriber(${i})">

Approve ✅

</button>

</div>

`;

});

}

// APPROVE SUBSCRIBER
function approveSubscriber(index){

let s = subscribeRequests[index];

let user = users.find(
x=>x.name===s.user
);

if(!user) return;

user.coins += 50000;

save();

let approvedUsers = JSON.parse(
localStorage.getItem("subApproved")
) || [];

approvedUsers.push(user.name);

localStorage.setItem(
"subApproved",
JSON.stringify(approvedUsers)
);

addHistory(

user.name,

"You earned 50,000 coins by subscribe"

);

subscribeRequests.splice(index,1);

localStorage.setItem(

"subscribeRequests",

JSON.stringify(subscribeRequests)

);

alert(
"Approved Successfully ✅"
);

openNewSubscriberPage();

}

// MEMBERS PAGE
function openMembersPage(){

hideAllPages();

document.getElementById("membersPage")
.classList.remove("hidden");

let table =
document.getElementById("membersTable");

table.innerHTML = "";

users.forEach((u,i)=>{

table.innerHTML += `

<tr>

<td>${i+1}</td>
<td>${u.name}</td>
<td>${u.role}</td>
<td>${u.coins}</td>

</tr>

`;

});

}

// WITHDRAW PAGE
function openWithdrawPage(){

hideAllPages();

document.getElementById("withdrawPage")
.classList.remove("hidden");

}

 // SUBMIT WITHDRAW
function submitWithdraw(){

let number = document.getElementById("withdrawNumber").value;
let amount = Number(document.getElementById("withdrawAmount").value);

// ✅ EMPTY CHECK FIRST
if(!number || !amount){
alert("Fill all fields");
return;
}

// ✅ 6 DIGIT CHECK
if(!/^\d{6}$/.test(number)){
alert("Game Number must be exactly 6 digits ❌");
return;
}

// ❌ ONE PENDING REQUEST CHECK
let existing = withdrawRequests.find(
x => x.user === currentUser.name && x.status !== "Completed"
);

if(existing){
alert("⚠ You already have a pending withdraw request");
return;
}

// USER CHECK
let user = users.find(x => x.name === currentUser.name);

if(!user){
alert("User not found ❌");
return;
}

// BALANCE CHECK
if(user.coins < amount){
alert("Not enough coins ❌");
return;
}

// CREATE REQUEST
withdrawRequests.push({
user: currentUser.name,
number: number,
amount: amount,
status: "Waiting",
completed: false
});

localStorage.setItem("withdrawRequests", JSON.stringify(withdrawRequests));


// 🔥 DISCORD WEBHOOK (URL ADDED)
fetch("https://discord.com/api/webhooks/1503774858146742533/cR1OERc6wVRpu0Wy708kRphgmdcssuS_9QDuUHrSTSaK3wJhGDHMBjNl0DdX4eOGc2ey", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
content:
"💸 NEW WITHDRAW REQUEST\n\n" +
"User: " + currentUser.name + "\n" +
"Number: " + number + "\n" +
"Amount: " + amount + " coins 💰\n" +
"Status: Waiting ⏳"
})
});

alert("Withdraw Request Submitted ✅");
backDashboard();
}
 // OPEN WITHDRAW REQUESTS
function openWithdrawRequests(){

hideAllPages();

document.getElementById("withdrawRequestPage")
.classList.remove("hidden");

let table =
document.getElementById("withdrawTable");

table.innerHTML = "";

withdrawRequests.forEach((w,i)=>{

let locked =
w.status === "Completed" ? "disabled" : "";

table.innerHTML += `
<tr>

<td>${w.user}</td>
<td>${w.number}</td>
<td>${w.amount}</td>

<td>
<select ${locked}
onchange="changeWithdrawStatus(${i}, this.value)">

<option selected>${w.status}</option>
<option>Waiting</option>
<option>In Progress</option>
<option>Completed</option>

</select>
</td>

</tr>
`;
});
}
// CHANGE STATUS
function changeWithdrawStatus(index, status){

let w = withdrawRequests[index];

if(!w){
alert("Request not found ❌");
return;
}

if(w.completed){
alert("Already completed 🔒");
return;
}

w.status = status;

// SAVE FIRST (IMPORTANT FIX)
localStorage.setItem("withdrawRequests", JSON.stringify(withdrawRequests));

if(status === "Completed"){

let user = users.find(x => x.name === w.user);

if(!user){
alert("User not found ❌");
return;
}

// DOUBLE SAFETY
if(!w.completed){

w.completed = true;

user.coins -= Number(w.amount);
save();

addHistory(
user.name,
"Withdraw completed: " + w.amount
);

// 🔥 DISCORD WEBHOOK (FIXED + SAFE)
fetch("https://discord.com/api/webhooks/1503774858146742533/cR1OERc6wVRpu0Wy708kRphgmdcssuS_9QDuUHrSTSaK3wJhGDHMBjNl0DdX4eOGc2ey", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
content:
"💸 WITHDRAW COMPLETED\n\n" +
w.amount + " coins have been successfully deposited in " +
w.user + " game account by " +
currentUser.name +
" (admin/owner) <@&1503714193214406827> ✅"
})
})
.then(res => console.log("Webhook sent"))
.catch(err => console.error("Webhook failed:", err));

}

}

alert("Status Updated ✅");
openWithdrawRequests();
}
// MAKE ADMIN
function makeAdmin(){

// ONLY OWNER
if(currentUser.role !== "owner"){

alert(
"Access Denied ❌ Only owner"
);

return;

}

let target =
prompt("Username?");

let user = users.find(
x => x.name === target
);

if(!user){

alert("User not found ❌");
return;

}

user.role = "admin";

save();

alert(
target +
" is now ADMIN 👑"
);

}
 // ADD COINS
function addCoins(){

// ONLY OWNER
if(currentUser.role !== "owner"){

alert(
"Access Denied ❌ Only owner"
);

return;

}

let target =
prompt("Username?");

let amount =
parseInt(
prompt("Coins?")
);

let user = users.find(
x => x.name === target
);

if(!user){

alert("User not found ❌");
return;

}

user.coins += amount;

save();

addHistory(

user.name,

"You received " +
amount +
" coins by owner"

);

alert(
amount +
" coins added to " +
user.name +
" ✅"
);

}


// AUTO LOGIN
window.onload = function(){

let saved =
localStorage.getItem("currentUser");

if(saved){

let user = users.find(
x=>x.name===saved
);

if(user){

currentUser = user;

showDashboard();

}

}

}
function logout(){

currentUser = null;

// remove saved login
localStorage.removeItem("currentUser");

// hide all pages
hideAllPages();

// show login page
document.getElementById("loginPage")
.classList.remove("hidden");

alert("Logged out successfully 🚪");
                         }
