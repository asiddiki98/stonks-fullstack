import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface NotificationsState {
  notifications: any[];
}

const initialState: NotificationsState = {
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<any>) => {
      state.notifications.push(action.payload);
    },
  },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
