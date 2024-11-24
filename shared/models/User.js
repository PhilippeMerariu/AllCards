module.exports = class User{
    constructor(id = null, email, password, country = "", cards = []) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.country = country;
      this.cards = cards;
    }

    getID(){
        return this.id;
    }

    setID(id){
        this.id = id;
    }

    getEmail(){
        return this.email;
    }

    getPassword(){
        return this.password
    }

    getCountry(){
        return this.country;
    }
    
    setCountry(country){
        this.country = country;
    }

    getCards(){
        return this.cards
    }

    addCard(card){
        this.cards.push(card);
    }

    removeCard(card){
        return this.cards.splice(this.cards.indexOf(card), 1);
    }
  
    toJSON(frontend = false){
        let data = {
            id: this.id,
            email: this.email,
            country: this.country,
            cards: this.cards    
        }
        if (!frontend){
            data["password"] = this.password;
        }
        return data;
    }
  }
  
//   export default User;
  