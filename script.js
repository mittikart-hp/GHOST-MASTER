// ================= DATA & INITIALIZATION =================
let users = JSON.parse(localStorage.getItem("users")) || [
    {name:"Lucas_Arora", password:"lucas9389", rank:15},
    {name:"Aarushkumar_Kumar", password:"arush8888", rank:14},
    {name:"Mannu_Mehra", password:"mannu7777", rank:6}
];

let members = JSON.parse(localStorage.getItem("members")) || [
    {name:"Lucas_Arora", rank:"Owner", level:4, money:0, war:0, verified:true},
    {name:"Aarushkumar_Kumar", rank:"Assistant Owner", level:36, money:0, war:0, verified:true},
    {name:"Mannu_Mehra", rank:"Deputy Leader", level:22, money:0, war:0, verified:true}
];

const rankMap = {
    "Unverified":1, "Verified":2, "Subscribe":3, "Sr Member":4, "Manager":5,
    "Deputy Leader":6, "Leader":7, "Admin Level 1":9, "Admin Level 2":10,
    "Admin Level 3":11, "Curator":12, "Sr Curator":13, "Assistant Owner":14, "Owner":15
};

function getRankNumber(n){ return rankMap[n] || 1; }

window.onload = function(){
    if(!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify(users));
    if(!localStorage.getItem("members")) localStorage.setItem("members", JSON.stringify(members));

    let user = localStorage.getItem("currentUser");
    let rank = parseInt(localStorage.getItem("currentRank"));

    if(user){
        document.querySelector(".login-container").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("userInfo").innerText = `${user} (Rank ${rank})`;
        
        if(document.getElementById("leaderBtn")) 
            document.getElementById("leaderBtn").style.display = (rank >= 6) ? "block" : "none";
        if(document.getElementById("adminBtn")) 
            document.getElementById("adminBtn").style.display = (rank >= 9) ? "block" : "none";
        
        showReports("all");
    }
    loadTasks();
    loadWarnings();
};

// ================= AUTHENTICATION =================
function login(){
    let n = document.getElementById("name").value.trim();
    let r = parseInt(document.getElementById("rank").value);
    let p = document.getElementById("password").value;

    let user = users.find(u => u.name === n);

    // ❌ NAME WRONG
    if(!user){
        document.getElementById("msg").innerText = "❌ Name not found!";
        return;
    }

    // ❌ RANK WRONG
    if(user.rank !== r){
        document.getElementById("msg").innerText = "❌ Wrong Rank!";
        return;
    }

    // ❌ PASSWORD WRONG
    if(user.password !== p){
        document.getElementById("msg").innerText = "❌ Wrong Password!";
        return;
    }

    // ✅ SUCCESS LOGIN
    localStorage.setItem("currentUser", n);
    localStorage.setItem("currentRank", r);
    location.reload();
}
function logout(){
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentRank");
    location.reload();
}
function togglePass(){
    let p = document.getElementById("password");
    let open = document.getElementById("eyeOpen");
    let close = document.getElementById("eyeClose");
    p.type = (p.type === "password") ? "text" : "password";
    open.style.display = (p.type === "password") ? "block" : "none";
    close.style.display = (p.type === "password") ? "none" : "block";
}

// ================= NAVIGATION =================
function openPage(id){
    let rank = parseInt(localStorage.getItem("currentRank"));
    if(id === "leaderPage" && rank < 6) return alert("No Permission");
    
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById("dashboard").style.display = "none";
    document.getElementById(id).style.display = "block";

    if(id === "memberPage") loadMembers();
    if(id === "dbPage") loadLogs();
}

function goBack(){
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById("dashboard").style.display = "block";
}

