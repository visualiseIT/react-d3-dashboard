// import _ from 'lodash';
const _ = require("lodash");

// var nodes = [];
// var links = [];
// var nodesIndex = {};
// var linksIndex = {};
//
// var maxCount = 0;


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

// let _ = {};
let $ = _;

const  createNode = function(entity) {
    if (!nodesIndex[entity.text]) {
        nodesIndex[entity.text] = entity;
        nodesIndex[entity.text].count = 0;
    }

    nodesIndex[entity.text].count++;
}

const  createLinks = function(entities) {
    $.each(entities, function (entity1, i) {

        $.each(entities, function (entity2, i) {

            if (entity1.text !== entity2.text) createLink(entity1, entity2);

        });

    });
}

const  createLink = function(e1, e2) {

    var link;

    var indexKey1 = e1.text + e2.text;
    var indexKey2 = e2.text + e1.text;

    if (linksIndex[indexKey1]) {
        link = linksIndex[indexKey1];
    } else if (linksIndex[indexKey2]) {
        link = linksIndex[indexKey2];
    }

    if (!link) {
        link = {
            source: e1.text,
            target: e2.text,
            count: 0
        }
        links.push(link);
        linksIndex[indexKey1] = link;
    }

    link.count++;

    if (link.count > maxCount) maxCount = link.count;

}

const computeDistinctLinkNodes = function () {
    $.each(links, function (link, i) {
        link.source = nodesIndex[link.source];
        link.target = nodesIndex[link.target];
    });
}


const filterLinks = function (options) {

    var links2Remove = [];
    $.each(links, function (link, i) {
        if ((link.count <= options.min) || (link.count >= options.max)) {
            links2Remove.push(link);
        }
    });
    $.each(links2Remove, function (link, i) {
//            Ext.Array.remove(links, link);
        links.splice($.includes(links, link), 1);

//            Ext.Array.include(removedLinks, link);
    });

    removedLinks = $.union(removedLinks, links2Remove);
    // removedLinks = $.merge(removedLinks, links2Remove);

    // removedLinks = $.unique(removedLinks);
    removedLinks = _.uniqWith(removedLinks, _.isEqual);

    /*--add--*/

    var links2Add = [];
    $.each(removedLinks, function (link, i) {
        if ((link.count >= options.min) && (link.count <= options.max)) {
            links2Add.push(link);
        }
    });
    $.each(links2Add, function (link, i) {
//                                    links.push(link);
//                                                Ext.Array.include(links, link);
        if ($.includes(links, link) == -1) links.push(link);
//                                                Ext.Array.remove(removedLinks, link);
        removedLinks.splice($.includes(removedLinks, link), 1);
    });

}


const filterNodes = function () {

//                            var nodes2remove = Ext.Object.getValues(nodes);
//                            var nodes2remove = Ext.Array.toArray(nodes);
//        var nodes2remove = Ext.Array.clone(nodes);
    var nodes2remove = nodes.slice();

    $.each(links, function (link, i) {
        //debugger;
        if ($.includes(nodes2remove, link.source) != -1) {
//                    Ext.Array.remove(nodes2remove, link.source)
            nodes2remove.splice($.includes(link.source, nodes2remove), 1);
        }
        if ($.includes(nodes2remove, link.target) != -1) {
//                    Ext.Array.remove(nodes2remove, link.target)
            nodes2remove.splice($.includes(nodes2remove, link.target), 1);
        }
    });

    removedNodes = $.union(removedNodes, nodes2remove);
    // removedNodes = $.merge(removedNodes, nodes2remove);

    $.each(nodes2remove, function (node, i) {

        nodes.splice($.includes(nodes, node), 1);
//            Ext.Array.remove(nodes, node);
        //delete nodes[node.name];

    });

}

const addMissingNodes = function () {

    $.each(links, function (link, i) {
        if ($.includes(nodes, link.source) == -1)
            //                                if (!nodes[link.source.name])
        {
//                                            Ext.Array.include(nodes, link.source);
            nodes.push(link.source)
            //                                        nodes[link.source.name] = link.source;
//                                            Ext.Array.remove(removedNodes, link.source);
            removedNodes.splice($.includes(removedNodes, link.source), 1);
        }
        if ($.includes(nodes, link.target) == -1) {
//                                            Ext.Array.include(nodes, link.target);
            nodes.push(link.target)
            //                                        nodes[link.target.name] = link.target;
//                                            Ext.Array.remove(removedNodes, link.target);
            removedNodes.splice($.includes(removedNodes, link.target), 1);

        }

    });

}

