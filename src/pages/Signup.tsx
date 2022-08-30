import styled from "styled-components"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from '@mui/material/FormControlLabel'
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

import { setUsernamePasswordConfirmText } from "../state/auth"
import { useAppDispatch } from "../store"
import { getConfirmText } from "../network"

const SignupRoot = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`

const SignupContainer = styled.div`
  margin: auto;
  padding: 2em;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    border: 1px solid #c4c4c4;
    border-radius: 0.25em;
    padding: 3em;
  }
  display: flex;
  flex-direction: column;
`

const NoneTransformButton = styled(Button)`
  text-transform: none;
`

const PasswordList = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    flex-direction: row;
    & > * + * {
      margin-left: 1em;
    }
  }
`

const RightButton = styled(NoneTransformButton)`
  margin-left: auto;
`

const ButtonGroup = styled.div`
  margin-top: 1em;
  display: flex;
`

export default function Signup() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  return (
    <SignupRoot>
      <SignupContainer>
        <Typography variant="h5">{t("Create your star account")}</Typography>
        <TextField 
          label={t("Username")} 
          margin="normal" 
          size="small" 
          helperText={t("You can use letters, numbers & periods")} 
          autoComplete="username" 
          value={username} 
          autoFocus 
          error={usernameError}
          onChange={ev => {
            setUsername(ev.target.value)
          }} 
          onBlur={() => {
            setUsernameError(username == "")
          }}
        />
        <PasswordList>
          <TextField 
            label={t("Password")} 
            margin="normal" 
            size="small" 
            type={showPassword ? "text" : "password"} 
            autoComplete="new-password"
            value={password} 
            onChange={ev => {
              setPassword(ev.target.value)
            }} 
            onBlur={ev => {
              setPasswordError(password != confirmPassword && confirmPassword != "" || password == "")
            }}
            error={passwordError}
          />
          <TextField 
            label={t("Confirm")} 
            margin="normal" 
            size="small" 
            type={showPassword ? "text" : "password"} 
            autoComplete="new-password"
            value={confirmPassword} 
            onChange={ev => {
              setConfirmPassword(ev.target.value)
            }} 
            onBlur={ev => {
              if (password != confirmPassword || confirmPassword == "") {
                setPasswordError(true)
              } else {
                setPasswordError(false)
              }
            }}
            error={passwordError}
          />
        </PasswordList>
        <FormControlLabel 
          control={<Checkbox value={showPassword} 
          onChange={ev => setShowPassword(ev.target.checked)} />} 
          label={t("Show password")} 
        />
        <ButtonGroup>
          <NoneTransformButton onClick={() => {
            navigate("/login")
          }}>{t("Sign in instead")}</NoneTransformButton>
          <RightButton variant="contained" onClick={() => {
            if (password != confirmPassword || confirmPassword == "" || password == "" || username == "") {
              setPasswordError(true)
              return
            }
            if (username == "") {
              setUsernameError(true)
              return
            }
            setPasswordError(false)
            ;(async function () {
              const confirmText = await getConfirmText(username, password)
              if (confirmText == null) {
                setErrorSnackbarOpen(true)
                return
              }
              dispatch(setUsernamePasswordConfirmText({
                username,
                password,
                confirmText
              }))
              navigate("/verify")
            })()
          }}>{t("Next")}</RightButton>
        </ButtonGroup>
        <Snackbar 
          open={errorSnackbarOpen} 
          autoHideDuration={6000} 
          onClose={() => setErrorSnackbarOpen(false)} 
        >
          <Alert severity="error" onClose={() => setErrorSnackbarOpen(false)} >{t("Repeated username")}</Alert>
        </Snackbar>
      </SignupContainer>
    </SignupRoot>
  )
}