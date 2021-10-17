import { cached } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';

import { useArrayMap } from 'ember-array-map-resource';
import { Resource } from 'ember-resources';
import { gql, useQuery } from 'glimmer-apollo';

import { PoolData } from './-base';

import type { DexData } from './-base';

export class UniswapData extends Resource implements DexData {
  poolsQuery = useQuery<GetPoolsQuery>(this, () => [GET_POOLS]);

  description = `
    This pool data is filtered:
      - must have at least 3 transactions in the last hour.
      - number of transactions in the last 24 hours must be greater than half the average for the week.
      - must have a full week's worth of transactions
      - overall volume is more than $10,000,000
  `;

  data = useArrayMap(this, {
    data: () => this.poolsQuery.data?.pools ?? [],
    map: (pool) => {
      let instance = new UniswapPool(pool);

      setOwner(instance, getOwner(this));

      return instance;
    },
  });

  @cached
  get sortedData() {
    let pools = this.data.records.filter(Boolean) as UniswapPool[];
    let sorted = pools
      .filter((data) => {
        let isNotNFT = data.pool.token0.name !== 'NFT';
        let hasRecentTransactions = Number(data.pool.poolHourData[0].txCount) > 2;
        let lastDayTransactions = Number(data.pool.poolDayData[1].txCount);
        let averagePerWeek = data.weekTransactions / 7;
        let minTransactions = averagePerWeek / 2;

        // the ratio of average over the week's transactions must be greater than half of
        // the expected average of one day (assuming equal distribution)
        let isNotOneShot = averagePerWeek / data.weekTransactions > 1 / 7 / 2;
        let hasSteadyTransactions = minTransactions < lastDayTransactions;

        return isNotNFT && hasRecentTransactions && hasSteadyTransactions && isNotOneShot;
      })
      .sort((a, b) => (b?.expectedIncome ?? 0) - (a?.expectedIncome ?? 0));

    return sorted as PoolData[];
  }

  get isLoading() {
    return this.poolsQuery.loading;
  }

  get viablePercent() {
    if (this.totalFetched) {
      return (this.length / this.totalFetched) * 100;
    }

    return 0;
  }

  get totalFetched() {
    return this.poolsQuery.data?.pools?.length || 0;
  }

  get length() {
    return this.sortedData.length;
  }
}

let BASE = 10_000;

export class UniswapPool extends PoolData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public pool: GetPoolsQuery['pools'][0]) {
    super();
  }

  get id() {
    return this.pool.id;
  }

  get name() {
    return `${this.pool.token0.symbol}/${this.pool.token1.symbol}`;
  }

  get rate() {
    let fee = Number(this.pool.feeTier);

    return fee / BASE;
  }

  get tvl() {
    return Number(this.pool.totalValueLockedUSD);
  }

  get weekTransactions() {
    return this.pool.poolDayData.reduce((sum, day) => {
      return Number(day.txCount) + sum;
    }, 0);
  }

  get weekVolume() {
    return this.pool.poolDayData.reduce((sum, day) => {
      return Number(day.volumeUSD) + sum;
    }, 0);
  }

  get volume() {
    if (this.inputs.weekAverage) {
      return this.weekVolume;
    }

    // day 0 is WIP
    return Number(this.pool.poolDayData[1].volumeUSD);
  }
}

type GetPoolsQuery = {
  __typename?: 'Query';
  pools: {
    __typename?: 'Pool';
    id: string;
    feeTier: string;
    txCount: string;
    totalValueLockedUSD: string;
    volumeUSD: string;
    token0: {
      name: string;
      symbol: string;
    };
    token1: {
      name: string;
      symbol: string;
    };
    poolHourData: {
      txCount: string;
    }[];
    poolDayData: {
      txCount: string;
      volumeUSD: string;
    }[];
  }[];
};

export const GET_POOLS = gql`
  query {
    pools(
      first: 400
      orderBy: volumeUSD
      orderDirection: desc
      where: { volumeUSD_gt: 10000000, liquidity_gt: 0 }
    ) {
      id
      feeTier
      totalValueLockedUSD
      volumeUSD
      liquidityProviderCount
      txCount

      token0 {
        name
        symbol
      }

      token1 {
        name
        symbol
      }

      poolHourData(first: 1, orderBy: periodStartUnix, orderDirection: desc) {
        txCount
        periodStartUnix
      }

      poolDayData(first: 7, orderBy: date, orderDirection: desc) {
        volumeUSD
        liquidity
        feesUSD
        tvlUSD
        txCount
      }
    }
  }
`;
