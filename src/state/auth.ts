import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  value?: {
    username: string,
    token?: string,
    password?: string
  }
}

const initialState = {} as AuthState

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsernameToken(state: AuthState, payload: PayloadAction<{
      username: string,
      token: string
    }>) {
      const { username, token } = payload.payload
      if (state.value == undefined) {
        state.value = {
          username,
          token
        }
      } else {
        state.value.username = username
        state.value.token = token
      }
    },
    setUsernamePassword(state: AuthState, payload: PayloadAction<{
      username: string,
      password: string,
    }>) {
      const { username, password } = payload.payload
      if (state.value == undefined) {
        state.value = {
          username,
          password
        }
      } else {
        state.value.username = username
        state.value.password = password
      }
    },
    logout(state: AuthState) {
      state.value = undefined
    }
  }
})

export const { setUsernameToken, setUsernamePassword, logout } = authSlice.actions

export default authSlice.reducer
