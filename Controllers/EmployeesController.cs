using InterviewTest.Model;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees ORDER BY Name ASC";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }
            return employees;
        }

        [HttpDelete]
        public StatusCodeResult Delete(string name)
        {
            if (name == "" )
            {
                return StatusCode(404);
            }
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"DELETE FROM Employees WHERE Name = @NAME";
                queryCmd.Parameters.AddWithValue("@NAME", name);
                int result = queryCmd.ExecuteNonQuery();

                if (result >= 1)
                {
                    return StatusCode(200);
                }
                return StatusCode(404);
            }
        }

        [HttpPatch("updateEmployee")]
        public Employee Patch(Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"UPDATE Employees SET Value = @VALUE WHERE Name = @NAME";

                queryCmd.Parameters.AddWithValue("@NAME", employee.Name);
                queryCmd.Parameters.AddWithValue("@VALUE", employee.Value);
                queryCmd.ExecuteNonQuery();

                return employee;
            }
        }

        [HttpPost("addEmployee")]
        public Employee Post(Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"INSERT INTO Employees (Name, Value) VALUES (@NAME, @VALUE)";
                queryCmd.Parameters.AddWithValue("@NAME", employee.Name);
                queryCmd.Parameters.AddWithValue("@VALUE", employee.Value);
                queryCmd.ExecuteNonQuery();

                return employee;
            }
        }
    }
}
