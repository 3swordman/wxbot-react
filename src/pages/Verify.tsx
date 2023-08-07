import styled from "styled-components"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

import { setUsernameToken } from "../state/auth"
import { useAppDispatch, useAppSelector, saveData } from "../store"
import { getToken, verify } from "../network"

const VerifyRoot = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`

const NoneTransformButton = styled(Button)`
  text-transform: none;
`

const SpaceTypography = styled(Typography)`
  margin-top: 0.75em;
`

const VerifyContainer = styled.div`
  margin: auto;
  padding: 2em;
  ${({ theme }) => theme.breakpoints.up("md")} {
    border: 1px solid #c4c4c4;
    border-radius: 0.25em;
    padding: 3em;
    max-width: 40%;
    max-height: 50%;
  }
  display: flex;
  flex-direction: column;
`

const MonoSpaceTypography = styled(Typography)`
  font-family: monospace;
`

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 1em;
`

const RightButton = styled(NoneTransformButton)`
  margin-left: auto;
`

export default function Verify() {
  const navigate = useNavigate()
  const authData = useAppSelector(state => state.auth.value)!
  const [confirmText2, setConfirmText2] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    if (authData == undefined || authData.confirmText == undefined || authData.password == undefined) {
      navigate("/signup")
    }
  }, [])
  return (
    <VerifyRoot>
      <Snackbar 
        open={errorSnackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setErrorSnackbarOpen(false)} 
      >
        <Alert severity="error" onClose={() => setErrorSnackbarOpen(false)}>{t("Seems you didn't send it, please send the new message instead later")}</Alert>
      </Snackbar>
      <VerifyContainer>
        <Typography variant="h5">{t("Verify your Wechat account")}</Typography>
        <SpaceTypography variant="subtitle1">{t("For your safety, Store wants to make sure it's really you. Please send the following message to the Wechat group.")}</SpaceTypography>
        <MonoSpaceTypography variant="h6">&login {confirmText2 || authData.confirmText!}</MonoSpaceTypography>
        <ButtonGroup>
          <NoneTransformButton onClick={() => {
            navigate("/signup")
          }}>{t("Back")}</NoneTransformButton>
          <RightButton variant="contained" onClick={() => {
            ;(async () => {
              const { username, password } = authData
              const { success, confirmText } = await verify(username)
              if (!success) {
                setConfirmText2(confirmText)
                setErrorSnackbarOpen(true)
                return
              }
              const token = (await getToken(username, password!)).loginToken
              dispatch(setUsernameToken({
                username, 
                token
              }))
              await saveData({
                username, token
              })
              navigate("/")
            })()
          }}>{t("I've already sent")}</RightButton>
        </ButtonGroup>
      </VerifyContainer>
    </VerifyRoot>
  )
}