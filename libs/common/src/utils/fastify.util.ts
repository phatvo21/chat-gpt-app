import { FastifyAdapter } from '@nestjs/platform-fastify';
import { IncomingMessage } from 'http';
import qs from 'qs';

export const getAdapter = () =>
  new FastifyAdapter({
    rewriteUrl: (req: IncomingMessage) => req.url.replace(/ws.*?\//, ''),
    // because client currently use qs to stringify
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    querystringParser: (str) => qs.parse(str),
    bodyLimit: 20_024_000,
  });
