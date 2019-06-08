/*
 * Copyright 2014 Emily Palmieri <silentfuzzle@gmail.com>
 * License: GNU GPL v3
 */

///////////////////////////////////////////////////////////////////////////////
//LAYOUT AND BEHAVIOR VARIABLES
///////////////////////////////////////////////////////////////////////////////

var svgWidth = 500,
    svgHeight = 500;
var mapContainer = "#map-wrapper";

var textDefaultOpacity = 0;
var textVisibleOpacity = 0.6;
var textHighlightOpacity = 1;
var textOffset = 4;
var textDefaultSize = 7;
var textMaxSize = 17.5;

var growthFactor = 2;

var nodeDefaultRadius = 8;
var nodeMaxRadius = nodeDefaultRadius * growthFactor;
var nodeDefaultColor = "#3182bd";
var nodeHighlightColor = "#FF0000";
var nodeBeginColor = "green";

var straightLinks = false;
var maxHighlightLinks = 5;
var linkDefaultWidth = 1.5;
var linkMaxWidth = linkDefaultWidth * growthFactor;
var linkDefaultColor = "#666";
var linkHighlightColor = "red";

var nodeLinkDefaultOpacity = 0.2;
var nodeLinkHighlightOpacity = 0.5;
var staticArrows = false;
var markerSize = 4;
if (staticArrows) {
    markerSize = linkDefaultWidth * 6;
}
var markerOffset = -0.1;
if (straightLinks) {
    markerOffset = 0;
}

var FORCE_DIRECTED = 1;
var RAINBOW_GRAPH = 2;
var rainbowNodeSpacing = 50;
    
///////////////////////////////////////////////////////////////////////////////
//SETUP
///////////////////////////////////////////////////////////////////////////////

var vis;
var force;
var node = 0;
var link;
var allVisible = false;
var layout = FORCE_DIRECTED;
  
// Set the viewer window to fill the TOC panel
var svg = d3.select(mapContainer)
    .append("svg")
      .attr({
        "width": "100%",
        "height": "100%"
      })
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("pointer-events", "all");

// Controls the zoom and pan functions initiated by the user
var zoomListening = true;
var zoomListener = d3.behavior.zoom()
  .scaleExtent([0.1, 3])
  .on("zoom", redraw);

// Stores the history of positions the user has navigated to
var pageHistory;
var linkColorer;

///////////////////////////////////////////////////////////////////////////////
//CALLED FROM PYTHON
///////////////////////////////////////////////////////////////////////////////

