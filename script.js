import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqe3zW0-kcnDtrGJad4_lg7FPgfdMfcrg",
  authDomain: "ghost-master-official.firebaseapp.com",
  projectId: "ghost-master-official",
  storageBucket: "ghost-master-official.firebasestorage.app",
  messagingSenderId: "70040749384",
  appId: "1:70040749384:web:a4efb7a355790f01d0df7d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// ================= USERS =================
let users = JSON.parse(localStorage.getItem("users")) || [
{name:"Lucas_Arora", password:"lucas9389", rank:15},
{name:"Aarushkumar_Kumar", password:"arush8888", rank:14},
{name:"Vivek_Singh", password:"vivek0000", rank:13},
{name:"Mannu_Mehra", password:"mannu7777", rank:15}
];

// baaki pura code yahi rahega...
// ================= RANK MAP =================
const rankMap = {
"Unverified":1,
"Verified":2,
"Subscribe":3,
"Sr Member":4,
"Manager":5,
"Deputy Leader":6,
"Leader":7,
"Admin Level 1":9,
"Admin Level 2":10,
"Admin Level 3":11,
"Curator":12,
"Sr Curator":13,
"Assistant Owner":14,
"Owner":15
};

function getRankNumber(rankName){
 return rankMap[rankName] || 1;
}

// ================= AUTO LOGIN =================
window.onload = function(){

 let user = localStorage.getItem("currentUser");
 let rank = parseInt(localStorage.getItem("currentRank"));

 if(user){
  document.querySelector(".login-container").style.display="none";
  document.getElementById("dashboard").style.display="block";
  document.getElementById("userInfo").innerText =
  user + " (Rank " + rank + ")";

  if(rank >= 6) document.getElementById("leaderBtn").style.display="block";

  if(rank >= 9){
    document.getElementById("adminBtn").style.display="block";
  }else{
    document.getElementById("adminBtn").style.display="none";
  }

  showReports("all");
 }

 loadTasks();
};
// ================= LOGIN =================
function login(){
 let n = document.getElementById("name").value.trim();
 let r = document.getElementById("rank").value;
 let p = document.getElementById("password").value;
 let msg = document.getElementById("msg");

 let user = users.find(u => u.name === n);

 if(!user){ msg.innerText = "Name Wrong"; return; }
 if(user.rank !== parseInt(r)){ msg.innerText = "Rank Wrong"; return; }
 if(user.password !== p){ msg.innerText = "Password Wrong"; return; }

 localStorage.setItem("currentUser", n);
 localStorage.setItem("currentRank", user.rank);

 location.reload();
}

// ================= LOGOUT =================
function logout(){
 localStorage.removeItem("currentUser");
 localStorage.removeItem("currentRank");
 location.reload();
}

// ================= PAGE SWITCH =================
function openPage(id){
 document.querySelectorAll(".page").forEach(p=>p.style.display="none");
 document.getElementById("dashboard").style.display="none";
 document.getElementById(id).style.display="block";

 if(id==="memberPage") loadMembers();
 if(id==="taskPage") loadTasks();
if(id==="warningPage") loadWarnings();
}

// ================= BACK =================
function goBack(){
 document.querySelectorAll(".page").forEach(p=>p.style.display="none");
 document.getElementById("dashboard").style.display="block";
}

// ================= REPORT SYSTEM =================
let reports = JSON.parse(localStorage.getItem("reports")) || [];

function openCreate(){
 document.getElementById("createBox").style.display="block";
}

function submitReport(){
 let name = document.getElementById("playerName").value.trim();
 let reason = document.getElementById("reason").value.trim();
 let img = document.getElementById("imgLink").value;

 if(!name || !reason){
  alert("Fill all fields");
  return;
 }

 let valid = users.some(u => u.name.toLowerCase() === name.toLowerCase());

 if(!valid){
  alert("Wrong Name");
  return;
 }

 reports.push({
  against: name,
  by: localStorage.getItem("currentUser"),
  reason: reason,
  img: img,
  reply: ""
 });

 localStorage.setItem("reports", JSON.stringify(reports));

 document.getElementById("playerName").value = "";
 document.getElementById("reason").value = "";
 document.getElementById("imgLink").value = "";

 document.getElementById("createBox").style.display="none";

 showReports("all");
}

