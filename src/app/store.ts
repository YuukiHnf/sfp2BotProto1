import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlicer from "../features/user/userSlicer";

export const store = configureStore({
  reducer: {
    user: userSlicer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
