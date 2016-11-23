var fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  async = require('async'),
  express = require('express');

var semesters = [];

var app = express();

app.get('/resuts/:usn', function(req, res) {

  //scrap results from fastvturesults.com
  //console.log(req.params.usn)
  url = 'http://www.fastvturesults.com/result/' + req.params.usn;
  //console.info("Retriving sem marks ...");

  async.waterfall([
    function(fetchInitialResultscallback) {
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
          fetchInitialResultscallback(null, semesters);
      });
    },
    function(semesters, fetchIndividualResultscallback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      //console.info("Retriving individual sem marks ...");
      async.map(semesters, function(sem, eachOfSeriesCallback) {
          request(sem.marks, function(error, response, body) {
            if (!error) {
              var semData = [];
              var $ = cheerio.load(body);

              $('#scell .success,#scell .danger').each(function() {

                var semJson = {
                  sub_name: $(this).find('td').eq(0).text().trim(),
                  sub_code: $(this).find('td').eq(1).text().trim(),
                  ia_marks: $(this).find('td').eq(2).text().trim(),
                  ext_marks: $(this).find('td').eq(3).text().trim(),
                  total_marks: $(this).find('td').eq(4).text().trim(),
                  results: $(this).find('td').eq(5).text().trim()
                }

                semData.push(semJson);
                //console.log("---next-sem---");
              });
              sem.marks = semData;
              //semesters[key].marks = semData
            }          
            eachOfSeriesCallback(null,sem);
          });
        },
        function(err,results) { 
          if (err) console.error(err.message);
          //console.log('Output.json file created ...');
        fetchIndividualResultscallback(null, results);
        });
    }
  ], function(err, result) {
    // result now equals 'done'
    res.setHeader('Content-Type', 'application/json');
    res.json(result, null, 3);
    semesters = [];
  });

});

app.listen(3000);
console.log('Listening on port 3000...');