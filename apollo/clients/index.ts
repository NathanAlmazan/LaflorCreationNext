import { gql } from "@apollo/client";

export interface Client {
    clientId: number;
    accountUid: string | null;
    clientName: string;
    clientContact: string;
}

export interface ClientVars {
    accountUid: string | null;
    clientName: string;
    clientContact: string;
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