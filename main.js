var money = 100
var obreros = []
var timeOfProducing = 10000
var quantOfTrees = () => randomRange(5,15)

class Obrero {
  constructor(lvl=0, obreroElem){
    this.lvl = lvl
    this.x = randomRange(0,800-100)
    this.y = randomRange(280-200,500-200)
    this.obreroElem = obreroElem
    if(lvl < 60){
      this.obreroElem.getElementsByClassName("obrero-image")[0].style.filter = 
        `brightness(${this.lvl*0.002+1}) contrast(${this.lvl*0.01+1}) hue-rotate(${this.lvl*30-30}deg)`
    } else {
      this.obreroElem.getElementsByClassName("obrero-image")[0].style.filter =
        `brightness(${this.lvl*0.002+1}) contrast(${this.lvl*0.01+1}) hue-rotate(${this.lvl*30-30}deg) drop-shadow(0px 0px ${this.lvl*0.5-30}px yellow)`
    }
    this.way = "left"
    if(Math.random()>0.5){
      this.changeWay()
    }
    this.tiltDir = "left"
  }
  changeWay(){
    if(this.way == "left"){
      this.way = "right"
      let img = this.obreroElem.getElementsByClassName("obrero-image")[0]
      img.style.transform = "scaleX(-1)"
    } else {
      this.way = "left"
      let img = this.obreroElem.getElementsByClassName("obrero-image")[0]
      img.style.transform = "scaleX(1)"
    }
  }
}

function randomRange(min,max){
  let randNumber = (Math.random() * (max-min))+ min
  return randNumber
}

function animatePago(pago){
  if(pago.style.opacity > 0){
    pago.style.top = (parseInt(pago.style.top)-1) + "px"
    pago.style.opacity -= 0.01
    setTimeout(()=>{animatePago(pago)}, 10)
  } else {
    pago.style.display = "none"
    document.getElementById("game-container").removeChild(pago)
  }
  
}

function renderPago(obrero, monto){
  let pago = document.createElement("div")
  let pagoMonto = document.createElement("p")
  let pagoImg = document.createElement("img")
  pagoMonto.className = "money-display"
  pagoMonto.textContent = monto
  pagoImg.className = "money-icon"
  pagoImg.src = "img/coin.png"
  pago.className = "pago"
  pago.style.top = obrero.y + "px"
  pago.style.left = obrero.x + "px"
  pago.style.zIndex = Math.floor(obrero.y)
  pago.style.opacity = 1
  pago.appendChild(pagoMonto)
  pago.appendChild(pagoImg)
  document.getElementById("game-container").appendChild(pago)
  animatePago(pago)
}

function produce(obrero){
  if(obreros.indexOf(obrero) != -1){
    let monto = parseInt(obrero.lvl)*3
    money += monto
    refreshMoney()
    renderPago(obrero,monto)
    setTimeout(() => {produce(obrero)}, timeOfProducing)
  }
}

function createTree(){
  let tree = document.createElement("div")
  let img = document.createElement("img")
  tree.className = "tree"
  let treeRandom = Math.random()
  if(treeRandom > 0.5){
    img.src = "img/tree.png"
  } else {
    img.src = "img/pink-tree.png"
  }
  img.className = "tree-image"
  tree.appendChild(img)
  return tree
}

const inputs = document.getElementsByClassName("obrero-input")
Array.prototype.forEach.call(inputs ,input => {
  input.addEventListener('change', () => { refreshAdd() });
});
Array.prototype.forEach.call(inputs ,input => {
  input.addEventListener('keyup', () => { refreshAdd() });
}); 

function generateTrees(){
  for(let i = 0; i < quantOfTrees(); i++){
    let tree = createTree()
    let treeY = randomRange(280-200,500-200)
    tree.style.zIndex = Math.floor(treeY)
    if(tree.getElementsByClassName("tree-image")[0].src.indexOf("pink-tree.png") >= 0){
      tree.style.top = (15 + treeY)+"px"
    } else {
      tree.style.top = treeY + "px"
    }
    tree.style.left = randomRange(0,800-100) + "px"
    tree.style.transform = `scale(${((treeY-40)/220)})`
    document.getElementById("game-container").appendChild(tree)
  }
}
generateTrees()

