import { createSlice } from '@reduxjs/toolkit'


const tokenStore = createSlice({
    name: 'token',
    initialState: {
        value: { "access": null }
    },
    reducers: {
        setToken: (state, action) => {
            state.value.access = action.payload;
        },
    },
});


export const { setToken } = tokenStore.actions;
export default tokenStore.reducer;
