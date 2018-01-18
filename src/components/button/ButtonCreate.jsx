import React from 'react';

const ButtonCreate = (props) =>{
    return(
        <div className="mobileButtonSubmit">
        <p className="button-text text-info">*Note: Button will active when all field has beed filled</p>
        <div className="button-submit">
            <button type="submit" className="btn btn-primary" disabled={props.visibility} onClick={(e) => props.handleButtonClick(e)}>Create Account</button>
        </div>
        </div>
    );
}

export default ButtonCreate;