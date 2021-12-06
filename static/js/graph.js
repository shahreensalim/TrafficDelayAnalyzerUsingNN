
var traffic_threshold=0, delay_threshold=0;
var slider1 = d3
   .sliderHorizontal()
   .min(0)
   .max(4)
   .step(0.1)
   .width(250)
   .displayValue(false)
   .on('onchange', (val) => {
     traffic_threshold=val.toFixed(2);
     d3.select('#value-alternative-handle1').text(traffic_threshold);
   });

 d3.select('#slider-alternative-handle1')
   .append('svg')
   .attr('width', 300)
   .attr('height', 100)
   .append('g')
   .attr('transform', 'translate(30,30)')
   .call(slider1);

   var slider2 = d3
      .sliderHorizontal()
      .min(0)
      .max(10)
      .step(5)
      .width(250)
      .displayValue(false)
      .on('onchange', (val) => {
        delay_threshold=val.toFixed(2);
        d3.select('#value-alternative-handle2').text(delay_threshold);
      });

    d3.select('#slider-alternative-handle2')
      .append('svg')
      .attr('width', 300)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)')
      .call(slider2);

var traffic_graph, traffic_mat, delay_mat, delay_graph;
$("#newValue").hide()
$("#editLink").hide()
$("#stopGeneration").hide()
var numNodes=5, topo="star", bw=5;
$("#topo_option").on("change",function(){
    let val =  $(this).val()
    if(val == "scalefree")
        topo = "ScaleFree"
    else if(val == "ring")
        topo = "Ring"
    else
      topo = "Star"
})
$("#nodes_option").on("change",function(){
    let val =  $(this).val()
    if(val == "five")
        numNodes = 5
    else if(val == "ten")
        numNodes = 10
    else
      numNodes = 15
})
$("#bw_option").on("change",function(){
    let val =  $(this).val()
    if(val == "mbps2")
        bw = 10
    else if(val == "mbps3")
        bw = 15
    else
      bw = 5
})

$("#loadTraffic").click(function(){
  $.ajax({
 type : 'POST',
 url : "/load_traffic",
 contentType: 'application/json;charset=UTF-8',
 data : JSON.stringify({'numNodes':numNodes, 'topo':topo, 'bw': bw})
});
  $.ajax({
    dataType: "json",
    url: "/get_all_data",
    success: function(data){
      traffic_graph = data['traffic_data']
      traffic_mat = data['traffic_mat']
      console.log(traffic_graph)
      //console.log(traffic_mat)
      update(traffic_graph.links, traffic_graph.nodes, "#main-graph");
      update_table("#traffic_mat", traffic_mat)
    },
    async : true

  });


});

$("#updateThreshold").click(function(){
  update(traffic_graph.links, traffic_graph.nodes, "#main-graph");
  update_table("#traffic_mat", traffic_mat)

  update(delay_graph.links, delay_graph.nodes, "#main-graph-delay");
  update_table("#delay_mat", delay_mat)

});

