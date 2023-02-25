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
             formName : "",
             formValue : 0,
            
         };

         this.handleNameChange = this.handleNameChange.bind(this);
         this.handleValueChange = this.handleValueChange.bind(this);
     }

     componentDidMount() {
         fetch(this.state.baseURL)
             .then(response => response.json())

             .then(data => {

                 this.setState({ employees: data.map(employee => ({ ...employee, newValue: 0 })) })

             })

             .catch(e => alert(e));

     }

     deleteEmployee(index) {

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

         fetch(`${this.state.baseURL}/updateEmployee` , {
             method: "PATCH",   
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 Name: updateEmployees[index].name,
                 Value: updateEmployees[index].value,
             })
         }).then(response => response.json())
             
             
             .catch(e => alert(e));


     }
     
     addEmployee(e) {
         e.preventDefault();

         const { formName, formValue } = this.state;


         
         fetch(`${this.state.baseURL}/addEmployee`, {
             method: "POST",
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 Name: formName,
                 Value: formValue,
             })
         }).then(response => response.json())
             .then(data => {
                 const modifiedData = { ...data, newValue: 0 };
                
                 this.setState(prevState => ({
                     employees: [...prevState.employees, modifiedData]
                 }));
             }).then(this.setState({formName: "", formValue:0}))
             .catch(e => alert(e));


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
                <div className="d-flex flex-column">
                <p className="h4 text-center align-items-center">Add employee</p>
                <form className = "d-flex flex-column w-100 align-items-center " >

                        <input type="text" className="text-center form-control w-50" value={this.state.formName} onChange={(e)=> this.handleFormName(e) }  placeholder="Name" />
                        <input type="number" className="text-center form-control w-50" value={this.state.formValue} placeholder="Value" onChange={(e)=> this.handleFormValue(e) } />
                        <a className="text-center form-control w-50"><Plus type="button" onClick={(e) => this.addEmployee(e) } size={27} /></a>
                </form>

                </div>

            <table className="table table-striped mt-3 table-sm table-hover text-center">
                <thead>
                    <tr className="w-100">
                        <th scope="col" className="w-25">Index</th>
                            <th scope="col" className="w-25">Employee</th>
                            <th scope="col" className="w-25">Value / NewValue</th>

                            <th scope="col" className="w-25"></th>

                    </tr>
                </thead>
                <tbody className="w-100">
                        {this.state.employees.sort((a, b) => a.name.localeCompare(b.name, undefined, { ignorePunctuation: true, sensitivity: 'base' })).map((employee, index) => (

                            <tr key={index} >
                                <td className="w-25">{index}</td>

                                <td className="w-25"><input type="text" className="text-center form-control w-75" value={employee.name} onChange={(e) => this.handleNameChange(e, index)} disabled={ true }   /></td>
                                <td className="w-25"><div className="d-flex"><p className="w-50">{employee.value}</p><input type="number" className="text-center form-control w-25" onChange={(e) => this.handleValueChange(e, index)} placeholder="new value" value={employee.newValue} /></div></td>


                                <td className="w-25">
                                    <a>
                                           <Trash type="button"  size={25} className="pe-2" onClick={() => this.deleteEmployee( index )} />
                                    </a>
                                    <a>
                                          <Pencil type="button" onClick={() => this.editEmployee( index ) } />
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
 
 