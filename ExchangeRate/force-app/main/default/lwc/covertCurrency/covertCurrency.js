import { LightningElement } from 'lwc';

export default class CovertCurrency extends LightningElement {
    
    showOutput = false;
    convertedValue = "";
    toCurrency = "";
    enteredAmount="";
    fromCurrency ="";
    currencyOptions = [];

    connectedCallback(){
        this.fetchSymbols();
        console.log("symbols fetched");
    }

    changeHandler(event){
        let {name, value} = event.target;
        if(name==="amount"){
            this.enteredAmount = value;
        }
        if(name==="fromCurr"){
            this.fromCurrency = value;
        }
        if(name==="toCurr"){
            this.toCurrency = value;
        }
    }
    clickHandler(){
        console.log("Click Handler");
        this.conversion();
    }

    async fetchSymbols(){
        console.log("fetch symbol");
        let url = 'https://api.frankfurter.app/currencies';
        try{
            let response = await fetch(url);
            if(!response.ok){
                throw new error ('Network response was not OK');
            }
            const data = await response.json();
            // process data returned from API
            let options = [];
            for(let symbol in data){
                options = [...options,{label:symbol, value:symbol}];
            }
            this.currencyOptions = [...options];
        } catch(error){
            console.log(error);
        }
    } 

    async conversion(){
        console.log("Conversion");
        let endpoint = `https://api.frankfurter.app/latest?amount=${this.enteredAmount}&from=${this.fromCurrency}&to=${this.toCurrency}`;
        try{
            let response = await fetch(endpoint);
            if(!response.ok){
                throw new error ('Network response was not OK');
            }
            const data = await response.json();
            this.convertedValue = data.rates[this.toCurrency];
            this.showOutput = true;
        } catch(error){
            console.log(error);
        }
    }
}