import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type SettingsTab = 'account' | 'security' | 'notifications' | 'help';

interface UiSettingsState {
  activeSettingsTab: SettingsTab;
}

const initialState: UiSettingsState = {
  activeSettingsTab: 'account',
};

export const uiSettingsSlice = createSlice({
  name: 'uiSettings',
  initialState,
  reducers: {
    setActiveSettingsTab: (state, action: PayloadAction<SettingsTab>) => {
      state.activeSettingsTab = action.payload;
    },
  },
});

export const { setActiveSettingsTab } = uiSettingsSlice.actions;

// Selectors
export const selectActiveSettingsTab = (state: RootState) => state.uiSettings.activeSettingsTab;

export default uiSettingsSlice.reducer; 