const createObrero = (function(){
  var errorTimer = null
  return function(){
    let lvl = parseInt(document.getElementById("lvl-input").value)
    let quant = parseInt(document.getElementById("quant-input").value)
    if(Number.isNaN(quant) || quant < 1){
      quant=1;
    }
    if(Number.isNaN(lvl) || lvl < 1){
      lvl=1;
    }
    if((money - lvl*15*quant) < 0){
      let moneyWrapper = document.getElementById("money-wrap")
      if (errorTimer != null) {
        window.clearTimeout(errorTimer); 
        errorTimer = null;
        moneyWrapper.style.backgroundColor = "red"
        errorTimer = setTimeout(() => {moneyWrapper.style.backgroundColor = "rgba(70, 68, 0, 0.664)"}, 1000)
      }
      else {
        moneyWrapper.style.backgroundColor = "red"
        errorTimer = window.setTimeout(() => {moneyWrapper.style.backgroundColor = "rgba(70, 68, 0, 0.664)"}, 1000);
      }
      return
    }
    money -= lvl*15*quant
    refreshMoney()
    for(let i = 0; i < quant; i++){
      let obreroElem = document.createElement("div")
      let img = document.createElement("img")
      obreroElem.className = "obrero"
      img.src = "img/woodcutter.png"
      img.className = "obrero-image"
      obreroElem.appendChild(img)
      document.getElementById("game-container").appendChild(obreroElem)
      let obrero = new Obrero(lvl,obreroElem)
      obreroElem.style.zIndex = Math.floor(obrero.y)
      obreroElem.style.top = obrero.y + "px"
      obreroElem.style.left = obrero.x + "px"
      obreroElem.style.transform = `scale(${((obrero.y-40)/220)})`
      obreros.push(obrero)
      setTimeout(()=>{produce(obrero)}, timeOfProducing)
    }
  }
})()

function wipeMoney(){
  money = 0;
  refreshMoney()
}

function wipeWorkers(){
  obreros.forEach(obrero => {
    obrero.obreroElem.style.display = "none"
    document.getElementById("game-container").removeChild(obrero.obreroElem)
    obrero = null;
  });
  obreros = []
}

function regenerateTrees(){
  const trees = document.querySelectorAll(".tree")
  trees.forEach(function(tree){
    document.getElementById("game-container").removeChild(tree)
  })
  generateTrees()
}

function refreshAdd(){
  let lvl = parseInt(document.getElementById("lvl-input").value)
  lvl < 1 ? document.getElementById("lvl-input").value = 1 : null
  let quant = parseInt(document.getElementById("quant-input").value)
  quant < 1 ? document.getElementById("quant-input").value = 1 : null
  if(!Number.isNaN(lvl) && !Number.isNaN(quant) && lvl > 0 && quant > 0){
    document.getElementById("obrero-btn").textContent = `Add ($${lvl*15*quant})`
  }
}
refreshAdd()

function refreshMoney(){
  document.getElementsByClassName("money-display")[0].textContent = "$" + money
}
refreshMoney()

function refreshObreros(){
  obreros.forEach(obrero => {
    obrero.obreroElem.style.transform += obrero.tilt == 1 ? (obrero.tiltDir == "left" ? "rotate(5deg)" : "rotate(-5deg)") : null;
    obrero.obreroElem.style.left = obrero.x + "px"
  });
}

function frame(){
  obreros.forEach(obrero => {
    if(obrero.x >= 800-100 || obrero.x <= 0){
      obrero.changeWay()
    }
    obrero.way == "left" ? obrero.x-- : obrero.x++
    obrero.x % 30 < 1 ? obrero.tilt = 1 : obrero.tilt = 0
    obrero.tilt == 1 ? (obrero.tiltDir == "left" ? obrero.tiltDir = "right" : obrero.tiltDir = "left") : null
  });
  refreshObreros()
  setTimeout(frame, 1)
}
frame()