// Display a network from passed JSON data
// data (string) - json code
// pageNum (float) - the number of the first page of the section the user is currently viewing
// historyOffset (int) - An integer representing how the user navigated to the section
//      0 - the user clicked a link in the e-book or a node in the network
//      1 - the user navigated to the next section in their history
//      -1 - the user navigated to the previous section in their history
//      -2 - the user navigated to another section without adding to their history
//      -3 - the user opened a new ebook
function dataLoaded(data, pageNum, historyOffset) {
    var links = data.links;
    var nodes = data.nodes;
    
    var nodeDictionary = new Object();
    if (node != 0 && historyOffset != -3) {
        // The user has created a new link, prepare to reload the network
        force.stop();
        
        // Save the current node positions in a dictionary
        var defaultOpacity = getDefaultTextOpacity();
        node.each(function(d) {
            var nodeInfo = [];
            nodeInfo[0] = d.x;
            nodeInfo[1] = d.y;
            nodeInfo[2] = d.fixed;
            nodeDictionary[d.id] = nodeInfo;
        });
        
        // Set the initial node positions to the saved positions
        nodes.forEach(function(n) {
            // Make sure this node existed in the previous graph
            if (nodeDictionary.hasOwnProperty(n.id)) {
                var x = nodeDictionary[n.id][0];
                var y = nodeDictionary[n.id][1];
                n.x = x;
                n.y = y;
                n.fixed = nodeDictionary[n.id][2];
            }
            else {
                // Set non-existent nodes to default values
                n.fixed = false;
            }
            n.r = nodeDefaultRadius;
            n.topacity = defaultOpacity;
            n.nopacity = nodeLinkDefaultOpacity;
        });
    }
    else {
        if (historyOffset == -3) {
            linkColorer = new LinkColorer();
            layout = FORCE_DIRECTED;
            allVisible = false;
        }
        
        // Set the default value for nodes when the network is initialized for the first time
        nodes.forEach(function(n) {
            n.r = nodeDefaultRadius;
            n.fixed = false;
            n.topacity = defaultOpacity;
            n.nopacity = nodeLinkDefaultOpacity;
            linkColorer.updateMinNodeID(n.id);
        });
    }

    // Set the type of network to display and its parameters
    force = d3.layout.force() 
        .nodes(nodes) 
        .links(links) 
        .size([svgWidth, svgHeight]) 
        .linkDistance(50)
        .charge(-100)
        .on("tick", tick)
        .start();
        
    // Clear any old network data from previous renderings
    d3.selectAll("svg > *").remove();

    // Reset the variables for displaying links as arrows
    var defs = svg.append("defs").selectAll("marker")
        .data(["default", "highlight"])
      .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -1 2 2")
        .attr("refX", 2)
        .attr("refY", markerOffset)
        .attr("markerWidth", markerSize)
        .attr("markerHeight", markerSize)
        .attr("orient", "auto");
    
    if (staticArrows) {
        // Prevents the arrow from resizing with the stroke-width of a link
        defs.attr("markerUnits", "userSpaceOnUse");
    }
    
    // Creates a triangle shape to place at the end of a link
    defs.append("path")
        .attr("d", "M0,-1L2,0L0,1");
    
    // This group contains all elements of the network
    // Allows users to zoom and pan by manipulating the svg
    vis = svg.append('svg:g');
    
    // Create an object that stores all links added to the network
    // "marker-end" - associates a triangle with a link to create a directed arrow
    // .style - used for resizing the links as the user zooms in or out of the network
    // .attr("class", ...) - sets the .link css attributes to links
    //                     - sets the .link.scroll attributes to links of type "scroll"
    link = vis.selectAll("path")
        .data(force.links())
      .enter().append("g")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", "url(#default)")
        .attr("tpage", function(d) { return d.target.id; })
        .attr("spage", function(d) { return d.source.id; })
        .attr("tx", function(d) { return d.target.x; })
        .attr("ty", function(d) { return d.target.y; })
        .on("mouseover", mouseoverLink)
        .on("mouseout", mouseoutLink)
        .on("click", clickLink);
    
    // Make path attributes accessible for animation/modification
    link.append("path")
        .style("stroke-width", linkDefaultWidth + "px")
        .style("opacity", function(d) { return nodeLinkDefaultOpacity; }); 
        
    // Create an object that stores all the nodes added to the network
    // .attr("class", "node") - sets the .node circle attributes to node circles
    node = vis.selectAll(".node") 
        .data(force.nodes()) 
      .enter().append("g") 
        .attr("class", "node") 
        .attr("page", function(d) { return d.id; })
        .on("mouseover", mouseoverNode) 
        .on("mouseout", mouseoutNode) 
        .on("click", clickNode)
        .on("dblclick", dblclick); 

    // Set the appearance of the node to be a circle
    node.append("circle")
        .attr("opacity", function(d) { return d.nopacity; })
        .attr("r", function(d) { return d.r; });

    // Set the text appearing next to the node and other data the node stores
    node.append("text") 
        .attr("x", nodeDefaultRadius + textOffset) 
        .attr("dy", ".35em") 
        .style("fill", "#000000")
        .text(function(d) { return d.title; });
    
    // Wrap the text of long titles
    node.selectAll("text")
        .call(wrap, 100);
    
    if (historyOffset == -3) {
        // Reset the view to make sure the network is on screen
        zoomListener.scale(1)
        centerNode(svgWidth/2, svgHeight/2)
    }
    else {
        // Make sure the display is set to the current scale and location
        zoomListener.scale(zoomListener.scale());
        zoomListener.translate(zoomListener.translate());
        zoomListener.event(vis);
    }
    setZoomListener();
    
    // Set the color of the nodes
    var newLink = linkColorer.buildLinkDictionary(link);
    changePage(pageNum, historyOffset, 0);
    
    if (newLink != null && historyOffset != -3) {
        // Center the view over a newly created link or node
        centerLink(newLink);
    }
}

// Set the color of the nodes and links based on the user's history and position
// pageNum (float) - the number of the first page of the section the user is currently viewing
// historyOffset (int) - An integer representing how the user navigated to the section
//      0 - the user clicked a link in the e-book or a node in the network
//      1 - the user navigated to the next section in their history
//      -1 - the user navigated to the previous section in their history
//      -2 - the user navigated to another section without adding to their history
//      -3 - the user opened a new ebook
// centerView (bool) - True (1) if the view should be centered over the given node, false (0) if not
function changePage(pageNum, historyOffset, centerView) {
    
    // Update the user's position in their history
    var currNode = null;
    if (historyOffset == 0) {
        currNode = pageHistory.addNode(pageNum);
    }
    else if (historyOffset == 1) {
        currNode = pageHistory.nextNode(pageNum);
    }
    else if (historyOffset == -1) {
        currNode = pageHistory.prevNode(pageNum);
    }
    else if (historyOffset == -2) {
        currNode = pageHistory.replaceNode(pageNum);
    }
    else {
        pageHistory = new DoubleList();
        currNode = pageHistory.addNode(pageNum);
    }
    
    // Color the links, titles, and nodes
    resetNodeOpacities();
    colorNetwork(currNode);
    
    // Make sure centerView has been set
    if (centerView != 1 && centerView != 0) {
        if (layout == RAINBOW_GRAPH) {
            centerView = 1;
        }
        else {
            centerView = 0;
        }
    }
    
    // Center the view over the current node
    if (centerView == 1) {
        node.each(function(d) {
            if (d.id == pageNum) {
                centerNode(d.x, d.y);
            }
        });
    }
}

// Set the automated layout to use for placing the nodes
// newLayout (int) - An integer representing the layout to use
//      1 - force-directed layout
//      2 - rainbow graph layout
function setLayout(newLayout) {
    layout = newLayout;
    resetTextOpacities();
    
    if (layout == FORCE_DIRECTED) {
        // Allow the nodes to move by force-directed layout
        force.start();
        allVisible = false;
        var defaultTextOpacity = getDefaultTextOpacity();
        
        node.each(function(d) {
            d.fixed = false;
            d.topacity = defaultTextOpacity;
        });
        
        // Recalculate what nodes to label
        var currNode = pageHistory.currNode;
        colorNetwork(currNode);
        
        // Make sure the view is centered over the cloud of nodes
        centerNode(svgWidth/2, svgHeight/2);
    }
    else {
        // Fix the nodes in place and arrange them in a rainbow graph
        force.stop();
        var x = 0;
        var y = 0;
        allVisible = true;
        
        node.each(function(d) {
            d.fixed = true;
            d.topacity = textHighlightOpacity;
            
            // Place the nodes based on their position in the spine
            d3.select(this).transition()
                    .duration(750)
                    .attrTween("transform", moveNode);
                    
            // Note the final position of the node with the user's current position
            if (pageHistory.currNode.pos == d.id) {
                x = svgWidth/2;
                y = d.spine * rainbowNodeSpacing;
            }
        });
        
        applyTextOpacities();
        
        // Center the view over the user's current position
        centerNode(x, y);
    }
}

// Toggle the visibility of all node labels on and off
// makeVisible (bool) - True (1) if all labels should be visible, false (0) if not
function toggleLabels(makeVisible) {
    allVisible = makeVisible;
    
    resetTextOpacities();
    if (allVisible) {
        // Set all text visible
        applyTextOpacities();
    }
    else {
        // Set the text opacities from the user's position
        var currNode = pageHistory.currNode;
        colorNetwork(currNode);
    }
}

///////////////////////////////////////////////////////////////////////////////
//DRAW TEXT METHODS
///////////////////////////////////////////////////////////////////////////////

// Wraps the text labeling each node
// text - the text attribute selected from all nodes
// width - the maximum width of a label
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = 0,
            x = nodeDefaultRadius + textOffset,
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em")
                .attr("font-size", textDefaultSize + "px");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                lineNumber = lineNumber + 1;
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", lineNumber * lineHeight + dy + "em")
                    .attr("font-size", textDefaultSize + "px")
                    .text(word);
            }
        }
    });
}

