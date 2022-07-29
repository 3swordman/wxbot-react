import { useState } from "react"
import styled from "styled-components"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import IconButton from "@mui/material/IconButton"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"

import { Good as GoodType } from "./constants"
import { useAppSelector, useAppDispatch } from "./store"
import { addGoods } from "./state/current-goods"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"

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

const CardContentContainer = styled(CardContent)`
  flex: 1 0 auto;
`

const CardButtonContainer = styled.div`
  margin-top: auto;
  display: flex;
`

const SizedImage = styled.img`
  height: 100px;
  width: 100px;
  object-fit: contain;
  ${({ theme }) => theme.breakpoints.up("md")} {
    height: 200px;
    width: 200px;
  }
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


export function Good({ good }: { good: GoodType }) {
  const { title, description, imageSrc, price } = good
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogValue, setDialogValue] = useState(1)
  const dispatch = useAppDispatch()
  function addNewGoods(count: number) {
    dispatch(addGoods({
      good,
      count
    }))
  }
  return (
    <>
      <Dialog open={dialogOpen}>
        <DialogTitle>{title} imformation</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <DialogParagraph>Description: {description}</DialogParagraph>
            <DialogParagraph>Price: ${price}</DialogParagraph>
          </DialogContentText>
          <TextField 
            autoFocus 
            label="The number of the good" 
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} 
            margin="dense" 
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
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {description}
          </Typography>
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
        <SizedImage src={imageSrc}></SizedImage>
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