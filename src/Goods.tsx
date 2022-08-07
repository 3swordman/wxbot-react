import { useState } from "react"
import styled from "styled-components"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"
import useMediaQuery from "@mui/material/useMediaQuery"
import useTheme from "@mui/material/styles/useTheme"

import { Good as GoodType } from "./constants"
import { useAppSelector, useAppDispatch } from "./store"
import { addGoods } from "./state/current-goods"

const GoodContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: 1fr 1fr;
  }
  ${({ theme }) => theme.breakpoints.up("xl")} {
    grid-template-columns: 1fr 1fr 1fr;
  }
  gap: 1em;
  margin: 1em;
`

const CardContainer = styled(Card)`
  display: flex;
  border-radius: 0.5em;
  cursor: pointer;
  transition: all 0.25s;
  &:hover {
    transform: translate(0.2em, 0.2em);
  }
`

const CardSecondaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  & > * + * {
    margin-top: 0.5em;
  }
`

const CardButtonContainer = styled.div`
  margin-top: auto;
  display: flex;
`

const SizedImage = styled.img`
  width: 100px;
  object-fit: contain;
  
  ${({ theme }) => theme.breakpoints.up("md")} {
    width: 200px;
  }
`
const LargerSizedImage = styled.img`
  width: 200px;
  object-fit: contain;
  
  ${({ theme }) => theme.breakpoints.up("md")} {
    width: 300px;
  }
`

const Images = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`

const FlexTypography = styled(Typography)`
  display: flex;
` as any

const RightTypography = styled(Typography)`
  display: block;
  color: #1976d2;
  margin-left: auto;
`

const DialogParagraph = styled.div`
  margin-bottom: 0.375em;
`

const DialogContentTextRoot = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.up("md")} {
    flex-direction: row;
  }
`

const DialogContentTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  & :nth-child(2) {
    &:before {
      content: "Description: "
    }
  }
`

const FullWidthTypography: any = styled(Typography)`
  &::after {
    visibility: hidden;
    display: block;
    content: "This is the internal implementation which is not right, but I can't find any other solutions";
    line-height: 0;
  }
`

export function Good({ good }: { good: GoodType }) {
  const { title, description, imageSrc, price } = good
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogValue, setDialogValue] = useState(1)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const smallDevice = useMediaQuery(theme.breakpoints.down("sm"))
  function addNewGoods(count: number) {
    dispatch(addGoods({
      good,
      count
    }))
  }
  return (
    <>
      <Dialog open={dialogOpen} fullScreen={smallDevice}>
        <DialogTitle>{title} imformation</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <DialogContentTextRoot>
              <DialogContentTextContainer>
                <DialogParagraph>Price: ${price}</DialogParagraph>
                {good.longDescription?.map(text => (
                  <DialogParagraph key={text}>{text}</DialogParagraph>
                )) ?? (
                  <DialogParagraph>{description}</DialogParagraph>
                )}
              </DialogContentTextContainer>
              <Images>
                {good.imageSrc.map(src => (
                  <LargerSizedImage src={src} alt={title} key={src} />
                ))}
              </Images>
            </DialogContentTextRoot>
          </DialogContentText>
          <TextField 
            autoFocus 
            label="The number of the good" 
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} 
            margin="normal" 
            value={dialogValue} 
            onChange={ev => {
              if (ev.target.value) {
                const num = parseInt(ev.target.value, 10)
                if (!Number.isNaN(num))
                  setDialogValue(num)
              } else {
                setDialogValue(0)
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>close</Button>
          <IconButton color="primary" aria-label="add to shopping cart" onClick={() => {
            addNewGoods(dialogValue)
            setDialogOpen(false)
          }}>
            <AddShoppingCartIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
      <CardContainer>
        <CardSecondaryContainer>
          <FlexTypography variant="h5" component="div">
            {title}
            <RightTypography variant="subtitle1">
              ${price}
            </RightTypography>
          </FlexTypography>
          <FullWidthTypography variant="subtitle1" color="text.secondary" component="div">
            {description}
          </FullWidthTypography>
          <CardButtonContainer>
            <Button onClick={() => setDialogOpen(true)}>
              Show imformation
            </Button>
            <IconButton color="primary" aria-label="add to shopping cart" onClick={() => {
              addNewGoods(1)
            }}>
              <AddShoppingCartIcon />
            </IconButton>
          </CardButtonContainer>
        </CardSecondaryContainer>
        <SizedImage src={imageSrc[0]} alt={title} />
      </CardContainer>
    </>
  )
}

export function Goods() {
  const goods = useAppSelector(state => state.goods.value)
  return (
    <>
      <GoodContainer>
        {goods.map(good => <Good good={good} key={good.title + good.id}></Good>)}
      </GoodContainer>
    </>
  )
}