import { cached } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';

import { useArrayMap } from 'ember-array-map-resource';
import { Resource } from 'ember-resources';
import { gql, useQuery } from 'glimmer-apollo';

import { PoolData } from './-base';

export class UniswapData extends Resource {
  poolsQuery = useQuery<GetPoolsQuery>(this, () => [GET_POOLS]);

  @cached
  get poolData() {
    return (this.poolsQuery.data?.pools ?? []).filter(
      (pool) => pool.token0.name !== 'NFT' && parseInt(pool.poolHourData[0].txCount) > 2
    );
  }

  data = useArrayMap(this, {
    data: () => this.poolData,
    map: (pool) => {
      let instance = new UniswapPool(pool);

      setOwner(instance, getOwner(this));

      return instance;
    },
  });

  get sortedData() {
    let sorted = this.data.records.sort(
      (a, b) => (b?.expectedIncome ?? 0) - (a?.expectedIncome ?? 0)
    );

    return sorted;
  }

  get length() {
    return this.data.length;
  }
}

let BASE = 10_000;

export class UniswapPool extends PoolData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public pool: any) {
    super();
  }

  get id() {
    return this.pool.id;
  }

  get name() {
    return `${this.pool.token0.symbol}/${this.pool.token1.symbol}`;
  }

  get rate() {
    let fee = parseInt(this.pool.feeTier, 10);

    return fee / BASE;
  }

  get tvl() {
    return parseFloat(this.pool.totalValueLockedUSD);
  }

  get volume() {
    if (this.inputs.weekAverage) {
      return parseFloat(this.pool.volumeUSD);
    }

    // day 0 is WIP
    return parseFloat(this.pool.poolDayData[1].volumeUSD);
  }
}

type GetPoolsQuery = {
  __typename?: 'Query';
  pools: {
    __typename?: 'Pool';
    id: string;
    feeTier: string;
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
  }[];
};

export const GET_POOLS = gql`
  query {
    pools(
      first: 200
      orderBy: volumeUSD
      orderDirection: desc
      where: { volumeUSD_gt: 10000000, liquidity_gt: 0 }
    ) {
      id
      feeTier
      totalValueLockedUSD
      volumeUSD
      liquidityProviderCount

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

      poolDayData(first: 2, orderBy: date, orderDirection: desc) {
        volumeUSD
        liquidity
        feesUSD
        tvlUSD
      }
    }
  }
`;
