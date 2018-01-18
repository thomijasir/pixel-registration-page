import React from 'react';

const InputUserEmail = (props) =>{
    return(
        <div className="form-group row">
            <label htmlFor="example-search-input" className="col-3 col-form-label text-right">E-mail</label>
            <div className="col-9"><input type="email" className="form-control" placeholder="Enter email" onChange={e => props.handleDataInput(e,"EMAIL")}/>
            {props.errorMessage != "" ? <small className='text-right text-danger'>{props.errorMessage}.</small> : ""}
            </div>
        </div>
    );
}

export default InputUserEmail;