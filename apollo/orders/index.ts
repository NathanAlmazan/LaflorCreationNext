import { gql } from "@apollo/client";
import { Client, Recipient } from "../clients";
import { Discount, Items } from "../items";
import { Rider } from "../riders";

export type OrderStatus = "CRT" | "PND" | "PAID" | "DSP" | "DLV";

export interface OrderInput {
    mop: string;
    status: OrderStatus;
    date: string;
    time: string;
    message: string;
    dNotes: string | null;
    fRemarks: string | null;
    clientAccount: string;
    riderId: number | null
}

export interface RecipientInput {
    recipientId?: number;
    recipientName: string;
    recipientContact: string;
    recipientStreet: string;
    recipientCity: string;
    recipientProvince: string;
    latitude: number | null;
    longitude: number | null;
}

export interface OrderDetailInput {
    orderUid: string;
    itemCode: string;
    quantity: number;
    discountCode: string | null;
}

export interface OrderDetails {
    orderUid: string;
    itemCode: string;
    quantity: number;
    discountCode: string;
    finalPrice: number;
    item: Items;
    discount: Discount;
}

export interface Orders {
    orderUid: string
    amount: number;
    mop: string;
    status: OrderStatus;
    date: string;
    time: string;
    message: string;
    dNotes: string
    fRemarks: string
    clientId: number;
    recipientId: number;
    recipient: Recipient;
    riderId: number;
    paymentId: string | null;
    orderDetails: OrderDetails[];
    client: Client;
    rider: Rider | null;
}

export interface GetOrderVars {
    orderUid: string;
}

export type PaymentType = "GCASH" | "GRAB_PAY" | "CARD";

export interface OrderPayment {
  sourceId: string;
  paymentId: string | null;
  callbackUrl: string;
  paymentDate: string | null;
}

export const CREATE_ORDER = gql`
mutation CreateOrder($recipient: RecipientInput!, $order: OrdersInput!) {
    createOrder(recipient: $recipient, order: $order) {
      orderUid
    }
}
`

export const CREATE_ORDER_DETAIL = gql`
mutation CreateOrder($details: [OrderDetailInput]!) {
    createOrderDetail(details: $details) {
      orderUid
    }
}
`

export const DELETE_ORDER = gql`
mutation DeleteOrder($orderUid: String!) {
  deleteOrder(orderUid: $orderUid) {
    orderUid
  }
}
`

export const GET_ORDER_BY_UID = gql`
query OrderById($orderUid: String!) {
    orderById(orderUid: $orderUid) {
      orderUid
      amount
      paymentId
      mop
      recipient {
        recipientName
        recipientStreet
        recipientCity
        recipientProvince
      }
      orderDetails {
        itemCode
        finalPrice
        quantity
        item {
          itemName
          itemImage
          isAddon
        }
      }
    }
  }
`

export const CONFIRM_PAYMENT = gql`
mutation ConfirmPayment($orderUid: String!) {
  confirmPayment(orderUid: $orderUid) {
    sourceId
    paymentId
  }
}
`

export const CREATE_PAYMENT = gql`
mutation CreatePayment($orderUid: [String]!, $type: PaymentType!) {
	createPayment(orderUid: $orderUid, paymentType: $type) {
    sourceId
    callbackUrl
  }
}
`
export interface CreatePaymentIntentVars {
  uid: string[];
  type: PaymentType;
}

export const CREATE_PAYMENT_INTENT = gql`
mutation CreatePaymentIntent($uid:[String]!, $type: PaymentType!) {
  createPaymentIntent(orderUid: $uid, paymentType: $type) {
    sourceId
    paymentId
    callbackUrl
    paymentDate
  }
}
`

export interface  CardPaymentInput {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvcNumber: number;
  paymentType: PaymentType;
}

export const PAY_WITH_CARD = gql`
mutation PayWithCard($uid:[String]!, $card: CardPaymentInput!) {
  payWithCard(orderUid: $uid, card: $card) {
    sourceId
    paymentId
    callbackUrl
    paymentDate
  }
}
`

export const GET_ORDER_COUNT = gql`
query ClientByAccount($uid: String!) {
  clientByAccount(uid: $uid) {
    orderCount
  }
}
`

export const GET_ORDER_BY_ACCOUNT = gql`
query ClientByAccount($uid: String!) {
  clientByAccount(uid: $uid) {
    clientName
    clientOrders {
      orderUid
      amount
      paymentId
      status
      mop
      recipient {
        recipientName
        recipientStreet
        recipientCity
        recipientProvince
      }
      orderDetails {
        itemCode
        finalPrice
        quantity
        item {
          itemName
          itemImage
          isAddon
        }
      }
    }
  }
}
`

export const GET_ALL_ORDERS = gql`
query AllOrders {
  allOrders {
    orderUid
    amount
    status
    date
    time
    mop
    fRemarks
    message
    dNotes
    client {
      clientName
      clientContact
    }
    recipient {
      recipientCity
      recipientProvince
      latitude
      longitude
    }
    orderDetails {
      quantity
      discountCode
      finalPrice
      item {
        itemName
        isAddon
      }
    }
    rider {
      riderName
      riderImage
      riderContact
    }
  }
}
`

export const SET_ORDER_DELIVERED = gql`
mutation SetOrderDelivered($uid: String!) {
  setOrderDelivered(orderUid: $uid) {
    orderUid
  }
}
`