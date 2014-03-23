$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.scaley').click(function(){
    $(this).toggleClass('success');
    $('.gymax').parents('.columns').toggleClass('invisible');
  });

  $('.scalex').click(function(){
    $(this).toggleClass('success');
    $('.gxmax').parents('.columns').toggleClass('invisible');
  });

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var v0 = nanDefault(parseFloat($('.volt').val()),1);
  var res = nanDefault(parseFloat($('.res').val()),50);
  var ind = nanDefault(parseFloat($('.ind').val()),50)/1000;
  var cap = nanDefault(parseFloat($('.cap').val()),50)/1000000;
  var gymax = nanDefault(parseFloat($('.gymax').val()),0.05);
  var fmax = nanDefault(parseFloat($('.gxmax').val()),10000);
  var max_amp = (v0*1.0/res);
  var res_freq = (1/Math.sqrt(ind*cap));

  // Only scale if they've turned on autoscale
  var scaley = !$('.scaley').hasClass('success');
  var scalex = !$('.scalex').hasClass('success');
  var base = [];

  fmax = scalex ? fmax : res_freq*5;

  for(var i = 0; i < fmax*10; i += 1){
    base.push([i/10,(v0)/(Math.sqrt(Math.pow(res,2)+Math.pow((i/10)*ind-1/((i/10)*cap),2)))]);
  }

  var options = {
    xaxes: [{
      axisLabel: 'ω (rad/s)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'Amplitude of current (A)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      min: 0
    }],
    grid: {labelMargin: 10}
      };

  if(scaley){
    options.yaxes[0].max = gymax;
  }

  var max_res = [[res_freq,0],[res_freq,max_amp]];

  var plot = $.plot('.plot',[
      {data: max_res, color: 'red', shadowSize: 0, dashes: {show: true}},
      {data: base},
      ], options);
  $('.note').text('Maximum amplitude of current is '+max_amp.toFixed(3)+' A at ω = '+res_freq.toFixed(2)+' rad/s.');
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}
