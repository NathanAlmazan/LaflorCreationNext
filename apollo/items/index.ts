import { gql } from "@apollo/client";

export interface Discount {
    discCode: string,
    discAmount: number
}

export interface DiscountProps {
    allDiscount: Discount[];
}

export interface ItemByCodeProps {
  code: string;
}

export interface ItemsVars {
    itemCode: string;
    itemName: string;
    itemPrice: number;
    isAddon: boolean | null;
    itemImage: string | null;
    discountCode: string | null;
}

export interface Items {
    itemCode: string
    itemName: string
    itemPrice: number
    isAddon: boolean
    itemImage: string
    discountCode: string | null
    discount: Discount | null
}

export interface ItemsFindVars {
  addons: boolean | null;
}

export interface ItemsProps {
  allItems: Items[];
  itemByCode?: Items
}  

export const ALL_DISCOUNT = gql`
query AllDiscount {
    allDiscount {
      discCode
      discAmount
    }
  }
`

export const ALL_ITEMS = gql`
query AllItems($addons: Boolean) {
  allItems(addons: $addons) {
    itemCode
    itemName
    itemPrice
    isAddon
    itemImage
    discountCode
    discount {
      discAmount
    }
  }
}
`

export const CREATE_ITEM = gql`
mutation createItems($item: ItemsInput!) {
    createItems(item: $item) {
        itemCode
        itemName
        itemPrice
        isAddon
    }
  }
`

export const ITEM_BY_CODE = gql`
query ItemByCode($code: String!) {
  itemByCode(code: $code) {
    itemCode
    itemName
    itemPrice
    isAddon
    itemImage
    discountCode
    discount {
      discAmount
    }
  }
}
`

export const DELETE_ITEM = gql`
mutation DeleteItems($code: String!) {
  deleteItems(itemCode: $code) {
    itemCode
  }
}
`

export const CREATE_DISCOUNT = gql`
mutation CreateDiscount($discount:DiscountInput!) {
  createDiscount(discount: $discount) {
    discCode
    discAmount
  }
}
`

export const DELETE_DISCOUNT = gql`
mutation DeleteDiscount($discount: String!) {
  deleteDiscount(discCode: $discount) {
    discCode
    discAmount
  }
}
`