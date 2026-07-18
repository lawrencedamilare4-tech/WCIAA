// supabase/functions/_shared/agents/skills/place-prediction.ts
import { MsgExecuteContract } from '@injectivelabs/sdk-ts';
import type { AgentSkill } from '../types';

export const placePredictionSkill: AgentSkill = {
  name: 'place_prediction',
  async execute(context, agentResult) {
    // Construct a contract call to the prediction market
    const msg = MsgExecuteContract.fromJSON({
      contractAddress: PREDICTION_MARKET_ADDRESS,
      sender: context.userInjectiveAddress,
      msg: {
        place_bet: {
          match_id: context.matchId,
          prediction: agentResult.predictedOutcome,
          amount: agentResult.suggestedStake,
        },
      },
    });

    return { msgs: [msg], memo: 'WCIA 2.0 prediction' };
  },
};