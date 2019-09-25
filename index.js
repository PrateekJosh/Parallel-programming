'use strict';

const bigtable = require('@google-cloud/bigtable');
const mathjs = require('mathjs');

const COLUMN_FAMILY_NAME = 'csv';
const COLUMN_NAME = 'MeasId';

const bigtableClient = bigtable();
const instance = bigtableClient.instance('gcp-eda-dev-instance');
const table = instance.table('mbr-table-50mil');

exports.insertBTRecord = (req, res) => {
  //const rowKey = event.key;
  let rowKey = "50000001";

  return Promise.resolve()
    .then(() => {
    	async function writeSimple() {
            const timestamp = new Date();
            const rowToInsert = {
              key: rowKey,
              data: {
                csv: {
                  MeasId: {
                    value: 'Meas50000001',
                    timestamp,
                  },
                  MemberId: {
                    value: 'Member500011',
                    timestamp,
                  },
                  SubMeasId: {
                    value: 'SubMeas3',
                    timestamp,
                  },
                },
              },
            };
          	console.log('starting...write')
            await table.insert(rowToInsert);
            console.log(`Successfully wrote row ${rowToInsert.key}`);
          	res.status(200).send(rowKey);
          }
       writeSimple();
	})
    .catch((error) => {
      if (error.name === 'PartialFailureError') {
        console.warn('Partial Error Detected');
        error.errors.forEach((error) => {
          console.error(error.message);
          
        });
        res.status(500).send(error.errors);
      } else {
        console.error('Something went wrong:', error);
        res.status(500).send(error);
      }
    });
};