import { getOwner } from '@ember/application';
import Route from '@ember/routing/route';

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setClient } from 'glimmer-apollo';

import type ApplicationInstance from '@ember/application/instance';

export default class ApplicationRoute extends Route {
  beforeModel() {
    setupUniswap(getOwner(this));
  }
}

// https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3
const ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

export function setupUniswap(context: ApplicationInstance) {
  // HTTP connection to the API
  const httpLink = createHttpLink({
    uri: ENDPOINT,
  });

  // Cache implementation
  const cache = new InMemoryCache();

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });

  // Set default apollo client for Glimmer Apollo
  setClient(context, apolloClient);
}
