using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Xml.Linq;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {

        [HttpGet("IncrementValues")]
        public List<Employee> IncrementValues()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"UPDATE Employees
                SET Value = 
                    CASE 
                        WHEN substr(Name, 1, 1) = 'E' THEN Value + 1
                        WHEN substr(Name, 1, 1) = 'G' THEN Value + 10
                        ELSE Value + 100
                    END";
                queryCmd.ExecuteNonQuery();
                connection.Close();
                return new EmployeesController().Get();
            }

        }
        
        [HttpGet("SumABC")]
        public int sumABC()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT CASE 
                                            WHEN SUM(Value) >= 11171 THEN SUM(Value) 
                                            ELSE 0 END as 'SumABC'
                                            FROM Employees
                                            WHERE (Name LIKE 'A%' 
                                            OR Name LIKE 'B%' 
                                            or Name LIKE 'C%')";

                using (var reader = queryCmd.ExecuteReader())
                {
                    reader.Read();
                    return reader.GetInt32(0);
                    
                }
            }
        }
    }
}
