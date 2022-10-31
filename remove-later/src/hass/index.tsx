import React, { FC, useEffect, useState, ReactElement } from 'react';
import {
  getAuth,
  createConnection,
  subscribeEntities,
  getAuthOptions as AuthOptions,
  Auth,
  ERR_HASS_HOST_REQUIRED,
  UnsubscribeFunc
} from 'home-assistant-js-websocket';
import { useHass } from '@hooks';

const BASE_URL = 'http://homeassistant.local:8123';


function getAuthOptions(): AuthOptions {
  return {
    hassUrl: BASE_URL,
    async loadTokens() {
      try {
        return JSON.parse(localStorage.hassTokens);
      } catch (e) {
        return undefined;
      }
    },
    saveTokens(tokens) {
      localStorage.hassTokens = JSON.stringify(tokens);
    }
  }
}

interface HassProps {
  children: ReactElement
}

export const Hass = ({
  children
}: HassProps): ReactElement => {
  const { setConnection, setEntities, ready } = useHass();
  let auth: Auth | null = null;

  useEffect(() => {
    let unsubscribe: UnsubscribeFunc | null = null;
    async function authenticate() {
      try {
        auth = await getAuth(getAuthOptions());
        if (auth.expired) {
          auth.refreshAccessToken();
        }
      } catch (e) {
        if (e === ERR_HASS_HOST_REQUIRED) {
          auth = await getAuth(getAuthOptions());
        } else {
          console.error(e);
          return;
        }
      }
      const connection = await createConnection({
        auth
      });
      // store the reference to the connection
      setConnection(connection);
      unsubscribe = subscribeEntities(connection, entities => {
        // store the latest updated entities
        setEntities(entities);
      });
      if (location.search.includes('auth_callback=1')) {
        history.replaceState(null, '', location.pathname);
      }
    }
    authenticate();

    if (unsubscribe !== null) {
      return () => unsubscribe();
    }
  }, []);

  return ready ? children : (<div>...loading</div>);
};