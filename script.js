let members = JSON.parse(localStorage.getItem("members")) || [

{name:"Lucas_Arora",rank:10,level:40,password:"lucas9389",money:0,war:0},

{name:"Arushkumar_Kumar",rank:8,level:36,password:"arush6327",money:0,war:0},

{name:"Don_Abhishek",rank:8,level:19,password:"abhishek7419",money:120,war:0},

{name:"Sheikh_Himanshu",rank:8,level:7,password:"himanshu8642",money:0,war:0},

{name:"Pradyum_Ivanov",rank:8,level:24,password:"pradyum5931",money:0,war:0}

]

function saveData(){
localStorage.setItem("members",JSON.stringify(members))
}

function formatMoney(m){

if(m>=1000000){
return Math.floor(m/1000000)+"m"
}

if(m>=1000){
return Math.floor(m/1000)+"k"
}

return m

}

function login(){

let name=document.getElementById("name").value
let rank=parseInt(document.getElementById("rank").value)
let pass=document.getElementById("password").value

let user=members.find(m=>m.name===name && m.rank===rank && m.password===pass)

if(!user){

alert("Wrong Login")
return

}

localStorage.setItem("user",JSON.stringify(user))

openDashboard()

}

function openDashboard(){

let user=JSON.parse(localStorage.getItem("user"))

document.getElementById("loginPage").style.display="none"
document.getElementById("dashboard").style.display="block"

document.getElementById("welcome").innerHTML="Welcome "+user.name

if(user.rank<10){
document.getElementById("adminBtn").style.display="none"
}

if(user.rank>=7){
document.getElementById("staffBtn").style.display="block"
}

}

