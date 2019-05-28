export class EntityNotFoundError extends Error {
  constructor(id: string, collection: string) {
    super(`Entity with id '${id}' not found in collection '${collection}.'`);
    this.name = 'EntityNotFoundError';
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}

export class NoEntityIdError extends Error {
  constructor() {
    super(`The entity must have an ID.`);
    this.name = 'NoEntityIdError';
    Object.setPrototypeOf(this, NoEntityIdError.prototype);
  }
}
