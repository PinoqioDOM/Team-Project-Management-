const Footer = () => {
  return (
    <footer className="bg-black border-t border-slate-800 px-4 py-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-purple-400 font-bold text-lg">OctariNox</span>
            <span className="text-slate-400 text-sm">© 2024 All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
