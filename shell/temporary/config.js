'use strict';

module.exports = {
  dbModelLocation: 'models',
  dbConnectionConfig: {
    name: 'random2',
    port: '5432',
    user: 'random2',
    options: {
      dialect: 'postgres',
      host: '127.0.0.1',
      logging: false
    }
  }
};
