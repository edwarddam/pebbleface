// Author: Ed Dam

// Rocky.js

var rocky  = require('rocky');

// Draw Text

function drawText(ctx, text, color, align, font, width, height) {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.font      = font;
  ctx.fillText(text, width, height);
}

// Collect API Message

var api;

rocky.on('hourchange', function(event) {
  rocky.postMessage({'fetch': true});
});

rocky.on('message', function(event) {
  var message = event.data;
  if (message.api) {
    api = message.api;
    rocky.requestDraw();
  }
});

// Redraw Every Minute

rocky.on('minutechange', function(event) {
  rocky.requestDraw();
});

// Draw Watchface

rocky.on('draw', function(event) {
  var ctx    = event.context;
  var width  = ctx.canvas.unobstructedWidth;
  var height = ctx.canvas.unobstructedHeight;
  
  // Clear Canvas
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  
  // Draw Rectangle
  ctx.lineWidth   = 2;
  ctx.strokeStyle = 'white';
  ctx.strokeRect(0, 35, 144, 0);
  ctx.strokeRect(0, 118, 144, 0);
  ctx.strokeRect(0, 143, 144, 0);
  
  // Draw Fixed Text
  drawText(ctx, 'pebble',    'white', 'left',   '24px bold Gothic', 9,          0);
  drawText(ctx, 'edwarddam', 'white', 'right',  '14px bold Gothic', width - 9,  9);
  drawText(ctx, 'water -',   'white', 'left',   '14px bold Gothic', 15,         height - 20);
  drawText(ctx, 'WR',        'white', 'center', '18px bold Gothic', width / 2,  height - 24);
  drawText(ctx, '- resist',  'white', 'right',  '14px bold Gothic', width - 15, height - 20);
  
  // Draw Time
  var dateHour   = new Date().toLocaleTimeString(undefined, {hour:   '2-digit'});
  var dateMinute = new Date().toLocaleTimeString(undefined, {minute: '2-digit'});
  var time       = dateHour + ":" + dateMinute;
  drawText(ctx, time, 'white', 'center', '49px Roboto-subset', width / 2, height / 2 - 28);
  
  // Draw Date
  var dayNames  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dateDay   = dayNames[new Date().getDay()];
  var dateDate  = new Date().toLocaleDateString(undefined, {day:   '2-digit'});
  var dateMonth = new Date().toLocaleDateString(undefined, {month: 'short'});
  var date      = dateDay + " " + dateDate + " " + dateMonth;
  drawText(ctx, date, 'white', 'center', '18px bold Gothic', width / 2,  height / 2 - 45);

  // Draw Weather
  var city        = api.location;
  var temperature = api.temperature;
  drawText(ctx, city + ' ' + temperature + '°C', 'white', 'center', '18px bold Gothic', width / 2, height - 50);
});
