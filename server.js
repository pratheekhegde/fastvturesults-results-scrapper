var fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  async = require('async')

var EventEmitter = require("events").EventEmitter;
var event = new EventEmitter();
var semesters = [];

//scrap results from fastvturesults.com
url = 'http://www.fastvturesults.com/result/4mw12cs064'
console.info("Retriving sem marks ...");
request(url, function(err, response, html) {

  var $ = cheerio.load(html);
  $('#scell .success,#scell .danger').each(function() {
    // console.info("sem : " + $(this).find('td').eq(0).text().trim() +
    //     ",attempt : " + $(this).find('td').eq(1).text().trim() +
    //     ",total_marks : " + $(this).find('td').eq(2).text().trim() +
    //     ",results : " + $(this).find('td').eq(3).text().trim() +
    //     ",percentage : " + $(this).find('td').eq(4).text().trim()
    // );

    var json = {
      sem: $(this).find('td').eq(0).text().trim(),
      attempt: $(this).find('td').eq(1).text().trim(),
      total_marks: $(this).find('td').eq(2).text().trim(),
      results: $(this).find('td').eq(3).text().trim(),
      percentage: $(this).find('td').eq(4).text().trim(),
      marks: $(this).find('td').eq(7).find('a').attr('href')
    };

    semesters.push(json);
  });
  console.info("Sem marks retrived ...");
  event.emit('update');
});

event.on('update', function() {
  console.info("Retriving individual sem marks ...");

  async.eachOfSeries(semesters, function(sem, key, callback) {
      request(sem.marks, function(error, response, body) {
        if (!error) {
          var semData = [];
          var $ = cheerio.load(body);

          $('#scell .success,#scell .danger').each(function() {

            var semJson = {
              sub_name: $(this).find('td').eq(0).text().trim(),
              sub_code: $(this).find('td').eq(1).text().trim()
            }

            semData.push(semJson);
            //console.log("---next-sem---");
          });
          sem.marks = semData;
          semesters[key].marks = semData
        }
        fs.writeFile('output.json', JSON.stringify(semesters, null, 4), function(err) {
          if (err) console.error(err.message);
        })
      });
      callback();
    },
    function(err) {
      if (err) console.error(err.message);
      console.log('Output.json file created ...');
    });
});