var colors = d3.scaleOrdinal(d3.schemeCategory10);




    //console.log(delay_threshold)


   // d3.json("static/json/graph.json", function (error, graph) {
   //     if (error) throw error;
   //
   // })

   function update(links, nodes, space) {
     //console.log(links)
     //console.log(nodes)
         // traffic_threshold = Number(d3.select('#value-alternative-handle1').text())
         // delay_threshold = Number(d3.select('#value-alternative-handle2').text())

         //console.log(traffic_threshold)
         //console.log(delay_threshold)
     var node,  link;


      width = $(space).width(),
      height = $(space).height();
      //console.log(width)
      //console.log(height)

      var margin = {top: 20, right: 20, bottom: 40, left: 80},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;
     d3.select(space).selectAll("*").remove();
     var svg = d3.select(space)
     .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)

       svg.append('defs').append('marker')
           .attrs({'id':'arrowhead',
               'viewBox':'-0 -5 10 10',
               'refX':13,
               'refY':0,
               'orient':'auto',
               'markerWidth':5,
               'markerHeight':5,
               'xoverflow':'visible'})
           .append('svg:path')
           .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
           .attr('fill', '#999')
           .style('stroke','none');

       var simulation = d3.forceSimulation()
           .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(200).strength(1))
           .force("charge", d3.forceManyBody())
           .force("center", d3.forceCenter(width / 2, height / 2));

           var linkids = []
       link = svg.selectAll(".link")
           .data(links)
           .enter()
           .append("path")
           .attr("class", "link")
           .style("stroke", function(d){
             //console.log(space)
             if(space=="#main-graph")
             {
               //console.log(d.value)
               ////console.log(traffic_threshold)
               if(d.value>=traffic_threshold)
               {
                 return "red"
               }
              else return "none";
             }
            else {
              //console.log(d.value)
              if(d.value>=delay_threshold)
              {
                return "red"
              }
             else return "none";
            }
           })
           .style("stroke-opacity", function(d){
             return d.value;
           }
         )
         .attrs({
             'class': 'link',
             'fill-opacity': 0,
             'stroke-opacity': 1,
             'id': function (d, i) {
               if (space == "#main-graph")
               {
                 //console.log(typeof d.source)
                 if(typeof d.source === 'object')
                  linkids[i] = 'link-' + d.source.id+'-'+d.target.id
                 else
                 {
                   linkids[i] = 'link-' + d.source+'-'+d.target
                 }

                return linkids[i]
               }
               else {
                 if(typeof d.source === 'object')
                  linkids[i] = 'dlink-' + d.source.id+'-'+d.target.id
                 else
                 {
                   linkids[i] = 'dlink-' + d.source+'-'+d.target
                 }

                return linkids[i]
               }
             }
         })
           .attr('marker-end',function(d){
             //return 'url(#arrowhead)'
             if(space=="#main-graph")
             {
               //console.log(d.value)
               ////console.log(traffic_threshold)
               if(d.value>=traffic_threshold)
               {
                 return 'url(#arrowhead)'
               }
              else return "none";
             }
            else {
              //console.log(d.value)
              if(d.value>=delay_threshold)
              {
                return 'url(#arrowhead)'
              }
             else return "none";
            }
           })
           .on("click", editlink)
           .on("mouseover", highlightTable)
           .on("mouseout", unhighlightTable)

       link.append("title")
           .text(function (d) {return d.type;});


       // edgepaths = svg.selectAll(".edgepath")
       //     .data(links)
       //     .enter()
       //     .append('path')
       //     .attrs({
       //         'class': 'edgepath',
       //         'fill-opacity': 1,
       //         'stroke-opacity': 1,
       //         'id': function (d, i) {return 'edgepath' + i}
       //     })
       //     .style("pointer-events", "none");

       // var edgelabels = svg.selectAll(".edgelabel")
       //     .data(links)
       //     .enter()
       //     .append('text')
       //     .style("pointer-events", "none")
       //     .attrs({
       //         'class': 'edgelabel',
       //         'id': function (d, i) {return 'edgelabel' + i},
       //         'font-size': 10,
       //         'fill': '#aaa'
       //     });
       //
       // edgelabels.append('textPath')
       //     .attr('xlink:href', function (d, i) {
       //
       //        if (space == "#main-graph")
       //         return '#'+linkids[i]
       //        else {
       //          return '#'+linkids[i]
       //        }
       //       })
       //     .style("text-anchor", "middle")
       //     .style("pointer-events", "none")
       //     .attr("startOffset", "50%")
       //     .text(function (d) {return d.value });

       node = svg.selectAll(".node")
           .data(nodes)
           .enter()
           .append("g")
           .attr("class", "node")
           .call(d3.drag()
                   .on("start", dragstarted)
                   .on("drag", dragged)
                   //.on("end", dragended)
           )
           .on("click", stopGeneration);

       node.append("circle")
           .attr("r", 8)
           .style("fill", function (d, i) {return "blue";})

       node.append("title")
           .text(function (d) {return d.id;});

       node.append("text")
           .attr("dy", -5)
           .attr("dx", +5)
           .text(function (d) {return d.id;});

       simulation
           .nodes(nodes)
           .on("tick", ticked);

       simulation.force("link")
           .links(links);


              function ticked() {
                  // link
                  //     // .attr("x1", function (d) {return d.source.x;})
                  //     // .attr("y1", function (d) {return d.source.y;})
                  //     // .attr("x2", function (d) {return d.target.x;})
                  //     // .attr("y2", function (d) {return d.target.y;});
                  //     return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
                  link.attr("d", function(d) {
                   var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                   return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                   });
                  node
                      .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

                  // edgepaths.attr('d', function (d) {
                  //     return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
                  // });

                  // edgelabels.attr('transform', function (d) {
                  //     if (d.target.x < d.source.x) {
                  //         var bbox = this.getBBox();
                  //
                  //         rx = bbox.x + bbox.width / 2;
                  //         ry = bbox.y + bbox.height / 2;
                  //         return 'rotate(180 ' + rx + ' ' + ry + ')';
                  //     }
                  //     else {
                  //         return 'rotate(0)';
                  //     }
                  // });
              }

              function dragstarted(d) {
                  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
                  d.fx = d.x;
                  d.fy = d.y;
              }

              function dragged(d) {
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
              }
   }

   function update_data(source, target, value)
   {
     //console.log(source)
     //console.log(target)
     //console.log(value)
     for(i=0; i<traffic_graph['links'].length; i++)
     {
       //console.log(traffic_graph['links'][i])
       if(traffic_graph['links'][i]['source']['id']==source && traffic_graph['links'][i]['target']['id']==target)
       {
         //console.log("hey")
         traffic_graph['links'][i]['value'] = value
         break
       }

     }
     //console.log(traffic_mat)
     traffic_mat[source-1][source-1][target-1]=value
     update_table("#traffic_mat", traffic_mat)



     update(traffic_graph.links, traffic_graph.nodes, "#main-graph")

   }
   function editlink(d)
   {
     $("#editLink").show()
     $("#newValue").show()
     var val;


   }

   function stopGeneration(d)
   {
     $("#stopGeneration").show()

     $("#stopGeneration").click(function(){
       source = d.id
       for(i=0; i<traffic_graph['links'].length; i++)
       {
         //console.log(traffic_graph['links'][i])
         if(traffic_graph['links'][i]['source']['id']==source)
         {
           //console.log("hey")
           traffic_graph['links'][i]['value'] = 0

         }

       }

       for(i=0; i<traffic_mat[source-1][source-1].length; i++)
       {
         traffic_mat[source-1][source-1][i]=0
       }

       update_table("#traffic_mat", traffic_mat)



       update(traffic_graph.links, traffic_graph.nodes, "#main-graph")
       $("#stopGeneration").hide()
     });
   }

   function update_table(space, tableData)
   {
       var table = $(space)
       table.empty()


       var tbody = $('<tbody></tbody>');
       row = $('<tr></tr>')
       rowData = $('<td></td>').addClass('bar').text("")
       row.append(rowData);
       var c, r;
       if(space == "#traffic_mat"){
         c = "col1-"
         r = "row1-"
       }

        else {
        c = "col2-"
        r = "row2-"
      }
       for (var i = 0; i <tableData.length; i++)
       {

            rowData = $('<td></td>').addClass('bar').attr('id', c+(i+1)).text(i+1);
            row.append(rowData);
       }
       tbody.append(row);
       for (var i = 0; i <tableData.length; i++) {
         row = $('<tr></tr>')
         //console.log(tableData[i][i])
         rowData = $('<td></td>').addClass('bar').attr('id', r+(i+1)).text(i+1)
         row.append(rowData);
         for(j = 0; j<tableData[i][i].length; j++)
         {
           if(space=="#traffic_mat")
           {
             if(tableData[i][i][j]>=traffic_threshold)
              rowData = $('<td></td>').attr('id', 't-'+(i+1)+'-'+(j+1)).attr('style', 'text-align:center; color:red;').text(tableData[i][i][j]);
              else {
            rowData = $('<td></td>').attr('id', 't-'+(i+1)+'-'+(j+1)).attr('style', 'text-align:center; color:black;').text(tableData[i][i][j]);
          }
           }
          else {
            if(tableData[i][i][j]>=delay_threshold)
             rowData = $('<td></td>').attr('id', 'd-'+(i+1)+'-'+(j+1)).attr('style', 'text-align:center; color:red;').text(tableData[i][i][j]);
         else {
           rowData = $('<td></td>').attr('id', 'd-'+(i+1)+'-'+(j+1)).attr('style', 'text-align:center; color:black;').text(tableData[i][i][j]);
         }
          }


           row.append(rowData);
         }
         tbody.append(row);
       }
       table.append(tbody)
       //console.log("loaded")

   }
   var row, column;
   $("#traffic_mat").on('click','td',function(e) {
    var temp =  $(this).attr('id');
    temp = temp.split("-")
    row = temp[1]
    column = temp[2]
    //console.log(row)
    //console.log(column)
    $("#editLink").show()
    $('#newValue').val('')
    $("#newValue").show()

    var val;


});
$("#traffic_mat").on('mouseover','td',function(e) {
 var temp =  $(this).attr('id');
 temp = temp.split("-")
 r= temp[1]
 c = temp[2]



 var val;
 var cell = "#link-"+r+'-'+c
 d3.select(cell).style("stroke", function(d){
   return "limegreen";
 })
 $(this).css('background-color', '#FFFF00')
 $(this).css('font-weight', 'bold')


});