// ================= MEMBER & WAR SYSTEM =================
function loadMembers(){
    let box = document.getElementById("memberTable");
    box.innerHTML = "";
    let rank = parseInt(localStorage.getItem("currentRank"));

    members.forEach((m, i) => {
        let btns = (rank >= 10) ? `<button onclick="updateWar(${i},'add')">+ War</button>` : "-";
        if(rank >= 11) btns += ` <button onclick="updateWar(${i},'remove')">- War</button>`;
        if(rank === 15) btns += ` <button onclick="deleteMember(${i})">Delete</button>`;

        box.innerHTML += `<tr>
            <td>${m.name}</td>

            <!-- ✅ VERIFIED COLOR -->
            <td class="${m.verified ? 'yes' : 'no'}">
                ${m.verified ? "YES" : "NO"}
            </td>

            <!-- ✅ RANK COLOR -->
            <td class="rank rank-${getRankNumber(m.rank)}">
                ${m.rank}
            </td>

            <td>${m.money}</td>
            <td>${m.war}</td>
            <td>-</td>
            <td>${btns}</td>
        </tr>`;
    });
}
function updateWar(i, action){

 let user = localStorage.getItem("currentUser");

 if(action === 'add'){
   members[i].war++;
   addLog(`${user} added war to ${members[i].name}`);
 }

 else if(members[i].war > 0){
   members[i].war--;
   addLog(`${user} removed war from ${members[i].name}`);
 }

 localStorage.setItem("members", JSON.stringify(members));
 loadMembers();
}
// ================= TASK SYSTEM =================
function loadTasks(){
    let box = document.getElementById("taskTable");
    if(!box) return;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let rank = parseInt(localStorage.getItem("currentRank"));
    box.innerHTML = "";

    tasks.forEach((t, i) => {
        let canEdit = (rank === 15 || (!t.locked && rank >= 6));
        box.innerHTML += `<tr>
            <td>${t.name}</td>
            <td>${t.task}</td>
            <td>${t.approvedBy}</td>
            <td>${t.due}</td>
            <td>${canEdit ? `<select onchange="updateStatus(${i},this.value)">
                <option ${t.status==='⏳ Not started'?'selected':''}>⏳ Not started</option>
                <option ${t.status==='✅ Completed'?'selected':''}>✅ Completed</option>
            </select>` : t.status}</td>
            <td>${rank === 15 ? `<button onclick="deleteTask(${i})">❌</button>` : "-"}</td>
        </tr>`;
    });
}

function updateStatus(i, status){
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[i].status = status;
    tasks[i].approvedBy = localStorage.getItem("currentUser");
    if(status === '✅ Completed') tasks[i].locked = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// ================= WARNING SYSTEM =================

// GET WARNINGS
function getWarnings(){
  return JSON.parse(localStorage.getItem("warnings")) || [];
}

// SAVE WARNINGS
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
}// ================= REPORT SYSTEM =================
let reports = JSON.parse(localStorage.getItem("reports")) || [];

function openCreate(){
    document.getElementById("createBox").style.display="block";
}

function submitReport(){
    let name = document.getElementById("playerName").value.trim();
    let reason = document.getElementById("reason").value.trim();
    let img = document.getElementById("imgLink").value.trim();

    if(!name || !reason){
        alert("Please fill name and reason!");
        return;
    }

    // Check if player exists in users list
    let valid = users.some(u => u.name.toLowerCase() === name.toLowerCase());
    if(!valid){
        alert("This player does not exist in our database!");
        return;
    }

    reports.push({
        against: name,
        by: localStorage.getItem("currentUser"),
        reason: reason,
        img: img || "No link provided",
        reply: ""
    });

    localStorage.setItem("reports", JSON.stringify(reports));

    // Reset fields
    document.getElementById("playerName").value = "";
    document.getElementById("reason").value = "";
    document.getElementById("imgLink").value = "";
    document.getElementById("createBox").style.display="none";

    showReports("all");
    alert("Report submitted successfully!");
}

