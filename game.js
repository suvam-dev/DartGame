console.log("game loaded")
var can = document.querySelector("#gameCanvas")
can.width = window.innerWidth;
can.height = window.innerHeight;
var ctx = can.getContext("2d")
const image = document.querySelector(".dartboard")
const size = Math.min(can.width, can.height)
ctx.drawImage(image, can.width / 2 - size / 2, can.height / 2 - size / 2, size, size);