$("#traffic_mat").on('mouseout','td',function(e) {
 var temp =  $(this).attr('id');
 temp = temp.split("-")
 r = temp[1]
 c = temp[2]


 var val;
 var cell = "#link-"+r+'-'+c
 d3.select(cell).style("stroke", function(d){
   //console.log(d)
   if(d.value>=traffic_threshold)
    return "red"
    else return "none";
 })

 $(this).css('background-color', 'transparent')
 $(this).css('font-weight', 'normal')


});

$("#delay_mat").on('mouseover','td',function(e) {
 var temp =  $(this).attr('id');
 temp = temp.split("-")
 r= temp[1]
 c = temp[2]



 var val;
 var cell = "#dlink-"+r+'-'+c
 d3.select(cell).style("stroke", function(d){
   return "limegreen";
 })
 $(this).css('background-color', '#FFFF00')
 $(this).css('font-weight', 'bold')


});



$("#delay_mat").on('mouseout','td',function(e) {
 var temp =  $(this).attr('id');
 temp = temp.split("-")
 r = temp[1]
 c = temp[2]


 var val;
 var cell = "#dlink-"+r+'-'+c
 d3.select(cell).style("stroke", function(d){
   //console.log(d)
   if(d.value>=delay_threshold)
    return "red"
    else return "none";
 })

 $(this).css('background-color', 'transparent')
 $(this).css('font-weight', 'normal')


});
$("#editLink").click(function(){

   val = $("#newValue").val();
   //console.log(val)
   if( $.isNumeric(val))
   {

     update_data(row, column, parseFloat(val))

     $("#editLink").hide()
     $("#newValue").hide()


   }
   else {
     alert("Please input a valid number")
   }
});
function highlightTable(d)
{

  //console.log(d.source.id)
  //console.log(d.target.id)
  cell = '#t-'+d.source.id+'-'+d.target.id
  //console.log($(cell).text())
  $(cell).css('background-color', '#FFFF00')
  $(cell).css('font-weight', 'bold')

  cell = '#d-'+d.source.id+'-'+d.target.id
  //console.log($(cell).text())
  $(cell).css('background-color', '#FFFF00')
  $(cell).css('font-weight', 'bold')

  cell = '#row1-'+d.source.id
  $(cell).css('color', 'steelblue')
  $(cell).css('font-weight', 'bold')
  cell = '#col1-'+d.target.id
  $(cell).css('color', 'steelblue')
  $(cell).css('font-weight', 'bold')

  cell = '#row2-'+d.source.id
  $(cell).css('color', 'steelblue')
  $(cell).css('font-weight', 'bold')
  cell = '#col2-'+d.target.id
  $(cell).css('color', 'steelblue')
  $(cell).css('font-weight', 'bold')

}
function unhighlightTable(d)
{
  //console.log(d.source.id)
  //console.log(d.target.id)
  cell = '#t-'+d.source.id+'-'+d.target.id
  //console.log($(cell).text())
  $(cell).css('background-color', "transparent")
  $(cell).css('font-weight', 'normal')
  cell = '#d-'+d.source.id+'-'+d.target.id
  //console.log($(cell).text())
  $(cell).css('background-color', "transparent")
  $(cell).css('font-weight', 'normal')

  cell = '#row1-'+d.source.id
  $(cell).css('color', 'black')
  $(cell).css('font-weight', 'normal')
  cell = '#col1-'+d.target.id
  $(cell).css('color', 'black')
$(cell).css('font-weight', 'normal')

cell = '#row2-'+d.source.id
$(cell).css('color', 'black')
$(cell).css('font-weight', 'normal')
cell = '#col2-'+d.target.id
$(cell).css('color', 'black')
$(cell).css('font-weight', 'normal')

}

