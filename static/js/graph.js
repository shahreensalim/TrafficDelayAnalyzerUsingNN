var traffic_graph, traffic_mat, delay_mat, delay_graph;
$("#newValue").hide()
$("#editLink").hide()
$("#stopGeneration").hide()
$.ajax({
  dataType: "json",
  url: "/get_all_data",
  success: function(data){
    traffic_graph = data['traffic_data']
    traffic_mat = data['traffic_mat']

  },
  async : false

});
console.log(traffic_graph)
console.log(traffic_mat)
var threshold = 0.5
var colors = d3.scaleOrdinal(d3.schemeCategory10);




 update(traffic_graph.links, traffic_graph.nodes, "#main-graph");
 update_table("#traffic_mat", traffic_mat)
   // d3.json("static/json/graph.json", function (error, graph) {
   //     if (error) throw error;
   //
   // })

   function update(links, nodes, space) {
     var node,  link;


      width = $(space).width(),
      height = $(space).height();
      console.log(width)
      console.log(height)

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
               'markerWidth':4,
               'markerHeight':4,
               'xoverflow':'visible'})
           .append('svg:path')
           .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
           .attr('fill', '#999')
           .style('stroke','none');

       var simulation = d3.forceSimulation()
           .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(200).strength(1))
           .force("charge", d3.forceManyBody())
           .force("center", d3.forceCenter(width / 2, height / 2));
       link = svg.selectAll(".link")
           .data(links)
           .enter()
           .append("path")
           .attr("class", "link")
           .attr("stroke", function(d){
             if(d.value>=threshold)
              return "green"
              else return "red";
           })
           .attr("stroke-opacity", function(d){
             return d.value;
           }
         )
         .attrs({
             'class': 'link',
             'fill-opacity': 0,
             'stroke-opacity': 1,
             'id': function (d, i) {
               if (space == "#main-graph")
                return 'link' + i
               else {
                 return 'dlink'+i
               }
             }
         })
           .attr('marker-end','url(#arrowhead)')
           .on("click", editlink)

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

       var edgelabels = svg.selectAll(".edgelabel")
           .data(links)
           .enter()
           .append('text')
           .style("pointer-events", "none")
           .attrs({
               'class': 'edgelabel',
               'id': function (d, i) {return 'edgelabel' + i},
               'font-size': 10,
               'fill': '#aaa'
           });

       edgelabels.append('textPath')
           .attr('xlink:href', function (d, i) {
              if (space == "#main-graph")
               return '#link' + i
              else {
                return '#dlink'+i
              }
             })
           .style("text-anchor", "middle")
           .style("pointer-events", "none")
           .attr("startOffset", "50%")
           .text(function (d) {return d.value });

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
           .attr("r", 5)
           .style("fill", function (d, i) {return "blue";})

       node.append("title")
           .text(function (d) {return d.id;});

       node.append("text")
           .attr("dy", -3)
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

                  edgelabels.attr('transform', function (d) {
                      if (d.target.x < d.source.x) {
                          var bbox = this.getBBox();

                          rx = bbox.x + bbox.width / 2;
                          ry = bbox.y + bbox.height / 2;
                          return 'rotate(180 ' + rx + ' ' + ry + ')';
                      }
                      else {
                          return 'rotate(0)';
                      }
                  });
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
     console.log(source)
     console.log(target)
     console.log(value)
     for(i=0; i<traffic_graph['links'].length; i++)
     {
       console.log(traffic_graph['links'][i])
       if(traffic_graph['links'][i]['source']['id']==source && traffic_graph['links'][i]['target']['id']==target)
       {
         console.log("hey")
         traffic_graph['links'][i]['value'] = value
         break
       }

     }

     traffic_mat[source-1][source-1][target-1]=value
     update_table("#traffic_mat", traffic_mat)



     update(traffic_graph.links, traffic_graph.nodes, "#main-graph")

   }
   function editlink(d)
   {
     $("#editLink").show()
     $("#newValue").show()
     var val;
     $("#editLink").click(function(){
        val = $("#newValue").val();
        if( $.isNumeric(val))
        {
          update_data(d.source.id, d.target.id, parseInt(val))
          $("#editLink").hide()
          $("#newValue").hide()
        }
        else {
          alert("Please input a valid number")
        }
     });

   }

   function stopGeneration(d)
   {
     $("#stopGeneration").show()

     $("#stopGeneration").click(function(){
       source = d.id
       for(i=0; i<traffic_graph['links'].length; i++)
       {
         console.log(traffic_graph['links'][i])
         if(traffic_graph['links'][i]['source']['id']==source)
         {
           console.log("hey")
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
       rowData = $('<td></td>').addClass('bar').text("Node")
       row.append(rowData);
       for (var i = 0; i <tableData.length; i++)
       {

            rowData = $('<td></td>').addClass('bar').text(i+1);
            row.append(rowData);
       }
       tbody.append(row);
       for (var i = 0; i <tableData.length; i++) {
         row = $('<tr></tr>')
         console.log(tableData[i][i])
         rowData = $('<td></td>').addClass('bar').text(i+1)
         row.append(rowData);
         for(j = 0; j<tableData[i][i].length; j++)
         {
           rowData = $('<td></td>').addClass('bar').text(tableData[i][i][j]);
           row.append(rowData);
         }
         tbody.append(row);
       }
       table.append(tbody)
       console.log("loaded")

   }

   $("#generateDelay").click(function(){
     $.ajax({
    type : 'POST',
    url : "/send_traffic",
    contentType: 'application/json;charset=UTF-8',
    data : JSON.stringify({'traffic_mat':traffic_mat})
  });
  $.ajax({
    dataType: "json",
    url: "/return_delay",
    success: function(data){
      delay_graph = data['delay_data']
      delay_mat = data['delay_mat']

      update(delay_graph.links, delay_graph.nodes, "#main-graph-delay");
      update_table("#delay_mat", delay_mat)
    },
    async : true

  });

   });
