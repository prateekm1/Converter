public with sharing class csvExporter {
    
    @AuraEnabled(cacheable = true)
    public static list<Account> fetchRecord(){
        return [select id, name, phone, website, industry from Account];
    }
}