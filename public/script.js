document.addEventListener('DOMContentLoaded', () => {
  const width = window.innerWidth * 0.7;  
  const height = window.innerHeight;     

  const svg = d3.select('#visualizer')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  let edgeLength = 50; 
  let nodeSize = 10; 


  function updateGraph() {
    const input = document.getElementById('input').value.trim();
    const lines = input.split('\n');
    const nodes = Array.from(new Set(lines.flatMap(line => line.split(',').map(id => id.trim())))).map(id => ({ id }));
    const links = lines.map(line => line.split(',').map(id => id.trim())).map(([source, target]) => ({ source, target }));

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(edgeLength))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    const node = svg.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', nodeSize)
      .attr('fill', 'steelblue')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    svg.selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('dx', 10)
      .attr('dy', '.35em')
      .text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      svg.selectAll('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }

  // Tree Visualization
  function visualizeTree() {
    const input = document.getElementById('input').value.trim();
    const lines = input.split('\n');
    
    // Prepare the nodes and links
    const nodes = Array.from(new Set(lines.flatMap(line => line.split(',').map(id => id.trim()))))
      .map(id => ({ id, label: id }));
    
    const links = lines.map(line => line.split(',').map(id => id.trim()))
      .map(([source, target]) => ({ source, target }));
    
    const rootNodeId = document.getElementById('tree-root').value.trim();
    
    // Validate the root node
    const rootNode = nodes.find(node => node.id === rootNodeId);
    if (!rootNode) {
      console.error('Root node not found:', rootNodeId);
      return; // Exit if the root node is not found
    }
  
    // Create a lookup to map nodes to their children
    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.id] = { id: node.id, children: [] };
    });
  
    // Build the tree structure
    links.forEach(link => {
      if (nodeMap[link.source] && nodeMap[link.target]) {
        nodeMap[link.source].children.push(nodeMap[link.target]);
      }
    });
  
    // Use d3.hierarchy to construct the root and tree layout
    const root = d3.hierarchy(nodeMap[rootNode.id]);
  
    // Set up the tree layout with adjusted size
    const treeLayout = d3.tree().size([height * 0.8, width * 0.6]); // Adjust size here
    treeLayout(root);
  
    svg.selectAll('*').remove(); // Clear previous visualization
  
    // Draw the links (edges)
    const link = svg.selectAll('line')
      .data(root.links())
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', '2px')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  
    // Draw the nodes (circles)
    const node = svg.selectAll('circle')
      .data(root.descendants())
      .enter().append('circle')
      .attr('r', nodeSize)
      .attr('fill', 'steelblue')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  
    // Add labels to the nodes
    svg.selectAll('text')
      .data(root.descendants())
      .enter().append('text')
      .attr('x', d => d.x + 10) // Adjust label position
      .attr('y', d => d.y + 5)  // Adjust label position
      .text(d => d.data.id);
  }
  
  

  // Topological Sort Visualization
  function visualizeTopologicalSort() {
    const input = document.getElementById('input').value.trim();
    const lines = input.split('\n');
    const nodes = Array.from(new Set(lines.flatMap(line => line.split(',').map(id => id.trim())))).map(id => ({ id }));
    const links = lines.map(line => line.split(',').map(id => id.trim())).map(([source, target]) => ({ source, target }));

    const inDegree = {};
    nodes.forEach(node => inDegree[node.id] = 0);
    links.forEach(link => inDegree[link.target]++);

    const queue = nodes.filter(node => inDegree[node.id] === 0);
    const sortedNodes = [];
    
    while (queue.length > 0) {
      const node = queue.shift();
      sortedNodes.push(node);
      links.filter(link => link.source === node.id).forEach(link => {
        inDegree[link.target]--;
        if (inDegree[link.target] === 0) {
          queue.push(nodes.find(n => n.id === link.target));
        }
      });
    }

    svg.selectAll('*').remove();

    const yScale = d3.scaleLinear()
      .domain([0, sortedNodes.length])
      .range([0, height]);

    const xScale = d3.scaleBand()
      .domain(sortedNodes.map(d => d.id))
      .range([0, width])
      .padding(0.1);

    svg.selectAll('rect')
      .data(sortedNodes)
      .enter().append('rect')
      .attr('x', d => xScale(d.id))
      .attr('y', d => yScale(sortedNodes.indexOf(d)))
      .attr('width', xScale.bandwidth())
      .attr('height', height / sortedNodes.length)
      .attr('fill', 'steelblue');

    svg.selectAll('text')
      .data(sortedNodes)
      .enter().append('text')
      .attr('x', d => xScale(d.id) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(sortedNodes.indexOf(d)) + height / sortedNodes.length / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text(d => d.id);
  }

  // Arc Visualization
  function visualizeArc() {
    const input = document.getElementById('input').value.trim();
    const lines = input.split('\n');
  
    // Prepare nodes and links
    const nodes = Array.from(new Set(lines.flatMap(line => line.split(',').map(id => id.trim()))))
      .map(id => ({ id, label: id }));
    const links = lines.map(line => line.split(',').map(id => id.trim()))
      .map(([source, target]) => ({ source, target }));
  
    svg.selectAll('*').remove(); // Clear previous visualization
  
    // Create a hierarchy for the tree layout
    const root = d3.hierarchy({ id: nodes[0].id, children: [] });
  
    // Build tree structure from links
    const buildTree = (node) => {
      const children = links.filter(link => link.source === node.id).map(link => ({
        id: link.target,
        children: []
      }));
      node.children = children;
      node.children.forEach(child => buildTree(child));
    };
    buildTree(root);
  
    // Set up the tree layout
    const treeLayout = d3.tree().size([height - 100, width - 100]); // Ensure enough width for the horizontal layout
    treeLayout(root);
  
    // Define a diagonal generator for curved links
    const diagonal = d3.linkHorizontal()
      .x(d => d.x)
      .y(d => d.y);
  
    // Draw the links (curved)
    svg.selectAll('path')
      .data(root.links())
      .enter().append('path')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', '2px')
      .attr('d', d => {
        return diagonal({ source: { x: d.source.x, y: d.source.y }, target: { x: d.target.x, y: d.target.y } });
      });
  
    // Draw the nodes
    svg.selectAll('circle')
      .data(root.descendants())
      .enter().append('circle')
      .attr('r', nodeSize)
      .attr('fill', 'steelblue')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  
    // Add labels to the nodes
    svg.selectAll('text')
      .data(root.descendants())
      .enter().append('text')
      .attr('x', d => d.x + 10)
      .attr('y', d => d.y)
      .attr('dy', '0.35em')
      .text(d => d.data.id);
  }
  
  // Event Listeners
  document.getElementById('random-btn').addEventListener('click', updateGraph);
  document.getElementById('tree-btn').addEventListener('click', visualizeTree);
  document.getElementById('topo-btn').addEventListener('click', visualizeTopologicalSort);
  document.getElementById('arc-btn').addEventListener('click', visualizeArc);

  // Update edge length and node size dynamically
  document.getElementById('edge-size').addEventListener('input', (e) => {
    edgeLength = +e.target.value;
    document.getElementById('edge-size-value').innerText = edgeLength;
  });

  document.getElementById('node-size').addEventListener('input', (e) => {
    nodeSize = +e.target.value;
    document.getElementById('node-size-value').innerText = nodeSize;
  });
});
