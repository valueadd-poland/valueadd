import { Observable, of } from 'rxjs';
import { EntityNotFoundError, NoEntityIdError } from './errors';

export class LocalStorageClient {
  /**
   * Get the entity from the collection by ID.
   * @param {string} collection The name of the collection in which to search for the entity.
   * @param {string | number} id Entity ID.
   * @throws {EntityNotFoundError}
   */
  static get<T extends { id: string | number }>(
    collection: string,
    id: string | number
  ): Observable<T> {
    const entities = LocalStorageClient.getCollection(collection);
    const found = entities.find(entity => entity.id === id);

    if (!found) {
      throw new EntityNotFoundError(id, collection);
    }

    return of(found);
  }

  /**
   * Get all entities from a given collection.
   * @param {string} collection The name of the collection from which to fetch all entities.
   */
  static getAll<T extends { id: string | number }>(collection: string): Observable<T[]> {
    return of(LocalStorageClient.getCollection(collection));
  }

  /**
   * Remove the entity from the given collection by ID.
   * @param {string} collection The name of the collection from which to remove the entity.
   * @param {string | number} id Entity ID.
   */
  static remove(collection: string, id: string | number): Observable<null> {
    const entities = LocalStorageClient.getCollection(collection);
    LocalStorageClient.setCollection(collection, entities.filter(entity => entity.id !== id));

    return of(null);
  }

  /**
   * Save an entity in a given collection. If an entity exists it will be overwritten.
   * @param {string} collection The name of the collection in which to save the entity.
   * @param {T} entity Entity to save.
   * @throws {NoEntityIdError}
   */
  static save<T extends { id: string | number }>(collection: string, entity: T): Observable<T> {
    if (!entity.id) {
      throw new NoEntityIdError();
    }

    const entities = LocalStorageClient.getCollection<T>(collection);

    if (entities.find(e => e.id === entity.id)) {
      return this.update<T>(collection, entity);
    }

    LocalStorageClient.setCollection(collection, entities.concat(entity));

    return of(entity);
  }

  /**
   * Update the entity in the collection.
   * @param {string} collection The name of the collection in which to update the entity.
   * @param {T} entity The entity object to be updated.
   * @param {boolean} [merge=false] Defines whether a given entity should be merged to an existing entity record.
   * @throws {NoEntityIdError}
   * @throws {EntityNotFoundError}
   */
  static update<T extends { id: string | number }>(
    collection: string,
    entity: Partial<T>,
    merge = false
  ): Observable<T> {
    if (!entity.id) {
      throw new NoEntityIdError();
    }

    const entities = LocalStorageClient.getCollection(collection);
    const index = entities.findIndex(e => e.id === entity.id);

    if (index === -1) {
      throw new EntityNotFoundError(entity.id, collection);
    }

    entities[index] = merge
      ? {
          ...entities[index],
          ...entity
        }
      : entity;

    LocalStorageClient.setCollection(collection, entities);

    return of(entities[index]);
  }

  private static getCollection<T = any>(collection: string): T[] {
    return JSON.parse(localStorage.getItem(collection) || '[]');
  }

  private static setCollection(collection: string, value: any): void {
    localStorage.setItem(collection, JSON.stringify(value));
  }
}
