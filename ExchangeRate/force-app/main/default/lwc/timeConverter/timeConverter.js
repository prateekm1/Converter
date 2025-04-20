import { LightningElement, wire, track } from 'lwc'; // Import track if needed for reactivity on properties assigned later
import getZone from '@salesforce/apex/getTimeZone.getZone';

export default class TimeConverter extends LightningElement {
    // Use @track for properties assigned outside the wire/constructor IF their changes need to trigger re-renders
    // For assigning inside the wire service to properties used directly in the template, @track is often not strictly needed anymore,
    // but it doesn't hurt for clarity, especially for complex objects/arrays.
    @track formattedZoneOptions = []; // Correct format for combobox options
    recordError; // Store the error object, not an array

    // Properties to store selected values
    selectedDateTime;
    selectedFromZone;
    selectedToZone;

    tempTime="";

    convertedTime="";
    convertedZone = "";
    output = false;

    // --- Wire Service to Fetch Time Zones ---
    @wire(getZone)
    wiredZoneRecords({ error, data }) {
        if (data) {
            // --- Data Transformation ---
            // Input `data` is: ['America/New_York', 'Asia/Kolkata', ...]
            // Required format is: [{ label: 'America/New_York', value: 'America/New_York' }, { label: 'Asia/Kolkata', value: 'Asia/Kolkata' }, ...]

            this.formattedZoneOptions = data.map(zoneString => {
                // For each string in the data array, create an object
                return {
                    label: zoneString, // Use the string itself as the label
                    value: zoneString  // Use the string itself as the value
                };
            });

            this.recordError = undefined; // Clear previous errors
          //  console.log('Formatted Zone Options:', JSON.stringify(this.formattedZoneOptions));
            console.log("Original data received >> ", data);

        } else if (error) {
            this.recordError = error; // Assign the whole error object
            this.formattedZoneOptions = []; // Clear options on error
            console.error('Error fetching time zone list:', JSON.stringify(error));
            // Consider adding user-friendly error display in the template
        }
    }

    get hasZoneOptions() {
        return this.formattedZoneOptions && this.formattedZoneOptions.length > 0;
    }

    handleChange(event){
        let {name, value} = event.target;
        if(name === 'time') this.selectedDateTime = value;
        if(name === 'fromZone') this.selectedFromZone = value;
        if(name === 'toZone') this.selectedToZone = value;

        this.tempTime = this.selectedDateTime.substring(0, 16);

        console.log("time > ", this.selectedDateTime);
        console.log("from > ", this.selectedFromZone);
        console.log("to > ", this.selectedToZone);
        console.log("final time > ", this.tempTime);
    }

    async handleClick(){
        let url = `https://timezone.abstractapi.com/v1/convert_time?api_key=47e70fe89d944d8292bc4a4fa438e93d&base_location=${this.selectedFromZone}&base_datetime=${this.tempTime}&target_location=${this.selectedToZone}`;
        try{
            let response = await fetch(url);
            if(!response.ok){
                throw new error ('Network response was not OK');
            }
            console.log('Request sent ', this.url);
            const data = await response.json();
            this.convertedTime = data.target_location.datetime;
            this.convertedZone = data.target_location.requested_location;
            console.log('Data ', data.target_location);
            console.log('converted time = ', this.convertedTime);
            console.log('converted zone = ', this.convertedZone);
            this.output = true;
        }
    catch(error){
        console.log(error);
    }
    }
}