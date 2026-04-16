export function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          {/* Main Footer Text */}
          <p className="text-slate-600 dark:text-gray-400 text-center">
            © 2025 VisaMate AI | Built for international students, by international students.
          </p>
          
          {/* Links */}
          <div className="flex gap-3 text-slate-500 dark:text-gray-500">
            
            
            <a 
              href="#" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a 
              href="#" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
