using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.MobileServices;
using Windows.Foundation;
using System.Runtime.Serialization;

namespace E2EZumoTests
{
    public class Data
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string GetValue { get; set; }
        public string ActualResult { get; set; }
        public string ExpectedResult { get; set; }
        public string Result { get; set; }
       
        public string Colors { get; set; }
        public Data() { }
        public Data(int Id, string Name, string Value, string GetValue, string ActualResult, string ExpectedResult, string Result)
        {
            this.Id = Id;
            this.Name = Name;
            this.Value = Value;
            this.GetValue = GetValue;
            this.ActualResult = ActualResult;
            this.ExpectedResult = ExpectedResult;
            this.Result = Result;
            
        }
    }

    
    public class ExceptionData
    {
        public string Name { get; set; }
        public string ExceptionDetails { get; set; }
        public ExceptionData() { }
        public ExceptionData(string Name, string ExceptionDetails)
        {
            this.Name = Name;
            this.ExceptionDetails = ExceptionDetails;
        }
    }
    [DataContract(Name = "TodoItem")]
    public class TodoItem
    {
        [DataMember(Name= "id")]
        public int id { get; set; }
        [DataMember(Name = "string1")]
        public string string1 { get; set; }
        // because of internal server error i make date is nullable
        [DataMember(Name = "date1")]
        public DateTime? date1 { get; set; }
        [DataMember(Name = "bool1")]
        public bool bool1 { get; set; }
        [DataMember(Name = "number")]
        public double number { get; set; }

        // add long number and interger number
        [DataMember(Name = "longnum")]
        public long longnum { get; set; }
        [DataMember(Name = "intnum")]
        public int intnum { get; set; }

        // // Verify setIndex from run query so we add additional coulmn setindex
        [DataMember(Name = "setindex")]
        public string setindex { get; set; }
    }

    //Use to get null values
    public class GetQuery
    {
        public int ID { get; set; }
        // This property use to store null value;
        public string Value { get; set; }
        public bool BoolValue { get; set; }
        public double NumberValue { get; set; }
        public DateTime DateValue { get; set; }
        
    }

    // for permission
    [DataContract(Name="Person")]
    public class Person
    {
        [DataMember(Name = "id")]
        public int id { get; set; }
        [DataMember(Name = "Name")]
        public string Name { get; set; }
        [DataMember(Name = "Kids")]
        public int Kids { get; set; }
        [DataMember(Name = "DateOfBirth")]
        public DateTime DateOfBirth { get; set; }
        [DataMember(Name = "Married")]
        public bool Married { get; set; }
    }
    public class AddMasterKeyFilter : IServiceFilter
    {
        public IAsyncOperation<IServiceFilterResponse> Handle(IServiceFilterRequest request, IServiceFilterContinuation continuation)
        {
            request.Headers.Add("x-zumo-master", E2EZumoHelper.AppMasterKey);
            return continuation.Handle(request);
        }
    }

    // for Pushnotification channels
    public class Channels
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string ChannelURL { get; set; }
    }

    // For all help button
    public class HelpData
    {
        public string Title { get; set; }
        public string ScenarioName { get; set; }
        public string Details { get; set; }
    }
    // For multiple authentication
    public class UserAccess
    {
        public int id { get; set; }
        public string userId { get; set; }
        public string identities { get; set; }
        
    }
}
