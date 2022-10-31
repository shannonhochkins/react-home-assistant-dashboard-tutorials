import { isEqual } from 'lodash';
import { useHass } from '@hooks';

export function useEntity(_entity: string) {
  const entity = useHass(state => state.entities[_entity], (oldEntity, newEntity) => isEqual(oldEntity, newEntity));
  if (!entity) {
    throw new Error(`Entity "${_entity}" does not exist`);
  }
  return entity;
}