const addMessage = function (text) {

    // var msg = vis.append("g").append("text")
    //     .attr("x", 25)
    //     .attr("y", 10 + (10 * Msgs.length))
    //     //                .attr("text-anchor", "middle")
    //     .attr("fill", "white")
    //     .text(text);
    //
    // Msgs.push(msg);
    console.info(text);
}

const clearMessages = function () {

    $.each(Msgs, function (v, i) {
        v.remove();
    })
}

const xml2json = xml => {
    var el = xml.nodeType === 9 ? xml.documentElement : xml
//      var h  = {name: el.nodeName}
    var h = {nodeName: el.localName}
    //   if (h.name === "emm:entity"){
    //       debugger;
    //   }
    h.name = Array.from(el.childNodes || []).filter(e => e.nodeType === 3).map(e => e.textContent).join('').trim()
    h.attributes = Array.from(el.attributes || []).filter(a => a).reduce((h, a) => {
        h[a.name] = a.value;
        return h
    }, {})
    h.children = Array.from(el.childNodes || []).filter(e => e.nodeType === 1).map(c => h[c.localName] = xml2json(c))

    if (h.attributes.id) {
        h.id = h.attributes.id;
    }
    if (h.attributes.name) {
        h.name = h.attributes.name;
    }


    //   h.children = [];
    //   $.each(el.childNodes, function(e){
    //       if (e.nodeType === 1){
    //           var c = e;
    //           if (!h[c.localName]) {
    //               h[c.localName] = xml2json(c)
    //               h.children.push(h[c.localName])
    //           }
    //           else {
    //               h[c.localName] = [h[c.localName]];
    //               h[c.localName].push(xml2json(c));
    //           }
    //       }
    //   });


    return h
}


const transform = (data) => {
    nodes = [];
    links = [];
    nodesIndex = {};
    linksIndex = {};

    maxCount = 0;

    //debugger;

    var articles = [];

    if (data.statuses && data.statuses.length > 0) {
        articles = data.statuses;
        addMessage("data received");
    } else {
        alert("Data not received, please try a refresh (F5)");
    }

    addMessage("articles.length = " + articles.length);

    addMessage("processing data.....1/5");

    _.each(articles, function (article, i) {

        if (article.entities) {
            if (article.entities.hashtags) {
                _.each(article.entities.hashtags, function (entity, i) {
                    entity.text = entity.text.toLowerCase();
                    entity.text[0] = entity.text[0].toUpperCase();
                    entity.id = entity.text;
                    createNode(entity);
                });

                createLinks(article.entities.hashtags);
            }


            // let entities = []
            // if (article.children){
            //     $.each(article.children, function(i, node){
            //         if (node.nodeName==="entity"){
            //             entities.push(node);
            //             createNode(node);
            //         }
            //     });
            // }
            //
            // createLinks(entities);
        }

    });

    addMessage("processing data.....2/5");

    return {
        articles,
        nodes,
        links,
        nodesIndex,
        linksIndex,
        maxCount
    }


    // nodes = d3.values(nodesIndex);
    //
    // addMessage("number of entities = " + nodes.length);
    // addMessage("processing data.....3/5");
    //
    computeDistinctLinkNodes();
    //
    addMessage("processing data.....4/5");
    //
    minLinks = 0;
    // // minLinks = Math.floor(maxCount / 2);
    //
    addMessage("minLinks = " + minLinks);
    //
    filterLinks({min: minLinks, max: maxCount});
    //
    addMessage("processing data.....5/5");
    //
    // //filterNodes();
    //
    addMessage("displaying data...");
    //
    // console.info(nodes)
    // console.info(links)
    //
    // // Restart the force layout.
    // force
    //     .nodes(nodes)
    //     .links(links)
    //     .start();
    //
    // update();
    //
    // addMessage("max link count = " + maxCount);
    //
    // slider.slider("option", "min", -maxCount); // left handle should be at the left end, but it doesn't move
    // slider.slider("value", -minLinks); //force the view refresh, re-setting the current value
};

const run = (_data) => {
    //debugger;
    let data = [];

    data = transform(_data);

    return data;
};


module.exports = {
    transform,
    run
};
