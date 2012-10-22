/**
 * Module dependencies.
 */
var express = require('express'),
    port = process.env.PORT || 3000,
    routes = require('./routes'),
    ArticleProvider = require("./article-provider").ArticleProvider,
    WorkProvider = require("./work-provider").WorkProvider,
    markdown = require('./markdown'),
    mailer = require('nodemailer'),
    articleProvider = new ArticleProvider(),
    workProvider = new WorkProvider(),
    emailConf = require('./conf/conf').emailConf;

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(app.router);
  app.use(express.errorHandler());
});

var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: emailConf.username,
        pass: emailConf.pwd
    }
});

articleProvider.load(function () {
  workProvider.load(function () {
    app.listen(port);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });
});

// Routes
// Home
//app.get('/', routes.index);
app.get('/', function(req, res) {
  res.render('index', { title: '', category: 'home', pageType: 'home' });
});
// Contact
//app.get('/contact', routes.contact);
app.get('/contact', function(req, res) {
  res.render('contact', { title: 'Contact', category: 'contact', pageType: 'contact', emailSent: null });
});
app.post('/contact', function(req, res) {

  var mailOptions = {
      from: req.body.email,
      to: "julien.zmiro@gmail.com",
      subject: "n3rdb1rd - Contact",
      text: "Message de : " + req.body.name + " | " + req.body.email + "\n \n" + req.body.msg,
      html: "<p>Message de : <strong>" + req.body.name + " | " + req.body.email + "</strong></p><p>" + req.body.msg + "</p>"
  };
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
          res.render('contact', { title: 'Contact', category: 'contact', pageType: 'contact', emailSent: 'false' });
      } else{
          res.render('contact', { title: 'Contact', category: 'contact', pageType: 'contact', emailSent: 'true' });
      }
  });

});
// Portfolio
app.get('/portfolio', function(req, res) {
  res.render('portfolio', { title: 'Portfolio', category: 'portfolio', pageType: 'workCategory', work: workProvider.works, markdown: markdown });
});
app.get('/portfolio/:workPath', function(req, res) {
  workProvider.findByPath(req.params.workPath, function(err, work) {
    if(err) {
      if(err == "PageNotFound") {
        res.render('404.jade', { layout: false, status: 404 });
      }
    } else {
      res.render('work', { layout: false, title: work.title, category: 'portfolio', pageType: 'workPage', work: work, markdown: markdown });
    }
  });
});
// Journal
//app.get('/journal', routes.journal, articleProvider.articles);
app.get('/journal', function(req, res) {
  res.render('journal', { title: 'Journal', category: 'journal', pageType: 'journalCategory', articlesOthers: articleProvider.articlesOthers, articlesMustRead: articleProvider.articlesMustRead, markdown: markdown });
});
app.get('/journal/:articlePath', function(req, res) {
  articleProvider.findByPath(req.params.articlePath, function(err, article) {
    if(err) {
      if(err == "PageNotFound") {
        res.render('404.jade', { layout: false, status: 404 });
      }
    } else {
      res.render('article', { title: article.title, category: 'journal', pageType: 'journalPage', article: article, markdown: markdown });
    }
  });
});

app.get('/*', function(req, res) {
  res.render('404.jade', { layout: false, status: 404 });
});