function showReports(type){
    let box = document.getElementById("reportList");
    if(!box) return; 
    box.innerHTML = "";

    let currentUser = localStorage.getItem("currentUser");
    let currentRank = parseInt(localStorage.getItem("currentRank"));

    reports.forEach((r, i) => {
        if(
            type === "all" ||
            (type === "against" && r.against === currentUser) ||
            (type === "by" && r.by === currentUser)
        ) {
            box.innerHTML += `
            <div class="report-card" style="border:1px solid #ccc; margin:10px; padding:10px; border-radius:8px;">
                <p><b>Against:</b> ${r.against}</p>
                <p><b>By:</b> ${r.by}</p>
                <p><b>Reason:</b> ${r.reason}</p>
                ${r.img && r.img.startsWith('http') ? `<a href="${r.img}" target="_blank">View Proof</a>` : "<p><i>No Image</i></p>"}
                
                ${r.reply ? `<div class="reply" style="background:#f0f0f0; padding:5px; margin-top:5px;"><b>Reply:</b> ${r.reply}</div>` : ""}

                <div style="margin-top:10px;">
                    ${currentRank >= 11 && (!r.reply || currentRank === 15) ? `<button onclick="replyReport(${i})">Reply</button>` : ""}
                    ${currentRank >= 14 ? `<button onclick="deleteReport(${i})" style="color:red;">Delete</button>` : ""}
                </div>
            </div>`;
        }
    });
}

