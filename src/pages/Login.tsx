import styled from "styled-components"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { useNavigate } from "react-router-dom"
import HCaptcha from "@hcaptcha/react-hcaptcha"

import { setUsernameToken } from "../state/auth"
import { useAppDispatch, useAppSelector, saveData } from "../store"
import { getToken } from "../network"

const LoginRoot = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`

const LoginContainer = styled.div`
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

const CenterTitle = styled(Typography)`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0.25em;
`

const NoneTransformButton = styled(Button)`
  text-transform: none;
`

const ForgotPasswordButton = styled(NoneTransformButton)`
  margin-right: auto;
`

const LoginButton = styled(NoneTransformButton)`
  margin-left: 4em;
  ${({ theme }) => theme.breakpoints.up("md")} {
    margin-left: 8em;
  }
`

const ButtonGroup = styled.div`
  display: flex;
`

export default function () {
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState(false)
  const [usernameHelperText, setUsernameHelperText] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [passwordHelperText, setPasswordHelperText] = useState("")
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authData = useAppSelector(state => state.auth.value)
  const logged = !!(authData && authData.token)
  const { t } = useTranslation()
  useEffect(() => {
    if (logged) {
      navigate(-1)
    }
  }, [logged])
  return (
    <LoginRoot>
      <LoginContainer>
        <CenterTitle variant="h5">{t("Sign in")}</CenterTitle>
        <CenterTitle variant="subtitle1">{t("Use your star account")}</CenterTitle>
        <TextField 
          autoComplete="username" 
          label={t("Username")}
          autoFocus 
          value={username} 
          onChange={ev => setUsername(ev.target.value)} 
          margin="normal"
          fullWidth
          error={usernameError}
          helperText={usernameHelperText}
        />
        <TextField 
          autoComplete="password"
          label={t("Password")}
          type="password"
          value={password} 
          onChange={ev => setPassword(ev.target.value)} 
          margin="dense"
          fullWidth
          error={passwordError}
          helperText={passwordHelperText}
        />
        <HCaptcha sitekey="5bf5fabf-a96e-4cd5-bb39-d5a96cf64ec6" onVerify={token => {
          setCaptchaToken(token)
          console.log(token)
        }}></HCaptcha>
        <ForgotPasswordButton size="small">{t("Forgot password?")}</ForgotPasswordButton>
        <ButtonGroup>
          <NoneTransformButton onClick={() => {
            navigate("/signup")
          }}>{t("Create account")}</NoneTransformButton>
          <LoginButton variant="contained" onClick={() => {
            let allSuccess = true
            if (username == "") {
              setUsernameError(true)
              setUsernameHelperText(t("This can't be blank"))
              allSuccess = false
            }
            if (password == "") {
              setPasswordError(true)
              setPasswordHelperText(t("This can't be blank"))
              allSuccess = false
            }
            if (!allSuccess)
              return
            ;(async () => {
              const responseData = await getToken(username, password)
              if (!responseData.success) {
                setErrorSnackbarOpen(true)
                return
              }
              const token = responseData.loginToken
              dispatch(setUsernameToken({
                username, token
              }))
              await saveData({
                username, token
              })
              navigate("/")
            })()
          }}>{t("Next")}</LoginButton>
        </ButtonGroup>
        <Snackbar 
          open={errorSnackbarOpen} 
          autoHideDuration={6000} 
          onClose={() => setErrorSnackbarOpen(false)} 
        >
          <Alert severity="error" onClose={() => setErrorSnackbarOpen(false)} >{t("Wrong username or password")}</Alert>
        </Snackbar>
      </LoginContainer>
    </LoginRoot>
  )
}