// Animates the size and visibility of the text of a node
// nodeSVG - the node's SVG element
// growing - true if the node and text are growing to their maximum size
// visible - true if the node's text should be forced visible
function animateText(nodeSVG, growing, visible) {
    // Set the text parameters based on the desired animation
    var xOffset = textOffset;
    var textSize = textDefaultSize;
    var textOpacity = textDefaultOpacity;
    if (growing) {
        // The text should grow in size and be fully opaque
        xOffset += nodeMaxRadius;
        textSize = textMaxSize;
        textOpacity = textHighlightOpacity;
    }
    else {
        xOffset += nodeDefaultRadius;
        if (visible) {
            // Force the text to be visible
            textOpacity = textVisibleOpacity;
        }
    }
    
    // Start the animation
    d3.select(nodeSVG).select("text").transition()
        .duration(750)
        .selectAll('tspan').attr("x", xOffset)
        .attr("y", 0.1)
        .style("opacity", function (d) {
                if (visible || growing) { 
                    return textOpacity; 
                }
                else {
                    return d.topacity;
                } 
            })
        .attr("font-size", textSize + "px");
}

// Makes the text of a node visible 
// nodeSVG - the node's SVG element
function setTextVisible(nodeSVG) {
    animateText(nodeSVG, false, true);
}

