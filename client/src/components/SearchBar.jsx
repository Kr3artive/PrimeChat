import React from 'react';
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  return (
    <div className='flex items-center gap-2 h-10 px-2 border border-black rounded-full'>
      <CiSearch className='text-2xl'/>
      <input 
      type="text"
      placeholder='Search User'
      className='outline-none w-3/4'
      />
    </div>
  )
}

export default SearchBar
