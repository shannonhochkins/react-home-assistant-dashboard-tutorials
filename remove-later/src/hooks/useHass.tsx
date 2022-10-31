import create from 'zustand';
import {
  HassServiceTarget,
  callService,
  HassEntities,
  Connection,
} from "home-assistant-js-websocket";

const THROTTLE_TIMEOUT = 100;

type OnOffToggle = 'toggle' | 'turn_on' | 'turn_off';

interface CallService {
  domain: string;
  service: string;
  serviceData?: object;
  target: HassServiceTarget;
}

interface HassState {
  ready: boolean,
  entities: null | HassEntities;
  setEntities: (entities: HassEntities) => void;
  connection: Connection | null;
  setConnection: (connection: Connection) => void;
  callService: ({
    domain,
    service,
    serviceData,
    target
  }: CallService) => void;
}

let timer = null;
export const useHass = create<HassState>()((set, get) => ({
  connection: null,
  ready: false,
  entities: null,
  setEntities: entities => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      set(() => ({ entities, ready: true }))
    }, THROTTLE_TIMEOUT);
  },
  setConnection: connection => set(() => ({ connection })),
  callService: async ({
    domain,
    service,
    serviceData,
    target
  }) => {
    const { connection, ready } = get();
    if (connection && ready) {
      await callService(connection, domain, service, serviceData, target);
    }
  }
}));