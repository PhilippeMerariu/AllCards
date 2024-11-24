module.exports = class Card{
    constructor(store, barcode, color, logo){
        this.store = store;
        this.barcode = barcode;
        this.color = color;
        this.logo = logo;
    }

    getStore(){
        return this.store;
    }

    getBarcode(){
        return this.barcode;
    }

    getColor(){
        return this.color;
    }

    setColor(color){
        this.color = color;
    }

    getLogo(){
        return this.logo;
    }

    setLogo(logo){
        this.logo = logo;
    }

    toJSON(){
        return {
            store: this.store,
            barcode: this.barcode,
            color: this.color,
            logo: this.logo
        }
    }
}