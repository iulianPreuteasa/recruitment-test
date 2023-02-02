import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Trash, Pencil, Plus } from 'react-bootstrap-icons';

 export default class App extends Component {
    
     state = {
         employees: []
     };

     componentDidMount() {
         fetch('http://localhost:5000/employees')
             .then(response => response.json())
             .then(data => this.setState({employees: data}))
             .catch(e => console.log(e));

     }




    render() {

        
        
    return (
      <div>
            <table className="table table-striped table-sm table-hover text-center">
                <thead>
                    <tr>
                        <th scope="col">Employee</th>
                        <th scope="col" className="text-start"><Plus size={ 27 } /></th>

                    </tr>
                </thead>
                <tbody >
                        {this.state.employees.map(employee => (

                            <tr>
                                <td >{employee.name}</td>
                                <td className="text-start">
                                    <Trash size={25} className="pe-2"/>
                                    <Pencil  />
                                   
                                </td>
                                

                            </tr>
                        ))}
                 
                </tbody>
            </table>

            

       </div>
    );
  }
}
 
 