import { useState } from "react"
import { useTranslation } from "react-i18next"
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
import Chip from "@mui/material/Chip"

import { Good as GoodType } from "./constants"
import { useAppSelector, useAppDispatch } from "./store"
import { addGoods } from "./state/current-goods"
import { useGoods } from "./network"

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

const DialogContentCategoryList = styled.div`
  display: flex;
  margin-bottom: 0.5em;
  flex-wrap: wrap;
  & > * + * {
    margin-left: 0.5em;
  }
`

const DialogContentTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const DialogPrice = styled.div`
  margin-left: auto;
  color: #1976d2;
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
  const { t } = useTranslation()
  function addNewGoods(count: number) {
    dispatch(
      addGoods({
        good,
        count
      })
    )
  }
  return (
    <>
      <Dialog open={dialogOpen} fullScreen={smallDevice}>
        <DialogTitle>
          {title} {t("information")}
        </DialogTitle>
        <DialogContent>
          <DialogContentCategoryList>
            {good.category.map(value => (
              <Chip label={t(value)} key={value} />
            ))}
            <DialogPrice>${price}</DialogPrice>
          </DialogContentCategoryList>
          <DialogContentText component="div">
            <DialogContentTextRoot>
              <DialogContentTextContainer>
                {good.longDescription?.map(text => <DialogParagraph key={text}>{text}</DialogParagraph>) ?? (
                  <DialogParagraph>{description}</DialogParagraph>
                )}
              </DialogContentTextContainer>
            </DialogContentTextRoot>
          </DialogContentText>
          <TextField
            autoFocus
            label={t("Count")}
            type="number"
            margin="normal"
            value={dialogValue}
            onChange={ev => {
              if (ev.target.value) {
                const num = parseInt(ev.target.value, 10)
                if (!Number.isNaN(num) && num > 0) setDialogValue(num)
              } else {
                setDialogValue(0)
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t("close")}</Button>
          <IconButton
            color="primary"
            aria-label={t("add to shopping cart")}
            onClick={() => {
              addNewGoods(dialogValue)
              setDialogOpen(false)
            }}
          >
            <AddShoppingCartIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
      <CardContainer>
        <CardSecondaryContainer>
          <FlexTypography variant="h5" component="div">
            {title}
            <RightTypography variant="subtitle1">${price}</RightTypography>
          </FlexTypography>
          <FullWidthTypography variant="subtitle1" color="text.secondary" component="div">
            {description}
          </FullWidthTypography>
          <CardButtonContainer>
            <Button onClick={() => setDialogOpen(true)}>{t("Show information")}</Button>
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              onClick={() => {
                addNewGoods(1)
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </CardButtonContainer>
        </CardSecondaryContainer>
      </CardContainer>
    </>
  )
}

export function Goods() {
  const { data: goods } = useGoods()
  return (
    <>
      <GoodContainer>
        {goods!.map(good => (
          <Good good={good} key={good.title + good.id}></Good>
        ))}
      </GoodContainer>
    </>
  )
}
