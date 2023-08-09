import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  value?: {
    username: string
    token?: string
    password?: string
    confirmText?: string
  }
}

const initialState = {} as AuthState

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsernameToken(
      state: AuthState,
      payload: PayloadAction<{
        username: string
        token: string
      }>
    ) {
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
    setUsernamePasswordConfirmText(
      state: AuthState,
      payload: PayloadAction<{
        username: string
        password: string
        confirmText: string
      }>
    ) {
      const { username, password, confirmText } = payload.payload
      if (state.value == undefined) {
        state.value = {
          username,
          password,
          confirmText
        }
      } else {
        state.value.username = username
        state.value.password = password
        state.value.confirmText = confirmText
      }
    },
    logout(state: AuthState) {
      state.value = undefined
    }
  }
})

export const { setUsernameToken, setUsernamePasswordConfirmText, logout } = authSlice.actions

export default authSlice.reducer
