import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMilles: 5000
};

export const postProduct: APIGatewayProxyHandler = async event  => {
  const client = new Client(dbOptions);
  await client.connect();

  const { title, description, price, count } = JSON.parse(event.body);

  try {
    const newProduct = await client.query(`INSERT INTO products (title, description, price, count) VALUES (${title}, ${description}, ${price}, ${count})`);

    if (!newProduct) {
      throw new Error('Something went wrong')
    }
    
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify({ newProduct })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: `Product was not created`
      })
    }
  } finally {
    await client.end();
  }
}
