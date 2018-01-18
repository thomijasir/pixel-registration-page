import React from 'react';


const SelectPeriode = (props) =>{


    // let options ="<option>Choose..</option>";
    // for(let i = 1; i<12; i++){
    //     options +=  "<option value={"+i+"}>"+i+" Month</option>";
    // }

    // const data = {
    //     html:options
    // }
    // console.log(data.html);

    return(
        <div className="form-group row">
        <label htmlFor="example-search-input" className="col-3 col-form-label text-right">Period</label>
            <div className="col-9">
                <select className="form-control" onChange={e => props.handleDataInput(e,"PERIOD")}>
                <option>Choose..</option><option value={1}>1 Month</option><option value={2}>2 Month</option><option value={3}>3 Month</option><option value={4}>4 Month</option><option value={5}>5 Month</option><option value={6}>6 Month</option><option value={7}>7 Month</option><option value={8}>8 Month</option><option value={9}>9 Month</option><option value={10}>10 Month</option><option value={11}>11 Month</option>
                <option value={12}>12 Month</option>
                </select>
            </div>
        </div>
    );
}

export default SelectPeriode;