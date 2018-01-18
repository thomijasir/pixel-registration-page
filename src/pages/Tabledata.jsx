import React, {Component} from 'react';
import axios from 'axios';
import {Table, Column, Cell} from 'fixed-data-table-2';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import  'fixed-data-table-2/dist/fixed-data-table.min.css';

class Tabledata extends Component{
    constructor(props){
        super(props);
        this.state ={
            database:"",
            myTableData: [
                {name: 'Rylan',email:'sample@gmail.com'},
                {name: 'Amelia',email:'sample@gmail.com'},
                {name: 'Estevan',email:'sample@gmail.com'},
                {name: 'Florence',email:'sample@gmail.com'},
                {name: 'Tressa',email:'sample@gmail.com'},
              ]
        };
    }
    componentDidMount(){
        const baseUrl = location.protocol + '//' + location.host;
        const dataUrl = baseUrl +'/model/datauser.json';
        axios.get(dataUrl)
        .then(responses =>{
            console.log('DATA DI TARIK',responses);
            this.setState({
                database:responses.data
            });
            
        }).catch(error =>{
            console.log("Ada Error Nih!", error);
        });
    }

    // Java Script Capitalize Funtion
    Capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // IDR Curency
    Rupiah(angka){
        if(!isNaN(angka)){
            console.log(angka);
            var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
            var rev2    = '';
            for(var i = 0; i < rev.length; i++){
                rev2  += rev[i];
                if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
                    rev2 += '.';
                }
            }
            return 'Rp. ' + rev2.split('').reverse().join('') + ',00';
        }else{
            return 'Rp. 0,00';
        }
        
    }

    // Setting Format Date to Us
   

    render(){
        console.log();
        return(
            <div className="row justify-content-center mt-5">
            
               <Table
                    rowsCount={this.state.database.length}
                    rowHeight={50}
                    headerHeight={50}
                    width={1000}
                    height={500}>

                    <Column
                        header={<Cell>Number</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {props.rowIndex+1}
                            </Cell>
                        )}
                        width={100}
                    />
                    
                    <Column
                        header={<Cell>Account ID</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {this.state.database[props.rowIndex].ad_account_id}
                            </Cell>
                        )}
                        width={134}
                    />
                    <Column
                        header={<Cell>Name</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {this.Capitalize(this.state.database[props.rowIndex].name)}
                            </Cell>
                        )}
                        width={250}
                    />

                    <Column
                        header={<Cell>Amount Spend</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {this.Rupiah(this.state.database[props.rowIndex].amount_spent)}
                            </Cell>
                        )}
                        width={250}
                    />

                    <Column
                        header={<Cell>User Create</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {moment(this.state.database[props.rowIndex].created_time).format("LL")}
                            </Cell>
                        )}
                        width={250}
                    />
                </Table>
            </div>
        );
    }
}
export default Tabledata;