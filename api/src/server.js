import express from 'express';
import authMiddleware from './auth';
import * as ws from './webSockets';
import cors from './cors';
import https from './https';

export default {
  create(port) {
    return {
      server: null,
      io: null,

      isRunning() {
        return this.server !== null;
      },

      run(done, opts = {}) {
        const app = express();

        // Since our API is a (BFF, backend for frontend)
        // running on another URL we need to allow CORS.
        // You may want to restrict access, rather than '*'.
        cors(app, '*');

        app.get('/api/1.0/status', (req, res) => {
          res.send('OK');
        });

        app.get('/protected', authMiddleware, (req, res) => {
          res.send('Logged in!');
        });

        // Enable HTTPS if certs are availible.
        const secure = (expressApp) => opts.certRoot ? https(expressApp, opts.certRoot) : expressApp;

        this.server = secure(app).listen(port, done);
        this.io = ws.init(this.server);

        return this;
      },

      stop(done) {
        if (this.server) this.server.close(done);
        this.server = null;
        this.io = null;
      },
    };
  },
};
