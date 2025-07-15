import { Pool } from 'pg';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

const getIpType = (): IpAddressTypes =>
  (process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true'
    ? IpAddressTypes.PRIVATE
    : IpAddressTypes.PUBLIC);

// No global pool variable. We will create a new pool for each request
// to ensure a fresh, authenticated connection in a serverless environment.

// Establishes a connection to the database pool
export const getDB = async () => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: getIpType(),
  });
  const pool = new Pool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    max: 5,
  });
  return pool;
};

