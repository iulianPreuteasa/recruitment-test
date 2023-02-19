import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Trash, Pencil, Plus } from 'react-bootstrap-icons';

 export default class App extends Component {

     constructor(props) {
         super(props);

         /* Example of 
                employees = [ 
                        {name : "iulian", value : 123, newValue : 0},
                        {name : "Daniel", value : 321, newValue : 0} 
                ]; */


         this.state = {
            employees       :[],
            baseURL         :"http://localhost:5000/Employees",
             baseQueryURL: "http://localhost:5000/Employees?",
            
         };

         this.handleNameChange = this.handleNameChange.bind(this);
         this.handleValueChange = this.handleValueChange.bind(this);
     }

     deleteEmployee(index) {
         console.log(this.state.employees);

         let employeeToDelete = this.state.employees[index].name;

         fetch(this.state.baseQueryURL + new URLSearchParams({ name: employeeToDelete }), {
             method: "delete",
             headers: {
                 'Content-Type': 'application/json',
             }
         }).then(response => alert(employeeToDelete + " has been deleted!"))
             .then(this.setState({ employees: this.state.employees.filter(employee => employee.name !== this.state.employees[index].name) }))
             .catch(e => console.log("Error is: " + e));
     }

     editEmployee(index) {

         let { employees } = this.state;

         let updateEmployees = [...employees];

         updateEmployees[index] = { ...employees[index], value: updateEmployees[index].newValue, newValue: 0 };

         this.setState({ employees: updateEmployees });

         // aici am facut hardcoding ca sa pot sa modific mai usor, dar o sa schimb dupa aia cu variabila din state :))
         fetch("http://localhost:5000/Employees/updateEmployee" , {
             method: "PATCH",
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 Name: updateEmployees[index].name,
                 Value: updateEmployees[index].value,
             })
         }).then(response => console.log(response));


     }

     handleNameChange(e, index) {
         let { employees } = this.state;

         let updatedEmployees = [...employees];

         updatedEmployees[index] = { ...employees[index], name: e.target.value };

         this.setState({
             employees: updatedEmployees
             })
     }  

     handleValueChange(e, index) {
         let { employees } = this.state;

         let updatedEmployees = [...employees];

         updatedEmployees[index] = { ...employees[index], newValue: e.target.value };

         this.setState({
             employees: updatedEmployees
         })
     }  

     componentDidMount() {
         fetch(this.state.baseURL)
             .then(response => response.json())
             .then(data => this.setState({ employees: data.map(employee => ({ ...employee, newValue: 0 })) }))
             .catch(e => console.log(e));

     }

    




    render() {

        
        
    return (
      <div>
            <table className="table table-striped table-sm table-hover text-center">
                <thead>
                    <tr>
                        <th scope="col">Index</th>
                        <th scope="col">Employee</th>
                        <th scope="col">Value</th>
                        <th scope="col"><a><Plus size={27} onClick={() => { alert("add employee") }} /></a></th>

                    </tr>
                </thead>
                <tbody >
                    {this.state.employees.map((employee, index) => (

                            <tr key={index}>
                                <td>{index}</td>

                            <td ><input type="text" className="text-center form-control w-75" value={employee.name} onChange={(e) => this.handleNameChange(e,index) }   /></td>
                            <td >{employee.value}<input type="number" className="text-center form-control w-75" onChange={(e) => this.handleValueChange(e, index)} placeholder="new value" value={employee.newValue}  /></td>


                                <td >
                                    <a>
                                        <Trash size={25} className="pe-2" onClick={() => this.deleteEmployee( index )} />
                                    </a>
                                    <a>
                                        <Pencil onClick={() => this.editEmployee( index ) } />
                                    </a>
                                   
                                </td>
                                

                            </tr>
                        ))}
                 
                </tbody>
            </table>

            

       </div>
    );
  }
}
 
 