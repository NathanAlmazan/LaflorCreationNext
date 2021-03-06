import { gql } from "@apollo/client";
import { Orders } from "../orders";

export interface Account {
    uid: string;
    email: string;
}

export interface Client {
    clientId: number;
    accountUid: string | null;
    clientName: string;
    clientContact: string;
    clientOrders: Orders[];
    orderCount: number;
}

export interface Recipient {
    recipientId: number;
    recipientName: string;
    recipientContact: string;
    recipientStreet: string;
    recipientCity: string;
    recipientProvince: string;
    latitude: number;
    longitude: number;
}

export interface ClientVars {
    accountUid: string | null;
    clientName: string;
    clientContact: string;
}

export interface RecipientProps {
    clientRecipients: Recipient[];
}

export interface RecipientVars {
    id: string;
}

export const CREATE_CLIENT = gql`
mutation createClient($client: ClientInput!) {
    createClient(client: $client) {
        clientId
        accountUid
        clientName
        clientContact
    }
  }
`

export const CLIENT_RECIPIENTS = gql`
query ClientRecipients($id: String!) {
    clientRecipients(account: $id) {
        recipientId
        recipientName
        recipientContact
        recipientStreet
        recipientCity
        recipientProvince
        latitude
        longitude
    }
  }
`