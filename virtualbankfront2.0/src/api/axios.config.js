// let token = sessionStorage.getItem("token");
let token = document.cookie.split("=")[1]

const config = {
    headers: {
        'Authorization': token,
        'username': 'ivil',
    },
    // baseURL:"http://192.168.71.86:8080",
    baseURL: "/bank2",
    // timeout: 3000,
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // },
}

export default config