import React from 'react';
import SearchBar from './SearchBar';
import SideTab from './SideTab';

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center px-10 py-3 sticky top-0'>
        <SearchBar/>
        <h1 className='text-green-500 text-xl font-mono'>PrimeChat</h1>
        <SideTab/>
    </nav>
  )
}

export default Navbar
