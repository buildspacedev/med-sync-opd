import { configureStore } from "@reduxjs/toolkit";
import opdReducer from "./opdSlice";

export const store = configureStore({
  reducer: {
    opd: opdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
