import { gql } from "@apollo/client";

export interface Discount {
    discCode: string,
    discAmount: number
}

export interface DiscountProps {
    allDiscount: Discount[];
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
  

export const ALL_DISCOUNT = gql`
query AllDiscount {
    allDiscount {
      discCode
      discAmount
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