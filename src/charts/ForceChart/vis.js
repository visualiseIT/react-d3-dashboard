import * as d3 from 'd3';
import './style.css';
import examplejson from './example.json';


let Msgs = [];
let slider;
let force, drag, vis;
let nodes, nodesIndex, links, linksIndex;
let node, link;
let maxCount, minLinks = 10;
let removedLinks = [], removedNodes = [];
let loaded = false;
let logRadius = true, radiusMultiplier = 10;
let chargeMultiplier = 2000;
let maxStroke = 0, strokeMultiplier = 0.2;
let moreOptionsDialog, moreOptionsBtn;
let linkDistanceMultiplier = 4;

let $ = {};

const draw = (props) => {
    //debugger;

    if (!props.d3data) return;

    d3.select('.vis-forcechart > *').remove();
    // const data = props.data;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;
    // const w = width, h = height;

    let w = width + margin.left + margin.right;
    let h = height + margin.top + margin.bottom;

    // let svg = d3.select('.vis-forcechart').append('svg')
    //         .attr('width',w)
    //         .attr('height',h)
    //         .append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    vis = d3.select('.vis-forcechart').append("svg:svg")
        .attr("width", w)
        .attr("height", h);


    var svg = vis;

    drag = simulation => {

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const color = function () {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    }

    // const height = 600;
    console.info(props.d3data);
    //debugger;
    // const data = examplejson;
    let nodesArray = [];
    let linksArray = [];

    nodesArray = d3.values(props.d3data.nodesIndex);
    linksArray = d3.values(props.d3data.links);

    const data = {nodes: nodesArray, links: linksArray};

    const chart = function () {

        //debugger;

        const links = data.links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        // const svg = d3.create("svg")
        //     .attr("viewBox", [0, 0, width, height]);


        /*
        const link = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.9)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => 3);
            // .attr("stroke-width", d => Math.sqrt(d.value));

        let newNodes = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("class", "node")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            // .join("g")
            // .append("circle")
            // .attr("r", 5)
            .attr("r", function (d) {
                return getRadius(d.count);
            })
            // .attr("fill", color)
            .call(drag(simulation));




        // node.append("title")
        //     .text(d => d.text);

        newNodes.append("text").attr("class", "bigstroke").attr("text-anchor", "middle").attr("text-anchor", "middle").attr("fill", "white").append("tspan").attr("x", 0).text(function (h) {
            debugger;
            var g = h.text.split(" ")[0];
            return g
        }).append("tspan").attr("x", 0).attr("dy", "1.05em").text(function (h) {
            var g = h.text.split(" ");
            g.shift();
            return g.join(" ")
        });
        newNodes.append("text").attr("text-anchor", "middle").attr("fill", "white").append("tspan").attr("x", 0).text(function (h) {
            var g = h.text.split(" ")[0];
            return g
        }).append("tspan").attr("x", 0).attr("dy", "1.05em").text(function (h) {
            var g = h.text.split(" ");
            g.shift();
            return g.join(" ")
        });

        */

        const link = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 1)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => 3);
            // .attr("stroke-width", d => Math.sqrt(d.value));

        let newNodes = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("g")
            .attr("class", "node")
            .call(drag(simulation));

        const node = newNodes
            .append("circle")
            // .attr("r", 5)
            .attr("r", function (d) {
                return getRadius(d.count);
            });
            // .attr("fill", color)
            // .call(drag(simulation));

        node.append("title")
            .text(d => d.id);

        newNodes.append("text").attr("class", "bigstroke").attr("text-anchor", "middle").attr("text-anchor", "middle").attr("fill", "white").append("tspan").attr("x", 0).text(function (h) {
            //debugger;
            var g = h.text.split(" ")[0];
            return g
        }).append("tspan").attr("x", 0).attr("dy", "1.05em").text(function (h) {
            var g = h.text.split(" ");
            g.shift();
            return g.join(" ")
        });
        newNodes.append("text").attr("text-anchor", "middle").attr("fill", "white").append("tspan").attr("x", 0).text(function (h) {
            var g = h.text.split(" ")[0];
            return g
        }).append("tspan").attr("x", 0).attr("dy", "1.05em").text(function (h) {
            var g = h.text.split(" ");
            g.shift();
            return g.join(" ")
        });

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            newNodes
                // .attr("x", d => d.x)
                // .attr("y", d => d.y)
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        // invalidation.then(() => simulation.stop());

        return svg.node();
    }

    chart()
}

