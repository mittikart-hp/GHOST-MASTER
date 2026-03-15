let members = JSON.parse(localStorage.getItem("members")) || [
{name:"Lucas_Arora",rank:10,level:40,password:"lucas9389",money:0,war:0},
{name:"Arushkumar_Kumar",rank:8,level:36,password:"arush6327",money:0,war:0},
{name:"Don_Abhishek",rank:8,level:19,password:"abhishek7419",money:120,war:0},
{name:"Sheikh_Himanshu",rank:8,level:7,password:"himanshu8642",money:0,war:0},
{name:"Pradyum_Ivanov",rank:8,level:24,password:"pradyum5931",money:0,war:0}
];

function saveData(){ localStorage.setItem("members",JSON.stringify(members)); }

function formatMoney(m){
    if(m>=1000000) return Math.floor(m/1000000)+"m";
    if(m>=1000) return Math.floor(m/1000)+"k";
    return m;
}

function login(){
    let name=document.getElementById("name").value;
    let rank=parseInt(document.getElementById("rank").value);
    let pass=document.getElementById("password").value;
    let user=members.find(m=>m.name===name && m.rank===rank && m.password===pass);
    if(!user){ alert("Wrong Login"); return; }
    localStorage.setItem("user",JSON.stringify(user));
    openDashboard();
}

function openDashboard(){
    let user=JSON.parse(localStorage.getItem("user"));
    document.getElementById("loginPage").style.display="none";
    document.getElementById("dashboard").style.display="block";
    document.getElementById("welcome").innerHTML="Welcome "+user.name;
    if(user.rank<10){ document.getElementById("adminBtn").style.display="none"; }
}

function openPage(page){
    document.getElementById("dashboard").style.display="none";
    document.getElementById("page").style.display="block";
    let content=document.getElementById("content");
    let user=JSON.parse(localStorage.getItem("user"));

    if(page==="members"){
        document.getElementById("title").innerHTML="Members";
        let html="<table><tr><th>S. No.</th><th>Name</th><th>Rank</th><th>Lvl</th></tr>";
        members.forEach((m,i)=>{
            let name = `<span class="rainbowName" onclick="openProfile(${i})" style="cursor:pointer">${m.name}</span>`;
            html+=`<tr><td>${i+1}</td><td>${name}</td><td>${m.rank}</td><td>${m.level}</td></tr>`;
        });
        html+="</table>";
        content.innerHTML=html;
    }

    if(page==="players"){
        document.getElementById("title").innerHTML="Players Info";
        let html="<table><tr><th>Name</th><th>Contribution</th><th>War</th><th>Action</th></tr>";
        members.forEach((m,i)=>{
            let action="";
            if(user.rank==10){
                action=`<button class="warAdd" onclick="addWar(${i})">+1</button>
                        <button class="warRemove" onclick="removeWar(${i})">-1</button>`;
            }
            html+=`<tr><td class="rainbowName">${m.name}</td><td>${formatMoney(m.money)}</td><td>${m.war}</td><td>${action}</td></tr>`;
        });
        html+="</table>";
        content.innerHTML=html;
    }

    if(page==="warRules"){
        document.getElementById("title").innerHTML="Family War Rules";
document.getElementById("content").className="warBg";
        content.innerHTML=`<div class="rulesBox">
        <p class="ruleColor">
        ╔════════════════════════════════════╗<br>
        ⚔️ GHOST MASTER FAMILY ⚔️<br>
        WAR RULES (UPDATED)<br>
        ╚════════════════════════════════════╝<br><br>
        1️⃣ 👥 Minimum Attendance<br>• Kam se kam 8 members<br>
        2️⃣ 🕒 Official Timing Only<br>• Scheduled time<br>
        3️⃣ 👑 Command Authority<br>• Leader ke orders<br>
        4️⃣ 🔫 War Preparation<br>• Gun, 100 Ammo, 2 Medkits<br>
        5️⃣ 📸 Proof Policy<br>• Screenshot mandatory<br>
        6️⃣ ⚡ Daily War Effort<br>• 2 tries/day<br>
        7️⃣ 🎖 Promotion Criteria<br>• Rank 7–9 promotion<br>
        8️⃣ 🚫 No Internal Arguments<br>• Argument prohibited<br>
        9️⃣ 🏆 Reward System<br>• Deputy only<br>
        🔟 ⏰ Pre-War Assembly<br>• 10 min before<br>
        1️⃣1️⃣ 🕴 Activity Monitoring<br>• Inactive warning<br>
        1️⃣2️⃣ 🚨 Zero Tolerance Policy<br>• Cheating strict action<br>
        </p></div>`;
    }

    if(page==="deputyRules"){
        document.getElementById("title").innerHTML="Deputy Rules";
        content.innerHTML=`<div class="rulesBox">
        <p class="ruleColor">
        🛡️ GHOST MASTER FAMILY – DEPUTY RULES<br><br>
        1. Leader ki absence me handle karega.<br>
        2. War me Leader ko support mandatory.<br>
        3. Members attendance check.<br>
        4. War location time se pohchana.<br>
        5. New members ko rules samjhana.<br>
        6. Issue report Leader tak.<br>
        7. Power misuse -> rank remove.
        </p></div>`;
    }

    if(page==="staffRules"){
        document.getElementById("title").innerHTML="Senior Staff Rules";
        content.innerHTML=`<div class="rulesBox">
        <p class="ruleColor">
        1. Add members<br>
        2. Give warning<br>
        3. Don't sell ranks<br>
        4. Always trust
        </p></div>`;
    }

    if(page==="warning"){
        document.getElementById("title").innerHTML="Warnings";
        content.innerHTML=`<div class="rulesBox"><p class="ruleColor">Name | Warning<br>Abhi kisi ke pass nahi hai warning</p></div>`;
    }

    if(page==="admin"){
        document.getElementById("title").innerHTML="Admin Panel";
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
        <button onclick="addDeposit()">Add Deposit</button>`;
    }
}

function back(){
    document.getElementById("page").style.display="none";
    document.getElementById("dashboard").style.display="block";
}

function logout(){
    localStorage.clear();
    location.reload();
}

function addMember(){
    let name=document.getElementById("newName").value;
    let rank=parseInt(document.getElementById("newRank").value);
    let level=parseInt(document.getElementById("newLevel").value);
    let pass=document.getElementById("newPass").value;
    members.push({name,rank,level,password:pass,money:0,war:0});
    saveData();
    alert("Member Added");
}

function addDeposit(){
    let i=parseInt(document.getElementById("memberIndex").value);
    let amount=parseInt(document.getElementById("depositAmount").value);
    members[i].money+=amount;
    saveData();
    alert("Deposit Added");
}

function addWar(i){ members[i].war++; saveData(); openPage("players"); }
function removeWar(i){ if(members[i].war>0) members[i].war--; saveData(); openPage("players"); }
function openProfile(i){

let m = members[i];

document.getElementById("dashboard").style.display="none";
document.getElementById("page").style.display="block";

document.getElementById("title").innerHTML = m.name + " Profile";

document.getElementById("content").innerHTML = `
<div class="rulesBox">

<h3 class="rainbowName">${m.name}</h3>

<p>Rank : ${m.rank}</p>
<p>Level : ${m.level}</p>
<p>Contribution : ${formatMoney(m.money)}</p>
<p>War Score : ${m.war}</p>

</div>
`;

}

if(localStorage.getItem("user")) openDashboard();
