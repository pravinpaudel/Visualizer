import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuickSort from "./pages/QuickSort";
import NotFound from "./pages/NotFound";
import UnionFind from "./pages/UnionFind";
import LLRBT from  "./pages/LLRBST";
import MergeSort from "./pages/MergeSort";
import HeapSort from "./pages/HeapSort";
import Dijkstras from "./pages/Dijkstras";

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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
