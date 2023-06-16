import { Inject } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\S\s]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

const getParamNames = (func: string) => {
  const fnStr = func.toString().replaceAll(STRIP_COMMENTS, '');
  return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
};

export const LogMethodCall = (): MethodDecorator => {
  const injectLogger = Inject(PinoLogger);

  return (target: any, methodName: string, propertyDescriptor: PropertyDescriptor): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    injectLogger(target, 'logger');
    const className = target.constructor.name as string;
    const originalMethod = propertyDescriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const argumentNames = getParamNames(target[methodName]);

    propertyDescriptor.value = async function (...args: any[]) {
      const { logger } = this;
      logger.setContext(`${className}#${methodName}`);
      try {
        const logArgs: any = argumentNames.map((name, index) => ({
          name,
          value: args[index],
        }));
        logger.info(`Called with args: ${JSON.stringify(logArgs)}`);
        return (await originalMethod.apply(this, args)) as unknown;
      } catch (error) {
        logger.error(error.message, error.stack, `${className}#${methodName}`);
        throw error;
      }
    };
  };
};
