import { createSendMailAction } from './actions/send-mail.action';
import { listenToSendMail } from './listeners/send-mail.listener';
import { Messages } from './models/message';
import {
  CompositionRootFactory,
  CompositionRootFactoryParams,
  IModuleCompositionRoot,
} from '../../shared/composition-root';
import { createUserReadModel } from '../user/read-models/read-model.factory';

export const createMailCompositionRoot: CompositionRootFactory = ({
  dbDefinition,
  eventEmitter,
  translator,
  mailer,
  renderer,
  hasher,
  logger,
}: CompositionRootFactoryParams): IModuleCompositionRoot => {
  const { dbInstance, inMemoryDb } = dbDefinition;
  const sendMail = createSendMailAction(
    translator,
    renderer,
    mailer,
    createUserReadModel({ db: dbInstance, hasher, inMemoryDb }),
    Messages
  );

  return {
    routers: [],
    activeListeners: [listenToSendMail(eventEmitter, sendMail, logger)],
    cleanApp: async (): Promise<void> => {},
  };
};
