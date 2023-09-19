import { app } from '@/server';
import './service/event';
import './service/ai';
import './service/r2';
import './service/moment';
import './service/baby';
import './service/hello';

app.doc('/api/doc', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});

export default app;
