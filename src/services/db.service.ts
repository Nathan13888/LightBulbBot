import Mongoose = require('mongoose');
import {getModelForClass, prop} from '@typegoose/typegoose';
import {Logger} from '../utils/logger';
import {Config} from '../config';

export namespace DB {
  let db: Mongoose.Connection;

  export class LogClass {
    @prop({required: true})
    time: Date;
    @prop({required: true})
    contents: string;
    @prop({required: true})
    version: string;
  }
  export class GuildConfigClass {
    @prop({required: true, unique: true})
    guildid: string;
    @prop({required: true})
    commands: number;
    @prop({required: true})
    alltimecommands: number;
    @prop({required: true})
    privilegedusers: Map<string, number>;
    @prop({required: true})
    commandchannels: Set<string>;
    @prop({required: true})
    announcements: string;
  }
  export class GlobalConfigClass {
    starts: number;
  }
  export const GuildConfig =
  export const Log = getModelForClass(LogClass, {
    existingMongoose: Mongoose,
    schemaOptions: {collection: 'logs'},
  });

  export function init() {
    // connect to MongoDB
    // TODO: log number of events found
    (async () => {
      try {
        Logger.log('Attempting to connect to DB');
        await Mongoose.connect(Config.DBURI, {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          serverSelectionTimeoutMS: 5000,
          dbName: 'LightBulb',
        }).catch((err) => console.log(err.reason));
      } catch (err) {
        Logger.log(err);
      }
    })();
    // db.once('open', () => {
    //   Logger.log('Connected to MongoDB');
    // });
    // db.on('error', (err) => {
    //   Logger.log(err);
    // }); Legacy from WCCBot
  }

  export async function DBLog(contents: string): Promise<boolean> {
    const log = new Log({
      time: new Date(),
      contents: contents,
      version: Config.getVersion(),
    } as LogClass);
    log.save((err) => {
      if (err) return false;
    });
    return true;
  }

  export function getStatus(): string {
    return 'Coming Soon';
  }

  export function disconnect() {
    if (!db) {
      return;
    }
    Mongoose.disconnect();
  }

}