// Sets the text of a node back to its default size and opacity
// nodeSVG - the node's SVG element
function setTextDefault(nodeSVG) {
    animateText(nodeSVG, false, false);
}

// Returns the default opacity to set all node labels to
function getDefaultTextOpacity() {
    if (allVisible) {
        // All labels are visible if selected by the user or no links exist
        return textVisibleOpacity;
    }
    else {
        return textDefaultOpacity;
    }
}

// Set the opacities of all text back to the default before coloring
function resetTextOpacities() {
    var defaultOpacity = getDefaultTextOpacity();
    node.each(function(n) {
        n.topacity = defaultOpacity;
    });
}

// Apply the set opacities to the node's text
function applyTextOpacities() {
    node.selectAll("text")
        .selectAll('tspan')
        .style("opacity", function(d) { return d.topacity; });
}

///////////////////////////////////////////////////////////////////////////////
//DRAW NODE METHODS
///////////////////////////////////////////////////////////////////////////////

// Color and set the opacities of the network nodes based on the user's position and history
// currPage - The first page of the section the user is viewing
function colorNodes(currPage) {
    node.each(function(n) {
        if (n.id == currPage) {
            d3.select(this).select("circle").style("fill", nodeHighlightColor);
            n.topacity = textVisibleOpacity;
            n.nopacity = nodeLinkHighlightOpacity;
            
            // Set the text of all connected nodes to visible
            var nodeLinks = getUpdateLinks(n.id);
            nodeLinks.forEach(function(l) {
                setEndpointTextOpacity(d3.select(l));
            });
        } 
        else if (n.type == 1) {
            // Emphasize nodes at the beginning of the book
            d3.select(this).select("circle").style("fill", nodeBeginColor);
            n.nopacity = nodeLinkHighlightOpacity;
        }
        else {
            d3.select(this).select("circle").style("fill", nodeDefaultColor);
        }
    });
}

// Set the opacities of all node circles back to the default before coloring
function resetNodeOpacities() {
    var defaultTextOpacity = getDefaultTextOpacity();
    node.each(function(n) {
        n.nopacity = nodeLinkDefaultOpacity;
        n.topacity = defaultTextOpacity;
    });
}

// Apply the set opacities to the node circles
function applyNodeOpacities() {
    node.selectAll("circle")
        .attr("opacity", function(d) { return d.nopacity; });
}

// Emphasize the given node by increasing its opacity
// nodeSVG - the node's SVG element
function makeNodeOpaque(nodeSVG) {
    d3.select(nodeSVG).select("circle").transition() 
        .duration(750)
        .attrTween("r", shrinkRadius)
        .attr("opacity", nodeLinkHighlightOpacity);
}

