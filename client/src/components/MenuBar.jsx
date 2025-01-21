import React from 'react';
import NewButton from './NewButton';
import { chats } from '../demo/chatdata';

const MenuBar = ({ children }) => {
  return (
    <div className='h-screen bg-green-300 flex gap-5 p-5'>
        <div className="bg-white rounded-xl w-2/5">
            <div className='flex justify-between m-4'>
                <h3 className='text-3xl'>My Chats</h3>
                <NewButton content={'New Group Chat'}/>
            </div>
            <ul className='bg-green-100 rounded-xl'>
                {chats.map((chat) => {
                    <li>{ chat.name }</li>
                })}
            </ul>
        </div>
        <div className="bg-white rounded-xl w-3/5 p-4">
            { children }
        </div>
    </div>
  )
}

export default MenuBar
