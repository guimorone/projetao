import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { IPolls } from './@types';

dotenv.config();

const app: Express = express();
app.use(cors<Request>({ credentials: true }));
const port = process.env.PORT || 3000;

const scopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/gm, '\n'),
  scopes,
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID || '', serviceAccountAuth);

app.route('/spreadsheet').get(async (req: Request, res: Response) => {
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle['polls'];
  const rows = await sheet.getRows();
  const data: IPolls[] = [];
  rows.forEach(row => {
    data.push({
      name: row.get('name') || undefined,
      poll: row.get('poll'),
      coords: [parseFloat(row.get('lat').replaceAll(',', '.')), parseFloat(row.get('lng').replaceAll(',', '.'))],
      address: row.get('address'),
      option1: row.get('option1'),
      option2: row.get('option2'),
      votes1: parseInt(row.get('votes1')) || 0,
      votes2: parseInt(row.get('votes2')) || 0,
    });
  });

  res.status(200).send(data);
});

app.listen(port, () => console.log(`[server]: Server is running on port ${port}`));