const drawNew = (props) => {
    //debugger;

    d3.select('.vis-forcechart > *').remove();
    const data = props.data;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;
    // const w = width, h = height;

    let w = width + margin.left + margin.right;
    let h = height + margin.top + margin.bottom;

    // let svg = d3.select('.vis-forcechart').append('svg')
    //         .attr('width',w)
    //         .attr('height',h)
    //         .append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    vis = d3.select('.vis-forcechart').append("svg:svg")
        .attr("width", w)
        .attr("height", h);


    var svg = vis;

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    //debugger;
    // d3.json("example.json", function(error, graph) {
    d3.json("http://localhost:7000/examplejson", function (error, graph) {
        if (error) throw error;
        //debugger;
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 2.5)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) {
                return d.id;
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }
    });

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}


export default draw;

function addMessage(text) {
    console.info(text);
}

function getRadius(count) {
    var radius = 8; //min size

    if (logRadius) {
        radius += Math.log(count) * radiusMultiplier;
    } else {
        radius += count * radiusMultiplier;
    }

    return radius;
}

var isLoaded = false;

function update() {

    //debugger;

    if (isLoaded === false) {
        link = vis.selectAll("line.link");
        node = vis.selectAll("circle.node")

        isLoaded = true;
    }

    /*// Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();*/

//            addMessage("starting update()...");

    // Update the links…
//            link = vis.selectAll("line.link").data(links);
    link = link.data(force.links());

    //            maxStroke = Math.round(((Math.log(maxCount) * 8) + 8) / 3);
    maxStroke = getRadius(maxCount) * 2;
    var newMaxStroke = maxStroke * strokeMultiplier;

    // Enter any new links.
    link.enter().insert("line", "g")
        .attr("class", function (l) {
            return "link";
        });
    /*
                    .style("stroke-width", function (l)
                    {
    //                    return (Math.round(Math.log(l.count) * 8) + 1) + "px";
    //                    return (Math.round((l.count / maxCount) * 20) + 0.5) + "px";
                        return (Math.round((l.count / maxCount) * maxStroke) + 0.5) + "px";
                    });
    */

    var visibleLinks = vis.selectAll("line");
    visibleLinks.style("stroke-width", function (l) {
        var width;

        var percentageSize = (l.count / maxCount);

        width = (Math.round(percentageSize * newMaxStroke) + 0.5);

        return width + "px";
    });

    // Exit any old links.
    link.exit().remove();


    // Update the nodes…
//            node = vis.selectAll("circle.node").data(nodes);
    node = node.data(force.nodes(), function (d) {
        return d.text;
    });
//                .style("fill", color);

    //debugger;
    // Enter any new nodes.
    var newNodes = node.enter().append("g")
        .attr("class", "node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", click)
        .on("contextmenu", rightclick)
        //            .call(drag);
        .call(force.drag);

    newNodes.append("circle");
    /*
                    .attr("r", function (d) {
                        var radius = 8; //min size

                        if (logRadius)
                            {
                                radius += Math.log(d.count) * radiusMultiplier;
                            }
                        else
                            {
                                radius += d.count * radiusMultiplier;
                            }

                        return  radius;
                    });
    */
//            .attr("r", 8);


    var visibleNodes = vis.selectAll("circle");

    visibleNodes.attr("r", function (d) {
        return getRadius(d.count);
    });

//                    node.
    /*
    newNodes.append("text")
//            .attr("x", 12)
//            .attr("dy", ".35em")
//                 .attr("class", "bigstroke")
        .attr("text-anchor", "middle")
        // .attr("fill", "steelblue")
        .attr("fill", "white")
        .attr("stroke-width", function(d) { return (d.interest * 50); })
        .text(function (d) { return d.text + " (" + d.count + ")"; });

     */


    newNodes.append("text").attr("class", "bigstroke").attr("text-anchor", "middle").attr("text-anchor", "middle").attr("fill", "white").append("tspan").attr("x", 0).text(function (h) {
        var g = h.text.split(" ")[0];
        return g
    }).append("tspan").attr("x", 0).attr("dy", "1.05em").text(function (h) {
        var g = h.text.split(" ");
        g.shift();
        return g.join(" ")
    });
    newNodes.append("text").attr("text-anchor", "middle").attr("fill", "white").append("tspan").attr("x", 0).text(function (h) {
        var g = h.text.split(" ")[0];
        return g
    }).append("tspan").attr("x", 0).attr("dy", "1.05em").text(function (h) {
        var g = h.text.split(" ");
        g.shift();
        return g.join(" ")
    });


//            newNodes.call(force.drag);

    // Exit any old nodes.
    node.exit().remove();


//            addMessage("finished update()");

    force.start();

}

