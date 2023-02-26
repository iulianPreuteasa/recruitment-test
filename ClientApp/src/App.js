import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Trash, Check, Plus } from 'react-bootstrap-icons';

 export default class App extends Component {

     constructor(props) {
         super(props);
         /* Example of 
                employees = [ 
                        {name : "iulian", value : 123, newValue : 0},
                        {name : "Daniel", value : 321, newValue : 0} 
                ]; */


         this.state = {
             employees: [],
             formName:  "",
             formValue: 0,
             sumABC:    0
         };

         this.handleValueChange = this.handleValueChange.bind(this);
         this.incrementValues = this.incrementValues.bind(this);
         this.addEmployee = this.addEmployee.bind(this);
        
     }

     componentDidMount() {
         fetch("http://localhost:5000/Employees")
             .then(response => response.json())
             .then(data => {
                     this.setState({ employees: data.map(employee => ({ ...employee, newValue: 0 })) }, this.sumABC())
             })
             .catch(e => alert(e));
     }

     deleteEmployee(index) {
         let employeeToDelete = this.state.employees[index].name;

         fetch("http://localhost:5000/Employees?" + new URLSearchParams({ name: employeeToDelete }), {
             method: "DELETE",
             headers: {
                 'Content-Type': 'application/json',
             }
         })
             .then(response => this.sumABC())
             .then(this.setState({ employees: this.state.employees.filter(employee => employee.name !== this.state.employees[index].name) }))
             .catch(e => console.log("Error is: " + e));
     }

     editEmployee(index) {
         let { employees } = this.state;

         let updateEmployees = [...employees];

         updateEmployees[index] = { ...employees[index], value: updateEmployees[index].newValue, newValue: 0 };

         this.setState({ employees: updateEmployees });

         fetch("http://localhost:5000/Employees/updateEmployee" , {
             method: "PATCH",   
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 Name: updateEmployees[index].name,
                 Value: updateEmployees[index].value,
             })
         })
             .then(response => this.sumABC())
             .catch(e => alert(e));
     }
     
     addEmployee(e) {
         e.preventDefault();

         const { formName, formValue } = this.state;

         if (formName === "" ) {
             return;
         } 
         
         fetch("http://localhost:5000/Employees/addEmployee", {
             method: "POST",
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 Name: formName,
                 Value: formValue,
             })
         })
             .then(response => response.json())
             .then(data => {
                 const modifiedData = { ...data, newValue: 0 };
                 this.setState(prevState => ({
                     employees: [...prevState.employees, modifiedData]
                 }));
             })
             .then(this.setState({ formName: "", formValue: 0 }, this.sumABC))
             .catch(e => alert(e));
     }

     incrementValues() {
         fetch("http://localhost:5000/List/IncrementValues")
             .then(response => response.json())
             .then(data => {
                 this.setState({ employees: data.map(x => ({ ...x, newValue: 0 })) }, this.sumABC);
             })
             .catch(e => console.log(e));
     }

     sumABC() {
         fetch("http://localhost:5000/List/SumABC")
             .then(response => response.json())
             .then(data => this.setState({sumABC: data}))
             .catch(e => console.log(e));
     }

     handleValueChange(e, index) {
         let { employees } = this.state;

         let updatedEmployees = [...employees];

         updatedEmployees[index] = { ...employees[index], newValue: e.target.value };

         this.setState({
             employees: updatedEmployees
         })
     }  

     handleFormValue(e) {
         this.setState({
             formValue: e.target.value
             })
     }

     handleFormName(e) {
         this.setState({
             formName: e.target.value
             })
     }


    render() {
        
        return (

            <div className="mb-3">
                <div className="d-flex justify-content-evenly w-100">
                    <div className="d-flex flex-column w-100">
                        <form className = "d-flex flex-column w-100 mt-3 align-items-center justify-content-center " >
                            <input type="text"
                                className="text-center form-control m-1 w-25"
                                value={this.state.formName}
                                onChange={(e) => this.handleFormName(e)}
                                placeholder="Name"
                            />

                            <input type="number"
                                className="text-center form-control m-1 w-25"
                                value={this.state.formValue}
                                placeholder="Value"
                                onChange={(e) => this.handleFormValue(e)}
                            />
                            <a className="btn btn-primary text-center form-control w-25 m-1"
                                    onClick={(e) => this.addEmployee(e)}>
                                <Plus type="button" size={29}/>
                            </a>
                        </form>
                    </div>
                    <div className="d-flex flex-column justify-content-between align-items-center w-100">
                        <p className="p-3"> Increment the field Value by 1 where the field Name begins with "E"
                            and by 10 where Name begins with "G" and all others by 100
                        </p>
                        <button className="btn btn-primary w-50"
                            onClick={this.incrementValues}>Increment Values
                        </button>
                            
                        <p className="p-3">Summed values of all names that begin with A, B or C,
                                            the summed values are greater than or equal to 11171 </p>
                        <p className="text-center border w-25 p-2 rounded">{this.state.sumABC}</p>
                    </div>
                </div>

                <table className="table table-striped mt-3 table-sm table-hover text-center">
                    <thead>
                        <tr className="w-100">
                            <th scope="col" className="w-25">   Employee           </th>
                            <th scope="col" className="w-25">   Value / NewValue   </th>
                            <th scope="col" className="w-25">                      </th>
                        </tr>
                    </thead>

                    <tbody className="w-100">
                            {this.state.employees.sort((a, b) => a.name.localeCompare(b.name, undefined, { ignorePunctuation: true, sensitivity: 'base' })).map((employee, index) => (

                                <tr key={index} >
                                    <td className="w-25">
                                        {employee.name}
                                    </td>

                                    <td className="w-25">
                                        <div className="d-flex">
                                            <p className="w-50">{employee.value}</p>
                                            <input type="number"
                                                className="text-center form-control w-25"
                                                onChange={(e) => this.handleValueChange(e, index)}
                                                placeholder="new value"
                                                value={employee.newValue}
                                            />
                                        </div>
                                    </td>


                                    <td className="w-25">
                                        <a>
                                            <Trash type="button" 
                                                size={25}
                                                className="pe-2"
                                                onClick={() => this.deleteEmployee(index)}
                                            />
                                        </a>
                                        <a>
                                            <Check type="button"
                                                size={25}
                                                onClick={(e) => this.editEmployee(e,index)}
                                            />
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
 
 