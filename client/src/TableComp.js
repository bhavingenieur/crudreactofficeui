import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import ListItem from './ListItem';


export default class TableComp extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {mail:true, loaded: false};
     
        const authState = this.props.auth_state;      
        
        const url = 'http://localhost:5000/api/messages';
        const options = {
            method: 'GET',
            headers: { 
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${authState.accessToken}`, },
          url
        }
        axios(options)
    }

    componentDidMount(){
        this.props.auth_svc.getUser().then( res=>{
            this.setState({ mail: res.email});
            axios.post('http://localhost:5000/api/messages', {'datum':this.state.mail})
            .then(res2 => {
                console.log(res2.data)
                this.setState({loaded : true, datum : res2.data})
                
            })
        })
        
    }  

    render(){

        return ( 
        (this.state.loaded) ? <ListItem list = {this.state.datum} auth_svc={this.props.auth_svc}/> : <div>Loading....  </div>
         
        )
    }
}