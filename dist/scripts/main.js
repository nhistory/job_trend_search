{
    const apiID = '0a5befcc';
    const apiKey = '636e5e3d0dbae70083676e8b0c8a799f';
    const city = 'Toronto';

    const keyword = 'javascript';

    fetch(
        `http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${apiID}&app_key=${apiKey}&results_per_page=50&what=${keyword}&content-type=application/json`
    )
        .then((response) => response.json())
        .then((json) => {
            // searched data by keyword and city
            result = json.results.filter((data) => {
                return data['location']['area'].indexOf(city) > 0;
            });
            // console.log(result);

            // job title data
            const jobTitle = result.map((job) => {
                return job.title;
            });
            console.log(jobTitle);

            // job title data
            const jobDesc = result.map((job) => {
                return job.description;
            });
            console.log(jobDesc);

            // count of job posting
            const jobNum = json.count;
            // console.log(jobNum);

            // mean of salary
            const meanSalary = json.mean;
            // console.log(meanSalary);
        });

    // histogram of salary
    fetch(
        `https://api.adzuna.com/v1/api/jobs/ca/histogram?app_id=${apiID}&app_key=${apiKey}&what=${keyword}`
    )
        .then((response) => response.json())
        .then((json) => {
            console.log(json['histogram']);
        });
}
