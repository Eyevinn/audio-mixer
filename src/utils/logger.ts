export enum Colors {
  black = '30',
  red = '31',
  green = '32',
  yellow = '33',
  blue = '34',
  magenta = '35',
  cyan = '36',
  white = '37'
}

const env = process.env.NODE_ENV;

// LOGGER LEVELS
// 0 = no logs
// 1 = basic logs
// 2 = colored logs
// 3 = data logs

const productionLoggerLevel = 1;
const devLoggerLevel = Number(process.env.REACT_APP_DEV_LOGGER_LEVEL) || 3;
const loggerLevel =
  env === 'production' ? productionLoggerLevel : devLoggerLevel;

type MsgType = string | number | object | null | boolean | undefined;

class Logger {
  log(colorCode: string, msg: MsgType) {
    if (loggerLevel > 0)
      console.log(`\x1b[${colorCode}m${JSON.stringify(msg)}\x1b[0m`);
  }

  black(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.black, msg);
  }

  red(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.red, msg);
  }

  green(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.green, msg);
  }

  yellow(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.yellow, msg);
  }

  blue(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.blue, msg);
  }

  magenta(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.magenta, msg);
  }

  cyan(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.cyan, msg);
  }

  white(msg: MsgType) {
    if (loggerLevel > 1) this.log(Colors.white, msg);
  }

  data(msgType: string, msgResource: string, msg: MsgType) {
    if (loggerLevel > 2) {
      let massagedMsgResource: string = msgResource;
      if (msgResource?.slice(0, 1) === '/') {
        massagedMsgResource = msgResource.slice(1);
      }
      if (msgType === 'sampling-update') {
        return;
      }
      console.log(
        `\x1b[36m${msgType}|${massagedMsgResource + ': '}\x1b[0m${JSON.stringify(msg)}`
      );
    }
  }
}

export default new Logger();
