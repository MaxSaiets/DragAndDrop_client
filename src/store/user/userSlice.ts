import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../../types";
import { registerUserWithEmailAndPassFireBase, loginUserWithEmailAndPassFireBase } from "../../fireBase/authServices";
import { loginWithGoogleApi, loginWithGitHubApi, getOrsaveUserInDatabase } from "../../services/user"
import { checkUserAuth } from "../../fireBase/authServices"

interface UserState {
    user: IUser | null;
    status: {
        login: 'idle' | 'loading' | 'succeeded' | 'failed';
        fetch: 'idle' | 'loading' | 'succeeded' | 'failed';
    };
    error: string | null;
}

const initialState: UserState = {
    user: null,
    status: {
        login: 'idle',
        fetch: 'idle'
    },
    error: null,
}

export const registerUser = createAsyncThunk(
    'user/register',
    async(data: {email: string, password: string}, thunkAPI) => {
        try {
            const res = await registerUserWithEmailAndPassFireBase(data.email, data.password)
            if (!res || !res.email) throw new Error('No user data');
            localStorage.setItem('token', res.token)

            const userData = await getOrsaveUserInDatabase(res.email, res.token, res.userData);
            
            return userData;
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            return thunkAPI.rejectWithValue(error.response?.data?.message) || 'Failed to login user';
        }
    }
)
export const loginUser = createAsyncThunk(
    'user/login',
    async(data: {email: string, password: string}, thunkAPI) => {
        try {
            const res = await loginUserWithEmailAndPassFireBase(data.email, data.password)
            if (!res || !res.email) throw new Error('No user data');

            localStorage.setItem('token', res.token)
            const userData = await getOrsaveUserInDatabase(res.email, res.token, res.userData);
            
            return userData;
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            return thunkAPI.rejectWithValue(error.response?.data?.message) || 'Failed to login user';
        }
    }
)


export const loginWithGoogle = createAsyncThunk(
    'user/loginWithGoogle',
    async (_, thunkAPI) => {
        try {
            const res = await loginWithGoogleApi();
            
            if (!res || !res.email) throw new Error('No user data from Google');
            localStorage.setItem('token', res.token);
            
            const userData = await getOrsaveUserInDatabase(res.email, res.token, res.userData);
            
            return userData;
        } catch (err) {
            const error = err as { message?: string };
            return thunkAPI.rejectWithValue(error.message || 'Failed to login user');
        }
    }
);

export const loginWithGitHub = createAsyncThunk(
    'user/loginWithGitHub',
    async (_, thunkAPI) => {
        try {
            const res = await loginWithGitHubApi();
            if (!res || !res.email) throw new Error('No user data from GitHub');
            localStorage.setItem('token', res.token);

            const userData = await getOrsaveUserInDatabase(res.email, res.token, res.userData);
            
            return userData;
        } catch (err) {
            const error = err as { message?: string };
            return thunkAPI.rejectWithValue(error.message || 'Failed to login with GitHub');
        }
    }
);

export const checkAuth = createAsyncThunk<IUser, void, { rejectValue: string }>(
    'user/checkAuth',
    async (_, thunkAPI) => {
  
      try {
        const result = await checkUserAuth();

        if (!result) {
            throw new Error('No authenticated user found');
        }

        const { token, response } = result;
        const userData = response.user;

        localStorage.setItem('token', token);
        localStorage.setItem('role', userData.role);

        return userData;
      } catch (err) {
        const error = err as { message?: string };
        return thunkAPI.rejectWithValue(error.message || 'Auth check failed');
      }
    }
);

// async getUserFromDB(email, token, userData){
//     try {
//         const response = await getOrsaveUserInDatabase(email, token, userData);
        
//         localStorage.setItem('token', token);

//         this.setUser(response.user);
//         this.setIsAuth(true);
//     } catch (error){
//         throw error
//     }
// } 
  

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.status.login = 'idle';
            state.status.fetch = 'idle';
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status.login = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status.login = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status.login = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.status.login = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status.login = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status.login = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loginWithGoogle.pending, (state) => {
                state.status.login = 'loading';
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.status.login = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.status.login = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loginWithGitHub.pending, (state) => {
                state.status.login = 'loading';
                state.error = null;
            })
            .addCase(loginWithGitHub.fulfilled, (state, action) => {
                state.status.login = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginWithGitHub.rejected, (state, action) => {
                state.status.login = 'failed';
                state.error = action.payload as string;
            })
            .addCase(checkAuth.pending, (state) => {
                state.status.fetch = 'loading';
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.status.fetch = 'succeeded';
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.status.fetch = 'failed';
                state.user = null;
                state.error = action.payload as string;
            })
              

    }
})

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;