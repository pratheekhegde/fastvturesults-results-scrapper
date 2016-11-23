# Fastvturesults Scrapper

**DISCLAIMER : The code is very dirty and heavily unoptimized!**

### Quick Run
`https://vtu-results-scrapper-api.herokuapp.com/results/:usn`. here `:usn` is your **USN**
        
Eg: https://vtu-results-scrapper-api.herokuapp.com/results/4mw12cs064

The above link may die any time. 😬 Prayers to heroku 🙏🏻

### Steps

* run `npm install`
* edit your **USN** inside `server.js`
* run `node server.js`
* `output.json` will contain all your results.
* You will have all your results from **fastvturesults.com**


### Output JSON format
The results will be an array of objects and each object will be of the following format.

```json
{
        "sem": "8",
        "attempt": "1",
        "total_marks": "553",
        "results": "FIRST CLASS WITH DISTINCTION",
        "percentage": "73.73%",
        "marks": [
            {
                "sub_name": "Software Architectures",
                "sub_code": "10IS81",
                "ia_marks": "18",
                "ext_marks": "56",
                "total_marks": "74",
                "results": "P"
            },
            {
                "sub_name": "System Modeling and Simulation",
                "sub_code": "10CS82",
                "ia_marks": "16",
                "ext_marks": "74",
                "total_marks": "90",
                "results": "P"
            },
            {
                "sub_name": "Software Testing",
                "sub_code": "10CS842",
                "ia_marks": "17",
                "ext_marks": "59",
                "total_marks": "76",
                "results": "P"
            },
            {
                "sub_name": "Information and Network Security",
                "sub_code": "10CS835",
                "ia_marks": "20",
                "ext_marks": "68",
                "total_marks": "88",
                "results": "P"
            },
            {
                "sub_name": "Project Work",
                "sub_code": "10CS85",
                "ia_marks": "90",
                "ext_marks": "86",
                "total_marks": "176",
                "results": "P"
            },
            {
                "sub_name": "Seminar",
                "sub_code": "10CS86",
                "ia_marks": "49",
                "ext_marks": "0",
                "total_marks": "49",
                "results": "P"
            }
        ]
    }
```
