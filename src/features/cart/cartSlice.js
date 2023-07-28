import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import cartItems from "../../cartItems";
import axios from "axios";
// import { openModal } from "../modal/modalSlice";

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems : [],
    amount : 4,
    total: 0,
    isLoading: true,
};

// promise with then and catch : 
// export const getCartItems = createAsyncThunk('cart/getCartItems' , () => {
//     return fetch(url)
//     .then((resp) => resp.json())
//     .catch((err) => console.log(err));
// })

// Promise function with async and await :
export const getCartItems = createAsyncThunk('cart/getCartItems' , async (name, thunkAPI) => {
   try{
        // console.log(name);
        // console.log(thunkAPI);
        // console.log(thunkAPI.getState());
        // thunkAPI.dispatch(openModal());
        const resp = await axios(url);
        return resp.data;
   }
   catch(error){
        return thunkAPI.rejectWithValue('something went wrong')
   }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState,

    reducers:{
        clearCart: (state) => {
            state.cartItems = [];
            // return {cartItems : []}
        },

        removeItem : (state,action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
            // console.log(action);
            // console.log(action.payload);
        },

        increase : (state, action) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload.id)
            cartItem.amount = cartItem.amount + 1;
            // console.log( action.payload);
            // console.log(action.payload.id);
        }, 

        decrease : (state, action) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload.id)
            cartItem.amount = cartItem.amount - 1;
            // console.log(action);
        },

        calculateTotals : (state) => {
            let amount = 0;
            let total = 0;

            state.cartItems.forEach((item) => {
                amount += item.amount ;
                total += item.amount * item.price;
            });
            state.amount = amount;
            state.total = total;
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(getCartItems.pending , (state) => {
            state.isLoading = true;
        })

        .addCase(getCartItems.fulfilled ,  (state,action) => {
            // console.log(action);
            state.isLoading = false;
            state.cartItems = action.payload;
        })

        .addCase(getCartItems.rejected , (state, action) => {
            console.log(action);
            state.isLoading = false;
        })
    }

})

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;