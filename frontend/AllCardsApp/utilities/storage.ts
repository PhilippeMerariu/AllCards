export function saveUser(user: any){
    localStorage.setItem("user.id", user.id);
    localStorage.setItem("user.email", user.email);
    localStorage.setItem("user.country", user.country);
    localStorage.setItem("user.cards", user.cards);
}

export function getUser(): any{
    return{
        id: localStorage.getItem("user.id"),
        email: localStorage.getItem("user.email"),
        country: localStorage.getItem("user.country"),
        cards: localStorage.getItem("user.cards")
    }
}