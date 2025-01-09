import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-5 flex justify-between items-center px-8">
      <div className="text-left">
        <strong>FindOJob</strong> &copy; 2024. All rights reserved.
      </div>
      <div className="flex space-x-4">
        <a href="#" className="hover:opacity-75">
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
            alt="Facebook"
            width="24"
            height="24"
            className="filter grayscale"
          />
        </a>
        <a href="#" className="hover:opacity-75">
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
            alt="Twitter"
            width="24"
            height="24"
            className="filter grayscale"
          />
        </a>
        <a href="#" className="hover:opacity-75">
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
            alt="LinkedIn"
            width="24"
            height="24"
            className="filter grayscale"
          />
        </a>
        <a href="#" className="hover:opacity-75">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
            alt="Instagram"
            width="24"
            height="24"
            className="filter grayscale"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
