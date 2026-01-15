import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, className = '' }) {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
