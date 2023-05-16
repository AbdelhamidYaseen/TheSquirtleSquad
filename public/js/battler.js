var enemyHasAttacked = true;
var inBattle = true;

//formule
//HP – (defence – attack)

//enemy details
var enemyHealth = document.getElementById("health");
const enemy ={
    name: "Shuckle",
    attackName: "Warp",
    attackDmg: 15,
    defense: 250,
    hp: 40 //should be 20, voor demo hoger
};
enemyHP = enemy.hp;
//own details
var ownHealth = document.getElementById("own-health");
const ownPokemon ={
    name: "Aron",
    attackName: "Tackle",
    attackDmg: 40,
    defense: 100,
    hp: 100 //should be 50, voor demo hoger
};
ownHP = ownPokemon.hp;

//own pokemon attacks
function attack() {
    if(enemyHasAttacked){
        var damage;
        if(ownPokemon.attackDmg >= enemy.defense){
            damage = ownPokemon.attackDmg * 2 - enemy.defense;
            enemyHP -= damage
        }else{
            damage = ownPokemon.attackDmg * (ownPokemon.attackDmg/enemy.defense);
            enemyHP -= damage
        }
        //add to battle log
        if(inBattle){
            var node = document.createElement("p");
            var textnode = document.createTextNode(`${ownPokemon.name} used ${ownPokemon.attackName} for ${damage} damage`);
            node.appendChild(textnode);
            document.getElementById("battle-log-content").appendChild(node);
            node.style.color = "green"; 
        }
        if(enemyHP<=0){
            enemyHealth.style.width = 0;
            console.log("you won!");
            
            if(inBattle){
                var node = document.createElement("p");
                var textnode = document.createTextNode(`${ownPokemon.name} did ${Math.round((enemy.hp-enemyHP)*100)/100} damage on ${enemy.name} and received ${Math.round((ownPokemon.hp-ownHP)*100)/100} damage.`);
                node.appendChild(textnode);
                document.getElementById("battle-log-content").appendChild(node);
                node.style.fontStyle = "italic";
                node.style.fontSize = "13px"
            }
            document.getElementById("battle-result-text").innerHTML = "You won!";
            battleEnd();
            inBattle=false;
        }else{
            enemyHasAttacked=false;
            enemyHealth.style.width = (enemyHP/enemy.hp)*100 + '%';
            document.getElementById("hit").style.cursor = "default";
            setTimeout(enemyAttack, 500);
        }
    }
}

//enemy attacks
function enemyAttack() {
    var damage;
    if(enemy.attackDmg >= ownPokemon.defense){
        damage = enemy.attackDmg * 2 - ownPokemon.defense;
        ownHP -= damage;
    }else{
        damage = enemy.attackDmg * (enemy.attackDmg/ownPokemon.defense);
        ownHP -= damage;
    }
    ownHP -= enemy.attackDmg/ownPokemon.defense;
    //add to battle log
    var node = document.createElement("p");
    var textnode = document.createTextNode(`${enemy.name} used ${enemy.attackName} for ${damage} damage`);
    node.appendChild(textnode);
    document.getElementById("battle-log-content").appendChild(node);
    node.style.color = "red";
    if(ownHP<=0){
        ownHealth.style.width = 0;
        console.log("GAME OVER!");

        var node = document.createElement("p");
        var textnode = document.createTextNode(`${enemy.name} did ${Math.round((ownPokemon.hp-ownHP)*100)/100} damage on ${ownPokemon.name} and received ${Math.round((enemy.hp-enemyHP)*100)/100} damage.`);
        node.appendChild(textnode);
        document.getElementById("battle-log-content").appendChild(node);
        node.style.fontStyle = "italic";
        node.style.fontSize = "13px"

        document.getElementById("battle-result-text").innerHTML = "GAME OVER!";
        battleEnd();
    }else{
        ownHealth.style.width = (ownHP/ownPokemon.hp)*100 + '%';
        enemyHasAttacked=true;
        document.getElementById("hit").style.cursor = "pointer";
    }
}

function battleEnd() {
    document.getElementById("battle-result").style.display = "block";
  }
  
  function off() {
    document.getElementById("battle-result").style.display = "none";
  }
  document.getElementById("hit").onclick = attack();

