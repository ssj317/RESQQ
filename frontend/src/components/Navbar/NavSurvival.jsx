import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo4.png";

const NavSurvival = () => {
  const navigate = useNavigate();

  return (
    <nav>
      <div className='flex flex-row items-center justify-between p-4 px-12 border-white h-20 '>
        <div 
          className='h-28 w-28 mt-12 relative hover:scale-105 transition-transform duration-300 cursor-pointer'
          onClick={() => navigate('/')}
        >
          <img 
            src={logo} 
            alt="ResQ Logo" 
            className='object-contain h-full w-full'
          />
        </div>
        
        <div className='text-white flex flex-row justify-between gap-4 mt-12 items-center'>
          <button 
            onClick={() => navigate('/signup')}
            className='border-2 border-blue-900/60 text-black bg-transparent hover:bg-blue-500/30 hover:scale-95 px-6 py-2 rounded-lg cursor-pointer transition-all duration-300 text-sm font-medium '
          >
            Sign Up
          </button>
          <button 
            onClick={() => navigate('/login')}
            className='border-2 border-blue-900/60 text-black bg-white/10 hover:bg-blue-500/30 hover:scale-95 px-6 py-2 rounded-lg cursor-pointer transition-all duration-300 text-sm font-medium'
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavSurvival;
