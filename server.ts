import Koa, { Middleware } from 'koa';
import favicon from 'koa-favicon';
import views from 'koa-views';
import serve from 'koa-static';
import Router from '@koa/router';
import path from 'path';
import { path as appPath } from 'app-root-path';

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3000;

router.get('/', async function (ctx) {
    await ctx.render('index');
});

app.use(views(path.join(appPath, '/dist/views'), { extension: 'html' }))
    .use(favicon(path.join(appPath, '/dist/web/favicon.ico')) as Middleware)
    .use(serve(path.join(appPath, '/dist/')) as Middleware)
    .use(router.routes() as Middleware)
    .use(router.allowedMethods() as Middleware)
    .listen(port, () => {
        console.log(`Game application is running on port ${port}.`);
    });
