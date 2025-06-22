export interface PredictionRecord {
  id: string;
  timestamp: number;
  prediction: 'up' | 'down';
  amount: number;
  startPrice: number;
  endPrice?: number;
  result?: 'win' | 'loss';
  payout?: number;
  txHash?: string;
}

class PredictionHistoryService {
  private readonly STORAGE_KEY = 'xrp_prediction_history';
  private readonly MAX_RECORDS = 100;

  addPrediction(prediction: Omit<PredictionRecord, 'id'>): PredictionRecord {
    const record: PredictionRecord = {
      ...prediction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    const history = this.getHistory();
    history.unshift(record);
    
    // Keep only latest records
    if (history.length > this.MAX_RECORDS) {
      history.splice(this.MAX_RECORDS);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    return record;
  }

  updatePredictionResult(id: string, endPrice: number, result: 'win' | 'loss', payout?: number): void {
    const history = this.getHistory();
    const index = history.findIndex(record => record.id === id);
    
    if (index !== -1) {
      history[index] = {
        ...history[index],
        endPrice,
        result,
        payout
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }
  }

  getHistory(): PredictionRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load prediction history:', error);
      return [];
    }
  }

  getStats() {
    const history = this.getHistory().filter(record => record.result);
    const totalPredictions = history.length;
    const wins = history.filter(record => record.result === 'win').length;
    const totalWagered = history.reduce((sum, record) => sum + record.amount, 0);
    const totalWinnings = history.reduce((sum, record) => sum + (record.payout || 0), 0);
    
    return {
      totalPredictions,
      wins,
      losses: totalPredictions - wins,
      winRate: totalPredictions > 0 ? (wins / totalPredictions) * 100 : 0,
      totalWagered,
      totalWinnings,
      netProfit: totalWinnings - totalWagered
    };
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const predictionHistory = new PredictionHistoryService();
