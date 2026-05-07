const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-12 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-300">&copy; {new Date().getFullYear()} Islamic Speakers Hub. All rights reserved.</p>
        <p className="text-sm mt-2 text-gray-400">Neutral and educational content platform.</p>
      </div>
    </footer>
  );
};

export default Footer;
