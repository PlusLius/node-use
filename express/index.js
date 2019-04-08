    const express = require('./express')

    const app = express()

    // app.listen(3000)

    // app.get('/plus',(req,res) => {
    //     res.end('plus')
    // })

    // app.post('/plus',(req,res) => {
    //     console.log('post plus')
    // }) 

    // // app.post('*',(req,res) => {
    // //     console.log('post * ')
    // // })

    // app.all('/word',(req,res) => {
    //     res.end('world')
    // })

    // app.use((req,res,next) => {
    //     console.log('全部匹配')
    //     next()
    // })
    // app.use('/water',(req,res,next) => {
    //     console.log('只匹配water')
    //     next()
    // })
    // app.get('/water',(req,res) => {
    //     res.end('water')
    // })

    // app.get('/school/:name/:age',(req,res) => {
    //     console.log(req.params)
    //     res.end('warter')
    // })

    // app.listen(3000)

    // app.use(function (req,res,next) {
    //     console.log('过滤石头');
    //     next('stone is too big');
    // });
    // app.use('/water', function (req,res,next) {
    //     console.log('过滤沙子');
    //     next('stone is too big');
    // });
    // app.get('/water', function (req,res) {
    //     res.end('water');
    // });
    // app.use(function (err,req,res,next) {
    //     console.log(err);
    //     res.end(err);
    // });
    // app.listen(3000);

    app.get('/school/:name/:age', function (req,res) {
        console.log(req.params);
        res.end('water');
    });

    app.get('/',function(req,res){
        res.send('<p>hello world</p>');
    })

    app.get('/status', function (req,res) {
        res.send('没有找到'); //not found
        //res.status(404).send('没有找到');设置短语
    });

    app.listen(3000);