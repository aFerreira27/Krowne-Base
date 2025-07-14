import { Pool } from 'pg';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

const getIpType = (): IpAddressTypes =>
  (process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true'
    ? IpAddressTypes.PRIVATE
    : IpAddressTypes.PUBLIC);

let pool: Pool;

// Establishes a connection to the database
export const getDB = async () => {
  if (pool) {
    return pool;
  }
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: getIpType(),
  });
  pool = new Pool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    max: 5,
  });
  return pool;
};
