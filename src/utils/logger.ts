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
const devLoggerLevel = 3;
const loggerLevel =
  env === 'production' ? productionLoggerLevel : devLoggerLevel;

class Logger {
  log(colorCode: string, msg: string) {
    if (loggerLevel > 0) console.log(`\x1b[${colorCode}m${msg}\x1b[0m`);
  }

  black(msg: string) {
    if (loggerLevel > 1) this.log(Colors.black, msg);
  }

  red(msg: string) {
    if (loggerLevel > 1) this.log(Colors.red, msg);
  }

  green(msg: string) {
    if (loggerLevel > 1) this.log(Colors.green, msg);
  }

  yellow(msg: string) {
    if (loggerLevel > 1) this.log(Colors.yellow, msg);
  }

  blue(msg: string) {
    if (loggerLevel > 1) this.log(Colors.blue, msg);
  }

  magenta(msg: string) {
    if (loggerLevel > 1) this.log(Colors.magenta, msg);
  }

  cyan(msg: string) {
    if (loggerLevel > 1) this.log(Colors.cyan, msg);
  }

  white(msg: string) {
    if (loggerLevel > 1) this.log(Colors.white, msg);
  }

  data(msgType: string, msg: string) {
    if (loggerLevel > 2)
      console.log(`\x1b[36m${msgType + ': '}\x1b[0m${JSON.stringify(msg)}`);
  }
}

export default new Logger();
