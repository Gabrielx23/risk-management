import { Transaction } from 'kysely';

import { createActivateUserAction } from './actions/activate-user.action';
import { createApplyPasswordResetAction } from './actions/apply-password-reset.action';
import { createChangePasswordAction } from './actions/change-password.action';
import { createUserAction } from './actions/create-user.action';
import { createDeleteUserAction } from './actions/delete-user.action';
import { createGenerateActivationCodeAction } from './actions/generate-activation-code.action';
import { createResetPasswordAction } from './actions/reset-password.action';
import { createUpdateUserAction } from './actions/update-user.action';
import { createUserReadModel } from './read-models/read-model.factory';
import { createUserRepository } from './repositories/repository.factory';
import { createAccountActivationRouter } from './routers/account-activation.router';
import { createAccountRouter } from './routers/account.router';
import { createPasswordResetsRouter } from './routers/password-resets.router';
import { createUsersRouter } from './routers/users.router';
import { DB } from '../../db/types';
import { now } from '../../shared/clock';
import {
  CompositionRootFactory,
  CompositionRootFactoryParams,
  IModuleCompositionRoot,
  createActionWithTx,
} from '../../shared/composition-root';
import { roleMiddleware } from '../../shared/middleware/role.middleware';
import { uuidGenerator } from '../../shared/uuid';
import { createOtpReadModel } from '../otp/read-models/otp-read-model.factory';

export const createUserCompositionRoot: CompositionRootFactory = ({
  dbDefinition,
  eventEmitter,
  hasher,
  authMiddleware,
}: CompositionRootFactoryParams): IModuleCompositionRoot => {
  const { dbInstance, coverTx, inMemoryDb } = dbDefinition;
  inMemoryDb.set('users', new Map([]));
  inMemoryDb.set('userSettings', new Map([]));

  const userReadModel = createUserReadModel({ db: dbInstance, hasher });
  const otpReadModel = createOtpReadModel({ db: dbInstance, clock: now });
  const createUser = createActionWithTx(
    (db?: Transaction<DB>) =>
      createUserAction(
        createUserRepository({ db, inMemoryDb }),
        uuidGenerator,
        hasher,
        now,
        eventEmitter
      ),
    coverTx
  );
  const deleteUser = createActionWithTx(
    (db?: Transaction<DB>) =>
      createDeleteUserAction(
        createUserRepository({ db, inMemoryDb }),
        eventEmitter
      ),
    coverTx
  );
  const updateUser = createActionWithTx(
    (db?: Transaction<DB>) =>
      createUpdateUserAction(createUserRepository({ db, inMemoryDb }), now),
    coverTx
  );

  return {
    routers: [
      createAccountRouter({
        createUser,
        deleteUser,
        changePassword: createActionWithTx(
          (db?: Transaction<DB>) =>
            createChangePasswordAction(
              createUserRepository({ db, inMemoryDb }),
              eventEmitter,
              hasher,
              now
            ),
          coverTx
        ),
        updateUser,
        userReadModel,
        authMiddleware,
      }),

      createUsersRouter({
        updateUser,
        deleteUser,
        userReadModel,
        authMiddleware,
        roleMiddleware,
      }),

      createAccountActivationRouter({
        activateUser: createActionWithTx(
          (db?: Transaction<DB>) =>
            createActivateUserAction(
              createUserRepository({ db, inMemoryDb }),
              otpReadModel,
              eventEmitter,
              now
            ),
          coverTx
        ),
        generateActivationCode: createActionWithTx(
          (db?: Transaction<DB>) =>
            createGenerateActivationCodeAction(
              createUserRepository({ db, inMemoryDb }),
              otpReadModel,
              eventEmitter
            ),
          coverTx
        ),
      }),

      createPasswordResetsRouter({
        resetPassword: createActionWithTx(
          (db?: Transaction<DB>) =>
            createResetPasswordAction(
              createUserRepository({ db, inMemoryDb }),
              otpReadModel,
              eventEmitter
            ),
          coverTx
        ),
        applyPasswordReset: createActionWithTx(
          (db?: Transaction<DB>) =>
            createApplyPasswordResetAction(
              createUserRepository({ db, inMemoryDb }),
              otpReadModel,
              eventEmitter,
              hasher,
              now
            ),
          coverTx
        ),
      }),
    ],
    activeListeners: [],
    cleanApp: async (): Promise<void> => {
      dbInstance && (await dbInstance.deleteFrom('users').execute());
    },
  };
};
