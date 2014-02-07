$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });

  $('.graph-select').on('click','.button',function(){
    $(this).toggleClass('success');
  });
});


function updateGraph(){
  var amp1 = nanDefault(parseFloat($('.amp1').val()),1);
  var omega1 = 50;
  var deg1 = nanDefault(parseFloat($('.deg1').val()),0);

  var amp2 = nanDefault(parseFloat($('.amp2').val()),1);
  var omega2 = 50;
  var deg2 = nanDefault(parseFloat($('.deg2').val()),0);

  var gmax = Math.abs(nanDefault(parseFloat($('.graph-max').val()),1.5));

  var tmax = 0.5;

  var glob = {a1: amp1, a2: amp2, o1: omega1, o2: omega2, d1: deg1, d2: deg2, t: tmax};
  var base1 = [];
  var base2 = [];
  var res = [];

  var baseline = [[0,0],[tmax*1000,0]];
  var graphs_to_display = [];

  graphs_to_display.push({data: baseline, color: 'black', shadowSize: 0});

  $('.success').each(function(){
    graphs_to_display.push(genGraph($(this).text(),glob));
  });

  var grid = {labelMargin: 10};

  grid.borderWidth = {bottom: 2, left: 3, top:2, right: 2},
  grid.borderColor = {left: 'black'};
  
  var plot = $.plot('.plot',graphs_to_display, {
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
      axisLabel: 'f(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      min: -gmax,
      max: gmax 
    }],
    grid: grid,
    legend: {
      container: $('.legend')
    }
      });

  var note_string = 'The sum of two sinusoids with the same frequency is a single sinusoid with the same frequency. In this case, ';
  //Function 1
  note_string += ampString(amp1)+'cos(50t'+degString(deg1);
  note_string += ' + ';
  //Function 2
  note_string += ampString(amp2)+'cos(50t'+degString(deg2)
  note_string += ' = '

  var coef = generateCoef(glob.a1,glob.a2,glob.d1,glob.d2);
  coef = coef == 1 ? "" : coef;
  var angle = generateAngle(glob.a1,glob.a2,glob.d1,glob.d2);
  note_string += ampString(coef.toFixed(2))+"cos(50t"+degString(angle.toFixed(2));")."
  $('.note').text(note_string);
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}

function fixDeg(deg){
  while(deg <= -180){
    deg += 360;
  }
  while(deg > 180){
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

function genGraph(type,glob){
  var data = [];
  var obj = {};
  var label;
  if(type == "Factor 1"){
    for(var i = 0; i < glob.t*1000; i += 1/glob.o1){
      data.push([i,glob.a1*Math.cos(glob.o1*i/1000+glob.d1*Math.PI/180)]);
    }
    var coef = glob.o1 == 1 ? "" : glob.o1;
    obj.label = ampString(glob.a1)+"cos("+coef+"t"+degString(glob.d1);
    obj.color = "#EDC240";
  }

  if(type == "Factor 2"){
    for(var i = 0; i < glob.t*1000; i += 1/glob.o2){
      data.push([i,glob.a2*Math.cos(glob.o2*i/1000+glob.d2*Math.PI/180)]);
    }
    var coef = glob.o2 == 1 ? "" : glob.o2;
    obj.label = ampString(glob.a2)+"cos("+coef+"t"+degString(glob.d2);
    obj.color = "#AFD8F8";
  }

  if(type == "Sum"){
    for(var i = 0; i < glob.t*1000; i += 2/(glob.o1+glob.o2)){
      data.push([i,(glob.a1*Math.cos(50*i/1000+glob.d1*Math.PI/180))+(glob.a2*Math.cos(50*i/1000+glob.d2*Math.PI/180))]);
    }
    var coef = generateCoef(glob.a1,glob.a2,glob.d1,glob.d2);
    coef = coef == 1 ? "" : coef;
    var angle = generateAngle(glob.a1,glob.a2,glob.d1,glob.d2);
    obj.label = ampString(coef.toFixed(2))+"cos(50t"+degString(angle.toFixed(2));")"
    obj.color = "darkred";
  }
  obj.data = data;
  return obj;
}

function generateCoef(a1,a2,p1,p2){
    return Math.sqrt(Math.pow((a1*Math.cos(p1*Math.PI/180)+a2*Math.cos(p2*Math.PI/180)),2)+Math.pow((a1*Math.sin(p1*Math.PI/180)+a2*Math.sin(p2*Math.PI/180)),2));
}

function generateAngle(a1,a2,p1,p2){
  return Math.atan((a1*Math.sin(p1*Math.PI/180)+a2*Math.sin(p2*Math.PI/180))/(a1*Math.cos(p1*Math.PI/180)+a2*Math.cos(p2*Math.PI/180)))*180/Math.PI;
}