// De-emphasize the given node by decreasing its opacity
// nodeSVG - the node's SVG element
function makeNodeTransparent(nodeSVG) {
    d3.select(nodeSVG).select("circle").transition() 
        .duration(750)
        .attrTween("r", shrinkRadius)
        .attr("opacity", function(d) { return d.nopacity; });
}

// Grows the radius of a node to its maximum size and repositions its title
// nodeSVG - the node's SVG element
function growRadiusWrapper(nodeSVG) {
    d3.select(nodeSVG).select("circle").transition() 
        .duration(750) 
        .attrTween("r", growRadius)
        .attr("opacity", nodeLinkHighlightOpacity);
    
    animateText(nodeSVG, true, false);
}

// Animates the growing of a node's radius
// d - node data
function growRadius(d) {
    // Create a function that returns the radius at time t
    var interpolation = d3.interpolateNumber(d.r, nodeMaxRadius);
    
    // Get the links associated with the node
    var nodeLinks = getUpdateLinks(d.id);
    
    // Animate the node and its associated links
    return function(t) {
        d.r = interpolation(t);
        nodeLinks.forEach(updateLinkPath);
        
        return d.r;
    }
}

// Returns the radius of a node and its title's position to their default values
// nodeSVG - the node's SVG element
function shrinkRadiusWrapper(nodeSVG) {
    d3.select(nodeSVG).select("circle").transition() 
        .duration(750) 
        .attrTween("r", shrinkRadius)
        .attr("opacity", function(d) { return d.nopacity; });
    
    setTextDefault(nodeSVG);
}

// Animates the shrinking of a node's radius
// d - node data
function shrinkRadius(d) {
    // Create a function that returns the radius at time t
    var interpolation = d3.interpolateNumber(d.r, nodeDefaultRadius);
    
    // Get the links associated with the node
    var nodeLinks = getUpdateLinks(d.id);
    
    // Animate the node and its associated links
    return function(t) {
        d.r = interpolation(t);
        nodeLinks.forEach(updateLinkPath);
        
        return d.r;
    }
}

// Manually moves a node and its links to a new location
// d - node data
function moveNode(d) {
    // Create a function that returns the node's position at time t
    var interpolationX = d3.interpolateNumber(d.x, svgWidth/2);
    var interpolationY = d3.interpolateNumber(d.y, d.spine * rainbowNodeSpacing);
    
    // Get the links associated with the node
    var nodeLinks = getUpdateLinks(d.id);
    
    // Animate the node and its associated links
    return function(t) {
        d.y = interpolationY(t);
        d.py = interpolationY(t);
        d.x = interpolationX(t);
        d.px = interpolationX(t);
        nodeLinks.forEach(updateLinkNodes);
        
        return "translate(" + d.x + "," + d.y + ")";
    }
}

///////////////////////////////////////////////////////////////////////////////
//DRAW LINK METHODS
///////////////////////////////////////////////////////////////////////////////

// Highlights a path from the first section of the book to the user's current position if one exists
// currNode - the user's current position in their history
function colorLinks(currNode) {
    link.each(function(d) {
        // Make sure all links start at their default color
        d3.select(this).select("path").style("stroke", linkDefaultColor);
        d3.select(this).attr("marker-end", "url(#default)");
        d.opacity = nodeLinkDefaultOpacity;
    });
    
    var endPoints = linkColorer.getPathToColor(currNode);
    for (var i = 0; i < endPoints.length; i++) {
        var linkSVG = d3.select(endPoints[i]);
        linkSVG.select("path").style("stroke", linkHighlightColor);
        linkSVG.attr("marker-end", "url(#highlight)");
        linkSVG.select("path").style("opacity", function(d) {
            d.target.nopacity = nodeLinkHighlightOpacity;
            d.source.nopacity = nodeLinkHighlightOpacity;
            d.opacity = nodeLinkHighlightOpacity;
            return nodeLinkHighlightOpacity;
        });
    }
}

// Set the text of the nodes associated with a link to visible
// linkSVG - the link's SVG element
function setEndpointTextOpacity(linkSVG) {
    linkSVG.attr("topacity", function(d) { 
        d.target.topacity = textVisibleOpacity;
        d.source.topacity = textVisibleOpacity;
        d.target.nopacity = nodeLinkHighlightOpacity;
        d.source.nopacity = nodeLinkHighlightOpacity;
        d.opacity = nodeLinkHighlightOpacity;
        return textVisibleOpacity;
    });
}

