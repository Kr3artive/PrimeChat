import React from 'react';
import SearchBar from './SearchBar';
import SideNavTab from './SideNavTab';

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center px-10 py-3 sticky top-0'>
        <SearchBar/>
        <h1 className='text-black text-2xl font-mono'>PrimeChat</h1>
        <SideNavTab/>
    </nav>
  )
}

export default Navbar
