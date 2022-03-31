{
    const apiID = '0a5befcc';
    const apiKey = '636e5e3d0dbae70083676e8b0c8a799f';

    fetch(
        `http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${apiID}&app_key=${apiKey}&results_per_page=20&what=javascript&content-type=application/json`
    )
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
        });
}
