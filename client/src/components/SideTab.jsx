import React from 'react';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";

const SideTab = () => {
  return (
    <div className='text-2xl flex justify-between items-center p-2 gap-3'>
      <IoIosNotifications/>
      <div className='border-2 border-green-400 rounded-full h-9 w-9'>
        <img src="https://picsum.photos/200" alt="" />
      </div>
      <FaAngleDown/>
    </div>
  )
}

export default SideTab
