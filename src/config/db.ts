import { exit } from 'node:process';

import colors from 'colors';
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL!);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.cyan.bold(`MongoDB connected on: ${url}`));
  } catch (error) {
    console.log(colors.red.bold('Error al conectar a MongoDB'));

    exit(1);
  }
};
