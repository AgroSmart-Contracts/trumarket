import { ConnectOptions, Connection, connect } from 'mongoose';

export const connectDB = async (
  uri: string,
  options?: ConnectOptions,
): Promise<Connection> => {
  const db = await connect(uri, options);
  return db.connection;
};
