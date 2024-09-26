import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase.js";
import { useUserStore } from "../lib/userStore.js";

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,

    // Change the selected chat and check block status
    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        // Check if the current user is blocked by the other user
        if (user?.blocked?.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            });
        }

        // Check if the receiver is blocked by the current user
        else if (currentUser?.blocked?.includes(user.id)) {
            return set({
                chatId,
                user: user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            });
        }

        // If neither is blocked, allow the chat
        else {
            return set({
                chatId,
                user: user,
                isCurrentUserBlocked: false,  // Correctly set to false
                isReceiverBlocked: false,
            });
        }
    },

    // Toggle the receiver's blocked status
    changeBlock: () => {
        set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
    },
}));
