document.getElementById("hit").onclick = function() {attack()};
var battleStarted=0;

var enemyHealth = document.getElementById("health");
healthWidth = 100;
function attack() {
    battleStarted++;
    if(battleStarted==1){
        enemyAttack();
    }
    console.log(healthWidth);
    healthWidth-=10;
    if(healthWidth<=0){
        enemyHealth.style.width = 0;
        console.log("you won!");
        document.getElementById("battle-result-text").innerHTML = "You won!";
        battleEnd();
    }else{
        enemyHealth.style.width = healthWidth + '%';
    }
}

var ownHealth = document.getElementById("own-health");
ownHealthWidth = 100;
function enemyAttack() {
    var attackInterval = window.setInterval(enemyDmg, 1000);
    function enemyDmg() {
        ownHealthWidth-=10;
        if(healthWidth<=0){
            window.clearInterval(attackInterval);
        }
        if(ownHealthWidth<=0){
            ownHealth.style.width = 0;
            console.log("GAME OVER!");
            window.clearInterval(attackInterval);
            document.getElementById("battle-result-text").innerHTML = "GAME OVER!";
            battleEnd();
        }else{
            ownHealth.style.width = ownHealthWidth + '%';
        }
    }
}

function battleEnd() {
    document.getElementById("battle-result").style.display = "block";
  }
  
  function off() {
    document.getElementById("battle-result").style.display = "none";
  }
