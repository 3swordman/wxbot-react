import { useState } from "react"
import styled from "styled-components"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"

import { setGoods } from "../state/current-goods"
import { useAppSelector, useAppDispatch } from "../store"
import { Good } from "../constants"

const CheckoutListRoot = styled(List)`
  display: flex;
  flex-direction: column;
`

const DetailRoot = styled.div`
  display: flex;
`

const PriceInfoContainer = styled.div`
  display: flex;
  margin-left: auto;
`

const PriceInfo = styled(Typography)`
  margin-top: auto;
  margin-bottom: auto;
`

const RightButton = styled(Button)`
  margin-left: 1em;
  margin-right: 1em;
  display: flex;
`

const DialogParagraph = styled.div`
  margin-bottom: 0.375em;
`

function CheckoutItem({ good, index, count }: { good: Good, index: number, count: number }) {
  // TODO: auto focus after the component rerendered
  const dispatch = useAppDispatch()
  return (
    <>
      {!!index && (
        <Divider component="li" />
      )}
      <ListItem>
        <ListItemText primary={good.title} secondary={"unit price: $" + good.price + ", total price: $" + good.price * count}></ListItemText>
        <TextField
          label="Count"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={count}
          onChange={ev => {
            if (ev.target.value) {
              const num = parseInt(ev.target.value, 10)
              if (!Number.isNaN(num))
                dispatch(setGoods({
                  good, 
                  count: num
                }))
            } else {
              dispatch(setGoods({
                good, 
                count: 0
              }))
            }
          }}
        />
      </ListItem>
    </>
  )
}

// function A({ good, count }: { good: Good, count: number }) {
//   const dispatch = useAppDispatch()
//   function setCount(count: number) {
//     dispatch(setGoods({
//       good, count
//     }))
//   }
//   return (
//     <TextField value={count} onChange={ev => {
//       setCount(parseInt(ev.target.value))
//     }} />
//   )
// }

export default function CheckoutList() {
  const currentGoods = useAppSelector(state => state.currentGoods.value)
  const totalPrice = currentGoods.reduce((totalPrice, [good, count]) => totalPrice + good.price * count, 0)
  const generatedText = Math.floor(Math.pow(36, 8) * Math.random()).toString(36)
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <Dialog open={dialogOpen}>
        <DialogTitle>generated text</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <DialogParagraph>generated text: {generatedText}</DialogParagraph>
            <DialogParagraph>send this to wechat group and you will spend the score buying these things</DialogParagraph>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>close</Button>
        </DialogActions>
      </Dialog>
      <CheckoutListRoot>
        {currentGoods.map(([good, count], index) => (
          <CheckoutItem key={good.title + good.id + count + index} good={good} index={index} count={count} />
        ))}
      </CheckoutListRoot>
      <DetailRoot>
        <PriceInfoContainer>
          <PriceInfo variant="h6">
            total price: ${totalPrice}
          </PriceInfo>
        </PriceInfoContainer>
        <RightButton variant="contained" onClick={() => setDialogOpen(true)}>view generated text</RightButton>
      </DetailRoot>
    </>
  )
}