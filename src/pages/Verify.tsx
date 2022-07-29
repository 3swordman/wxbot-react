import styled from "styled-components"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

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
  ${({ theme }) => theme.breakpoints.up("sm")} {
    border: 1px solid #c4c4c4;
    border-radius: 0.25em;
    padding: 3em;
    padding-right: 15em;
    max-width: 50%;
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
  const [verifyString, setVerifyString] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    setVerifyString(Math.floor(Math.pow(36, 8) * Math.random()).toString(36))
  }, [])
  return (
    <VerifyRoot>
      <VerifyContainer>
        <Typography variant="h5">Verify your Wechat account</Typography>
        <SpaceTypography variant="subtitle1">For your safety, Store wants to make sure it's really you. Please send the following message to the Wechat group.</SpaceTypography>
        <MonoSpaceTypography variant="h6">verify-wechat-{verifyString}</MonoSpaceTypography>
        <ButtonGroup>
          <NoneTransformButton onClick={() => {
            navigate("/signup")
          }}>Back</NoneTransformButton>
          <RightButton variant="contained" onClick={() => {
            navigate("/")
          }}>I've already sent</RightButton>
        </ButtonGroup>
      </VerifyContainer>
    </VerifyRoot>
  )
}