function replyReport(i){
    let text = prompt("Enter your reply:");
    if(!text) return;
    reports[i].reply = text;
    localStorage.setItem("reports", JSON.stringify(reports));
    showReports("all");
}
// ================= TASK SYSTEM =================
function getTasks(){
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(){
    let name = prompt("Confirm your name:");
    let taskText = prompt("What is the task?");
    let due = prompt("Due date (Optional):");

    if(!name || !taskText) return;

    let currentUser = localStorage.getItem("currentUser");
    let currentRank = parseInt(localStorage.getItem("currentRank"));

    if(name.toLowerCase() !== currentUser.toLowerCase()){
        alert("You can only add tasks for yourself!");
        return;
    }

    let tasks = getTasks();
    tasks.push({
        name: currentUser,
        task: taskText,
        due: due || "No deadline",
        status: "⏳ Not started",
        approvedBy: "-",
        creatorRank: currentRank,
        locked: false
    });

    saveTasks(tasks);
    loadTasks();
}

function canChangeStatus(task){
    let currentRank = parseInt(localStorage.getItem("currentRank"));
    if(currentRank === 15) return true; // Owner can do anything
    if(task.locked && currentRank < 14) return false; // Only Assistant Owners+ can edit locked tasks

    let cr = task.creatorRank;
    if(cr <= 5) return currentRank >= 6; // Leaders can approve members
    if(cr <= 10) return currentRank >= 12; // Curators can approve leaders
    if(cr <= 13) return currentRank >= 14; // Owners can approve admins
    return false;
}

function loadTasks(){
    let box = document.getElementById("taskTable");
    if(!box) return;
    box.innerHTML = "";

    let tasks = getTasks();
    let currentRank = parseInt(localStorage.getItem("currentRank"));

    tasks.forEach((t, i) => {
        let disabled = !canChangeStatus(t);
        let statusOptions = ["⏳ Not started", "✏️ In progress", "⛔ Blocked", "👀 Under review", "✅ Completed"];

        box.innerHTML += `
        <tr>
            <td>${t.name}</td>
            <td>${t.task}</td>
            <td>${t.approvedBy}</td>
            <td>${t.due}</td>
            <td>
                ${disabled ? `<span>${t.status}</span>` : `
                <select onchange="updateStatus(${i}, this.value)">
                    ${statusOptions.map(opt => `<option value="${opt}" ${t.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>`}
            </td>
            <td>
                ${currentRank === 15 ? `<button onclick="deleteTask(${i})">❌</button>` : "-"}
            </td>
        </tr>`;
    });
}

function updateStatus(i, newStatus){
    let tasks = getTasks();
    let task = tasks[i];
    
    if(!canChangeStatus(task)){
        alert("You don't have permission to change this task!");
        loadTasks(); // Reset view
        return;
    }

    task.status = newStatus;
    task.approvedBy = localStorage.getItem("currentUser");
    if(newStatus === "✅ Completed") task.locked = true; // Auto-lock on completion

    saveTasks(tasks);
    loadTasks();
}
// OPEN ADMIN PANEL
function openAdminPanel(){
    let rank = parseInt(localStorage.getItem("currentRank"));
    if(rank < 9) {
        alert("Access Denied: Admins Only");
        return;
    }
    
    openPage("adminPage");

    // Sections visibility based on rank
    document.getElementById("viewSection").style.display = "block";
    document.getElementById("moneySection").style.display = (rank >= 10) ? "block" : "none";
    document.getElementById("addSection").style.display = (rank >= 11) ? "block" : "none";

    loadAdminMembers();
}

// LOAD MEMBER LIST IN ADMIN PANEL
function loadAdminMembers(){
    let box = document.getElementById("adminMemberList");
    if(!box) return;
    box.innerHTML = "";

    members.forEach((m, i) => {
        box.innerHTML += `<p style="border-bottom:1px solid #eee; padding:5px;">
            <b>${i}.</b> ${m.name} | <span style="color:blue;">${m.rank}</span> | Money: ${m.money}
        </p>`;
    });
}

// ADD/UPDATE MONEY (Rank 10+)
function addMoney(){
    let rank = parseInt(localStorage.getItem("currentRank"));
    let i = parseInt(document.getElementById("memberIndex").value);
    let amount = document.getElementById("depositAmount").value;

    if(rank < 10) return alert("Rank 10+ required to update money");
    if(!members[i]) return alert("Invalid Member Number");

    members[i].money = amount;
    localStorage.setItem("members", JSON.stringify(members));
    loadAdminMembers();
    alert("Money Updated Successfully!");
}

// ADD NEW MEMBER (Rank 11+)
function addMember(){
    let rank = parseInt(localStorage.getItem("currentRank"));
    if(rank < 11) return alert("Rank 11+ required to add members");

    let name = document.getElementById("newName").value.trim();
    let rankName = document.getElementById("newRank").value.trim();
    let password = document.getElementById("newPassword").value.trim();

    if(!name || !rankName || !password) return alert("Fill all fields!");

    // Check if user already exists
    if(users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        return alert("User already exists!");
    }

    let rankNum = getRankNumber(rankName);

    // Push to members and users
    members.push({ name, verified: false, rank: rankName, money: 0, war: 0 });
    users.push({ name, password, rank: rankNum });

    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("users", JSON.stringify(users));

    loadAdminMembers();
    alert("New Member Added!");
}
// OPEN LEADER SECTION
function openLeaderSection(id){
    let rank = parseInt(localStorage.getItem("currentRank"));
    if(rank < 6) return alert("No Permission");

    document.getElementById("rankSection").style.display = "none";
    document.getElementById("verifySection").style.display = "none";
    document.getElementById(id).style.display = "block";

    if(id === "rankSection") loadRankTable();
    if(id === "verifySection") loadVerifyTable();
}

// LOAD RANK UPDATE TABLE
function loadRankTable(){
    let box = document.getElementById("rankTable");
    let currentRank = parseInt(localStorage.getItem("currentRank"));
    box.innerHTML = "";

    members.forEach((m, i) => {
        let targetRankNum = getRankNumber(m.rank);
        
        // Safety: Cannot change rank of someone equal or higher than you
        let canEdit = (currentRank === 15) || (currentRank > targetRankNum);

        box.innerHTML += `<tr>
            <td>${m.name}</td>
            <td class="rank rank-${targetRankNum}">${m.rank}</td>
            <td>
                ${canEdit ? `
                <select onchange="changeRank(${i}, this.value)">
                    <option value="">Change Rank</option>
                    ${Object.keys(rankMap).map(r => `<option value="${r}">${r}</option>`).join('')}
                </select>` : "---"}
            </td>
        </tr>`;
    });
}

// CHANGE RANK LOGIC
function changeRank(i, newVal){
    if(!newVal) return;
    let currentRank = parseInt(localStorage.getItem("currentRank"));
    let targetUser = members[i];

    if(currentRank <= getRankNumber(targetUser.rank) && currentRank !== 15){
        alert("You cannot change the rank of your seniors or equals!");
        loadRankTable();
        return;
    }

    members[i].rank = newVal;
    
    // Update rank in users array too
    let uIndex = users.findIndex(u => u.name === targetUser.name);
    if(uIndex !== -1) users[uIndex].rank = getRankNumber(newVal);

    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("users", JSON.stringify(users));
    
    loadRankTable();
    alert("Rank Updated!");
}

// VERIFICATION LOGIC
function loadVerifyTable(){
    let box = document.getElementById("verifyTable");
    box.innerHTML = "";

    members.forEach((m, i) => {
        box.innerHTML += `<tr>
            <td>${m.name}</td>
            <td style="color: ${m.verified ? 'green' : 'red'}">${m.verified ? "YES" : "NO"}</td>
            <td>
                <select onchange="changeVerify(${i}, this.value)">
                    <option value="">Select</option>
                    <option value="true">Verify (YES)</option>
                    <option value="false">Unverify (NO)</option>
                </select>
            </td>
        </tr>`;
    });
}

function changeVerify(i, val){
    if(!val) return;
    members[i].verified = (val === "true");
    localStorage.setItem("members", JSON.stringify(members));
    loadVerifyTable();
    alert("Verification Status Updated!");
}
// ================= DELETE TASK (Add this) =================
function deleteTask(i){
    let currentRank = parseInt(localStorage.getItem("currentRank"));
    if(currentRank !== 15){
        alert("Only Owner can delete tasks!");
        return;
    }

    if(confirm("Are you sure you want to delete this task?")){
        let tasks = getTasks();
        tasks.splice(i, 1);
        saveTasks(tasks);
        loadTasks();
    }
}
let dbBtn = document.getElementById("dbBtn");
if(dbBtn){
  let currentRank = parseInt(localStorage.getItem("currentRank")) || 0;

  dbBtn.style.display = (currentRank === 15) ? "block" : "none";
}
if(dbBtn){
  dbBtn.style.display = (rank === 15) ? "block" : "none";
}
function addLog(text){
  let logs = JSON.parse(localStorage.getItem("dbLogs")) || [];

  logs.push({
    text: text,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("dbLogs", JSON.stringify(logs));
}
function loadLogs(){

  let box = document.getElementById("dbLogs");
  if(!box) return;

  let logs = JSON.parse(localStorage.getItem("dbLogs")) || [];

  box.innerHTML = "";

  logs.slice().reverse().forEach(l=>{
    box.innerHTML += `
      <div style="padding:8px; border-bottom:1px solid #555;">
        🕒 ${l.time}<br>
        ⚡ ${l.text}
      </div>
    `;
  });

}
// DATABASE BUTTON CONTROL
window.addEventListener("load", function(){

  let dbBtn = document.getElementById("dbBtn");
  let rank = parseInt(localStorage.getItem("currentRank")) || 0;

  if(dbBtn){
    dbBtn.style.display = (rank === 15) ? "block" : "none";
  }

});
// AUTO CLICK TRACKING
document.addEventListener("click", function(e){

  let user = localStorage.getItem("currentUser");
  let rank = localStorage.getItem("currentRank");

  if(!user) return;

  let el = e.target;

  if(el.tagName === "BUTTON"){

    let text = el.innerText || "Unknown";

    saveLog(`${user} (Rank ${rank}) clicked: ${text}`);
  }

});
function saveLog(text){

  let logs = JSON.parse(localStorage.getItem("dbLogs")) || [];

  logs.push({
    text: text,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("dbLogs", JSON.stringify(logs));
}
function loadLogs(){

  let box = document.getElementById("dbLogs");
  if(!box) return;

  let logs = JSON.parse(localStorage.getItem("dbLogs")) || [];

  box.innerHTML = "";

  logs.slice().reverse().forEach(l=>{
    box.innerHTML += `
      <div class="log-card">
        🕒 ${l.time}<br>
        ⚡ ${l.text}
      </div>
    `;
  });

}
