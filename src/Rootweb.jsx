import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import App from './App.jsx';
import Tabledata from './pages/Tabledata.jsx';

class Rootweb extends Component{
    render(){
        return(
            <BrowserRouter>
                <div className="App">
                    <Route exact path="/" component={App} />
                    <Route path="/table" component={Tabledata} />
                </div>
            </BrowserRouter>
        );
    }
}
export default Rootweb;