function showReports(type){
 let box = document.getElementById("reportList");
 box.innerHTML = "";

 let currentUser = localStorage.getItem("currentUser");
 let currentRank = parseInt(localStorage.getItem("currentRank"));

 reports.forEach((r,i)=>{
  if(
   type==="all" ||
   (type==="against" && r.against===currentUser) ||
   (type==="by" && r.by===currentUser)
  ){
   box.innerHTML += `
   <div class="report-card">
   <p><b>Against:</b> ${r.against}</p>
   <p><b>By:</b> ${r.by}</p>
   <p><b>Reason:</b> ${r.reason}</p>

   ${currentRank>=10 ? `<a href="${r.img}" target="_blank">Image</a>`:""}

   ${
      currentRank>=11 && (!r.reply || currentRank===15)
      ? `<button onclick="reply(${i})">Reply</button>`
      : ""
   }

   ${currentRank>=14 ? `<button onclick="deleteReport(${i})">Delete</button>`:""}

   ${r.reply ? `<div class="reply">${r.reply}</div>`:""}
   </div>`;
  }
 });
}
function reply(i){
 let text = prompt("Reply:");
 if(!text) return;

 reports[i].reply = text;
 localStorage.setItem("reports", JSON.stringify(reports));
 showReports("all");
}

function deleteReport(i){
 if(confirm("Delete?")){
  reports.splice(i,1);
  localStorage.setItem("reports", JSON.stringify(reports));
  showReports("all");
 }
}

// ================= MEMBERS =================
async function loadMembers(){
  let box = document.getElementById("memberTable");
  box.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "members"));

  let currentRank = parseInt(localStorage.getItem("currentRank")) || 1;

  let i = 0;

  querySnapshot.forEach((doc) => {
    let m = doc.data();

    let actionButtons = "";

    if(currentRank <= 9){
      actionButtons = `-`;
    }
    else if(currentRank <= 10){
      actionButtons = `
        <button class="war-btn add" onclick="updateWar(${i},'add')">+ Add</button>
        <button disabled>- Remove</button>
      `;
    }
    else if(currentRank < 15){
      actionButtons = `
        <button class="war-btn add" onclick="updateWar(${i},'add')">+ Add</button>
        <button class="war-btn remove" onclick="updateWar(${i},'remove')">- Remove</button>
      `;
    }
    else{
      actionButtons = `
        <button class="war-btn add" onclick="updateWar(${i},'add')">+ Add</button>
        <button class="war-btn remove" onclick="updateWar(${i},'remove')">- Remove</button>
        <button class="delete-btn" onclick="deleteMember(${i})">Delete</button>
      `;
    }

    box.innerHTML += `
    <tr>
      <td>${m.name}</td>
      <td>${m.verified ? "YES":"NO"}</td>
      <td>${m.rank}</td>
      <td>${m.money}</td>
      <td>${m.war}</td>
      <td>${m.phone || "-"}</td>
      <td>${actionButtons}</td>
    </tr>`;

    i++;
  });
}

function updateWar(i,action){
 let rank = parseInt(localStorage.getItem("currentRank"));

 if(rank <= 9){
  alert("No Permission");
  return;
 }

 if(rank <= 10 && action === "remove"){
  alert("Remove Not Allowed");
  return;
 }

 if(action==="add") members[i].war++;
 if(action==="remove" && members[i].war>0) members[i].war--;

 localStorage.setItem("members", JSON.stringify(members));
 loadMembers();
}

function deleteMember(i){
 let rank = parseInt(localStorage.getItem("currentRank"));

 if(rank !== 15){
  alert("Only Owner Can Delete");
  return;
 }

 if(confirm("Are you sure to delete this member?")){
  members.splice(i,1);
  localStorage.setItem("members", JSON.stringify(members));
  loadMembers();
 }
}
// ================= TASK SYSTEM =================

