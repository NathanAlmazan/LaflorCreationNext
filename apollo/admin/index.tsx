import { gql } from "@apollo/client";

export interface RankItemSales {
    itemCode: string;
    itemSales: number;
}

export const GET_ITEMS_SALES = gql`
query RankItemSales {
    rankItemSales {
      itemCode
      itemSales
    }
  }
`
export interface DailyOrders {
    deliveryDate: string;
    orderCount: number;
}

export const GET_DAILY_ORDERS = gql`
query DailyOrders {
    dailyOrders {
      deliveryDate
      orderCount
    }
  }
`

export interface RankProvinces {
    province: string;
    orderCount: number;
}

export const GET_PROVINCE_RANK = gql`
query RankProvinces {
    rankProvinces {
      province
      orderCount
    }
  }
`