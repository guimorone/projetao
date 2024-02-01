import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const scopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/gm, '\n'),
  scopes,
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID || '', serviceAccountAuth);

app.get('/spreadsheet', async (req: Request, res: Response) => {
  await doc.loadInfo();

  res.status(200).send(doc.title);
});

app.listen(port, () => console.log(`[server]: Server is running at http://localhost:${port}`));
