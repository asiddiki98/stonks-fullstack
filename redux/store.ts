import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

// Import all of the slicers you have created
import chatReducer from "./chatSlice";
import notificationReducer from "./notificationsSlice";

// This is where you add all of the different reducers you set up.
const rootReducer = combineReducers({
  chat: chatReducer,
  notification: notificationReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Add any middleware or enhancers here
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Export the wrapper object that Next.js App component can use
export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