// Apply the set opacities to the links
function applyLinkOpacities() {
    link.selectAll("path")
        .style("opacity", function(d) { return d.opacity; });
}

// Grows the width of a link's stroke to its maximum size
// linkSVG - the link's SVG element
function growStroke(linkSVG) {
    d3.select(linkSVG).select("path").transition()
        .duration(750)
        .style("stroke-width", linkMaxWidth + "px")
        .style("opacity", nodeLinkHighlightOpacity);
}

// Shrinks the width of a link's stroke to its default size
// linkSVG - the link's SVG element
function shrinkStroke(linkSVG) {
    d3.select(linkSVG).select("path").transition()
        .duration(750)
        .style("stroke-width", linkDefaultWidth + "px")
        .style("opacity", function(d) { return d.opacity; });
}

// Animate a link so that's end points remain at the edge of an animated node
// link - a link svg element
function updateLinkPath(link) {
    d3.select(link).select("path").attr("d", drawCurve);
}

// Manually move a link's endpoints with its associated nodes
// link - a link svg element
function updateLinkNodes(link) {
    updateLinkPath(link);
    
    // Update references to the node's position
    d3.select(link).attr("tx", function(d) { return d.target.x; })
        .attr("ty", function(d) { return d.target.y; });
}

// Draws a directed link between nodes
// d - a link object pulled from the svg
function drawCurve(d) {
    var sourceX = d.source.x;
    var sourceY = d.source.y;
    var targetX = d.target.x;
    var targetY = d.target.y;
    
    var theta = Math.atan((targetX - sourceX) / (targetY - sourceY));
    var phi = Math.atan((targetY - sourceY) / (targetX - sourceX));
    
    var sinTheta = d.source.r * Math.sin(theta);
    var cosTheta = d.source.r * Math.cos(theta);
    var sinPhi = d.target.r * Math.sin(phi);
    var cosPhi = d.target.r * Math.cos(phi);
    
    // Set the position of the link's end point at the source node
    // such that it is on the edge closest to the target node
    if (d.target.y > d.source.y) {
        sourceX = sourceX + sinTheta;
        sourceY = sourceY + cosTheta;
    }
    else {
        sourceX = sourceX - sinTheta;
        sourceY = sourceY - cosTheta;
    }
    
    // Set the position of the link's end point at the target node
    // such that it is on the edge closest to the source node
    if (d.source.x > d.target.x) {
        targetX = targetX + cosPhi;
        targetY = targetY + sinPhi;    
    }
    else {
        targetX = targetX - cosPhi;
        targetY = targetY - sinPhi;   
    }
    
    if (straightLinks) {
        // Draw a line between the two calculated points
        // M - move to position
        // L - draw a line from current position to end position
        return "M" + sourceX + "," + sourceY + "L" + targetX + "," + targetY;
    }
    else {
        // Draw an arc between the two calculated points
        // M - move to position
        // A - draw arc from current position to end position
        //  about an ellipse with x- and y-radius (dr, dr)
        //  rotated 0 radians relative to the current coordinate system
        var dx = targetX - sourceX,
            dy = targetY - sourceY,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + sourceX + "," + sourceY + 
            "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
    }
    // See svg "path" attribute for more information
}
    
///////////////////////////////////////////////////////////////////////////////
//ANIMATION METHODS
///////////////////////////////////////////////////////////////////////////////

