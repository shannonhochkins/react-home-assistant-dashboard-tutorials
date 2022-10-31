import React, { FC, useEffect, useState, ReactElement } from 'react';
import {
  getAuth,
  createConnection,
  subscribeEntities,
  getAuthOptions as AuthOptions,
  Auth,
  ERR_HASS_HOST_REQUIRED,
  UnsubscribeFunc
} from 'home-assistant-js-websocket'

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

  let auth: Auth | null = null;
  const [ready, setReady] = useState(false);

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
      unsubscribe = subscribeEntities(connection, entities => console.log('entities', entities));
      setReady(true);
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