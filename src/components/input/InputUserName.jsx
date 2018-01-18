import React from 'react';

const InputUserName = (props) =>{
    return(
        <div className="form-group row">
            <label htmlFor="example-search-input" className="col-3 col-form-label text-right">Username</label>
            <div className="col-9"><input type="text" className="form-control" placeholder="Enter Username" onChange={e => props.handleDataInput(e,"USERNAME")} />
            {props.errorMessage != "" ? <small className='text-right text-danger'>{props.errorMessage}.</small> : ""}
            </div>
        </div>
    );
}

export default InputUserName;