var fs = require("fs");

ArticleProvider = function(){};
ArticleProvider.prototype.articles = [];
ArticleProvider.prototype.articlesMustRead = [];
ArticleProvider.prototype.articlesOthers = [];

ArticleProvider.prototype.findAll = function(callback) {
  callback(null, this.articles);
};

ArticleProvider.prototype.findMustRead = function(callback) {
  callback(null, this.articlesMustRead);
};

ArticleProvider.prototype.findOthers = function(callback) {
  callback(null, this.articlesOthers);
};

ArticleProvider.prototype.findByPath = function(path, callback) {
  var result = null;
  for(var i = 0; i < this.articles.length; i++) {
    if(this.articles[i].path == path) {
      result = this.articles[i];
      break;
    }
  }
  if(result == null) {
    callback( "PageNotFound", null);
  } else {
    callback(null, result);
  }
};

ArticleProvider.prototype.sortArticlesByDate = function(callback) {
  var compareDates = function(a, b) {
    var result = 0;
    if(a.date > b.date) {
      result = -1;
    }
    else {
      result = 1;
    }
    return result;
  };

  this.articles.sort(compareDates);
  this.articlesMustRead.sort(compareDates);
  this.articlesOthers.sort(compareDates);

  callback();
};

ArticleProvider.prototype.load = function(callback) {
  var filesArr = [],
      currentArticleFile = null,
      currentArticleMeta = null,
      currentArticleFileTitle = null,
      currentArticleFilePath = null,
      currentArticleFileDate = null,
      currentArticleFilePinit = null,
      currentArticleFileBody = null,
      currentArticleObjet = {},
      articleIndex = 0,
      articleMustRead = 0,
      articleOthers = 0;

  filesArr = fs.readdirSync("articles");

  for(var index in filesArr) {
    currentArticleObjet = null;
    var fileStat = fs.statSync("articles/" + filesArr[index]);
    if(fileStat.isFile() && filesArr[index] != ".DS_Store") {
      currentArticleFile = fs.readFileSync("articles/" + filesArr[index], "utf8").split(">-------<", 2);
      currentArticleMeta = currentArticleFile[0].split("\n", 3);
      currentArticleFileTitle = currentArticleMeta[0].slice(currentArticleMeta[0].indexOf(":") + 1).trim();
      currentArticleFilePath = filesArr[index].slice(0, filesArr[index].indexOf("."));
      currentArticleFileDate = currentArticleMeta[1].slice(currentArticleMeta[1].indexOf(":") + 1).trim();
      currentArticleFilePinit = currentArticleMeta[2].slice(currentArticleMeta[2].indexOf(":") + 1).trim();
      currentArticleFileBody = currentArticleFile[1];

      currentArticleObjet = {
        title: currentArticleFileTitle,
        path: currentArticleFilePath,
        date: currentArticleFileDate,
        pinit: currentArticleFilePinit,
        body: currentArticleFileBody
      };

      if(currentArticleObjet.pinit == "true") {
        this.articlesMustRead[articleMustRead] = currentArticleObjet;
        articleMustRead += 1;
      }
      if(currentArticleObjet.pinit == "false") {
        this.articlesOthers[articleOthers] = currentArticleObjet;
        articleOthers += 1
      }

      this.articles[articleIndex] = currentArticleObjet;
      articleIndex += 1;
      
    }
  }

  this.sortArticlesByDate(callback);

}
exports.ArticleProvider = ArticleProvider;