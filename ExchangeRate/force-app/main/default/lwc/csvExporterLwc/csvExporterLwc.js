import { LightningElement, wire } from 'lwc';
import fetchRecord from '@salesforce/apex/csvExporter.fetchRecord';

export default class CsvExporterLwc extends LightningElement {

    accountRecords =[];

    columns = [
        { label: 'Account Name', fieldName: 'Name' },
        { label: 'Website', fieldName: 'Website', type: 'url' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Industry', fieldName: 'Industry', type: 'text' },
    ];

    @wire(fetchRecord) wiredFunction({data,error}){
        if(data){
            this.accountRecords = data;
        }else if(error){
            console.log(error);
        }
    }
    

    get check(){
        return this.accountRecords.length > 0 ? false:true;
    }

    handleClick(){
        // if records are selected in data table
        let selectedRow =[];
        let downloadRows =[];
        selectedRow = this.template.querySelector("lightning-datatable").getSelectedRows();

        // if records are selected or not, in case records are not selected download all
        if(selectedRow.length>0){
            downloadRows = [...selectedRow];
        }else{
            downloadRows = [...this.accountRecords];
        }

        // convert array to csv
        let csvfile = this.convertArrayToCsv(downloadRows);
        this.createLinkForDownload(csvfile);
    }

    convertArrayToCsv(downloadRows){
        let csvHeader = Object.keys(downloadRows[0].toString());
        let csvBody = downloadRows.map(currItem => Object.values(currItem).toString());
        
        let csvFile = csvHeader + '\n' + csvBody.join("\n");
        return csvFile;
    }

    createLinkForDownload(csvFile){
        const downLink = document.createElement("a");
        downLink.href = "data:text/csv;charset=utf-8,"+encodeURI(csvFile);
        downLink.target = "_blank";
        downLink.download = "Account_Date.csv";
        downLink.click();
    }






    /* ** Pagination Code **
    var pagelist;
    var currentPage =1;
    var recordPerPage = 10;
    var totalPage = 1;

    this.totalPage = Math.ceil(accountRecords.length/recordPerPage);

    handleNext(){
        this.pageNo +=1;
        this.preparePageinationList();
    }
    handlePrevious(){
        this.pageNo -=1;
        this.preparePageinationList();
    }
    handleFirst(){
        this.pageNo =1;
        this.preparePageinationList();
    }
    handleLast(){
        this.pageNo = this.totalPage;
        this.preparePageinationList();
    }

    let begin = (this.pageNo - 1)* parseInt(this.recordPerPage);
    let end = parseInt(begin)+parseInt(this.recordPerPage);
    this.recordsToDisplay = this.record.slice(begin,end); */
}