function openPage(page){

document.getElementById("dashboard").style.display="none"
document.getElementById("page").style.display="block"

let content=document.getElementById("content")
let user=JSON.parse(localStorage.getItem("user"))

/* MEMBERS */

if(page==="members"){

document.getElementById("title").innerHTML="Members"

let html="<table><tr><th>S. No.</th><th>Name</th><th>Rank</th><th>Lvl</th></tr>"

members.forEach((m,i)=>{

let name=m.name

if(user.rank>=7){
name=`<span class="rainbowName" onclick="showProfile(${i})">${m.name}</span>`
}else{
name=`<span class="rainbowName">${m.name}</span>`
}

html+=`<tr>
<td>${i+1}</td>
<td>${name}</td>
<td>${m.rank}</td>
<td>${m.level}</td>
</tr>`

})

html+="</table>"

content.innerHTML=html

}

/* PROFILE */

if(page==="profile"){
}

/* PLAYERS INFO */

if(page==="players"){

document.getElementById("title").innerHTML="Players Info"

let html="<table><tr><th>Name</th><th>Contribution</th><th>War</th><th>Action</th></tr>"

members.forEach((m,i)=>{

let action=""

if(user.rank==10){

action=` 
<button class="warAdd" onclick="addWar(${i})">+1</button>
<button class="warRemove" onclick="removeWar(${i})">-1</button>
`

}

html+=`<tr>
<td class="rainbowName">${m.name}</td>
<td>${formatMoney(m.money)}</td>
<td>${m.war}</td>
<td>${action}</td>
</tr>`

})

html+="</table>"

content.innerHTML=html

}

/* FAMILY RULES */
if(page==="deposit"){

document.getElementById("title").innerHTML="Family Rules"

content.innerHTML=`

<div class="rulesBox">

<p class="ruleColor">

╔════════════════════════════════╗<br>
👻 GHOST MASTER FAMILY RULES 👻<br>
╚════════════════════════════════╝<br><br>

1️⃣ 🤝 Respect First<br>
• Har member ek dusre se respect se baat karega.<br>
• No personal attacks or insulting language.<br><br>

2️⃣ 🚫 Zero Toxicity Policy<br>
• Abuse, toxicity, ya unnecessary arguments strictly prohibited hain.<br><br>

3️⃣ ⚔️ War Discipline<br>
• War ke time sirf Leader / Admin ke orders follow honge.<br>
• Self-decision ya solo action allowed nahi hoga.<br><br>

4️⃣ 🕒 Activity Requirement<br>
• Regular active rehna zaruri hai.<br>
• Long inactivity par warning ya removal ho sakta hai.<br><br>

5️⃣ ❌ No Internal Conflicts<br>
• Family ke andar fight ya groupism mana hai.<br>
• Issues ho to directly Admin se contact karein.<br><br>

6️⃣ 📘 Server Rules Compliance<br>
• Server ke official rules follow karna compulsory hai.<br>
• Rule break karne par family responsibility nahi legi.<br><br>

7️⃣ 🚨 No Cheating Policy<br>
• Hack, exploit, glitch ya unfair advantage lene par<br>
direct strict action liya jayega.<br><br>

8️⃣ 📸 War Proof System<br>
• Har war ke start aur end ka screenshot lena mandatory hai.<br><br>

9️⃣ 🏆 Reputation Matters<br>
• Har member family ki image represent karta hai.<br>
• Public behaviour professional hona chahiye.<br><br>

🔟 💰 Reward System<br>
• War win hone par reward system transparent<br>
aur fair process se follow hoga.<br><br>

━━━━━━━━━━━━━━━━━━━━━━━━━━<br>
⚠ Discipline • Unity • Loyalty ⚠<br>
Together We Dominate 👑<br>
━━━━━━━━━━━━━━━━━━━━━━━━━━

</p>

</div>

`

}

/* STAFF RULES */

if(page==="staff"){

document.getElementById("title").innerHTML="Senior Staff Work Rules"

content.innerHTML=`

<div class="rulesBox">

<p class="ruleColor">

1. Add members<br>
2. Give warning with rules<br>
3. Don't sell ranks<br>
4. Always trust

</p>

</div>

`

}

/* ADMIN PANEL */

if(page==="admin"){

document.getElementById("title").innerHTML="Admin Panel"

content.innerHTML=`

<h3>Add Member</h3>

<input id="newName" placeholder="Name">
<input id="newRank" placeholder="Rank">
<input id="newLevel" placeholder="Level">
<input id="newPass" placeholder="Password">

<button onclick="addMember()">Add Member</button>

<h3>Update Contribution</h3>

<input id="memberIndex" placeholder="Member Number">
<input id="depositAmount" placeholder="Deposit">

<button onclick="addDeposit()">Add Deposit</button>

`

}

}

function showProfile(i){

let m=members[i]

document.getElementById("title").innerHTML="Member Profile"

document.getElementById("content").innerHTML=`

<div class="rulesBox">

<h3 class="rainbowName">${m.name}</h3>

<p class="ruleColor">

Rank : ${m.rank}<br>
Level : ${m.level}<br>
Contribution : ${formatMoney(m.money)}<br>
War Count : ${m.war}

</p>

</div>

`

}

function addWar(i){

members[i].war++
saveData()
openPage("players")

}

function removeWar(i){

if(members[i].war>0){
members[i].war--
}

saveData()
openPage("players")

}

function addMember(){

let name=document.getElementById("newName").value
let rank=parseInt(document.getElementById("newRank").value)
let level=parseInt(document.getElementById("newLevel").value)
let pass=document.getElementById("newPass").value

members.push({name,rank,level,password:pass,money:0,war:0})

saveData()

alert("Member Added")

}

function addDeposit(){

let i=parseInt(document.getElementById("memberIndex").value)-1
let amount=parseInt(document.getElementById("depositAmount").value)

members[i].money+=amount

saveData()

alert("Deposit Added")

}

function back(){

document.getElementById("page").style.display="none"
document.getElementById("dashboard").style.display="block"

}

function logout(){

localStorage.clear()

location.reload()

}

if(localStorage.getItem("user")){
openDashboard()
}
