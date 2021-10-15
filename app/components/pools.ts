import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';

import { useArrayMap } from 'ember-array-map-resource';
import { gql, useQuery } from 'glimmer-apollo';

import type Inputs from 'liquidity-pools/services/inputs';

export default class Pools extends Component {
  poolsQuery = useQuery(this, () => [GET_POOLS]);

  @cached
  get poolData() {
    return (this.poolsQuery.data?.pools ?? []).filter((pool) => pool.token0.name !== 'NFT');
  }

  data = useArrayMap(this, {
    data: () => this.poolData,
    map: (pool) => {
      let instance = new Uniswap(pool);

      setOwner(instance, getOwner(this));

      return instance;
    },
  });

  get sortedData() {
    return this.data.records.sort((a, b) => b.expectedIncome - a.expectedIncome);
  }

  get length() {
    return this.data.length;
  }
}

let BASE = 10_000;

class Uniswap {
  @service declare inputs: Inputs;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public pool: any) {}

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
    // day 0 is WIP
    return parseFloat(this.pool.poolDayData[1].volumeUSD);
  }

  get expectedIncome() {
    let starting = this.inputs.startingValue || 0;
    let rateAsDecimal = this.rate / 100;

    return (starting / (starting + this.tvl)) * (rateAsDecimal * this.volume);
  }
}

export const GET_POOLS = gql`
  query {
    pools(first: 500, orderBy: volumeUSD, orderDirection: desc, where: { volumeUSD_gt: 1000 }) {
      id
      feeTier
      totalValueLockedUSD
      volumeUSD
      token0 {
        name
        symbol
      }
      token1 {
        name
        symbol
      }
      feeTier
      poolDayData(first: 2, orderBy: date, orderDirection: desc) {
        volumeUSD
        liquidity
        feesUSD
        tvlUSD
      }
    }
  }
`;
