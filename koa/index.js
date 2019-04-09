const Koa = require('./koa')

const app = new Koa()
const port = 3000

app.use(async function (ctx, next) {
    console.log(1);
    await next();
    console.log(2);
});
app.use(async function (ctx, next) {
    console.log(3);
    await next();
    console.log(4);
});
app.use(async function (ctx, next) {
    console.log('5');
    ctx.res.end('ok');
});

app.listen(port)