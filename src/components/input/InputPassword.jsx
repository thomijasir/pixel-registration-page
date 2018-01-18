import React from 'react';

const InputPassword = (props) =>{
    return(
        <div className="form-group row">
            <label htmlFor="example-search-input" className="col-3 col-form-label text-right text-right">Password</label>
            <div className="col-9"><input type="Password" className="form-control" placeholder="Password" onChange={e => props.handleDataInput(e,"PASSWORD")} /></div>
        </div>

    );
}

export default InputPassword;