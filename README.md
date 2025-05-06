# Algorithm Visualizer

Algorithm Visualizer is a React-based web application that helps users understand and explore various algorithms and data structures through interactive visualizations. The project is built using Vite for fast development and includes a variety of algorithms categorized by their types, such as sorting, graph traversal, and data structures.

## Features

- **Interactive Visualizations**: Explore algorithms with step-by-step animations.
- **Search and Filter**: Search for algorithms by name or description and filter them by categories.
- **Algorithm Categories**:
  - Sorting (e.g., Quick Sort, Merge Sort, Heap Sort)
  - Graph Algorithms (e.g., BFS, DFS, Dijkstra's Algorithm)
  - Data Structures (e.g., Union-Find, Red-Black Tree, Hash Table)
  - Techniques (e.g., Dynamic Programming)
  - Backtracking (e.g., N-Queens Problem)
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pravinpaudel/visualizer.git
   cd visualizer
   ```
2. Install dependencies:
    ```
    npm install
    ```
3. Start the development server:
    ```
    npm run dev
    ```
4. Open the application in your browser at http://localhost:5173.

## Usage
1. Use the search bar to find algorithms by name or description.
2. Select a category from the sidebar to filter algorithms.
3. Click on an algorithm card to view its visualization and details.

## Project Structure
1. src/pages/Index.jsx: Main page that displays the list of algorithms and handles filtering and searching.
2. src/components: Contains reusable components such as algorithm cards and category filters.
3. src/assets: Icons and other static assets used in the application.

## Technologies Used
1. **React**: Frontend library for building the user interface.
2. **Vite**: Fast development environment and build tool.
3. **React Icons**: For displaying icons in the UI.
4. **CSS Modules**: For styling components.

## Future Enhancements
1. Add more algorithms and categories.
2. Include step-by-step explanations for each algorithm.
3. Add user customization options for visualization speed and themes.

## Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.