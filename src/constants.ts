import { BN, BN_ONE } from "@polkadot/util";
import type { WeightV2 } from '@polkadot/types/interfaces'

export const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
export const PROOFSIZE = new BN(1_000_000);
export {WeightV2}