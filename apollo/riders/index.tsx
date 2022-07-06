 import { gql } from "@apollo/client";

 export interface Rider {
    riderId: number;
    accountUid: string;
    riderName: string;
    riderContact: string;
    riderCity: string;
    riderProvince: string;
    riderImage: string;
 }

 export interface RiderInput {
    riderId?: number;
    accountUid: string | null;
    riderName: string;
    riderContact: string;
    riderCity: string;
    riderProvince: string;
    riderImage: string | null;
 }

 export const CREATE_RIDER = gql`
 mutation CreateRider($rider: RiderInput!) {
    createRider(rider: $rider) {
        riderId
        accountUid
        riderName
        riderContact
        riderCity
        riderProvince
        riderImage
    }
  }
 `

 export const UPDATE_RIDER = gql`
 mutation UpdateRider($rider: RiderInput) {
    updateRider(rider: $rider) {
      riderId
      accountUid
      riderName
      riderContact
    }
  }
 `

 export const GET_ALL_RIDER = gql`
 query AllRiders {
    allRiders {
      riderId
      accountUid
      riderName
      riderContact
      riderCity
      riderProvince
      riderImage
    }
  }
 `

 export const DELETE_RIDER = gql`
 mutation DeleteRider($rider: Int!) {
    deleteRider(riderId: $rider) {
      riderId
      accountUid
      riderName
      riderContact
    }
  }
 `

 export const GET_RIDER_BY_AREA = gql`
 query RiderByArea($city: String!, $province: String!) {
  riderByArea(city: $city, province: $province) {
    riderId
    riderName
    riderContact
    riderImage
  }
}
 `

export const ASSIGN_ORDER = gql`
mutation SetOrderRider($rider: Int!, $order: String!) {
  setOrderRider(riderId: $rider, orderUid: $order) {
    orderUid
  }
}
`