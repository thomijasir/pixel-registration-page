import React from 'react';

const ConfrimPassword = (props) =>{
    return(
        <div className="form-group row null">
            <label htmlFor="example-search-input" className="col-3 col-form-label text-right">Confrim Password</label>
            <div className="col-9"><input type="password" className="form-control" placeholder="Password" onChange={e => props.handleDataInput(e,"CONFPASSWORD")} />
            {props.errorMessage != "" ? <small className='text-right text-danger'>{props.errorMessage}.</small> : ""}
            </div>
        </div>
    );
}

export default ConfrimPassword;