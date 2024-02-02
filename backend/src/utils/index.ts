import type { IFeedbacks } from '../@types';

export const parseFeedbackScore = (score: IFeedbacks['score']): string => {
  switch (score) {
    case 'veryBad':
      return 'Muito Ruim';
    case 'bad':
      return 'Ruim';
    case 'neutral':
      return 'Neutro';
    case 'good':
      return 'Bom';
    case 'veryGood':
      return 'Muito Bom';
    default:
      return score || '';
  }
};
