import create from 'zustand';
import {
  HassServiceTarget,
  callService,
  HassEntities,
  Connection
} from 'home-assistant-js-websocket';

interface CallService {
  domain: string;
  service: string;
  serviceData?: object;
  target: HassServiceTarget;
}
interface HassState {
  ready: boolean;
  entities: null | HassEntities;
  setEntities: (entities: HassEntities) => void;
  connection: null | Connection;
  setConnection: (connection: Connection) => void;
  callSwitch: (entity: string, service?: string, serviceData?: object) => void;
  callLight: (entity: string, service?: string, serviceData?: object) => void;
  callService: ({
    domain,
    service,
    serviceData,
    target
  }: CallService) => void;
}
const THROTTLE_TIMEOUT = 200;
let timer = null;
export const useHass = create<HassState>()((set, get) => ({
  connection: null,
  entities: null,
  ready: false,
  setEntities: entities => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      set(() => ({ entities, ready: true }));
    }, THROTTLE_TIMEOUT);
  },
  setConnection: (connection: Connection) => {
    set(() => ({ connection }));
  },
  callSwitch: async (entity, service = 'toggle', serviceData) => {
    const { callService } = get();
    callService({
      domain: 'switch',
      service,
      target: {
        entity_id: entity
      },
      serviceData
    });
  },
  callLight: async (entity, service = 'toggle', serviceData) => {
    const { callService } = get();
    callService({
      domain: 'light',
      service,
      target: {
        entity_id: entity
      },
      serviceData
    });
  },
  callService: async ({
    domain,
    service,
    serviceData,
    target
  }: CallService) => {
    const { connection, ready } = get();
    if (connection && ready) {
      await callService(connection, domain, service, serviceData, target);
    }
  }
}))