import React from 'react';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";

const SideTab = () => {
  return (
    <div className='text-2xl flex justify-between items-center p-2 gap-3'>
      <IoIosNotifications/>
      <div className='border-2 border-green-400 rounded-full h-9 w-9'>
        <img src="https://tse2.mm.bing.net/th?id=OIP.O8vv9O4Ku4HvFQyep-NXMAHaLG&pid=Api" alt="" className='rounded-full h-8 w-8 object-cover' />
      </div>
      <FaAngleDown/>
    </div>
  )
}

export default SideTab