// When the user hovers the mouse over a node, this method animates associated elements
// nodeSVG - the SVG element of the hovered node
// strokeMethod - a method to apply to each associated link
// textMethod - a method to apply to the text of each associated node
// opacityMethod - a method to apply to the circle of each associated node
function animateConnections(nodeSVG, strokeMethod, textMethod, opacityMethod) {
    var page = d3.select(nodeSVG).attr("page");
    var connectedNodes = [];
    
    // Emphasize the links connected to this node
    var nodeLinks = getUpdateLinks(page);
    nodeLinks.forEach(function(link) {
        var tpage = d3.select(link).attr("tpage");
        
        // Save the nodes connected to this node
        if (tpage != page) {
            connectedNodes.push(tpage);
        }
        else {
            var spage = d3.select(link).attr("spage");
            connectedNodes.push(spage);
        }
        
        strokeMethod(link);
    });
    
    // Emphasize the nodes connected to this node
    node.each(function(n) {
        var npage = d3.select(this).attr("page");
    
        var i = 0;
        var found = false;
        while (i < connectedNodes.length && !found) {
            if (npage == connectedNodes[i]) {
                textMethod(this);
                if (npage != page) {
                    // Avoid applying multiple animations to the calling node
                    opacityMethod(this);
                }
                found = true;
            }
            else {
                i++;
            }
        }
        
        // Remove the nodes in the list as they are found
        if (found) {
            connectedNodes.splice(i,1);
        }
    });
}

// When the user hovers the mouse over a link, this method animates the source and target node
// linkSVG - the SVG element of the hovered link
// radiusMethod - a method to apply to the link's target
// textMethod - a method to apply to the text of the link's source
// opacityMethod - a method to apply to the circle of the link's source
function animateSourceAndTarget(linkSVG, radiusMethod, textMethod, opacityMethod) {
    var tpage = d3.select(linkSVG).attr("tpage");
    var spage = d3.select(linkSVG).attr("spage");
    node.each(function(d) {
        if (d.id == tpage) {
            radiusMethod(this);
        }
        else if (d.id == spage) {
            textMethod(this);
            opacityMethod(this);
        }
    });
}

///////////////////////////////////////////////////////////////////////////////
//POSITION METHODS
///////////////////////////////////////////////////////////////////////////////

// Animates the force-directed network
function tick() { 
    link.select("path").attr("d", drawCurve);
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    
    // Update references to the node's position
    link.attr("tx", function(d) { return d.target.x; })
        .attr("ty", function(d) { return d.target.y; });
}

// Scales and pans the network as specified by the user
function redraw() {
  vis.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}

// Centers a newly formed link on screen
// linkObj - a NetworkNode object containing a link to center the view over
function centerLink(linkObj) {
    link.each(function(d) {
        if (d.source.id == linkObj.source.nodeID && 
                d.target.id == linkObj.target.nodeID) {
                
            if (layout == FORCE_DIRECTED) {
                // Center the view over the average position between the two nodes
                // The node with more weight will move less after the link is added
                // Weighting the average makes it more likely that the final view will show the link on screen
                var totWeight = d.source.weight + d.target.weight;
                var sw = d.source.weight / totWeight;
                var tw = d.target.weight / totWeight;
                var x = d.source.x*sw + d.target.x*tw;
                var y = d.source.y*sw + d.target.y*tw;
                centerNode(x, y);
            }
            else {
                // The nodes are fixed in place in a rainbow graph layout
                // Center the view over the target node
                centerNode(d.target.x, d.target.y);
            }
        }
    });
}

// Centers a node on the screen
// x1 - the x-position stored in the node's data
// y1 - the y-position stored in the node's data
function centerNode(x1, y1) {
    // Get the width and height of the document
    var bodyWidth = d3.select(mapContainer).style("width");
    var bodyHeight = d3.select(mapContainer).style("height");
    bodyWidth = parseInt(bodyWidth.substring(0, bodyWidth.length - 2));
    bodyHeight = parseInt(bodyHeight.substring(0, bodyHeight.length - 2));
    
    scale = zoomListener.scale();
    
    // Center the node at 0 on the svg
    x2 = (bodyWidth / 2 - x1);
    y2 = (bodyHeight / 2 - y1);
    
    // Get the screen position of the node at the center of the svg
    var sPos = getScreenCoords(x1, y1, [x2, y2], scale);
    
    // Center the node on the display
    x2 = x2 + (bodyWidth / 2 - sPos[0]);
    y2 = y2 + (bodyHeight / 2 - sPos[1]);
    
    // Apply the transformation to the display
    zoomListener.scale(scale);
    zoomListener.translate([x2, y2]);
    zoomListener.event(vis.transition().duration(750));
}

// Returns the position of the center of a node on the screen
// x - the x-position of a node on the svg
// y - the y-position of a node on the svg
// translate - the transformation required to center the node on the svg
// scale - the current scale of the svg
function getScreenCoords(x, y, translate, scale) {
    var xn = translate[0] + x*scale;
    var yn = translate[1] + y*scale;
    
    return [xn, yn];
}

