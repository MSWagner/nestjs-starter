import * as _ from 'lodash';
import * as moment from 'moment';
import uuidv4 from 'uuidv4';

import { Injectable } from '@nestjs/common';
import { getConnection, EntityManager } from 'typeorm';

import { fixtureTrees } from './fixtures';

export type REPLACE_TYPE = 'DATE' | 'UUID';

@Injectable()
export class TestService {
    connectionManager: EntityManager;

    constructor() {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('ERROR-TEST-UTILS-ONLY-FOR-TESTS');
        }

        this.connectionManager = getConnection().manager;
    }

    /**
     * Returns the order id
     * @param entityName The entity name of which you want to have the order from
     */
    getOrder(entityName) {
        return Object.keys(fixtureTrees).indexOf(entityName);
    }

    /**
     * Returns the entites of the database
     */
    async getEntities() {
        const entities = [];
        (await (await this.connectionManager.connection).entityMetadatas).forEach(
            x => entities.push({ name: x.name, tableName: x.tableName, order: this.getOrder(x.name) })
        );

        return entities;
    }

    /**
     * Cleans the database and reloads the entries
     */
    async reloadFixtures() {
        const entities = await this.getEntities();
        const entitiesWithFixtures = entities.filter(entity => Object.keys(fixtureTrees).indexOf(entity.name) !== -1);

        await this.cleanAll(entitiesWithFixtures);
        await this.loadAll(entitiesWithFixtures);
    }

    /**
     * Cleans all the entities
     */
    async cleanAll(entities) {
        try {
            for (const entity of entities.sort((a, b) => b.order - a.order)) {
                const repository = await this.connectionManager.getRepository(entity.name);

                await repository.query(`DELETE FROM "${entity.tableName}"`);
            }
        } catch (error) {
            throw new Error(`ERROR: Cleaning test db: ${error}`);
        }
    }

    /**
     * Insert the data from the src/test/fixtures folder
     */
    async loadAll(entities: any[]) {
        for (const entity of entities.sort((a, b) => a.order - b.order)) {

            try {
                const repository = await this.connectionManager.getRepository(entity.name);

                const items = fixtureTrees[entity.name];

                await repository
                    .createQueryBuilder(entity.name)
                    .insert()
                    .values(items)
                    .execute();
            } catch (error) {
                // Entity not included in the fixtures. But this should not be necessary!
                // throw new Error(`ERROR [TestUtils.loadAll()]: Loading fixtures on test db: ${error}`);
            }
        }
    }

    replaceUUIDs(object) {
        return this.replaceValues(object, ['UUID']);
    }

    replaceDates(object) {
        return this.replaceValues(object, ['DATE']);
    }

    replaceValues(object, types: REPLACE_TYPE[]) {
        if (_.isArray(object)) {
            object.forEach((arrayObject, index) => {

                const result = this.replaceValues(arrayObject, types);
                object[index] = result;
            });

            return object;
        }

        if (types.includes('DATE') && this.isDate(object)) {
            return 'DATE';
        }

        if (types.includes('UUID') && uuidv4.is(object)) {
            return 'UUID';
        }

        if (!_.isObject(object)) {
            return object;
        }

        const keys = _.keys(object);

        keys.forEach(key => {
            if (this.isObjectWithKeys(object[key])) {
                this.replaceValues(object[key], types);
            }

            if (types.includes('DATE') && this.isDate(object[key])) {
                object[key] = key;
            }

            if (types.includes('UUID') && uuidv4.is(object[key])) {
                object[key] = key;
            }
        });

        return object;
    }

    isObjectWithKeys(object) {
        const keysOfKey = _.keys(object);

        return (!_.isNil(object) && !_.isNil(keysOfKey) && keysOfKey.length > 0);
    }

    isDate(object) {
        if (_.isInteger(object)) { return false; }

        let date;
        if (!_.isObject(object)) {
            date = moment(object, 'YYYY-MM-DD hh:mm:ss.f');
        }

        if (_.isDate(object) || !_.isNil(date) && date.isValid() && date.year() >= 1970) {
            return true;
        }

        return false;
    }
}