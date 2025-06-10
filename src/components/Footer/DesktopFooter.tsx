export const DesktopFooter = () => {
  return (
    <footer className="hidden md:block bg-gray-800 text-gray-300">
      <div className="container mx-auto py-3">
        <div className="flex justify-between items-center">
          <p className="text-sm">DragAndDone</p>
          <div className="flex space-x-3">
            <a href="/about" className="text-sm hover:text-white transition-colors">About</a>
            <a href="/privacy" className="text-sm hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="text-sm hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 