function tick() {
    link
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
}

function mouseover() {
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", function (d) {
//                  d.mOver = true;
//                    return (Math.log(d.count) * 8) + 16;
            return getRadius(d.count) + 8;
        });
//            force.start();
}

function mouseout() {
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", function (d) {
//                  d.mOver = false;
//                    return (Math.log(d.count) * 8) + 8;
            return getRadius(d.count);
        });
//            force.start();
}

function click(d) {
//            addMessage("click");
    var data = this.__data__;
    if (data.fixed) {
//                    debugger;
        if (d.wasDragged) {
            d.wasDragged = false;
        } else {
            rightclick.call(this);
        }
        return;
    }

//            debugger;

    link.attr("class", function (l) {
        var classes = "link";
        if (l.source === data) {
            if (!l.target.linked) l.target.linked = 0;
            l.target.linked++;

            classes = "link fixed";
        } else if (l.target === data) {
            if (!l.source.linked) l.source.linked = 0;
            l.source.linked++;

            classes = "link fixed";
        } else if (this.getAttribute("class") === "link fixed") {
            classes = "link fixed";
        }
        return classes;
    });

    node.attr("class", function (n) {

        var classAttr = this.getAttribute("class");
        var classes = classAttr.split(" ");

        var class2return = "node";

        if (n.linked) {
            class2return += " linked";
        }

//                if (Ext.Array.contains(classes, "fixed"))
        if ($.inArray("fixed", classes) != -1) {
            class2return += " fixed";
        }

        return class2return;
    });

    d3.select(this).classed("fixed", true);
    data.mOver = true;
    data.fixed = true;
    force.start();

//            update();
}

function rightclick() {
//            debugger;
    var data = this.__data__;

    link.attr("class", function (l) {
        var classes = "link";
        if (l.source === data) {
            if (!l.target.linked) l.target.linked = 0;

            if (l.target.linked > 0) {
                l.target.linked--;
            }

            if (l.target.linked > 0) {
                classes = "link fixed";
            }

        } else if (l.target === data) {
            if (!l.source.linked) l.source.linked = 0;

            if (l.source.linked > 0) {
                l.source.linked--;
            }

            if (l.source.linked > 0) {
                classes = "link fixed";
            }
        } else if (this.getAttribute("class") === "link fixed") {
            classes = "link fixed";
        }
        return classes;
    });

    node.attr("class", function (n) {

        var classAttr = this.getAttribute("class");
        var classes = classAttr.split(" ");

        var class2return = "node";

        if (n.linked) {
            class2return += " linked";
        }

//                if (Ext.Array.contains(classes, "fixed"))
        if ($.inArray("fixed", classes) != -1) {
            class2return += " fixed";
        }

        return class2return;
    });

    d3.select(this).classed("fixed", false);
    this.__data__.mOver = false;
    this.__data__.fixed = false;
    force.start();

    d3.event.preventDefault();
}

function dragend(d) {

//        addMessage("dragend");

    var time = new Date().getTime();
    var diff = time - d.wasDragged;

    d.wasDragged = (diff > 250);

}

function dragstart(d) {
//            addMessage("dragstart");
//            debugger;
    d.wasDragged = new Date().getTime();
    /*
                if (d.fixed === false)
                    {
                        d.fixed = true;
                        d3.select(this).classed("fixed", true);
                    }
                else if (d.fixed === true)
                    {
    //                    debugger;
                        d.fixed = false;
                        d3.select(this).classed("fixed", false);
                    }
                else
                    {
                        d.fixed = false;
                        d3.select(this).classed("fixed", false);
                    }
    */

}