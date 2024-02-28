import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { parseFeedbackScore } from './utils';
import type { IPolls } from './@types';

dotenv.config();

const app: Express = express();
app.use(cors<Request>());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

const scopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/gm, '\n'),
  scopes,
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID || '', serviceAccountAuth);

app
  .route('/spreadsheet')
  .get(async (_req: Request, res: Response) => {
    try {
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle['polls'];
      const rows = await sheet.getRows();
      const data: Omit<IPolls, 'index'>[] = [];
      rows.forEach(row => {
        data.push({
          name: row.get('name') || undefined,
          poll: row.get('poll'),
          coords: [
            parseFloat(row.get('lat').replaceAll(',', '.')),
            parseFloat(row.get('lng').replaceAll(',', '.')),
          ],
          address: row.get('address'),
          option1: row.get('option1'),
          option2: row.get('option2'),
          votes1: parseInt(row.get('votes1')) || 0,
          votes2: parseInt(row.get('votes2')) || 0,
        });
      });

      res.status(200).send(data);
    } catch (error: unknown) {
      res.status(500).send(error);
    }
  })
  .put(async (req: Request, res: Response) => {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle['polls'];
      const rows = await sheet.getRows();

      for (const key in req.body) {
        const value = key.replace(/[^\x00-\x7F]/g, '').trim();
        const [index, votes1, votes2] = value.split(' ', 3);
        const indexInt = parseInt(index);
        const votes1Int = parseInt(votes1);
        const votes2Int = parseInt(votes2);

        const rowsFilter = rows.filter(row => parseInt(row.get('index')) === indexInt);

        if (!rowsFilter || !rowsFilter.length) {
          res.status(404).send('Lixeira não encontrada!');
          return;
        } else {
          rowsFilter.forEach(async row => {
            row.set('votes1', votes1Int);
            row.set('votes2', votes2Int);

            await row.save();
          });
        }
      }

      res.status(200).send('Informação atualizada com sucesso!');
    } catch (error: unknown) {
      res.status(500).send(error);
    }
  });

app.post('/suggestion', async (req: Request, res: Response) => {
  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['suggestions'];
    await sheet.addRow(req.body);

    res.status(201).send('Sucesso!');
  } catch (error: unknown) {
    res.status(500).send(error);
  }
});

app.post('/feedback', async (req: Request, res: Response) => {
  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['feedbacks'];
    req.body.score = parseFeedbackScore(req.body.score);
    await sheet.addRow(req.body);

    res.status(201).send('Sucesso!');
  } catch (error: unknown) {
    res.status(500).send(error);
  }
});

app.listen(port, () => console.log(`[server]: Server is running on port ${port}`));
