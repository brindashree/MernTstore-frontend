import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { authenticate,isAuthenticated, signin} from "../auth/helper";

const Signin = () => {

    const [values, setValues] = useState({
        email: "test@gmail.com",
        password: "123456",
        error: "",
        loading: false,
        didRedirect:false
    })
    
    const { email, password, error, loading, didRedirect } = values;
    
    const { user } = isAuthenticated();

 const handleChange = name => event => {
        setValues({
            ...values,
            error: false,
            [name]: event.target.value
        });
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({
            ...values,
            error: false,
            loading:true
        })
        signin({ email, password })
            .then(
                data => {
                    if (data.error) {
                         setValues({
            ...values,
            error: data.error,
            loading:false
        })
                    }
                    else {
                        authenticate(data, () => {
                            setValues({
                                ...values,
                                didRedirect:true
                            })
                        })
                    }
                }
            )
        .catch(console.log("signin request failed"))
    }

    const performRedirect = () => {
        if (didRedirect) {
            if (user && user.role === 1) {
                return <p>redirect to admin</p>
            } else {
                return <p>redirect to user dashboard</p>
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />;
        }
    }

     const loadingMessage = () => {
         return (
             loading && (
                 <div className="alert alert-info">
                     <h2>Loading.....</h2>
                 </div>
             )
         )
    }
     const errorMessage = () => {
         return (
             <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                     <div className="alert alert-danger" style={{ display: error ? "" : "none" }}> {error} </div>
                 </div>
             </div>
             
         )
    }

        const signInForm = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                           
                            <label className="text-light"> Email </label>
                            <input type="text" value={email} onChange={handleChange("email")} className="form-control" />
                            
                            <label className="text-light"> Passsword </label>
                            <input type="password" value={password}  onChange={handleChange("password")} className="form-control" />
                            
                        </div>
                        <button onClick={onSubmit} className="btn btn-success d-grid gap-2 col-6 mx-auto my-2">Submit</button>
                    </form>
                </div>
            </div>
    )
}
    return (
        <Base title="Signin page" description="A page for the user to signin!">
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signin