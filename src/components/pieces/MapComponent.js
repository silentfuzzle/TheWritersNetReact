import React, { Component } from 'react';
import * as d3 from "d3";
import LinkColorer from '../../map/link_colorer';
import DoubleList from '../../map/double_linked_nodes';

class Map extends Component {
    constructor(props) {
        super(props);

        this.svgWidth = 500;
        this.svgHeight = 500;
        this.mapContainer = "#map-wrapper";
        
        this.textDefaultOpacity = 0;
        this.textVisibleOpacity = 0.6;
        this.textHighlightOpacity = 1;
        this.textOffset = 4;
        this.textDefaultSize = 7;
        this.textMaxSize = 17.5;

        this.growthFactor = 2;

        this.nodeDefaultRadius = 8;
        this.nodeMaxRadius = this.nodeDefaultRadius * this.growthFactor;
        this.nodeDefaultColor = "#3182bd";
        this.nodeHighlightColor = "#FF0000";
        this.nodeBeginColor = "green";

        this.straightLinks = false;
        this.maxHighlightLinks = 5;
        this.linkDefaultWidth = 1.5;
        this.linkMaxWidth = this.linkDefaultWidth * this.growthFactor;
        this.linkDefaultColor = "#666";
        this.linkHighlightColor = "red";

        this.nodeLinkDefaultOpacity = 0.2;
        this.nodeLinkHighlightOpacity = 0.5;
        this.staticArrows = false;
        this.markerSize = 4;
        if (this.staticArrows) {
            this.markerSize = this.linkDefaultWidth * 6;
        }
        this.markerOffset = -0.1;
        if (this.straightLinks) {
            this.markerOffset = 0;
        }

        this.FORCE_DIRECTED = 1;
        this.RAINBOW_GRAPH = 2;
        this.rainbowNodeSpacing = 50;

        this.vis = null;
        this.force = null;
        this.node = 0;
        this.link = null;
        this.allVisible = false;
        this.layout = this.FORCE_DIRECTED;

        this.svg = null;

        this.zoomListening = true;
        this.zoomListener = null;

        // Stores the history of positions the user has navigated to
        this.pageHistory = null;
        this.linkColorer = null;
    }

    drawMap() {
        const testData = `{"links":[{"source":0,"type":"hyperlink","target":2},{"source":2,"type":"hyperlink","target":0},{"source":0,"type":"hyperlink","target":1},{"source":1,"type":"hyperlink","target":0},{"source":0,"type":"hyperlink","target":2},{"source":2,"type":"hyperlink","target":3},{"source":3,"type":"hyperlink","target":2},{"source":2,"type":"hyperlink","target":0}],"nodes":[{"id":"4","spine":4,"pages":0,"label":null,"type":1,"title":"Pajar"},{"id":"5","spine":5,"pages":0,"label":null,"type":2,"title":"About the Author"},{"id":"6","spine":6,"pages":0,"label":null,"type":2,"title":"About Pajar"},{"id":"7","spine":7,"pages":0,"label":null,"type":2,"title":"Adventurous Reader"}]}`;
        
        // Set the viewer window to fill the TOC panel
        this.svg = d3.select(this.mapContainer)
            .append("svg");
        this.svg.attr({
                "width": "100%",
                "height": "100%",
                "preserveAspectRatio": "xMidYMid meet",
                "pointer-events": "all"
            });

        // Controls the zoom and pan functions initiated by the user
        this.zoomListener = d3.zoom()
            .scaleExtent([0.1, 3])
            .on("zoom", this.redraw);

        this.loadData(JSON.parse(testData), 0, -3);
    }