function getTasks(){
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ================= ADD TASK =================
function addTask(){
  let name = prompt("Enter Name:");
  let taskText = prompt("Enter Task:");
  let due = prompt("Enter Due Date:");

  if(!name || !taskText){
    alert("Fill all fields");
    return;
  }

  let currentUser = localStorage.getItem("currentUser");
  let currentRank = parseInt(localStorage.getItem("currentRank"));

  if(name.toLowerCase() !== currentUser.toLowerCase()){
    alert("Wrong name");
    return;
  }

  let tasks = getTasks();

  tasks.push({
    name,
    task: taskText,
    due: due || "-",
    status:"⏳ Not started",
    approvedBy:"-",
    creatorRank: currentRank,
    locked:false
  });

  saveTasks(tasks);
  loadTasks();
}

// ================= PERMISSION SYSTEM =================
function canChangeStatus(task){
  let currentRank = parseInt(localStorage.getItem("currentRank"));

  // Owner full control
  if(currentRank === 15) return true;

  // Locked → no change
  if(task.locked) return false;

  let cr = task.creatorRank;

  // 1–5 → only 6 & 7
  if(cr >=1 && cr <=5){
    return currentRank === 6 || currentRank === 7;
  }

  // 6–10 → only 12 & 13
  if(cr >=6 && cr <=10){
    return currentRank === 12 || currentRank === 13;
  }

  // 11–13 → only 14+
  if(cr >=11 && cr <=13){
    return currentRank >=14;
  }

  return false;
}

// ================= STATUS CLASS =================
function getStatusClass(status){
  if(status==="✏️ In progress") return "status-progress";
  if(status==="⛔ Blocked") return "status-blocked";
  if(status==="👀 Under review") return "status-review";
  if(status==="✅ Completed") return "status-done";
  return "status-not";
}

// ================= LOAD TASKS =================
function loadTasks(){
  let box = document.getElementById("taskTable");
  if(!box) return;

  box.innerHTML = "";

  let tasks = getTasks();
  let currentRank = parseInt(localStorage.getItem("currentRank"));

  tasks.forEach((t,i)=>{

    let disabled = !canChangeStatus(t) ? "disabled" : "";
    let statusClass = getStatusClass(t.status);

    box.innerHTML += `
    <tr>
      <td>${t.name}</td>
      <td>${t.task}</td>
      <td>${t.approvedBy}</td>
      <td>${t.due}</td>

      <td>
        ${
          disabled
          ? `<span class="${statusClass}">${t.status}</span>`
          : `
          <select class="${statusClass}" onchange="updateStatus(${i},this.value)">
            <option ${t.status==="⏳ Not started"?"selected":""}>⏳ Not started</option>
            <option ${t.status==="✏️ In progress"?"selected":""}>✏️ In progress</option>
            <option ${t.status==="⛔ Blocked"?"selected":""}>⛔ Blocked</option>
            <option ${t.status==="👀 Under review"?"selected":""}>👀 Under review</option>
            <option ${t.status==="✅ Completed"?"selected":""}>✅ Completed</option>
          </select>`
        }
      </td>

      <td>
        ${
          currentRank === 15
          ? `<button class="delete-btn" onclick="deleteTask(${i})">❌</button>`
          : "-"
        }
      </td>
    </tr>`;
  });
}

// ================= UPDATE STATUS =================
function updateStatus(i,newStatus){
  let tasks = getTasks();
  let currentUser = localStorage.getItem("currentUser");

  let task = tasks[i];

  if(!canChangeStatus(task)){
    alert("No Permission");
    return;
  }

  // First approval lock
  if(!task.locked){
    task.locked = true;
  }

  task.status = newStatus;
  task.approvedBy = currentUser;

  saveTasks(tasks);
  loadTasks();
}

// ================= DELETE TASK =================
function deleteTask(i){
  let rank = parseInt(localStorage.getItem("currentRank"));

  if(rank !== 15){
    alert("Only Owner");
    return;
  }

  if(!confirm("Are you sure to delete this task?")) return;

  let tasks = getTasks();
  tasks.splice(i,1);

  saveTasks(tasks);
  loadTasks();
}
//========== Leader Page ========
function openLeaderSection(id){
    document.getElementById("rankSection").style.display="none";
    document.getElementById("verifySection").style.display="none";

    document.getElementById(id).style.display="block";

    if(id==="rankSection") loadRankTable();
    if(id==="verifySection") loadVerifyTable();
}

// ===== LOAD RANK TABLE =====
function loadRankTable(){
    let box = document.getElementById("rankTable");
    box.innerHTML = "";

    members.forEach((m,i)=>{
        box.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td class="rank rank-${getRankNumber(m.rank)}">${m.rank}</td>
            <td>
                <select onchange="changeRank(${i},this.value)">
                    ${
                    [14,15].includes(parseInt(localStorage.getItem("currentRank")))
                    ?
                    `
                    <option value="">Select Rank</option>
                    <option value="Unverified">Unverified</option>
                    <option value="Verified">Verified</option>
                    <option value="Subscribe">Subscribe</option>
                    <option value="Sr Member">Sr Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Deputy Leader">Deputy Leader</option>
                    <option value="Leader">Leader</option>
                    <option value="Admin Level 1">Admin Level 1</option>
                    <option value="Admin Level 2">Admin Level 2</option>
                    <option value="Admin Level 3">Admin Level 3</option>
                    <option value="Curator">Curator</option>
                    <option value="Sr Curator">Sr Curator</option>
                    <option value="Assistant Owner">Assistant Owner</option>
                    <option value="Owner">Owner</option>
                    `
                    :
                    `
                    <option value="">Select Rank</option>
                    <option value="Verified">Verified</option>
                    <option value="Subscribe">Subscribe</option>
                    <option value="Sr Member">Sr Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Deputy Leader">Deputy Leader</option>
                    `
                    }
                </select>
            </td>
        </tr>`;
    });
}

// ===== CHANGE RANK =====
function changeRank(i,val){
    if(val==="") return;

    let currentRank = parseInt(localStorage.getItem("currentRank"));
    let targetRank = getRankNumber(members[i].rank);

    if(!(currentRank==6 || currentRank==7 || currentRank==14 || currentRank==15)){
        alert("No Permission");
        return;
    }
if((currentRank==6 || currentRank==7) && targetRank >= currentRank){
    alert("You cannot edit same or higher rank user");
    return;
}

    members[i].rank = val;

    let userIndex = users.findIndex(u => u.name === members[i].name);
    if(userIndex !== -1){
        users[userIndex].rank = getRankNumber(val);
    }

    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("users", JSON.stringify(users));

    loadRankTable();
    loadMembers();

    alert("Rank Updated Successfully");
}

// ===== LOAD VERIFY TABLE =====
function loadVerifyTable(){
    let box = document.getElementById("verifyTable");
    box.innerHTML = "";

    members.forEach((m,i)=>{
        box.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td class="${m.verified ? 'verified-yes':'verified-no'}">
                ${m.verified ? "YES":"NO"}
            </td>
            <td>
                <select onchange="changeVerify(${i},this.value)">
                    <option value="">Select</option>
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                </select>
            </td>
        </tr>`;
    });
}

// ===== CHANGE VERIFY =====
function changeVerify(i,val){
    if(val==="") return;

    let currentRank = parseInt(localStorage.getItem("currentRank"));
    let targetRank = getRankNumber(members[i].rank);

    if((currentRank==6 || currentRank==7) && targetRank >= currentRank){
    alert("You cannot verify same or higher rank user");
    return;
}

    if((currentRank==6 || currentRank==7) && targetRank>6){
        alert("You can verify only rank 1 to 6");
        return;
    }

    members[i].verified = (val==="true");

    localStorage.setItem("members", JSON.stringify(members));

    loadVerifyTable();
    loadMembers();

    alert("Verification Updated Successfully");
}

function getMemberRank(name){
    let m = members.find(x => x.name === name);
    return m ? m.rank : "Unverified";
}
// ======ADMIN PANNEL SAVE USERS====
function saveUsers(){
 localStorage.setItem("users", JSON.stringify(users));
}


// OPEN ADMIN PANEL
function openAdminPanel(){
 openPage("adminPage");

 let rank = parseInt(localStorage.getItem("currentRank"));

 document.getElementById("viewSection").style.display="block";
 document.getElementById("moneySection").style.display="none";
 document.getElementById("addSection").style.display="none";

 if(rank >= 10){
   document.getElementById("moneySection").style.display="block";
 }

 if(rank >= 11){
   document.getElementById("addSection").style.display="block";
 }

 loadAdminMembers();
}

// LOAD MEMBER LIST
function loadAdminMembers(){
 let box=document.getElementById("adminMemberList");
 box.innerHTML="";

 members.forEach((m,i)=>{
   box.innerHTML += `
   <p>${i}. ${m.name} | ${m.rank} | ${m.money}</p>
   `;
 });
}

// ADD MONEY
function addMoney(){
 let rank=parseInt(localStorage.getItem("currentRank"));

 if(rank < 10){
   alert("No Permission");
   return;
 }

 let i=parseInt(document.getElementById("memberIndex").value);
 let amount=document.getElementById("depositAmount").value;

 if(!members[i]){
   alert("Invalid Member");
   return;
 }

 members[i].money=amount;

 localStorage.setItem("members", JSON.stringify(members));
 loadAdminMembers();
 alert("Money Added");
}

// ADD MEMBER
async function addMember(){
 let rank=parseInt(localStorage.getItem("currentRank"));

 if(rank < 11){
   alert("No Permission");
   return;
 }

 let name=document.getElementById("newName").value.trim();
 let rankName=document.getElementById("newRank").value.trim();
 let password=document.getElementById("newPassword").value.trim();

 if(!name || !rankName || !password){
   alert("Fill all");
   return;
 }

 let rankNum = getRankNumber(rankName);

 await addDoc(collection(db, "members"), {
  name: name,
  verified: false,
  rank: rankName,
  money: "0",
  war: 0,
  phone: "---"
});

 users.push({
   name:name,
   password:password,
   rank:rankNum
 });

 localStorage.setItem("members", JSON.stringify(members));
 localStorage.setItem("users", JSON.stringify(users));

 loadAdminMembers();

 alert("Member Added Successfully");
}

// ================= WARNING SYSTEM =================

function getWarnings(){
  return JSON.parse(localStorage.getItem("warnings")) || [];
}

function saveWarnings(data){
  localStorage.setItem("warnings", JSON.stringify(data));
}

// ADD WARNING
function addWarning(){
  let name = prompt("Enter Member Name:");
  let reason = prompt("Enter Reason:");

  if(!name || !reason){
    alert("Fill all fields");
    return;
  }

  let currentUser = localStorage.getItem("currentUser");
  let currentRank = parseInt(localStorage.getItem("currentRank"));

  if(currentRank < 6){
    alert("No Permission");
    return;
  }

  let warnings = getWarnings();

  warnings.push({
    name,
    reason,
    by: currentUser,
    date: new Date().toLocaleDateString()
  });

  saveWarnings(warnings);
  loadWarnings();
}

// LOAD WARNINGS
function loadWarnings(){
  let box = document.getElementById("warningTable");
  if(!box) return;

  box.innerHTML = "";

  let warnings = getWarnings();
  let currentRank = parseInt(localStorage.getItem("currentRank"));

  warnings.forEach((w,i)=>{

    box.innerHTML += `
    <tr>
      <td>${w.name}</td>
      <td>${w.reason}</td>
      <td>${w.by}</td>
      <td>${w.date}</td>
      <td>
  ${
    currentRank >= 14
    ? `<button onclick="deleteWarning(${i})">Delete</button>`
    : "-"
  }
</td>
    </tr>`;
  });
}

// DELETE WARNING
function deleteWarning(i){
  let rank = parseInt(localStorage.getItem("currentRank"));

  if(rank < 14){
    alert("Only High Rank Can Delete");
    return;
  }

  if(!confirm("Delete warning?")) return;

  let warnings = getWarnings();
  warnings.splice(i,1);

  saveWarnings(warnings);
  loadWarnings();
}
