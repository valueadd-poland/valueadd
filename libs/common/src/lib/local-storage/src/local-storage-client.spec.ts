import { EntityNotFoundError, NoEntityIdError } from './errors';
import { LocalStorageClient } from './local-storage-client';

class Person {
  hobby: string;
  id: string;
  name: string;
}

describe('LocalStorageClient', () => {
  const collection = 'Names';
  const testCollection: Person[] = [
    {
      id: '1',
      name: 'John',
      hobby: 'Games'
    },
    {
      id: '2',
      name: 'Mike',
      hobby: 'Math'
    },
    {
      id: '3',
      name: 'Jessica',
      hobby: 'Nails'
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(collection, JSON.stringify(testCollection));
  });

  describe('#get', () => {
    it('should return the entity with the given ID', async done => {
      const entity = await LocalStorageClient.get<Person>(collection, '1').toPromise();
      expect(entity).toEqual(testCollection[0]);
      done();
    });

    it('should throw an EntityNotFoundError', async done => {
      try {
        await LocalStorageClient.get<Person>(collection, '120').toPromise();
        fail('Expected error.');
      } catch (e) {
        expect(e instanceof EntityNotFoundError).toBeTruthy();
      }
      done();
    });
  });

  describe('#getAll', () => {
    it(`should return a collection with ${testCollection.length} entities`, async done => {
      const entities = await LocalStorageClient.getAll<Person>(collection).toPromise();
      expect(entities.length).toBe(testCollection.length);
      done();
    });
  });

  describe('#remove', () => {
    it(`should remove the entity from the given collection`, async done => {
      await LocalStorageClient.remove(collection, '1');
      const entities = await LocalStorageClient.getAll<Person>(collection).toPromise();
      const found = entities.find(e => e.id === '1');

      expect(found).toBeUndefined();
      expect(entities.length).toBe(testCollection.length - 1);
      done();
    });
  });

  describe('#save', () => {
    it('should save the entity in the given collection', async done => {
      const toSave: Person = {
        id: '4',
        name: 'James',
        hobby: 'Shooting'
      };
      await LocalStorageClient.save(collection, toSave);
      const entity = await LocalStorageClient.get<Person>(collection, '4').toPromise();
      const entities = await LocalStorageClient.getAll<Person>(collection).toPromise();

      expect(entity).toEqual(toSave);
      expect(entities.length).toBe(testCollection.length + 1);

      done();
    });

    it('should overwrite an existing entity', async done => {
      const toSave: Person = {
        id: '3',
        name: 'James',
        hobby: 'Shooting'
      };
      await LocalStorageClient.save(collection, toSave);
      const entity = await LocalStorageClient.get<Person>(collection, '3').toPromise();
      const entities = await LocalStorageClient.getAll<Person>(collection).toPromise();

      expect(entity).toEqual(toSave);
      expect(entities.length).toBe(testCollection.length);

      done();
    });

    it('should throw a NoEntityIdError', async done => {
      const toSave = {
        name: 'James'
      };

      try {
        await LocalStorageClient.save(collection, toSave as any);
        fail('Error expected.');
      } catch (e) {
        expect(e instanceof NoEntityIdError).toBeTruthy();
      }

      done();
    });
  });

  describe('#update', () => {
    it('should overwrite the given entity', async done => {
      const toSave: Person = {
        id: '3',
        name: 'James',
        hobby: 'Shooting'
      };
      await LocalStorageClient.update(collection, toSave);
      const entity = await LocalStorageClient.get<Person>(collection, '3').toPromise();
      const entities = await LocalStorageClient.getAll<Person>(collection).toPromise();

      expect(entity).toEqual(toSave);
      expect(entities.length).toBe(testCollection.length);

      done();
    });

    it('should merge the given object with an existing entity', async done => {
      const toSave: Partial<Person> = {
        id: '3',
        hobby: 'Shooting'
      };
      await LocalStorageClient.update(collection, toSave, true);
      const entity = await LocalStorageClient.get<Person>(collection, '3').toPromise();
      const entities = await LocalStorageClient.getAll<Person>(collection).toPromise();

      expect(entity).toEqual({
        id: '3',
        name: 'Jessica',
        hobby: 'Shooting'
      });
      expect(entities.length).toBe(testCollection.length);

      done();
    });

    it('should throw a NoEntityIdError', async done => {
      const toSave = {
        name: 'James'
      };

      try {
        await LocalStorageClient.update(collection, toSave as any);
        fail('Error expected.');
      } catch (e) {
        expect(e instanceof NoEntityIdError).toBeTruthy();
      }

      done();
    });

    it('should throw an EntityNotFoundError', async done => {
      const toSave: Person = {
        id: '4',
        name: 'James',
        hobby: 'Shooting'
      };

      try {
        await LocalStorageClient.update(collection, toSave);
        fail('Error expected.');
      } catch (e) {
        expect(e instanceof EntityNotFoundError).toBeTruthy();
      }

      done();
    });
  });
});
