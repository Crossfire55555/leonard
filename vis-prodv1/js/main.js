$(function(){
  var graph1 = $('.plot1');
  graph1.height(graph1.width()/4);
  var graph2 = $('.plot2');
  graph2.height(graph2.width()/4);
  var graph3 = $('.plot3');
  graph3.height(graph3.width()/4);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var amp1 = nanDefault(parseFloat($('.amp1').val()),1);
  var omega = nanDefault(parseFloat($('.omega').val()),50);
  var deg1 = nanDefault(parseFloat($('.deg1').val()),0);

  var amp2 = nanDefault(parseFloat($('.amp2').val()),1);
  var deg2 = nanDefault(parseFloat($('.deg2').val()),0);

  var base1 = [];
  var base2 = [];
  var res = [];
  var tmax = 0.5;

  var coefficient = omega == 1 ? "" : omega;
  var base_label1 = ampString(amp1)+"cos("+coefficient+"t"+degString(deg1);
  var base_label2 = ampString(amp2)+"cos("+coefficient+"t"+degString(deg2);

  var factor = Math.abs(omega/10);
  var grid = {labelMargin: 10};

  grid.borderWidth = {bottom: 2, left: 3, top:2, right: 2},
  grid.borderColor = {left: 'black'};

  for(var i = 0; i < tmax*1000; i += 1/factor){
    base1.push([i,amp1*Math.cos(omega*i/1000+deg1*Math.PI/180)]);
  }

  for(var i = 0; i < tmax*1000; i += 1/factor){
    base2.push([i,amp2*Math.cos(omega*i/1000+deg2*Math.PI/180)]);
  }

  for(var i = 0; i < tmax*1000; i += 1/factor){
    res.push([i,(amp1*Math.cos(omega*i/1000+deg1*Math.PI/180))*(amp2*Math.cos(omega*i/1000+deg2*Math.PI/180))]);
  }

  var baseline = [[0,0],[tmax*1000,0]];
  var plot1 = $.plot('.plot1',[
      {data: baseline, color: 'black', shadowSize: 0},
      {data: base1, color: 'green', label: base_label1},
      ], {
    series: {
      lines: {
        show: true
      },
    },
    xaxes: [{
      axisLabel: 'time, t (ms)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'v(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      labelWidth: 40,
    }],
    grid: grid
      });

  var plot2 = $.plot('.plot2',[
      {data: baseline, color: 'black', shadowSize: 0},
      {data: base2, color: 'blue', label: base_label2},
      ], {
    series: {
      lines: {
        show: true
      },
    },
    xaxes: [{
      axisLabel: 'time, t (ms)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'i(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      labelWidth: 40,
    }],
    grid: grid
      });

  var plot3 = $.plot('.plot3',[
      {data: baseline, color: 'black', shadowSize: 0},
      {data: res, color: 'red', label: base_label1+' * '+base_label2},
      ], {
    series: {
      lines: {
        show: true
      },
    },
    xaxes: [{
      axisLabel: 'time, t (ms)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'p(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      labelWidth: 40,
    }],
    grid: grid
      });
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}

function fixDeg(deg){
  while(deg < 0){
    deg += 360;
  }
  while(deg >= 360){
    deg -= 360;
  }
  return deg;
}

function ampString(amp){
  var amp_str = "";
  if(amp == -1){
    amp_str = "-"
  }else if(amp != 1){
    amp_str = amp;
  }
  return amp_str;
}

function degString(deg){
  var deg_str = ")";
  if(deg > 0){
    deg_str = '+'+deg+'°)';
  }else if(deg < 0){
    deg_str = deg+'°)';
  }
  return deg_str;
}
