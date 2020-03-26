import * as React from 'react';
import moment from 'moment';
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';

export default class EditPanel extends React.Component {
    constructor(props){
      super(props);
      this.state = {finaldate :'', tm:'', isOpen:'true'}
    }
  
    _postsavedata = () =>{
        let newprop = moment.utc(this.props.secret, "dddd, MMMM Do YYYY")
        newprop=newprop.toISOString();
        this.state.finaldate = newprop;
        console.log(this.state.finaldate, this.state.tm)
        this.props.auth_s.getUser().then( res=>{
          this.setState({ mail : res.email})
          console.log(this.state.tm)
            if(this.state.finaldate && this.state.tm) {
              const payload = { email: this.state.mail, dt : this.state.finaldate, tm : this.state.tm}
              axios.post(`http://localhost:5000/api/editdata`, {payload})
                  .then(() => console.log('updated'))
              }
      })   
        this.dismissPanel();
    }
    _setTime = (event) => {
        let pop = moment(event.target.innerText, "hh:mm a")
        pop = pop.toISOString();
        this.state.tm = pop;
    }
    dismissPanel = () =>{
        this.setState({isOpen:false})
    }
    openPanel =() => {
        this.setState({isOpen:true})
    }

    componentDidMount(){
      console.log(this.state.isOpen)
    }
   

    render(){
      const dropdownStyles = {
          dropdown: { width: 300 }
            };
      const options = [
          {key: 'morning', 'text': 'Morning', itemType: DropdownMenuItemType.Header},
          { key: '07:00', text: '07:00 AM' },
          { key: '08:00', text: '08:00 AM' },
          { key: '09:00', text: '09:00 AM' },
          { key: '10:00', text: '10:00 AM' },
          { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
          {key: 'evening', 'text': 'Evening', itemType: DropdownMenuItemType.Header},
          { key: '16:00', text: '04:00 PM' },
          { key: '17:00', text: '05:00 PM' },
          { key: '18:00', text: '06:00 PM' },
          { key: '19:00', text: '07:00 PM' },
      ]
      return (
        <div>
        <Panel
        headerText="Edit your schedule"
        isOpen={this.state.isOpen}
        onDismiss={this.dismissPanel}        
        closeButtonAriaLabel="Close"
        >
        <p>Choose an alternate time</p>
        <Dropdown placeholder="Select an option" onChange= {this._setTime}label="Pick your time" options={options} styles={dropdownStyles} />
        <PrimaryButton text='Save' onClick={this._postsavedata}/>
        <DefaultButton text='Cancel' onClick = {this.dismissPanel}/>
      </Panel>
    </div>
  );
    }

  
}