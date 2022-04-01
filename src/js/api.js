function api(url, method, body = null) {
    return new Promise((resolve, reject) => {
        if (self.fetch) {

            const apiurl = "http://localhost:8000/" + url

            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            headers.append('Access-Control-Allow-Origin', '*')

            let init = {
                method: method,
                headers: headers,
                redirect: 'follow',
            }

            if (global.hasOwnProperty('user')) headers.append('userId', global.user.id)

            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                init.body = JSON.stringify(body)
            }

            fetch(apiurl, init)
                .then(response => response.json())
                .then(function (json) {
                    resolve(json)
                })
                .catch(function (error) {
                    resolve({
                        "message": "Houve um problema com sua requisição",
                        "error": error.message
                    })
                })
        } else {
            reject({
                "message": "A API Fetch não está disponível no seu dispositivo!"
            })
        }
    })
}