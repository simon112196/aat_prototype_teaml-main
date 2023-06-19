import { createSlice } from '@reduxjs/toolkit'


const userStore = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload;
        }
    },
});


export const { setUser } = userStore.actions;
export default userStore.reducer;