    // Display a network from passed JSON data
    // data (string) - json code
    // pageNum (float) - the number of the first page of the section the user is currently viewing
    // historyOffset (int) - An integer representing how the user navigated to the section
    //      0 - the user clicked a link in the e-book or a node in the network
    //      1 - the user navigated to the next section in their history
    //      -1 - the user navigated to the previous section in their history
    //      -2 - the user navigated to another section without adding to their history
    //      -3 - the user opened a new ebook
    loadData(data, pageNum, historyOffset) {
        const links = data.links;
        const nodes = data.nodes;
        
        let nodeDictionary = {};
        if (this.node !== 0 && historyOffset !== -3) {
            // The user has created a new link, prepare to reload the network
            this.force.stop();
            
            // Save the current node positions in a dictionary
            const defaultOpacity = this.getDefaultTextOpacity();
            this.node.each(function(d) {
                let nodeInfo = [];
                nodeInfo[0] = d.x;
                nodeInfo[1] = d.y;
                nodeInfo[2] = d.fixed;
                nodeDictionary[d.id] = nodeInfo;
            });
            
            // Set the initial node positions to the saved positions
            nodes.forEach(function(n) {
                // Make sure this node existed in the previous graph
                if (nodeDictionary.hasOwnProperty(n.id)) {
                    let x = nodeDictionary[n.id][0];
                    let y = nodeDictionary[n.id][1];
                    n.x = x;
                    n.y = y;
                    n.fixed = nodeDictionary[n.id][2];
                }
                else {
                    // Set non-existent nodes to default values
                    n.fixed = false;
                }
                n.r = this.nodeDefaultRadius;
                n.topacity = defaultOpacity;
                n.nopacity = this.nodeLinkDefaultOpacity;
            });
        }
        else {
            if (historyOffset === -3) {
                this.linkColorer = new LinkColorer();
                this.layout = this.FORCE_DIRECTED;
                this.allVisible = false;
            }
            
            // Set the default value for nodes when the network is initialized for the first time
            nodes.forEach((n) => {
                n.r = this.nodeDefaultRadius;
                n.fixed = false;
                n.topacity = this.defaultOpacity;
                n.nopacity = this.nodeLinkDefaultOpacity;
                this.linkColorer.updateMinNodeID(n.id);
            });
        }

        // Set the type of network to display and its parameters
        this.force = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links)) 
            .force("charge", d3.forceManyBody())
            //.size([this.svgWidth, this.svgHeight]) 
            //.linkDistance(50)
            //.charge(-100)
            .on("tick", () => this.tick());
            //.start();
    
        // Clear any old network data from previous renderings
        d3.selectAll("svg > *").remove();

        // Reset the variables for displaying links as arrows
        let defs = this.svg.append("defs").selectAll("marker")
            .data(["default", "highlight"])
            .enter().append("marker")
            .attr("id", function(d) { return d; })
            .attr("viewBox", "0 -1 2 2")
            .attr("refX", 2)
            .attr("refY", this.markerOffset)
            .attr("markerWidth", this.markerSize)
            .attr("markerHeight", this.markerSize)
            .attr("orient", "auto");

        if (this.staticArrows) {
            // Prevents the arrow from resizing with the stroke-width of a link
            defs.attr("markerUnits", "userSpaceOnUse");
        }
        
        // Creates a triangle shape to place at the end of a link
        defs.append("path")
            .attr("d", "M0,-1L2,0L0,1");
        
        // This group contains all elements of the network
        // Allows users to zoom and pan by manipulating the svg
        this.vis = this.svg.append('svg:g');
        
        const that = this;

        // Create an object that stores all links added to the network
        // "marker-end" - associates a triangle with a link to create a directed arrow
        // .style - used for resizing the links as the user zooms in or out of the network
        // .attr("class", ...) - sets the .link css attributes to links
        //                     - sets the .link.scroll attributes to links of type "scroll"
        this.link = this.vis.selectAll("path")
            .data(links);
            /*.enter().append("g")
            .attr("class", function(d) { return "link " + d.type; })
            .attr("marker-end", "url(#default)")
            .attr("tpage", function(d) { return d.target.id; })
            .attr("spage", function(d) { return d.source.id; })
            .attr("tx", function(d) { return d.target.x; })
            .attr("ty", function(d) { return d.target.y; })
            .on("mouseover", function() { that.mouseoverLink(that); })
            .on("mouseout", function() { that.mouseoutLink(that); })
            .on("click", function() { that.clickLink(that); })*/;

        // Make path attributes accessible for animation/modification
        this.link.append("path")
            .style("stroke-width", this.linkDefaultWidth + "px")
            .style("opacity", () => { return this.nodeLinkDefaultOpacity; });

        // Create an object that stores all the nodes added to the network
        // .attr("class", "node") - sets the .node circle attributes to node circles
        this.node = this.vis.selectAll(".node") 
            .data(nodes);
            /*.enter().append("g") 
            .attr("class", "node") 
            .attr("page", function(d) { return d.id; })
            .on("mouseover", function() { that.mouseoverNode(that) }) 
            .on("mouseout", function() { that.mouseoutNode(that) }) 
            .on("click", function() { that.clickNode(that) })
            .on("dblclick", function() { that.dblclick(that) })*/;

        // Set the appearance of the node to be a circle
        this.node.append("circle")
            .attr("opacity", function(d) { return d.nopacity; })
            .attr("r", function(d) { return d.r; });
        
        // Set the text appearing next to the node and other data the node stores
        this.node.append("text") 
            .attr("x", this.nodeDefaultRadius + this.textOffset) 
            .attr("dy", ".35em") 
            .style("fill", "#000000")
            .text(function(d) { return d.title; });
        
        // Wrap the text of long titles
        this.node.selectAll("text")
            .call(this.wrap, 100);
        
        if (historyOffset === -3) {
            // Reset the view to make sure the network is on screen
            d3.zoomTransform(this.svg).scale(1);
            //this.zoomListener.scale(1)
            this.centerNode(this.svgWidth/2, this.svgHeight/2)
        }
        else {
            // Make sure the display is set to the current scale and location
            let transform = d3.zoomTransform(this.svg);
            transform.scale(transform.scale());
            transform.translate(transform.translate());
            transform.event(this.vis);

            /*this.zoomListener.scale(this.zoomListener.scale());
            this.zoomListener.translate(this.zoomListener.translate());
            this.zoomListener.event(this.vis);*/
        }
        this.setZoomListener();
        
        // Set the color of the nodes
        let newLink = this.linkColorer.buildLinkDictionary(this.link);
        this.changePage(pageNum, historyOffset, 0);
        
        if (newLink !== null && historyOffset !== -3) {
            // Center the view over a newly created link or node
            this.centerLink(newLink);
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
    changePage(pageNum, historyOffset, centerView) {
        
        // Update the user's position in their history
        var currNode = null;
        if (historyOffset === 0) {
            currNode = this.pageHistory.addNode(pageNum);
        }
        else if (historyOffset === 1) {
            currNode = this.pageHistory.nextNode(pageNum);
        }
        else if (historyOffset === -1) {
            currNode = this.pageHistory.prevNode(pageNum);
        }
        else if (historyOffset === -2) {
            currNode = this.pageHistory.replaceNode(pageNum);
        }
        else {
            this.pageHistory = new DoubleList();
            currNode = this.pageHistory.addNode(pageNum);
        }
        
        // Color the links, titles, and nodes
        this.resetNodeOpacities();
        this.colorNetwork(currNode);
        
        // Make sure centerView has been set
        if (centerView !== 1 && centerView !== 0) {
            if (this.layout === this.RAINBOW_GRAPH) {
                centerView = 1;
            }
            else {
                centerView = 0;
            }
        }
        
        // Center the view over the current node
        if (centerView === 1) {
            this.node.each((d) => {
                if (d.id === pageNum) {
                    this.centerNode(d.x, d.y);
                }
            });
        }
    }

    // Set the automated layout to use for placing the nodes
    // newLayout (int) - An integer representing the layout to use
    //      1 - force-directed layout
    //      2 - rainbow graph layout
    setLayout(newLayout) {
        this.layout = newLayout;
        this.resetTextOpacities();
        
        if (this.layout === this.FORCE_DIRECTED) {
            // Allow the nodes to move by force-directed layout
            this.force.start();
            this.allVisible = false;
            let defaultTextOpacity = this.getDefaultTextOpacity();
            
            this.node.each(function(d) {
                d.fixed = false;
                d.topacity = defaultTextOpacity;
            });
            
            // Recalculate what nodes to label
            let currNode = this.pageHistory.currNode;
            this.colorNetwork(currNode);
            
            // Make sure the view is centered over the cloud of nodes
            this.centerNode(this.svgWidth/2, this.svgHeight/2);
        }
        else {
            // Fix the nodes in place and arrange them in a rainbow graph
            this.force.stop();
            let x = 0;
            let y = 0;
            this.allVisible = true;
            
            this.node.each((d) => {
                d.fixed = true;
                d.topacity = this.textHighlightOpacity;
                
                // Place the nodes based on their position in the spine
                d3.select(d).transition()
                    .duration(750)
                    .attrTween("transform", this.moveNode);
                        
                // Note the final position of the node with the user's current position
                if (this.pageHistory.currNode.pos === d.id) {
                    x = this.svgWidth/2;
                    y = d.spine * this.rainbowNodeSpacing;
                }
            });
            
            this.applyTextOpacities();
            
            // Center the view over the user's current position
            this.centerNode(x, y);
        }
    }
    
    // Toggle the visibility of all node labels on and off
    // makeVisible (bool) - True (1) if all labels should be visible, false (0) if not
    toggleLabels(makeVisible) {
        this.allVisible = makeVisible;
        
        this.resetTextOpacities();
        if (this.allVisible) {
            // Set all text visible
            this.applyTextOpacities();
        }
        else {
            // Set the text opacities from the user's position
            let currNode = this.pageHistory.currNode;
            this.colorNetwork(currNode);
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    //DRAW TEXT METHODS
    ///////////////////////////////////////////////////////////////////////////

    // Wraps the text labeling each node
    // text - the text attribute selected from all nodes
    // width - the maximum width of a label
    wrap(text, width) {
        text.each((d) => {
            let text = d3.select(d),
                words = text.text().split(/\s+/).reverse(),
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = 0,
                x = this.nodeDefaultRadius + this.textOffset,
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em")
                    .attr("font-size", this.textDefaultSize + "px");
            
            for (const word of words) {
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
                        .attr("font-size", this.textDefaultSize + "px")
                        .text(word);
                }
            }
        });
    }

    // Animates the size and visibility of the text of a node
    // nodeSVG - the node's SVG element
    // growing - true if the node and text are growing to their maximum size
    // visible - true if the node's text should be forced visible
    animateText(nodeSVG, growing, visible) {
        // Set the text parameters based on the desired animation
        let xOffset = this.textOffset;
        let textSize = this.textDefaultSize;
        let textOpacity = this.textDefaultOpacity;
        if (growing) {
            // The text should grow in size and be fully opaque
            xOffset += this.nodeMaxRadius;
            textSize = this.textMaxSize;
            textOpacity = this.textHighlightOpacity;
        }
        else {
            xOffset += this.nodeDefaultRadius;
            if (visible) {
                // Force the text to be visible
                textOpacity = this.textVisibleOpacity;
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
    setTextVisible(nodeSVG) {
        this.animateText(nodeSVG, false, true);
    }
    
    // Sets the text of a node back to its default size and opacity
    // nodeSVG - the node's SVG element
    setTextDefault(nodeSVG) {
        this.animateText(nodeSVG, false, false);
    }

    getDefaultTextOpacity() {
        if (this.allVisible) {
            // All labels are visible if selected by the user or no links exist
            return this.textVisibleOpacity;
        }
        else {
            return this.textDefaultOpacity;
        }
    }

    // Set the opacities of all text back to the default before coloring
    resetTextOpacities() {
        const defaultOpacity = this.getDefaultTextOpacity();
        this.node.each(function(n) {
            n.topacity = defaultOpacity;
        });
    }
    
    // Apply the set opacities to the node's text
    applyTextOpacities() {
        this.node.selectAll("text")
            .selectAll('tspan')
            .style("opacity", function(d) { return d.topacity; });
    }

    ///////////////////////////////////////////////////////////////////////////
    //DRAW NODE METHODS
    ///////////////////////////////////////////////////////////////////////////

    // Color and set the opacities of the network nodes based on the user's position and history
    // currPage - The first page of the section the user is viewing
    colorNodes(currPage) {
        const that = this;
        this.node.each(function(n) {
            if (n.id === currPage) {
                d3.select(this).select("circle").style("fill", that.nodeHighlightColor);
                n.topacity = that.textVisibleOpacity;
                n.nopacity = that.nodeLinkHighlightOpacity;
                
                // Set the text of all connected nodes to visible
                let nodeLinks = that.getUpdateLinks(n.id);
                nodeLinks.forEach(function(l) {
                    that.setEndpointTextOpacity(d3.select(l));
                });
            } 
            else if (n.type === 1) {
                // Emphasize nodes at the beginning of the book
                d3.select(this).select("circle").style("fill", that.nodeBeginColor);
                n.nopacity = that.nodeLinkHighlightOpacity;
            }
            else {
                d3.select(this).select("circle").style("fill", that.nodeDefaultColor);
            }
        });
    }

    // Set the opacities of all node circles back to the default before coloring
    resetNodeOpacities() {
        var defaultTextOpacity = this.getDefaultTextOpacity();
        this.node.each((n) => {
            n.nopacity = this.nodeLinkDefaultOpacity;
            n.topacity = defaultTextOpacity;
        });
    }
    
    // Apply the set opacities to the node circles
    applyNodeOpacities() {
        this.node.selectAll("circle")
            .attr("opacity", function(d) { return d.nopacity; });
    }
    
    // Emphasize the given node by increasing its opacity
    // nodeSVG - the node's SVG element
    makeNodeOpaque(nodeSVG) {
        d3.select(nodeSVG).select("circle").transition() 
            .duration(750)
            .attrTween("r", this.shrinkRadius)
            .attr("opacity", this.nodeLinkHighlightOpacity);
    }
    
    // De-emphasize the given node by decreasing its opacity
    // nodeSVG - the node's SVG element
    makeNodeTransparent(nodeSVG) {
        d3.select(nodeSVG).select("circle").transition() 
            .duration(750)
            .attrTween("r", this.shrinkRadius)
            .attr("opacity", function(d) { return d.nopacity; });
    }

    // Grows the radius of a node to its maximum size and repositions its title
    // nodeSVG - the node's SVG element
    growRadiusWrapper(nodeSVG) {
        d3.select(nodeSVG).select("circle").transition() 
            .duration(750) 
            .attrTween("r", this.growRadius)
            .attr("opacity", this.nodeLinkHighlightOpacity);
        
        this.animateText(nodeSVG, true, false);
    }

    
    // Animates the growing of a node's radius
    // d - node data
    growRadius(d) {
        // Create a function that returns the radius at time t
        let interpolation = d3.interpolateNumber(d.r, this.nodeMaxRadius);
        
        // Get the links associated with the node
        let nodeLinks = this.getUpdateLinks(d.id);
        
        // Animate the node and its associated links
        return function(t) {
            d.r = interpolation(t);
            nodeLinks.forEach(this.updateLinkPath);
            
            return d.r;
        }
    }

    // Returns the radius of a node and its title's position to their default values
    // nodeSVG - the node's SVG element
    shrinkRadiusWrapper(nodeSVG) {
        d3.select(nodeSVG).select("circle").transition() 
            .duration(750) 
            .attrTween("r", this.shrinkRadius)
            .attr("opacity", function(d) { return d.nopacity; });
        
        this.setTextDefault(nodeSVG);
    }
    
    // Animates the shrinking of a node's radius
    // d - node data
    shrinkRadius(d) {
        // Create a function that returns the radius at time t
        let interpolation = d3.interpolateNumber(d.r, this.nodeDefaultRadius);
        
        // Get the links associated with the node
        let nodeLinks = this.getUpdateLinks(d.id);
        
        // Animate the node and its associated links
        return function(t) {
            d.r = interpolation(t);
            nodeLinks.forEach(this.updateLinkPath);
            
            return d.r;
        }
    }

    // Manually moves a node and its links to a new location
    // d - node data
    moveNode(d) {
        // Create a function that returns the node's position at time t
        let interpolationX = d3.interpolateNumber(d.x, this.svgWidth/2);
        let interpolationY = d3.interpolateNumber(d.y, d.spine * this.rainbowNodeSpacing);
        
        // Get the links associated with the node
        let nodeLinks = this.getUpdateLinks(d.id);
        
        // Animate the node and its associated links
        return function(t) {
            d.y = interpolationY(t);
            d.py = interpolationY(t);
            d.x = interpolationX(t);
            d.px = interpolationX(t);
            nodeLinks.forEach(this.updateLinkNodes);
            
            return "translate(" + d.x + "," + d.y + ")";
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    //DRAW LINK METHODS
    ///////////////////////////////////////////////////////////////////////////

    // Highlights a path from the first section of the book to the user's current position if one exists
    // currNode - the user's current position in their history
    colorLinks(currNode) {
        const that = this;
        this.link.each(function(d) {
            // Make sure all links start at their default color
            d3.select(this).select("path").style("stroke", that.linkDefaultColor);
            d3.select(this).attr("marker-end", "url(#default)");
            d.opacity = that.nodeLinkDefaultOpacity;
        });
        
        let endPoints = this.linkColorer.getPathToColor(currNode);
        for (let i = 0; i < endPoints.length; i++) {
            let linkSVG = d3.select(endPoints[i]);
            linkSVG.select("path").style("stroke", this.linkHighlightColor);
            linkSVG.attr("marker-end", "url(#highlight)");
            linkSVG.select("path").style("opacity", (d) => {
                d.target.nopacity = this.nodeLinkHighlightOpacity;
                d.source.nopacity = this.nodeLinkHighlightOpacity;
                d.opacity = this.nodeLinkHighlightOpacity;
                return this.nodeLinkHighlightOpacity;
            });
        }
    }

    // Set the text of the nodes associated with a link to visible
    // linkSVG - the link's SVG element
    setEndpointTextOpacity(linkSVG) {
        linkSVG.attr("topacity", (d) => { 
            d.target.topacity = this.textVisibleOpacity;
            d.source.topacity = this.textVisibleOpacity;
            d.target.nopacity = this.nodeLinkHighlightOpacity;
            d.source.nopacity = this.nodeLinkHighlightOpacity;
            d.opacity = this.nodeLinkHighlightOpacity;
            return this.textVisibleOpacity;
        });
    }

    // Apply the set opacities to the links
    applyLinkOpacities() {
        this.link.selectAll("path")
            .style("opacity", function(d) { return d.opacity; });
    }

    // Grows the width of a link's stroke to its maximum size
    // linkSVG - the link's SVG element
    growStroke(linkSVG) {
        d3.select(linkSVG).select("path").transition()
            .duration(750)
            .style("stroke-width", this.linkMaxWidth + "px")
            .style("opacity", this.nodeLinkHighlightOpacity);
    }

    // Shrinks the width of a link's stroke to its default size
    // linkSVG - the link's SVG element
    shrinkStroke(linkSVG) {
        d3.select(linkSVG).select("path").transition()
            .duration(750)
            .style("stroke-width", this.linkDefaultWidth + "px")
            .style("opacity", function(d) { return d.opacity; });
    }
    
    // Animate a link so that's end points remain at the edge of an animated node
    // link - a link svg element
    updateLinkPath(link) {
        d3.select(link).select("path").attr("d", this.drawCurve);
    }
    
    // Manually move a link's endpoints with its associated nodes
    // link - a link svg element
    updateLinkNodes(link) {
        this.updateLinkPath(link);
        
        // Update references to the node's position
        d3.select(link).attr("tx", function(d) { return d.target.x; })
            .attr("ty", function(d) { return d.target.y; });
    }

    drawCurve(d) {
        let sourceX = d.source.x;
        let sourceY = d.source.y;
        let targetX = d.target.x;
        let targetY = d.target.y;
        
        let theta = Math.atan((targetX - sourceX) / (targetY - sourceY));
        let phi = Math.atan((targetY - sourceY) / (targetX - sourceX));
        
        let sinTheta = d.source.r * Math.sin(theta);
        let cosTheta = d.source.r * Math.cos(theta);
        let sinPhi = d.target.r * Math.sin(phi);
        let cosPhi = d.target.r * Math.cos(phi);
        
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
        
        if (this.straightLinks) {
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
            let dx = targetX - sourceX,
                dy = targetY - sourceY,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + sourceX + "," + sourceY + 
                "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
        }
        // See svg "path" attribute for more information
    }

    ///////////////////////////////////////////////////////////////////////////
    //ANIMATION METHODS
    ///////////////////////////////////////////////////////////////////////////

    // When the user hovers the mouse over a node, this method animates associated elements
    // nodeSVG - the SVG element of the hovered node
    // strokeMethod - a method to apply to each associated link
    // textMethod - a method to apply to the text of each associated node
    // opacityMethod - a method to apply to the circle of each associated node
    animateConnections(nodeSVG, strokeMethod, textMethod, opacityMethod) {
        let page = d3.select(nodeSVG).attr("page");
        let connectedNodes = [];
        
        // Emphasize the links connected to this node
        let nodeLinks = this.getUpdateLinks(page);
        nodeLinks.forEach(function(link) {
            let tpage = d3.select(link).attr("tpage");
            
            // Save the nodes connected to this node
            if (tpage !== page) {
                connectedNodes.push(tpage);
            }
            else {
                let spage = d3.select(link).attr("spage");
                connectedNodes.push(spage);
            }
            
            strokeMethod(link);
        });
        
        // Emphasize the nodes connected to this node
        this.node.each(function(n) {
            let npage = d3.select(this).attr("page");
        
            let i = 0;
            let found = false;
            while (i < connectedNodes.length && !found) {
                if (npage === connectedNodes[i]) {
                    textMethod(this);
                    if (npage !== page) {
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
    animateSourceAndTarget(linkSVG, radiusMethod, textMethod, opacityMethod) {
        let tpage = d3.select(linkSVG).attr("tpage");
        let spage = d3.select(linkSVG).attr("spage");
        this.node.each(function(d) {
            if (d.id === tpage) {
                radiusMethod(this);
            }
            else if (d.id === spage) {
                textMethod(this);
                opacityMethod(this);
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    //POSITION METHODS
    ///////////////////////////////////////////////////////////////////////////

    tick() { 
        this.link.select("path").attr("d", this.drawCurve);
        this.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        
        // Update references to the node's position
        this.link.attr("tx", function(d) { return d.target.x; })
            .attr("ty", function(d) { return d.target.y; });
    }

    // Scales and pans the network as specified by the user
    redraw() {
        this.vis.attr("transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
    }

    // Centers a newly formed link on screen
    // linkObj - a NetworkNode object containing a link to center the view over
    centerLink(linkObj) {
        this.link.each((d) => {
            if (d.source.id === linkObj.source.nodeID && 
                    d.target.id === linkObj.target.nodeID) {
                    
                if (this.layout === this.FORCE_DIRECTED) {
                    // Center the view over the average position between the two nodes
                    // The node with more weight will move less after the link is added
                    // Weighting the average makes it more likely that the final view will show the link on screen
                    let totWeight = d.source.weight + d.target.weight;
                    let sw = d.source.weight / totWeight;
                    let tw = d.target.weight / totWeight;
                    let x = d.source.x*sw + d.target.x*tw;
                    let y = d.source.y*sw + d.target.y*tw;
                    this.centerNode(x, y);
                }
                else {
                    // The nodes are fixed in place in a rainbow graph layout
                    // Center the view over the target node
                    this.centerNode(d.target.x, d.target.y);
                }
            }
        });
    }

    // Centers a node on the screen
    // x1 - the x-position stored in the node's data
    // y1 - the y-position stored in the node's data
    centerNode(x1, y1) {
        // Get the width and height of the document
        let bodyWidth = d3.select(this.mapContainer).style("width");
        let bodyHeight = d3.select(this.mapContainer).style("height");
        bodyWidth = parseInt(bodyWidth.substring(0, bodyWidth.length - 2));
        bodyHeight = parseInt(bodyHeight.substring(0, bodyHeight.length - 2));
        
        let scale = d3.zoomTransform(this.svg).scale();
        //this.zoomListener.scale();
        
        // Center the node at 0 on the svg
        let x2 = (bodyWidth / 2 - x1);
        let y2 = (bodyHeight / 2 - y1);
        
        // Get the screen position of the node at the center of the svg
        let sPos = this.getScreenCoords(x1, y1, [x2, y2], scale);
        
        // Center the node on the display
        x2 = x2 + (bodyWidth / 2 - sPos[0]);
        y2 = y2 + (bodyHeight / 2 - sPos[1]);
        
        // Apply the transformation to the display
        let transform = d3.zoomTransform(this.svg);
        transform.scale(scale);
        transform.translate([x2, y2]);
        transform.translate(this.vis.transition().duration(750));

        /*this.zoomListener.scale(scale);
        this.zoomListener.translate([x2, y2]);
        this.zoomListener.event(this.vis.transition().duration(750));*/
    }

    // Returns the position of the center of a node on the screen
    // x - the x-position of a node on the svg
    // y - the y-position of a node on the svg
    // translate - the transformation required to center the node on the svg
    // scale - the current scale of the svg
    getScreenCoords(x, y, translate, scale) {
        const xn = translate[0] + x*scale;
        const yn = translate[1] + y*scale;
        
        return [xn, yn];
    }

    ///////////////////////////////////////////////////////////////////////////
    //NODE EVENT LISTENERS
    ///////////////////////////////////////////////////////////////////////////

    // Calls Python to send the user to the section corresponding to a clicked node
    clickNode(that) {    
        if (d3.event.defaultPrevented) {
            // Freeze the node position if the user is dragging a node
            d3.select(this).attr("fixed", function(d) { d.fixed = true; return d.fixed; });
            
            // Disallow navigation if the user is dragging a node or panning the view
            return;
        }
        
        // Get the first page number of the section from the node that was clicked
        const pageNum = d3.select(this).attr("page");

        // Open the page associated with this node
        that.props.history.push(`/page/${pageNum}`);
    }

    // Emphasize a node and its associated links on mouse hover
    mouseoverNode(that) {
        // Allow user to reposition the node on mouse drag
        that.zoomListening = false;
        that.setZoomListener();
        
        that.growRadiusWrapper(this);
        that.animateConnections(this, that.growStroke, that.setTextVisible, 
            that.makeNodeOpaque);
    }

    // Deemphasize a node and its associated links on mouse out
    mouseoutNode(that) {
        // Allow user to pan the view on mouse drag
        that.zoomListening = true;
        that.setZoomListener();
        
        that.shrinkRadiusWrapper(this);
        that.animateConnections(this, that.shrinkStroke, that.setTextDefault, 
            that.makeNodeTransparent);
    } 

    // Unfix a node's position on mouse double click
    dblclick(that) {
        // Disallow users from unfixing nodes in rainbow graph layout
        if (that.layout === that.FORCE_DIRECTED) {
            d3.select(this).attr("fixed", function(d) { d.fixed = false; return d.fixed; });
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    //LINK EVENT LISTENERS
    ///////////////////////////////////////////////////////////////////////////

    // Center the user's view on a link's target node on mouse click
    clickLink(that) {
        let tx = d3.select(this).attr("tx");
        let ty = d3.select(this).attr("ty");
        that.centerNode(tx, ty);
    }

    // Emphasize a link and its target node on mouse hover
    mouseoverLink(that) {
        that.growStroke(this);
        that.animateSourceAndTarget(this, that.growRadiusWrapper, 
            that.setTextVisible, that.makeNodeOpaque);
    }

    // Deemphasize a link and its target node on mouse out
    mouseoutLink(that) {
        that.shrinkStroke(this);
        that.animateSourceAndTarget(this, that.shrinkRadiusWrapper, 
            that.setTextDefault, that.makeNodeTransparent);
    }

    ///////////////////////////////////////////////////////////////////////////////
    //CONTROL SCHEME
    ///////////////////////////////////////////////////////////////////////////////
    
    // Sets the controls scheme based on the selected mode
    setZoomListener() {
        if (this.zoomListening) {
            this.addZoomListener();
        }
        else {
            this.removeZoomListener();
        }
    }
    
    // Sets the control scheme to positioning nodes
    removeZoomListener() {
        this.svg.on("mousedown.zoom", null);
        this.svg.on("mousemove.zoom", null);
        this.svg.on("dblclick.zoom", null);
        this.svg.on("touchstart.zoom", null);
        this.svg.on("MozMousePixelScroll.zoom", null);
        this.node.call(this.force.drag);
    }
    
    // Sets the control scheme to navigating nodes
    addZoomListener() {
        this.node.on('mousedown.drag', null);
        this.node.on('touchstart.drag', null);
        this.zoomListener(this.svg);
    }

    ///////////////////////////////////////////////////////////////////////////
    //MISCELLANEOUS
    ///////////////////////////////////////////////////////////////////////////

    // Color the links, titles, and nodes in the network based on the user's current state
    // currNode - The current node in the user's history
    colorNetwork(currNode) {
        let pageNum = currNode.pos;
        
        this.colorLinks(currNode);
        this.colorNodes(pageNum);
        this.applyTextOpacities();
        this.applyNodeOpacities();
        this.applyLinkOpacities();
    }

    // Returns a list of link svg elements associated with a node with id page
    // page - the id of a node
    getUpdateLinks(page) {
        var nodeLinks = [];
        this.link.each(function(d) {
            if (d.source.id === page || d.target.id === page) {
                nodeLinks.push(this);
            }
        });
        
        return nodeLinks;
    }

    ///////////////////////////////////////////////////////////////////////////
    //COMPONENT LIFECYCLE METHODS
    ///////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        this.drawMap();
    }

    render() {
        return <div id="map-wrapper"></div>
    }
}

export default Map;