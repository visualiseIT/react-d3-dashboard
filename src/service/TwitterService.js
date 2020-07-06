



const search = (body) => {

    //debugger;

    var url = 'http://localhost:7070?'
        + 'q=' + encodeURIComponent(body);

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((resp) => resp.json());

};


module.exports = {
    search
};
