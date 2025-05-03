import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuickSort from "./pages/QuickSort";
import NotFound from "./pages/NotFound";
import UnionFind from "./pages/UnionFind";
import LLRBT from  "./pages/LLRBST";
import MergeSort from "./pages/MergeSort";
import HeapSort from "./pages/HeapSort";
import Dijkstras from "./pages/Dijkstras";
import Kruskal from "./pages/Kruskal";
import NQueens from "./pages/NQueens";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quicksort" element={<QuickSort />} />
          <Route path="/unionfind" element={<UnionFind />} />
          <Route path="/llrbt" element={<LLRBT />} />
          <Route path="/mergesort" element={<MergeSort />} />
          <Route path="/heapsort" element={<HeapSort />} />
          <Route path="/dijkstra" element={<Dijkstras />} />
          <Route path="/kruskal" element={<Kruskal />} />
          <Route path="/nqueens" element={<NQueens />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
