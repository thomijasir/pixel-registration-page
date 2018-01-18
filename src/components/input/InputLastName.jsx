import React from 'react';

const InputLastName = (props) =>{
    return(
        <div className="form-group row">
            <label htmlFor="example-search-input" className="col-3 col-form-label text-right">Last Name</label>
            <div className="col-9"><input type="text" className="form-control" placeholder="Enter last name" onChange={e => props.handleDataInput(e,"LASTNAME")} />
            {props.errorMessage != "" ? <small className='text-right text-danger'>{props.errorMessage}.</small> : ""}
            </div>
        </div>

    );
}

export default InputLastName;