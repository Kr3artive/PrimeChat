import React from 'react';
import { IoAdd } from "react-icons/io5";

const NewButton = ({ content, onclick }) => {
  return (
    <button onClick={onclick} className='bg-green-100 hover:bg-green-200 rounded-lg h-10 flex items-center p-2 gap-1.5 transition-colors duration-200'>
        <span>{ content }</span>
        <IoAdd className='text-2xl'/>
    </button>
  )
}

export default NewButton
