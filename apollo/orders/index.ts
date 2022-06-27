import { gql } from "@apollo/client";
import { Discount, Items } from "../items";

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
    totalPrice: number;
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
    riderId: number;
    orderDetails: OrderDetails[];
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