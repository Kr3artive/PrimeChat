import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isCreateGroupChatModalOpen, setIsCreateGroupChatModalOpen] = useState(false);

    const openCreateGroupChatModal = () => {
        setIsCreateGroupChatModalOpen(true);
    };

    const closeCreateGroupChatModal = () => {
        setIsCreateGroupChatModalOpen(false);
    }

    return (
        <ModalContext.Provider value={{ openCreateGroupChatModal, closeCreateGroupChatModal ,isCreateGroupChatModalOpen}}>
            { children }
        </ModalContext.Provider>
    )
}