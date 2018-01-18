import React, {Component} from 'react';
import axios from 'axios';

import InputFirstName from './components/input/InputFirstName.jsx';
import InputLastName from './components/input/InputLastName.jsx';
import InputUserName from './components/input/InputUserName.jsx';
import InputUserEmail from './components/input/InputUserEmail.jsx';
import InputPassword from './components/input/InputPassword.jsx';
import ConfrimPassword from './components/input/ConfrimPassword.jsx';
import SelectPeriode from './components/select/SelectPeriode.jsx';
import SelectTimeZone from './components/select/SelectTimeZone.jsx';
import SelectUserType from './components/select/SelectUserType.jsx';
import ButtonCreate from './components/button/ButtonCreate.jsx';
import Footer from'./components/layout/Footer.jsx';

// class AlertFailure extends Component{
//     render(){
//         return (
//             <p>Error </p>
//         );
//     }
// }
// 
const AlertFailure = (props) => {
    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        <strong>Error,</strong> {props.message}
        </div>
    );
}

const AlertSuccess = (props) => {
    return (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        <strong>Successfully,</strong> {props.message}
        </div>
    );
}

const isEmailvalid = (mail) => 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return true;
  }
    return false;
}

let ErrorAlert;

class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            firstName:"",
            firstNameError:"",

            lastName:"",
            lastNameError:"",

            userName:"",
            userNameError:"",

            email:"",
            emailErrors:"",

            password:"",
            confPassword:"",
            passwordError:"",
            
            period:"",
            timeZone:"",
            stype:"",
            buttonVisibility:"disable",
        }
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleDataInput = this.handleDataInput.bind(this);
    }

    handleButtonClick(events){
        events.preventDefault();
        console.log('click button!');
        this.setState({
            firstNameError:"",
            lastNameError:"",
            userNameError:"",
            emailErrors:"",
            passwordError:"",
        })
        const err = this.validate();

        if(!err){
            this.requestRegisterUser();
            ErrorAlert = <AlertSuccess message="Register successfully please check your inbox"/>
            this.resetForm();
            console.log('suceess submit!');
        }else{
            console.log('failure submit the form');
        }

        for(var key in this.state){
            console.log(key, this.state[key]);
        }
    }

    resetForm(){
        this.setState({
            firstName:"",
            firstNameError:"",
            lastName:"",
            lastNameError:"",
            userName:"",
            userNameError:"",
            email:"",
            emailErrors:"",
            password:"",
            confPassword:"",
            passwordError:"",
            period:"",
            timeZone:"",
            stype:"",
            buttonVisibility:"disable"
        });
    }

    validate(){
        let isError = false;
        // FirstName Validate
        if(this.state.firstName == ""){
            isError = true;
            this.setState({
                firstNameError:"Sorry, You have fill this form"
            })
        }

        if(!isNaN(this.state.firstName) && this.state.firstName.length != 0){
            isError = true;
            this.setState({
                firstNameError:"Sorry, Name must be alphabet!"
            })
        }

        // LastName Validate
        if(this.state.lastName== ""){
            isError = true;
            this.setState({
                lastNameError:"Sorry, You have fill this form"
            })
        }

        if(!isNaN(this.state.lastName) && this.state.lastName.length != 0){
            isError = true;
            this.setState({
                lastNameError:"Sorry, Name must be alphabet!"
            })
        }

        // Email Validate
        if(this.state.email.indexOf('@') === -1){
            isError = true;
            this.setState({
                emailErrors:"Sorry, Your email is not valid!"
            })
        }

        // Username Validate
        if(this.state.userName== ""){
            isError = true;
            this.setState({
                userNameError:"Sorry, You have fill this field"
            })
        }

        if(!isNaN(this.state.userName) && this.state.userName.length != 0){
            isError = true;
            this.setState({
                userNameError:"Sorry, Name must be alphabet!"
            })
        }

        if(this.state.userName.length != 0 && this.state.userName.length <= 5){
            isError = true;
            this.setState({
                userNameError:"Sorry, Username must least then 5 character"
            })
        }

        // Password Validation
        if(this.state.password ==""){
            isError = true;
            this.setState({
                passwordError:"Sorry, you have fill this field"
            })
        }
        if(this.state.password != this.state.confPassword && this.state.userName.length != 0){
            isError = true;
            this.setState({
                passwordError:"Sorry, password not match!"
            })
        }

        return isError;
    }
    // Post Data
	async requestRegisterUser() {
        const url = "https://api-dev.managix.id/user/registration";
        axios.post(url,
            {
            first_name  : this.state.firstName,
            last_name   : this.state.lastName,
            email       : this.state.email,
            username    : this.state.userName,
            password    : this.state.password,
          },{
            headers: {
                'x-api-key':'22fbf8e3-d7ad-478f-92e5-a3f769eece00',
                'Content-Type': 'application/json'
            }
          }
        ).then(function (response) {
            console.log('Successfully!',response);
          })
          .catch(function (error) {
            console.log('Error Data Sending!',error);
          });
	}

    // redirect
	get successRegister() {
        return ErrorAlert;
	}

    handleDataInput(events,type){
        this.formValidate();
        console.log(events);
        //console.log(events.target.value.trim());
        switch(type){
            case "FIRSTNAME":
                this.setState({
                    firstName:events.target.value.trim()
                });
                
                if(isNaN(this.state.firstName) && this.state.firstNameError != ""){
                    this.setState({
                        firstNameError:"Sorry, Name must be alphabet!",
                    });
                }else{
                    this.setState({
                        firstNameError:"",
                    });
                }
                break;
            case "LASTNAME":
                this.setState({
                    lastName:events.target.value.trim()
                });
                this.setState({
                    lastNameError:""
                });
                break;
            case "USERNAME":
                this.setState({
                    userName:events.target.value.trim()
                });
                if(this.state.userName.length < 5){
                    this.setState({
                        userNameError:"Sorry, Username must least then 5 character"
                    });
                }else{
                    this.setState({
                        userNameError:""
                    });
                }
                break;
            case "EMAIL":

                this.setState({
                    email:events.target.value.trim()
                });
                
                if(isEmailvalid(events.target.value.trim())){
                    this.setState({
                        emailErrors:""
                    });
                }else{
                    this.setState({
                        emailErrors:"Wrong email adress example: me@gmail.com",
                    });
                }
                
                break;
            case "PASSWORD":
                this.setState({
                    password:events.target.value.trim()
                });

                if(this.state.password == this.state.confPassword){
                    this.setState({
                        passwordError:"",
                    });
                }
                
                break;
            case "CONFPASSWORD":
                this.setState({
                    confPassword:events.target.value.trim()
                });
                break;
            case "PERIOD":
                this.setState({
                    period:events.target.value.trim()
                });
                break;
            case "TIMEZONE":
                this.setState({
                    timeZone:events
                });
                break;
            case "STYPE":
                this.setState({
                    stype:events.target.value.trim()
                });
                break;
        }
    }

    formValidate(){
        if(this.state.firstName == ""){
            this.setState({
                buttonVisibility:"disable"
            });
        }else if(this.state.lastName == ""){
            this.setState({
                buttonVisibility:"disable"
            });
        }else if(this.state.userName == ""){
            this.setState({
                buttonVisibility:"disable"
            });
        }else if(this.state.email == ""){
            this.setState({
                buttonVisibility:"disable"
            });
        }else if(this.state.password == ""){
            this.setState({
                buttonVisibility:"disable"
            });
        }else if(this.state.confPassword == ""){
            this.setState({
                buttonVisibility:"disable"
            });
        }else{
            this.setState({
                buttonVisibility:""
            });
        }
    }

    render(){
        return(
            <div className="container-fluid h-100 style-mobile">
                <div className="row h-100">
                <div className="mobile-hide">
                    <div className="col-sm-6 col-2 wondefull-bg text-white py-2 d-flex align-items-center justify-content-center " id="left">
                    <img src="https://lh3.googleusercontent.com/fkgyZWuvws4WNxeBC0jSFJ50kAiZLAt3GPvTRCYM8st9GZgWYiAB5QaPOsH7kVcWFiZFNbzI3Ba-Ne1j6c0-yg=w1024" className="img-fluid" />
                    </div>
                </div>
                <div className="col offset-sm-6 py-2">
                    <div className="row justify-content-center h-100">
                    <div className="col-md-10 my-auto-costume">
                    <br/>
                        <div className="title-form">
                        <img src="https://lh3.googleusercontent.com/fkgyZWuvws4WNxeBC0jSFJ50kAiZLAt3GPvTRCYM8st9GZgWYiAB5QaPOsH7kVcWFiZFNbzI3Ba-Ne1j6c0-yg=w1024" className="img-fluid desktop-hide" />
                        <p className="mobile-hide">Create Account Managix</p>
                        </div>
                        {this.successRegister}
                        <form className="padding-mobile">
                        
                            <InputFirstName 
                                errorMessage={this.state.firstNameError}
                                handleDataInput={this.handleDataInput}/>

                            <InputLastName 
                                errorMessage={this.state.lastNameError}
                                handleDataInput={this.handleDataInput}/>

                            <InputUserName 
                                errorMessage={this.state.userNameError}
                                handleDataInput={this.handleDataInput}/>

                            <InputUserEmail 
                                errorMessage={this.state.emailErrors}
                                handleDataInput={this.handleDataInput}/>

                            <InputPassword 
                                handleDataInput={this.handleDataInput}/>

                            <ConfrimPassword
                                errorMessage={this.state.passwordError}
                                handleDataInput={this.handleDataInput}/>

                            <SelectPeriode 
                                handleDataInput={this.handleDataInput}/>

                            {/* <SelectTimeZone 
                                handleDataInput={this.handleDataInput}/> */}

                            {/* <SelectUserType
                                handleDataInput={this.handleDataInput}/> */}

                            <ButtonCreate 
                                handleButtonClick={this.handleButtonClick}
                                visibility={this.state.buttonVisibility} />
                        </form>
                        <Footer/>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}


export default App;