var fs = require("fs");

WorkProvider = function(){};
WorkProvider.prototype.works = [];

WorkProvider.prototype.findAll = function(callback) {
  callback(null, this.works);
};

WorkProvider.prototype.findByPath = function(path, callback) {
  var result = null;
  for(var i = 0; i < this.works.length; i++) {
    if(this.works[i].path == path) {
      result = this.works[i];
      break;
    }
  }
  if(result == null) {
    callback( "PageNotFound", null);
  } else {
    callback(null, result);
  }
};

WorkProvider.prototype.sortWork = function(callback) {
  var compareRanks = function(a, b) {
    var result = 0;
    if(a.rank > b.rank) {
      result = 1;
    }
    else {
      result = -1;
    }
    return result;
  };

  this.works.sort(compareRanks);

  callback();
};

WorkProvider.prototype.load = function(callback) {
  var filesArr = [],
      currentWorkFile = null,
      currentWorkMeta = null,
      currentWorkFileTitle = null,
      currentWorkFilePath = null,
      currentWorkFileRank = null,
      currentWorkFileCssId = null,
      currentWorkFileBody = null,
      currentWorkFileThumb = null,
      currentWorkObjet = {},
      workIndex = 0,

  filesArr = fs.readdirSync("work");

  for(var index in filesArr) {
    currentWorkObjet = null;
    var fileStat = fs.statSync("work/" + filesArr[index]);
    if(fileStat.isFile() && filesArr[index] != ".DS_Store") {
      currentWorkFile = fs.readFileSync("work/" + filesArr[index], "utf8").split(">-------<", 3);
      currentWorkMeta = currentWorkFile[0].split("\n", 6);
      currentWorkFileTitle = currentWorkMeta[0].slice(currentWorkMeta[0].indexOf(":") + 1).trim();
      currentWorkFilePath = filesArr[index].slice(0, filesArr[index].indexOf("."));
      currentWorkFileRank = currentWorkMeta[1].slice(currentWorkMeta[1].indexOf(":") + 1).trim();
      currentWorkFileCssId = currentWorkMeta[2].slice(currentWorkMeta[2].indexOf(":") + 1).trim();
      currentWorkFileBody = currentWorkFile[1];
      currentWorkFileThumb = currentWorkFile[2];

      currentWorkObjet = {
        title: currentWorkFileTitle,
        path: currentWorkFilePath,
        rank: currentWorkFileRank,
        cssId: currentWorkFileCssId,
        body: currentWorkFileBody,
        thumb: currentWorkFileThumb
      };

      this.works[workIndex] = currentWorkObjet;
      workIndex += 1;
      
    }
  }

  this.sortWork(callback);

}
exports.WorkProvider = WorkProvider;