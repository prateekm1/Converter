public with sharing class getTimeZone {
    
    @AuraEnabled(cacheable=true)
    public static list<string> getZone() {
        
        //return Time_Zone__mdt.getAll().values();
        list<Time_Zone__mdt> lis =Time_Zone__mdt.getAll().values();
        list<string> res = new List<String>();
        for(Time_Zone__mdt tz: lis){
            res.add(tz.TimeZone__c);
        }
        system.debug('Metadata value: '+ res);
        return res;
    }
}