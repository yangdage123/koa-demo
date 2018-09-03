const Koa = require('koa');
const _ = require('koa-route');
const ser = require('koa-static');
const path = require('path');
const app = new Koa();
const DAO = require('./modules/dao');

const main = ser(path.join(__dirname, 'static'));

const handler = async (ctx, next) => {
  const {
    response,
    request,
  } = ctx;
  try {
    await next();
  } catch (e) {
    response.status = e.statusCode || e.status || 500;
    response.body = {
      message: e.message
    };
    console.error(`[error][${Date.now()}] ${request.method} ${request.url} [reason] ${e.message} `);
  }
};
const logger = async (ctx, next) => {
  const {
    request,
  } = ctx;
  console.log(`[info] [${Date.now()}] ${request.method} ${request.url} >>`);
  await next();
  console.log(`[info] [${Date.now()}] ${request.method} ${request.url} <<`)
};

const root = (ctx) => {
  const {
    response,
  } = ctx;
  response.type = 'html';
  response.body = '<div>root</div>';
};

const about = (ctx) => {
  const {
    response,
  } = ctx;
  response.type = 'html';
  response.body = '<div>about</div>';
};

const error = (ctx) => {
  throw new Error('shibai');
};

const getData = async (ctx) => {
  const {
    response,
  } = ctx;
  const rows = await DAO.getData();
  response.type = 'json';
  response.body = {
    code: 0,
    info: {
      list: rows,
    },
  msg: 'success',
  }
};

const add = async (ctx) => {
  const {
    response,
  } = ctx;
  const rows = await DAO.add();
  response.type = 'json';
  response.body = {
    code: 0,
    info: {
    },
    msg: 'success',
  }
};

app.use(handler);
app.use(main);
app.use(logger);
app.use(_.get('/', root));
app.use(_.get('/about', about));
app.use(_.get('/error', error));
app.use(_.get('/getData', getData));
app.use(_.get('/add', add));


app.listen(3000);
console.log('server listen 3000...');



