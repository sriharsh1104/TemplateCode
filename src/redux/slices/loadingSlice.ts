import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: undefined
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.loadingMessage = action.payload;
    },
    hideLoader: (state) => {
      state.isLoading = false;
      state.loadingMessage = undefined;
    }
  }
});

export const { showLoader, hideLoader } = loadingSlice.actions;

export const selectLoading = (state: RootState) => state.loading;

export default loadingSlice.reducer; 