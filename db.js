export const server = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000/api/" : "https://vtu9ja.ng/api/";
const userAuth ={
    uid: localStorage.getItem("uid"),
    token: sessionStorage.getItem("token")
};
export class db{
    constructor(path){
        this.path = path;
    }
    get(path){
        return fetch(`${server}${this.path}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.stringify(userAuth.token)}`
            }
        }).then(res => res.json());
    }
    post(path, data){
        return fetch(`${server}${this.path}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.stringify(userAuth.token)}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json());
    }
    put(path, data){
        return fetch(`${server}${this.path}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.stringify(userAuth.token)}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json());
    }
    delete(path){
        return fetch(`${server}${this.path}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.stringify(userAuth.token)}`
            }
        }).then(res => res.json());
    }
}