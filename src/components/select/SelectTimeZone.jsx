import React, { Component } from 'react';
import axios from 'axios';
import Select from'react-select';
import 'react-select/dist/react-select.css';
import Moment from 'moment-timezone';


class SelectTimeZone extends Component {

    constructor (props){
        super (props);
        this.state = {
            timezoneArr:"",
            selectedOption: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
            var moment = require('moment-timezone'); // moment-timezone
            var timezone = moment.tz.names();
            var arrayData = [];
            for (var i = 0; i < timezone.length; i++) {
                arrayData.push( { value: timezone[i], label: timezone[i] });
                //console.log(timezone[i]);
                //$('select').append('<option value="' + timezone[i] + '">' + timezone[i] + '</option>');
            }
            this.setState({
                timezoneArr:arrayData
            })
        const baseUrl = location.protocol + '//' + location.host;
        const timezones = baseUrl +'/model/timezones.json';

        axios.get(timezones)
            .then(responses => {
               //console.log("Success Load!",responses.data[0]);
            //    this.setState({
            //     timezoneArr:responses.data
            //    })
            }).catch(error =>{
            console.log("Error getting content", error);
        });
    };

    handleChange(selectedOption) {
        this.setState({ selectedOption });
        this.props.handleDataInput(selectedOption.value,"TIMEZONE");
      }

    render(){
        // for(let key of this.state.timezoneArr){
        //     console.log('Data Parsing',key.value);
        // }
        //console.log(this.state.timezoneArr);
        const { selectedOption } = this.state;
  	    const value = selectedOption && selectedOption.value;
        return(
            <div className="form-group row">
            <label htmlFor="example-search-input" className="col-3 col-form-label text-right">Time Zone</label>
            <div className="col-9">

            {/* <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange}
                options={this.state.timezoneArr}
            /> */}

            {/* <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange}
                options={[
                { value: 'one', label: 'One' },
                { value: 'two', label: 'Two' },
                ]}
            /> */}
                {/* <select className="form-control" required>
                <option>Choose..</option>
                <option value={1}>Asia/Jakarta - Indonesia (ID)</option>
                <option value={2}>Asia/Makasar - Indonesia (ID)</option>
                <option value={3}>Asia/Pontianak - Indonesia (ID)</option>
                <option value={4}>Asia/Jayapura - Indonesia (ID)</option>
                <option value={5}>Erope/Dublin - Ireland (IE)</option>
                <option value={6}>Asia/Tokyo - Japan (JPN)</option>
                </select> */}
            </div>
            </div>
        );

    }
}

export default SelectTimeZone;