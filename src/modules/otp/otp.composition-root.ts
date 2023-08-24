import { Transaction } from 'kysely';

import { createGenerateOtpAction } from './actions/generate-otp.action';
import { createInvalidateOtpAction } from './actions/invalidate-otp.action';
import { listenToGenerateOtp } from './listeners/generate-otp.listener';
import { listenToInvalidateOtp } from './listeners/invalidate-otp.listener';
import { createOtpRepository } from './repositories/repository.factory';
import { DB } from '../../db/types';
import { now } from '../../shared/clock';
import {
  CompositionRootFactory,
  CompositionRootFactoryParams,
  IModuleCompositionRoot,
  createActionWithTx,
} from '../../shared/composition-root';
import { uuidGenerator } from '../../shared/uuid';

export const createOtpCompositionRoot: CompositionRootFactory = ({
  dbDefinition,
  eventEmitter,
  randomizer,
  logger,
}: CompositionRootFactoryParams): IModuleCompositionRoot => {
  const { dbInstance, inMemoryDb, coverTx } = dbDefinition;
  inMemoryDb.set('otp', new Map([]));

  const generateOtp = createActionWithTx(
    (db?: Transaction<DB>) =>
      createGenerateOtpAction(
        createOtpRepository({ db, inMemoryDb }),
        randomizer,
        eventEmitter,
        now,
        uuidGenerator
      ),
    coverTx
  );

  const invalidateOtp = createActionWithTx(
    (db?: Transaction<DB>) =>
      createInvalidateOtpAction(
        createOtpRepository({ db, inMemoryDb }),
        eventEmitter
      ),
    coverTx
  );

  return {
    routers: [],
    activeListeners: [
      listenToInvalidateOtp(eventEmitter, invalidateOtp, logger),
      listenToGenerateOtp(eventEmitter, generateOtp, logger),
    ],
    cleanApp: async (): Promise<void> => {
      dbInstance && (await dbInstance.deleteFrom('otp').execute());
    },
  };
};