function convert_traffic_graph(t)
{
  var res = {}
  var nodes = [], links=[];
  for(var i =0; i<t['nodes'].length; i++)
  {
    nodes.push({'id': t['nodes'][i]['id']})
  }
  for(var i =0; i<t['links'].length; i++)
  {
    links.push({'source': t['links'][i]['source']['id'],'target': t['links'][i]['target']['id'],'value': t['links'][i]['value']})
  }
  res['nodes'] = nodes
  res['links'] = links
  return res
}
   $("#generateDelay").click(function(){
     console.log(traffic_graph)
     traffic_graph_converted = convert_traffic_graph(traffic_graph)
     $.ajax({
    type : 'POST',
    url : "/send_traffic",
    contentType: 'application/json;charset=UTF-8',
    data : JSON.stringify({'traffic_mat':traffic_mat, 'traffic_graph':traffic_graph_converted})
  });
  $.ajax({
    dataType: "json",
    url: "/return_delay",
    success: function(data){
      delay_graph = data['delay_data']
      delay_mat = data['delay_mat']
      delay_max = data['delay_max']
      console.log(delay_max)
      step = 0.1
      if(delay_max<=1){
        delay_max = 1
        step = 0.1
      }
      else {
        step = delay_max/10
      }



      d3.select('#slider-alternative-handle2')
        .call(slider2.min(0).max(delay_max).step(step));
      update(delay_graph.links, delay_graph.nodes, "#main-graph-delay");
      update_table("#delay_mat", delay_mat)
    },
    async : true

  });

   });
