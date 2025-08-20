# Graph Visualizer

A web-based interactive graph visualization tool built with D3.js that supports multiple layout algorithms and visualization styles.

## Features

- **Multiple Visualization Types:**
  - Random/Force-directed layout
  - Tree layout with customizable root node
  - Topological sort visualization
  - Arc/curved edge visualization

- **Interactive Controls:**
  - Adjustable edge length (10-100)
  - Customizable node size (5-30)
  - Drag-and-drop node positioning
  - Real-time parameter updates

- **Input Format:**
  - Simple comma-separated edge list format
  - One edge per line: `source,target`

## Installation

### Prerequisites
- Node.js (version 12 or higher)
- npm or yarn

### Setup
1. Clone or download the project files
2. Navigate to the project directory
3. Install dependencies (if any):
   ```bash
   npm install express
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Input Format
Enter your graph data in the textarea using the following format:
```
A,B
B,C
C,D
A,D
```

Each line represents an edge from the first node to the second node.

### Visualization Types

#### Random Layout
- Uses D3's force simulation
- Nodes repel each other and are pulled by edges
- Interactive dragging supported
- Good for exploring general graph structure

#### Tree Layout
- Hierarchical tree visualization
- Requires specifying a root node in the "Root Node" input field
- Nodes are arranged in levels based on distance from root
- Best for directed acyclic graphs (DAGs)

#### Topological Sort
- Shows nodes arranged in topological order
- Useful for dependency graphs and scheduling problems
- Displays nodes as rectangles in sorted order
- Only works with directed acyclic graphs

#### Arc Layout
- Tree layout with curved edges
- Provides a more organic, flowing appearance
- Uses D3's curve interpolation for smooth connections

### Controls

- **Edge Size Slider:** Adjusts the distance between connected nodes (10-100)
- **Node Size Slider:** Changes the radius of node circles (5-30)
- **Root Node Input:** Specify which node to use as root for tree visualizations
- **Visualization Buttons:** Switch between different layout algorithms

## File Structure

```
project/
├── public/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styling
│   └── script.js           # JavaScript logic
├── server.js               # Express server
└── README.md              # This file
```

## Technical Details

### Dependencies
- **D3.js v7:** Data visualization library
- **Express.js:** Web server framework

### Browser Compatibility
- Modern browsers supporting ES6+
- Chrome, Firefox, Safari, Edge

### Performance Notes
- Optimized for graphs with up to 100-200 nodes
- Force simulation may slow down with very large graphs
- Real-time updates on parameter changes

## Example Graphs

### Simple Tree
```
root,A
root,B
A,C
A,D
B,E
```

### Dependency Graph
```
start,task1
start,task2
task1,task3
task2,task3
task3,end
```

### Cyclic Graph
```
A,B
B,C
C,A
A,D
```

## Troubleshooting

### Common Issues

**Tree visualization not working:**
- Ensure you've specified a valid root node
- Check that the root node exists in your graph data
- Verify the graph is connected from the root

**Topological sort showing empty:**
- Make sure your graph is acyclic (no cycles)
- Check input format is correct

**Nodes not appearing:**
- Verify input format: one edge per line, comma-separated
- Check for extra spaces or special characters
- Ensure node names don't contain commas

### Performance Issues
- Reduce edge length for better performance with large graphs
- Consider simplifying complex graphs
- Try different visualization types for better results

## Contributing

Feel free to contribute improvements:
1. Add new visualization algorithms
2. Improve performance optimizations
3. Add export functionality
4. Enhance styling and UI

## License

Open source - feel free to modify and distribute.

## Future Enhancements

- [ ] Graph import/export functionality
- [ ] More layout algorithms (circular, hierarchical)
- [ ] Node and edge styling options
- [ ] Graph analysis tools (shortest path, centrality measures)
- [ ] Animation controls
- [ ] Save/load graph configurations
