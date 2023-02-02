import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Employee</th>
                        <th scope="col">ADD</th>

                    </tr>
                </thead>
                <tbody>
                        {this.state.employees.map(employee => (

                            <tr>
                                <td>{employee.name}</td>
                                <td>DELETE</td>
                                <td>EDIT</td>

                            </tr>
                        ))}
                 
                </tbody>
            </table>

            

       </div>
    );
  }
}
 
 