///////////////////////////////////////////////////////////////////////////////
//NODE EVENT LISTENERS
///////////////////////////////////////////////////////////////////////////////

// Calls Python to send the user to the section corresponding to a clicked node
function clickNode() {    
    if (d3.event.defaultPrevented) {
        // Freeze the node position if the user is dragging a node
        d3.select(this).attr("fixed", function(d) { d.fixed = true; return d.fixed; });
        
        // Disallow navigation if the user is dragging a node or panning the view
        return;
    }
    
    // Get the first page number of the section from the node that was clicked
    pageNum = d3.select(this).attr("page");

    // Open the page associated with this node
    var url = "/Page/Display?pageId=" + pageNum;
    window.location.href = url;
}

// Emphasize a node and its associated links on mouse hover
function mouseoverNode() {
    // Allow user to reposition the node on mouse drag
    zoomListening = false;
    setZoomListener();
    
    growRadiusWrapper(this);
    animateConnections(this, growStroke, setTextVisible, makeNodeOpaque);
}

// Deemphasize a node and its associated links on mouse out
function mouseoutNode() {
    // Allow user to pan the view on mouse drag
    zoomListening = true;
    setZoomListener();
    
    shrinkRadiusWrapper(this);
    animateConnections(this, shrinkStroke, setTextDefault, makeNodeTransparent);
} 

// Unfix a node's position on mouse double click
function dblclick() {

    // Disallow users from unfixing nodes in rainbow graph layout
    if (layout == FORCE_DIRECTED) {
        d3.select(this).attr("fixed", function(d) { d.fixed = false; return d.fixed; });
    }
}

///////////////////////////////////////////////////////////////////////////////
//LINK EVENT LISTENERS
///////////////////////////////////////////////////////////////////////////////

// Center the user's view on a link's target node on mouse click
function clickLink() {
    var tx = d3.select(this).attr("tx");
    var ty = d3.select(this).attr("ty");
    centerNode(tx, ty);
}

// Emphasize a link and its target node on mouse hover
function mouseoverLink() {
    growStroke(this);
    animateSourceAndTarget(this, growRadiusWrapper, setTextVisible, 
            makeNodeOpaque);
}

// Deemphasize a link and its target node on mouse out
function mouseoutLink() {
    shrinkStroke(this);
    animateSourceAndTarget(this, shrinkRadiusWrapper, setTextDefault, 
            makeNodeTransparent);
}

///////////////////////////////////////////////////////////////////////////////
//CONTROL SCHEME
///////////////////////////////////////////////////////////////////////////////

// Sets the controls scheme based on the selected mode
function setZoomListener() {
    if (zoomListening) {
        addZoomListener();
    }
    else {
        removeZoomListener();
    }
}

// Sets the control scheme to positioning nodes
function removeZoomListener() {
    svg.on("mousedown.zoom", null);
    svg.on("mousemove.zoom", null);
    svg.on("dblclick.zoom", null);
    svg.on("touchstart.zoom", null);
    svg.on("MozMousePixelScroll.zoom", null);
    node.call(force.drag);
}

// Sets the control scheme to navigating nodes
function addZoomListener() {
    node.on('mousedown.drag', null);
    node.on('touchstart.drag', null);
    zoomListener(svg);
}

///////////////////////////////////////////////////////////////////////////////
//MISCELLANEOUS
///////////////////////////////////////////////////////////////////////////////

// Color the links, titles, and nodes in the network based on the user's current state
// currNode - The current node in the user's history
function colorNetwork(currNode) {
    pageNum = currNode.pos;
    
    colorLinks(currNode);
    colorNodes(pageNum);
    applyTextOpacities();
    applyNodeOpacities();
    applyLinkOpacities();
}

// Returns a list of link svg elements associated with a node with id page
// page - the id of a node
function getUpdateLinks(page) {
    var nodeLinks = [];
    link.each(function(d) {
        if (d.source.id == page || d.target.id == page) {
            nodeLinks.push(this);
        }
    });
    
    return nodeLinks;
}
